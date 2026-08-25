import { DEFAULT_LANGUAGE } from "pages/ShikshalokamVoiceChat/enum"

export const INITIAL_STATE = (set, get, store) => ({
  chatLanguage: DEFAULT_LANGUAGE,
  hasSelectedLanguage: false,
  previousUrl: null,
  ssoRerouteURL: null,

  setChatLanguage: chatLanguage => set({ chatLanguage }),

  getChatLanguage: () => get().chatLanguage,

  setHasSelectedLanguage: hasSelectedLanguage => set({ hasSelectedLanguage }),

  getHasSelectedLanguage: () => get().hasSelectedLanguage,

  setPreviousUrl: previousUrl => set({ previousUrl }),

  setSsoRerouteURL: ssoRerouteURL => set({ ssoRerouteURL }),

  reset: () => {
    set(store.getInitialState())
  },
})
