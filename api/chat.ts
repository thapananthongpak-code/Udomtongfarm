// The chat assistant's endpoint. Vercel runs this file as a serverless function, which
// keeps the Gemini API key on the server: nothing in src/ ever sees it.

import { ApiError, GoogleGenAI, ThinkingLevel, type Content } from "@google/genai";
import { z } from "zod";
import { CHAT_LIMITS } from "../src/lib/chat-limits.js";
import { buildFarmKnowledge, describeMentioned } from "./_lib/knowledge.js";
import { isRateLimited } from "./_lib/rate-limit.js";

export const config = { maxDuration: 30 };

// Tried in order. The first is the quickest to start replying. Gemini sometimes answers
// "this model is experiencing high demand" or "too many requests"; each model has its own
// allowance, so the next one is asked instead and the visitor still gets a reply.
// Each model accepts different thinking settings. Thinking is kept low: replies are short,
// and thinking both delays the first words and counts towards the output ceiling.
const CHAT_MODELS = [
  { model: "gemini-3.5-flash-lite", thinkingLevel: ThinkingLevel.MINIMAL },
  { model: "gemini-3.8-flash", thinkingLevel: ThinkingLevel.LOW },
];

// The chat is switched on by setting GEMINI_API_KEY. Without it the site hides the chat button.
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        // Earlier replies from the assistant can be longer than what a visitor may type.
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(CHAT_LIMITS.history),
});

export type ChatErrorCode = "rate_limited" | "unavailable" | "too_long";

const fail = (code: ChatErrorCode, status: number) => Response.json({ error: code }, { status });

function failFromApi(error: unknown): Response {
  if (error instanceof ApiError) {
    if (error.status === 429) return fail("rate_limited", 429);
    if (error.status === 400 || error.status === 401 || error.status === 403) {
      // Gemini answers 400 for a key it does not recognise, and 403 for one that lacks access.
      console.error(`Chat: Gemini refused the request (${error.status}). Check GEMINI_API_KEY. ${error.message}`);
      return fail("unavailable", 503);
    }
    console.error(`Chat: Gemini API error ${error.status}: ${error.message}`);
    return fail("unavailable", 502);
  }
  console.error("Chat: unexpected error", error);
  return fail("unavailable", 500);
}

/** Tells the site whether to show the chat button. */
export function GET() {
  return Response.json({ enabled: ai !== null }, { headers: { "Cache-Control": "public, max-age=300" } });
}

/** Answers a visitor's question about the farm, streaming the reply back as plain text. */
export async function POST(request: Request) {
  if (!ai) return fail("unavailable", 503);

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("too_long", 400);

  const { messages } = parsed.data;
  const question = messages[messages.length - 1];
  if (question.role !== "user" || messages[0].role !== "user") return fail("too_long", 400);
  if (messages.some((message) => message.role === "user" && message.content.length > CHAT_LIMITS.messageLength)) {
    return fail("too_long", 400);
  }

  const address = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (isRateLimited(address)) return fail("rate_limited", 429);

  const { prompt, species } = await buildFarmKnowledge();
  const visitorText = messages
    .filter((message) => message.role === "user")
    .slice(-2)
    .map((message) => message.content)
    .join(" ");
  const details = describeMentioned(visitorText, species);

  // Smaller models do not reliably notice which language a question is in, so it is worked out here.
  const replyLanguage = /[\u0E00-\u0E7F]/.test(question.content)
    ? "The visitor's latest message is in Thai. Reply in Thai."
    : "The visitor's latest message is in English. Reply in English.";

  // Gemini calls the assistant's side of the conversation "model".
  const contents: Content[] = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

  const generation = {
    contents,
    config: {
      // The farm knowledge comes first and never varies, which lets Gemini reuse it between
      // requests at a lower price. The part that depends on the question goes after it.
      systemInstruction: [prompt, details, replyLanguage].filter(Boolean).join("\n\n"),
      // Replies are a few sentences, so a low ceiling is enough.
      maxOutputTokens: 2048,
    },
  };

  // A rejected key or a rate limit surfaces here, before any of the reply has been sent,
  // so the visitor gets a proper error instead of an empty reply.
  let stream: Awaited<ReturnType<typeof ai.models.generateContentStream>> | null = null;
  let lastError: unknown = null;
  for (const { model, thinkingLevel } of CHAT_MODELS) {
    try {
      stream = await ai.models.generateContentStream({
        model,
        contents: generation.contents,
        config: { ...generation.config, thinkingConfig: { thinkingLevel } },
      });
      break;
    } catch (error) {
      lastError = error;
      // Only a busy or rate-limited model is worth another try. Anything else would fail the same way again.
      const tryNext = error instanceof ApiError && [429, 500, 503].includes(error.status);
      if (!tryNext) break;
      console.warn(`Chat: ${model} answered ${error.status}, trying the next model.`);
    }
  }
  if (!stream) return failFromApi(lastError);
  const reply = stream;

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let finishReason: string | undefined;
        for await (const chunk of reply) {
          finishReason = chunk.candidates?.[0]?.finishReason ?? finishReason;
          const text = chunk.text;
          if (text) controller.enqueue(encoder.encode(text));
        }
        // "STOP" is a normal ending. Anything else means the reply was cut short.
        if (finishReason && finishReason !== "STOP") console.warn(`Chat: reply ended early (${finishReason}).`);
        controller.close();
      } catch (error) {
        console.error("Chat: the reply was interrupted", error);
        controller.error(error);
      }
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
