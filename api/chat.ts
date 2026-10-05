// The chat assistant's endpoint. Vercel runs this file as a serverless function, which
// keeps the Anthropic API key on the server: nothing in src/ ever sees it.

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { CHAT_LIMITS } from "../src/lib/chat-limits.js";
import { buildFarmKnowledge, describeMentioned } from "./_lib/knowledge.js";
import { isRateLimited } from "./_lib/rate-limit.js";

export const config = { maxDuration: 30 };

const CHAT_MODEL = "claude-haiku-4-5";

// The chat is switched on by setting ANTHROPIC_API_KEY. Without it the site hides the chat button.
const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

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
  if (error instanceof Anthropic.RateLimitError) return fail("rate_limited", 429);
  if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
    console.error("Chat: the Anthropic API key was rejected. Check ANTHROPIC_API_KEY.");
    return fail("unavailable", 503);
  }
  if (error instanceof Anthropic.APIError) {
    console.error(`Chat: Anthropic API error ${error.status}: ${error.message}`);
    return fail("unavailable", 502);
  }
  console.error("Chat: unexpected error", error);
  return fail("unavailable", 500);
}

/** Tells the site whether to show the chat button. */
export function GET() {
  return Response.json({ enabled: client !== null }, { headers: { "Cache-Control": "public, max-age=300" } });
}

/** Answers a visitor's question about the farm, streaming the reply back as plain text. */
export async function POST(request: Request) {
  if (!client) return fail("unavailable", 503);

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

  const stream = client.messages.stream({
    model: CHAT_MODEL,
    // Replies are meant to be a few sentences, so a low ceiling is enough.
    max_tokens: 1024,
    system: [
      // Identical for every visitor, so it is cached. Anything that varies goes after it.
      { type: "text", text: prompt, cache_control: { type: "ephemeral" } },
      ...(details ? [{ type: "text" as const, text: details }] : []),
    ],
    messages,
  });

  // Wait for the first event before answering, so a rejected key or a rate limit
  // reaches the visitor as a proper error instead of an empty reply.
  const events = stream[Symbol.asyncIterator]();
  let first: IteratorResult<Anthropic.MessageStreamEvent>;
  try {
    first = await events.next();
  } catch (error) {
    return failFromApi(error);
  }

  const encoder = new TextEncoder();
  const textOf = (event: Anthropic.MessageStreamEvent) =>
    event.type === "content_block_delta" && event.delta.type === "text_delta" ? event.delta.text : "";

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (let next = first; !next.done; next = await events.next()) {
          const text = textOf(next.value);
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (error) {
        console.error("Chat: the reply was interrupted", error);
        controller.error(error);
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
