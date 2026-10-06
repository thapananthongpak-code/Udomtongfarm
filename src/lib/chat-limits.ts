/** Limits on what a visitor can send to the chat assistant, to keep each request small and cheap. */
export const CHAT_LIMITS = {
  /** Characters in one visitor message. */
  messageLength: 600,
  /** Messages of the conversation sent with each request. */
  history: 12,
  /** Requests from one address within the window below. */
  requests: 15,
  windowMs: 10 * 60 * 1000,
};
