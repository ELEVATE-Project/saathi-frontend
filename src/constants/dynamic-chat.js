/**
 * Chat message source identifiers
 * Used to distinguish between bot and user messages throughout chatHistory.
 */
export const CHAT_SOURCE = {
  BOT: "bot",
  USER: "user",
}

/**
 * Special / reserved updated_at IDs that are not real chat messages.
 * Used to skip or filter these entries in history processing.
 */
export const CHAT_SPECIAL_IDS = {
  INTRO_MSG: "intro_msg_id",
}