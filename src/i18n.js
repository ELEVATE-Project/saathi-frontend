import i18n from "i18next"
import { DEFAULT_LANGUAGE } from "pages/ShikshalokamVoiceChat/enum"
import { initReactI18next } from "react-i18next"
import HttpApi from "i18next-http-backend"
import { useSiteDataSessionStore } from "store"
import env from "./utils/env"

const chatLanguageLocal = useSiteDataSessionStore.getState().getChatLanguage()
const languageToUse = chatLanguageLocal || DEFAULT_LANGUAGE

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    lng: languageToUse,
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: `${env.ROOT_PATH() ? `/${env.ROOT_PATH()}` : ""}/locales/{{lng}}/{{ns}}.json`,
    },
  })

export const setLanguage = languageProp => {
  const route = JSON.parse(sessionStorage.getItem("route")) || JSON.parse(localStorage.getItem("route"))
  const languageToUse = languageProp || route || "en"
  console.log("Language set to: ", languageToUse)
  i18n.changeLanguage(languageToUse)
}

export default i18n
