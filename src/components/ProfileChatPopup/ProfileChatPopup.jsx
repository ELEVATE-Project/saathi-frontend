import PropTypes from "prop-types"
import { useRef, useEffect } from "react"
import DynamicVoiceChat from "../../pages/ShikshalokamVoiceChat/dynamic-voice-chat"
import "../TnC/privacyPolicyPopup.css"
import env from "../../utils/env"

const PROFILE_FLOW = "saathi_profile"

function ProfileChatPopup({ isOpen, onClose }) {
  const timerRef = useRef(null)

  useEffect(() => {
    console.log("[TRACE ProfileChatPopup] MOUNTED", { ts: Date.now() })
    return () => {
      console.log("[TRACE ProfileChatPopup] UNMOUNTED — clearing timer if set", { timerId: timerRef.current, ts: Date.now() })
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  if (!isOpen) return null

  console.log("PROFILE POPUP RENDERED", { isOpen })

  const handleProfileExtracted = () => {
    const delay = env.ONBOARDING_REDIRECT_DELAY()
    console.log("[TRACE handleProfileExtracted] ENTER — starting timer", { delay, ts: Date.now() })
    timerRef.current = setTimeout(() => {
      console.log("[TRACE handleProfileExtracted] TIMER FIRED — calling onClose", { ts: Date.now() })
      onClose?.()
    }, delay)
    console.log("[TRACE handleProfileExtracted] timer created, id:", timerRef.current, { ts: Date.now() })
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
