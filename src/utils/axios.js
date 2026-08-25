import axios from "axios"
import env from "./env"
import { showOfflineNotification } from "components/ToastMessage/showNotification"

const axiosInstance = axios.create({
  withCredentials: false,
  baseURL: env.LOCAL_PROXY(),
  params: {},
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && (!navigator.onLine || error?.code === "ERR_NETWORK")) {
      showOfflineNotification()
    }
    return Promise.reject(error)
  }
)

export default axiosInstance;
