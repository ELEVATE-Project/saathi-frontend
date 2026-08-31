import axiosInstance from "../utils/axios"

const getWithoutAuth = async endpoint => {
  const headers = {
    "Content-Type": "application/json",
  }
  return await axiosInstance
    .get(`/api/${endpoint}`, { headers })
    .then(response => {
      if (response && response.data) {
        return response.data
      }
    })
    .catch(error => {
      return error?.response?.data
    })
}

export const getSessionDetails = async () => {
  const endpoint = `generate-session/`
  return await getWithoutAuth(endpoint)
}
