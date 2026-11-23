import useUserDataLocalStore from "../../store/slices/userData/userDataLocal"

/**
 * Headers that carry the login token the app already holds.
 * The backend needs it on the chat-history and chat-message reads (T32, ISS-45).
 * With REACT_APP_AUTH_METHOD other than "url" the store holds `true`, not a token string, so no header is sent.
 */
export const getAuthHeaders = () => {
  const token = useUserDataLocalStore.getState().access_token
  return typeof token === "string" && token ? { "X-auth-token": token } : {}
}
