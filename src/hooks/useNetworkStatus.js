import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import { showNotification, showOfflineNotification } from "../components/ToastMessage/TotastMessage"

export const useNetworkStatus = () => {
  const { t } = useTranslation()
  const [isOffline, setIsOffline] = useState(() =>
    typeof window !== "undefined" ? !navigator.onLine : false
  )

  useEffect(() => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection

    let toastId = null
    let isSlowOrOffline = false

    const handleOffline = () => {
      setIsOffline(true)
      if (isSlowOrOffline) return
      isSlowOrOffline = true
      toastId = showOfflineNotification()
    }

    const handleOnline = () => {
      setIsOffline(false)
      if (!isSlowOrOffline) return
      isSlowOrOffline = false
      toast.dismiss()
      toastId = showNotification({
        message: t("onlineNetwork"),
        type: "success",
        options: {
          autoClose: 3000,
          closeButton: true,
          position: "top-center",
          style: { fontWeight: "bold", color: "#1D1616" },
        },
      })
    }

    const handleSlowNetwork = () => {
      setIsOffline(false)
      if (isSlowOrOffline) return
      isSlowOrOffline = true
      toast.dismiss()
      toastId = showNotification({
        message: t("networkWarning"),
        type: "warn",
        options: {
          isOfflineToast: true,
          autoClose: false,
          closeButton: true,
          position: "top-center",
          style: { fontWeight: "bold", color: "#000" },
        },
      })
    }

    const checkNetworkSpeed = () => {
      if (!navigator.onLine) {
        handleOffline()
        return
      }
      if (connection) {
        const { effectiveType } = connection
        if (effectiveType && (effectiveType === "2g" || effectiveType === "3g")) {
          handleSlowNetwork()
        } else if (isSlowOrOffline) {
          handleOnline()
        }
      }
    }

    if (!navigator.onLine) {
      handleOffline()
    } else {
      checkNetworkSpeed()
    }

    connection?.addEventListener("change", checkNetworkSpeed)
    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    return () => {
      connection?.removeEventListener("change", checkNetworkSpeed)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [t])

  return { isOffline, setIsOffline }
}
