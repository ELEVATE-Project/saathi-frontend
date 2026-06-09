import PropTypes from "prop-types"
import { useRef, useEffect } from "react"
import DynamicVoiceChat from "../../pages/ShikshalokamVoiceChat/dynamic-voice-chat"
import "../TnC/privacyPolicyPopup.css"
import env from "../../utils/env"

const PROFILE_FLOW = "saathi_profile"

function ProfileChatPopup({ isOpen, onClose }) {
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  if (!isOpen) return null

  const handleProfileExtracted = () => {
    const delay = env.ONBOARDING_REDIRECT_DELAY()
    timerRef.current = setTimeout(() => {
      onClose?.()
    }, delay)
  }

  return (
    <>
      {/* Backdrop — reuses .tnc-cover CSS for backdrop-filter: blur(10px) */}
      <div className="tnc-cover" />

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "min(600px, 95vw)",
            height: "85vh",
            background: "#fff",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DynamicVoiceChat
            flowOverride={PROFILE_FLOW}
            isPopupMode={true}
            onProfileExtracted={handleProfileExtracted}
          />
        </div>
      </div>
    </>
  )
}

ProfileChatPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default ProfileChatPopup
