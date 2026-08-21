import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { FiCopy, FiThumbsUp, FiThumbsDown, FiGlobe } from "react-icons/fi"
import { BiLibrary } from "react-icons/bi"
import { showNotification } from "components/ToastMessage/TotastMessage"
import FeedbackModal from "components/FeedbackModal"
import { DEFAULT_KB_LOGO, DEFAULT_WEB_LOGO, FEEDBACK_TYPE } from "constants/dynamic-chat"
// SourcesPanel is now imported and rendered at the top-level DynamicVoiceChat component to allow layout squeezing

/**
 * MessageActionBar — row of action buttons shown below each bot message.
 */
function MessageActionBar({
  message,
  companyChatId,
  sessionId,
  sources = [],
  isStreaming,
  isMobile,
  accessToken,
  activeSourcesChatId,
  onToggleSources,
}) {
  const { t } = useTranslation()
  const [activeFeedback, setActiveFeedback] = useState(null) 
  const [feedbackModal, setFeedbackModal] = useState(null)

  const sourcesOpen = activeSourcesChatId === companyChatId

  const hasSources = Array.isArray(sources) && sources.length > 0

  const handleCopy = async () => {
    try {
      // Strip HTML tags for plain text copy
      const plain = message.replace(/<[^>]*>/g, "")
      await navigator.clipboard.writeText(plain)
      showNotification({
        message: `${t("copied")}!`,
        type: "success",
        options: { autoClose: 3000, isOfflineToast: true },
      })
    } catch {
      showNotification({
        message: t("copyFailed"),
        type: "error",
        options: { autoClose: 3000, isOfflineToast: true },
      })
    }
  }

  const handleFeedbackClick = (type) => {
    if (!accessToken) return
    if (activeFeedback === type) {
      // Toggle off — no re-open, just deselect
      setActiveFeedback(null)
      return
    }
    setFeedbackModal(type)
  }

  const handleFeedbackSubmitted = (type) => {
    setActiveFeedback(type)
  }

  // Don't render during active streaming
  if (isStreaming) return null

  return (
    <>
      <div className="msg-action-bar">
        {/* Copy */}
        <button
          className="msg-action-btn"
          onClick={handleCopy}
          title={t("copy")}
          aria-label={t("copy")}
        >
          <FiCopy />
          <span className="msg-action-label">{t("copy")}</span>
        </button>

        {/* Thumbs Up — only for logged-in users */}
        {accessToken && (
          <button
            className={`msg-action-btn ${activeFeedback === FEEDBACK_TYPE.THUMBS_UP ? "msg-action-btn--active msg-action-btn--positive" : ""}`}
            onClick={() => handleFeedbackClick(FEEDBACK_TYPE.THUMBS_UP)}
            title={t("goodResponse")}
            aria-label={t("goodResponse")}
            aria-pressed={activeFeedback === FEEDBACK_TYPE.THUMBS_UP}
          >
            <FiThumbsUp />
          </button>
        )}

        {/* Thumbs Down — only for logged-in users */}
        {accessToken && (
          <button
            className={`msg-action-btn ${activeFeedback === FEEDBACK_TYPE.THUMBS_DOWN ? "msg-action-btn--active msg-action-btn--negative" : ""}`}
            onClick={() => handleFeedbackClick(FEEDBACK_TYPE.THUMBS_DOWN)}
            title={t("badResponse")}
            aria-label={t("badResponse")}
            aria-pressed={activeFeedback === FEEDBACK_TYPE.THUMBS_DOWN}
          >
            <FiThumbsDown />
          </button>
        )}

        {/* Sources — only when available */}
        {hasSources && (
          <button
            className={`msg-action-btn ${sourcesOpen ? "msg-action-btn--active" : ""}`}
            onClick={() => onToggleSources(sources)}
            title={t("sources")}
            aria-label={t("sources")}
          >
            <div className="msg-action-logos-container">
            <img
              src={DEFAULT_WEB_LOGO}
              alt="Web source"
              className="msg-action-logo"
            />
            <img
              src={DEFAULT_KB_LOGO}
              alt="KB source"
              className="msg-action-logo"
            />
            </div>
            <span className="msg-action-label">{t("sources")} ({sources.length})</span>
          </button>
        )}
      </div>

      {/* Feedback modal */}
      <FeedbackModal
        isOpen={!!feedbackModal}
        type={feedbackModal}
        companyChatId={companyChatId}
        sessionId={sessionId}
        onClose={() => setFeedbackModal(null)}
        onSubmitted={handleFeedbackSubmitted}
      />
    </>
  )
}

export default MessageActionBar
