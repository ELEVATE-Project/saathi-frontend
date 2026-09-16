/**
 * Mobile device detection utilities
 */
export const MOBILE_USER_AGENT_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

export const isMobileUserAgent = () =>
  typeof navigator !== "undefined" &&
  MOBILE_USER_AGENT_REGEX.test(navigator.userAgent)
