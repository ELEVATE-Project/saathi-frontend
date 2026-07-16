import { apiClient } from "../client"
import { API_ENDPOINTS } from "constants/urls"

/**
 * Login API endpoint
 * @param {Object} data - Login credentials
 * @param {string} data.email - User email address
 * @param {string} data.password - User password
 * @returns {Promise<Object>} Response data containing access token and user information
 */
export const loginApi = async data => {
  const response = await apiClient.post(API_ENDPOINTS.LOGIN, data)
  return response.data
}

export const logoutApi = async (accessToken, refreshToken) => {
  const response = await apiClient.post(
    API_ENDPOINTS.LOGOUT,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        "X-auth-token": accessToken,
        "X-refresh-token": refreshToken,
      },
    }
  )
  return response.data
}
