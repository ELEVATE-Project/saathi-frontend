import env from "utils/env"

export const DEFAULT_LANGUAGE = env.DEFAULT_LANGUAGE()

export const languageList = [
  { label: "English", value: "en" },
  { label: "हिंदी", value: "hi" },
  { label: "ಕನ್ನಡ", value: "kn" },
  { label: "ଓଡ଼ିଆ", value: "or" },
  { label: "தமிழ்", value: "ta" },
]

export const languageValueMap = Object.fromEntries(languageList.map(l => [l.value, l.label]))
