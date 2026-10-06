import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { CHAT_LIMITS as limits } from "@/lib/chat-limits";

type Message = { role: "user" | "assistant"; content: string };
type ErrorCode = keyof Dictionary["chat"]["errors"];

const isErrorCode = (value: unknown, labels: Dictionary["chat"]): value is ErrorCode =>
  typeof value === "string" && value in labels.errors;

/** A small chat window, opened from a button in the corner, for questions about the farm. */
export default function ChatWidget() {
  const lang = useLang();
  const labels = useT().chat;
  // The button stays hidden until the server confirms the chat has an API key.
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/chat")
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => {
        if (!cancelled) setEnabled(body?.enabled === true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the newest text in view as the reply arrives.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, error]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;

    // Only the most recent part of the conversation is sent, and it must start with the visitor.
    const asked: Message = { role: "user", content: question };
    let history = [...messages, asked].slice(-limits.history);
    while (history[0].role === "assistant") history = history.slice(1);

    setMessages([...messages, asked, { role: "assistant", content: "" }]);
    setDraft("");
    setError(null);
    setBusy(true);

    const appendToReply = (chunk: string) =>
      setMessages((current) => {
        const last = current[current.length - 1];
        return [...current.slice(0, -1), { ...last, content: last.content + chunk }];
      });
    const dropEmptyReply = () =>
      setMessages((current) => (current[current.length - 1]?.content === "" ? current.slice(0, -1) : current));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok || !response.body) {
        const code = (await response.json().catch(() => null))?.error;
        dropEmptyReply();
        setError(isErrorCode(code, labels) ? code : "unavailable");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let received = false;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          received = true;
          appendToReply(chunk);
        }
      }
      if (!received) {
        dropEmptyReply();
        setError("unavailable");
      }
    } catch {
      dropEmptyReply();
      setError("unavailable");
    } finally {
      setBusy(false);
    }
  }

  if (!enabled) return null;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-primary fixed bottom-5 right-5 z-40 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] print:hidden"
      >
        <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.25">
          <path d="M2.5 3h11v8h-6L4.5 13.5V11h-2V3Z" strokeLinejoin="round" />
        </svg>
        {labels.open}
      </button>
    );
  }

  const waiting = busy && messages[messages.length - 1]?.content === "";

  return (
    <section
      role="dialog"
      aria-label={labels.title}
      lang={lang}
      className="fixed inset-x-3 bottom-3 z-50 flex max-h-[min(36rem,calc(100dvh-1.5rem))] flex-col border border-ink bg-surface shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5)] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[24rem] print:hidden"
    >
      <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
        <h2 className="font-serif text-xl">{labels.title}</h2>
        <button type="button" onClick={() => setOpen(false)} aria-label={labels.close} className="-mr-2 p-2 text-muted hover:text-ink">
          <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.25">
            <path d="m3 3 10 10M13 3 3 13" />
          </svg>
        </button>
      </header>

      <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-4 overflow-y-auto px-5 py-5 text-[0.9375rem] leading-relaxed">
        <p className="text-muted">{labels.greeting}</p>

        {messages.length === 0 && (
          <ul className="space-y-2">
            {labels.suggestions.map((suggestion) => (
              <li key={suggestion}>
                <button type="button" onClick={() => send(suggestion)} className="btn btn-quiet btn-sm text-left">
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        )}

        {messages.map((message, index) =>
          message.role === "user" ? (
            <p key={index} className="ml-8 bg-wall px-3.5 py-2.5">
              {message.content}
            </p>
          ) : (
            message.content && (
              <p key={index} className="mr-4 whitespace-pre-wrap border-l-2 border-accent pl-3.5">
                {message.content}
              </p>
            )
          ),
        )}

        {waiting && <p className="animate-pulse text-muted">{labels.thinking}</p>}
        {error && (
          <p role="alert" className="notice notice-error">
            {labels.errors[error]}
          </p>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(draft);
        }}
        className="border-t border-line p-3"
      >
        <div className="flex gap-2">
          <label htmlFor="chat-input" className="sr-only">
            {labels.placeholder}
          </label>
          <input
            id="chat-input"
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={limits.messageLength}
            placeholder={labels.placeholder}
            autoComplete="off"
            className="input"
          />
          <button type="submit" className="btn btn-primary" disabled={busy || !draft.trim()}>
            {labels.send}
          </button>
        </div>
        <p className="mt-2 px-1 text-[0.75rem] leading-snug text-faint">{labels.disclaimer}</p>
      </form>
    </section>
  );
}
