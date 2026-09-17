/**
 * Mobile device detection utilities
 */
export const MOBILE_USER_AGENT_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

export const isMobileUserAgent = () =>
  typeof navigator !== "undefined" &&
  MOBILE_USER_AGENT_REGEX.test(navigator.userAgent)

export const isDesktopPlatform = () => {
  if (typeof navigator === "undefined") return false
  const platform = navigator.platform || ""
  const ua = navigator.userAgent || ""
  const vendor = navigator.vendor || ""
  const maxTouch = navigator.maxTouchPoints || 0

  // Windows desktop
  if (/Win32|Win64|Windows/i.test(platform)) return true
  // Linux desktop (x86_64, i686) - real mobile phones run ARM (armv7l, armv8l, aarch64)
  if (/Linux (x86_64|i686|x86)/i.test(platform)) return true
  // macOS desktop vs iPad/iPhone
  if (/MacIntel|MacPPC|Mac68K/i.test(platform)) {
    // Chrome/Firefox/Edge emulating mobile on Mac
    if (vendor && !vendor.includes("Apple")) return true
    // Emulated iPhone on Mac Safari (real iPhone platform is "iPhone")
    if (/iPhone|iPod/i.test(ua)) return true
    // Real Mac desktop has no touchscreen
    if (maxTouch <= 1) return true
  }
  return false
}

export const isMobileVirtualKeyboard = () => {
  if (typeof window === "undefined") return false

  // Desktop platforms (including DevTools device emulation on desktop) use physical keyboards
  if (isDesktopPlatform()) {
    return false
  }

  // Devices without a coarse pointer (e.g. standard desktops) do not have a virtual keyboard
  if (
    window.matchMedia &&
    !window.matchMedia("(any-pointer: coarse)").matches
  ) {
    return false
  }

  const hasCoarsePointer = Boolean(
    window.matchMedia &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(any-pointer: coarse)").matches)
  )

  const isMobileViewport = Boolean(
    window.matchMedia &&
      (window.matchMedia("(max-width: 500px)").matches ||
        window.matchMedia("(max-width: 768px)").matches)
  )

  // Mobile user-agent with touch, or mobile touch viewport (<=768px / <=500px with coarse pointer)
  return Boolean(
    (isMobileUserAgent() && hasCoarsePointer) ||
      (isMobileViewport && hasCoarsePointer)
  )
}

