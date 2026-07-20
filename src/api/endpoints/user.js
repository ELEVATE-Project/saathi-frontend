import { API_ENDPOINTS } from "constants/urls"
import { apiClient } from "../client"
import env from "utils/env"
import Swal from "sweetalert2"
import i18n from "i18next"
import ROUTES from "../../url"
import { clearFromStorage } from "../../services/storage_service"
import useUserDataLocalStore from "../../store/slices/userData/userDataLocal"

/**
 * Creates a new user profile
 * @param {Object} data - The data object containing user profile information
 * @param {string} data.access_token - The access token for the user
 * @returns {Promise<Object>} The created user profile data
 */
export const createUserProfileApi = async data => {
  const response = await apiClient.post(API_ENDPOINTS.CREATE_USER_PROFILE, data)
  return response.data
}

/**
 * Get user profile with optional filter
 * @param {string} filter - Optional filter string (e.g., "?id=123" or "?email=test@example.com")
 * @returns {Promise<Object>} The user profile data
 */
export const getUserProfileApi = async filter => {
  try {
    const endpoint = `${API_ENDPOINTS.GET_USER_PROFILE}${filter}`
    const response = await apiClient.get(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error) {
    return error?.response?.data
  }
}

/**
 * Get or create profile details
 * @param {Object} body - The profile data to send
 * @returns {Promise<Object>} The profile details
 */
export const getProfileDetailsApi = async body => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.GET_PROFILE_DETAILS, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error) {
    return error?.response?.data
  }
}

export const getProfileApi = async (profileId, accessToken) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.GET_PROFILE, {
      params: {
        profile_id: profileId,
      },
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": accessToken,
      },
    })

    return response.data
  } catch (error) {
    return error?.response?.data
  }
}

export const acceptTncApi = async (profileId, accessToken) => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.ACCEPT_TNC,
      {
        profile_id: profileId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": accessToken,
        },
      }
    )

    return response.data
  } catch (error) {
    return error?.response?.data
  }
}

/**
 * Read Elevate profile using access token
 * @param {string} accessToken - The access token for authentication
 * @returns {Promise<Object>} The Elevate profile data
 */
export const readElevateProfileApi = async accessToken => {
  try {
    const authUrl = env.AUTH_ROUTE()
    const response = await apiClient.get(authUrl, {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": accessToken,
      },
      withCredentials: true,
    })
    return response?.data
  } catch (error) {
    console.log("[readElevateProfileApi] error status:", error?.response?.status)
    if (error?.response?.status === 401) {
      await Swal.fire({
        text: i18n.t("sessionExpiredMessage"),
        confirmButtonText: i18n.t("confirmChanges"),
        allowOutsideClick: false,
        allowEscapeKey: false,
      })
      const flowName = env.FLOW_NAME()
      const search = flowName ? `?${new URLSearchParams({ flow: flowName }).toString()}` : ""
      useUserDataLocalStore.getState().setAccessToken(null)
      clearFromStorage()
      window.location.href = ROUTES.SHIKSHALOKAM_HOME_PAGE + search
    }
    else {
      throw error
    }
  }
}
