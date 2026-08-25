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
    let isOfflineState = false
    let isSlowState = false

    const handleOffline = () => {
      setIsOffline(true)
      if (isOfflineState) return
      isOfflineState = true
      isSlowState = false
      toast.dismiss()
      toastId = showOfflineNotification()
    }

    const handleSlowNetwork = () => {
      setIsOffline(false)
      if (isOfflineState) {
        isOfflineState = false
      }
      if (isSlowState) return
      isSlowState = true
      toast.dismiss()
      toastId = showNotification({
        message: t("networkWarning"),
        type: "warn",
        options: {
          isOfflineToast: true,
          autoClose: false,
          style: { color: "#000" },
        },
      })
    }

    const handleOnline = () => {
      setIsOffline(false)
      const wasOffline = isOfflineState
      const wasSlow = isSlowState
      isOfflineState = false
      isSlowState = false

      if (!wasOffline && !wasSlow) return

      if (connection) {
        const { effectiveType } = connection
        if (effectiveType && (effectiveType === "2g" || effectiveType === "3g")) {
          handleSlowNetwork()
          return
        }
      }

      toast.dismiss()
      toastId = showNotification({
        message: t("onlineNetwork"),
        type: "success",
        options: {
          style: { color: "#1D1616" },
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
        } else if (isSlowState || isOfflineState) {
          handleOnline()
        }
      } else if (isOfflineState) {
        handleOnline()
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
