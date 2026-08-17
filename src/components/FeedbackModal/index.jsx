import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { submitChatFeedbackApi } from "api/endpoints/feedback"
import { getChatsFromDB } from "api/endpoints/chat_flow"
import { showNotification } from "components/ToastMessage/TotastMessage"

/**
 * FeedbackModal — single modal for both positive and negative feedback.
 * @param {{ isOpen: boolean, type: "thumbs_up"|"thumbs_down", companyChatId: number, sessionId: string, onClose: () => void, onSubmitted: (type: string) => void }} props
 */
function FeedbackModal({ isOpen, type, companyChatId, sessionId, onClose, onSubmitted }) {
  const { t } = useTranslation()
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const isPositive = type === "thumbs_up"
  const title = isPositive ? t("feedbackPositiveTitle") : t("feedbackNegativeTitle")
  const placeholder = isPositive
    ? t("feedbackPositivePlaceholder")
    : t("feedbackNegativePlaceholder")

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      let targetCompanyChatId = companyChatId
      if ((typeof targetCompanyChatId !== "number" || isNaN(targetCompanyChatId)) && sessionId) {
        try {
          const freshData = await getChatsFromDB(sessionId)
          const results = Array.isArray(freshData?.results) ? freshData.results : (Array.isArray(freshData) ? freshData : [])
          const lastBotDbChat = [...results].reverse().find(c => c?.sender?.id === 1 || c?.role === "bot")
          if (lastBotDbChat?.id) {
            targetCompanyChatId = lastBotDbChat.id
          }
        } catch (err) {
          console.error("Error resolving companychat ID from DB:", err)
        }
      }

      await submitChatFeedbackApi({
        company_chat: targetCompanyChatId,
        thumbs_up: isPositive,
        thumbs_down: !isPositive,
        comment: comment.trim(),
      })
      showNotification({
        message: t("feedbackSubmitted"),
        type: "success",
        options: { autoClose: 3000, isOfflineToast: true },
      })
      onSubmitted(type)
      onClose()
    } catch {
      showNotification({
        message: t("feedbackError"),
        type: "error",
        options: { autoClose: 3000, isOfflineToast: true },
      })
    } finally {
      setIsSubmitting(false)
      setComment("")
    }
  }

  const handleClose = () => {
    setComment("")
    onClose()
  }

  return (
    <div className="feedback-modal-overlay" onClick={e => { if (e.target === e.currentTarget) handleClose() }}>
      <div className="feedback-modal">
        <h3 className="feedback-modal-title">{title}</h3>
        <p className="feedback-modal-label">{t("feedbackDetailsLabel")}</p>
        <textarea
          className="feedback-modal-textarea"
          placeholder={placeholder}
          value={comment}
          onChange={e => setComment(e.target.value)}
          maxLength={500}
          rows={4}
        />
        <p className="feedback-modal-hint">
          {t("feedbackHint")}
        </p>
        <div className="feedback-modal-actions">
          <button className="feedback-modal-cancel" onClick={handleClose} disabled={isSubmitting}>
            {t("cancel")}
          </button>
          <button className="feedback-modal-submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackModal
