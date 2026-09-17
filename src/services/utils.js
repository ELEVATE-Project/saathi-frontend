/**
 * Mobile device detection utilities
 */
export const MOBILE_USER_AGENT_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

export const isMobileUserAgent = () =>
  typeof navigator !== "undefined" &&
  MOBILE_USER_AGENT_REGEX.test(navigator.userAgent)

export const isMobileVirtualKeyboard = () => {
  if (typeof window === "undefined") return false

  // A "fine" pointer means mouse/trackpad → physical keyboard → not a virtual keyboard
  if (window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
    return false
  }

  // "coarse" pointer + mobile user-agent → touchscreen virtual keyboard
  return (
    isMobileUserAgent() &&
    window.matchMedia &&
    window.matchMedia("(pointer: coarse)").matches
  )
}

