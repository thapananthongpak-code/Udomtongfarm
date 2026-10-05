import "server-only";

/** The chat assistant is switched on by setting ANTHROPIC_API_KEY. Without it the chat button is not shown. */
export const isChatConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

export const CHAT_MODEL = "claude-haiku-4-5";

/** Limits on what a visitor can send, to keep each request small and cheap. */
export const CHAT_LIMITS = {
  /** Characters in one visitor message. */
  messageLength: 600,
  /** Messages of the conversation sent with each request. */
  history: 12,
  /** Requests from one address within the window below. */
  requests: 15,
  windowMs: 10 * 60 * 1000,
};
