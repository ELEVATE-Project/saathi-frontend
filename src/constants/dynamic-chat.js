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

/**
 * Feedback types for chat messages
 */
export const FEEDBACK_TYPE = {
  THUMBS_UP: "thumbs_up",
  THUMBS_DOWN: "thumbs_down",
}

/**
 * Chat source search type identifiers
 */
export const SOURCE_TYPE = {
  WEB_SEARCH: "web_search",
  KB_SEARCH: "kb_search",
}

/**
 * Default source logos
 */
export const DEFAULT_KB_LOGO = "https://shikshagraha.org/wp-content/uploads/2024/09/Group-22x-p-500-1.png"
export const DEFAULT_WEB_LOGO = "https://static.thenounproject.com/png/249243-200.png"