// Header constants
export const HEADER_TITLE = "SAATHI: Micro Improvement Mega Impact"

// Language selection constants
export const LANGUAGE_SELECTION_TEXT = {
  WELCOME: "Welcome",
  SELECT_PREFERRED_LANGUAGE: "Select your preferred language",
}

export const MOBILE_USER_AGENT_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

export const isMobileUserAgent = () =>
  typeof navigator !== "undefined" &&
  MOBILE_USER_AGENT_REGEX.test(navigator.userAgent)

