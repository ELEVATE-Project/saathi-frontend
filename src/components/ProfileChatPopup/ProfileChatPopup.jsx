import PropTypes from "prop-types"
import DynamicVoiceChat from "../../pages/ShikshalokamVoiceChat/dynamic-voice-chat"
import useSmartChatStorage from "../../hooks/useSmartChatStorage"
import "../TnC/privacyPolicyPopup.css"

const PROFILE_FLOW = "saathi_profile"

function ProfileChatPopup({ isOpen, onClose }) {
  const [, , removeChatHistory] = useSmartChatStorage()

  if (!isOpen) return null

  console.log("PROFILE POPUP RENDERED", {
    isOpen
  })

  const handleProfileExtracted = () => {
    removeChatHistory()
    onClose?.()
  }

  return (
    <div
      className="tnc-cover"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
      }}
    >
      <div
        className="tnc-bg"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "#fff",
          overflow: "hidden",
        }}
      >
        <DynamicVoiceChat
          flowOverride={PROFILE_FLOW}
          isPopupMode={true}
          onProfileExtracted={handleProfileExtracted}
        />
      </div>
    </div>
  )
}

ProfileChatPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default ProfileChatPopup