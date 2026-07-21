import { readElevateProfileApi } from "api/endpoints/user"
import useUserDataLocalStore from "store/slices/userData/userDataLocal"

/**
 * Validates the current user session against the Elevate profile API.
 * No-ops for guest users (no token). On 401, readElevateProfileApi
 * handles the popup and redirect internally. Other errors are re-thrown.
 */
export const validateSession = async () => {
  const token = useUserDataLocalStore.getState().access_token
  if (!token) return
  await readElevateProfileApi(token)
}
