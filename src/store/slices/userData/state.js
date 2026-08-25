export const INITIAL_STATE = (set, get, store) => ({
  access_token: null,
  refresh_token: null,
  companyName: null,
  firstName: "",
  flow: null,
  has_accepted_tnc: "ONGOING",
  ipFetched: false,
  preferredLanguage: null,
  profileId: null,
  state: null,

  setIpFetched: ipFetched => set({ ipFetched }),

  setPrefferedLanguage: preferredLanguage => set({ preferredLanguage }),

  setFirstName: firstName => set({ firstName }),

  setCompanyName: companyName => set({ companyName }),

  setState: state => set({ state }),

  setAcceptedTnC: has_accepted_tnc => set({ has_accepted_tnc }),

  setAccessToken: access_token => set({ access_token }),

  getAccessToken: () => get().access_token,

  setRefreshToken: refresh_token => set({ refresh_token }),

  getRefreshToken: () => get().refresh_token,

  setProfileId: profileId => set({ profileId }),

  reset: () => {
    set(store.getInitialState())
  },
})
