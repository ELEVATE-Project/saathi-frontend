import React, { useState, useEffect, useRef } from "react"
import { RxCross2 } from "react-icons/rx"
import { FiLogOut } from "react-icons/fi"
import { useTranslation } from "react-i18next"
import FormData from "components/Form/FormData"

/** Purple avatar circle showing the first letter of the user's name */
function AvatarInitial({ name = "", size = 52 }) {
  const initial = (name || "U")[0].toUpperCase()
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#572e91",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.38,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  )
}

/**
 * Config-driven user profile modal using reusable FormData component.
 *
 * Props:
 *   isOpen      – boolean
 *   onClose     – () => void
 *   onLogout    – () => void
 *   onSave      – (formValues: object) => void
 *   userData    – { firstName, designation, companyName, userState, district, preferredLanguage, ... }
 *   schema      – PROFILE_FORM_SCHEMA object
 *   options     – { languages: [{ label, value }], ... }
 *   modalConfig – PROFILE_MODAL_CONFIG object (optional)
 */
function UserProfileModal({
  isOpen,
  onClose,
  onLogout,
  onSave,
  userData = {},
  schema = { fields: [] },
  options = {},
  modalConfig = {},
}) {
  const { t } = useTranslation()
  const [formValues, setFormValues] = useState({})
  const overlayRef = useRef(null)

  const fields = schema.fields || []

  // Re-initialise form whenever modal opens or userData changes
  useEffect(() => {
    if (!isOpen) return
    const init = {}
    fields.forEach(field => {
      if (field.type === "split") {
        field.fields?.forEach(f => { init[f.dataKey] = userData[f.dataKey] ?? userData[f.id] ?? "" })
      } else {
        init[field.dataKey] = userData[field.dataKey] ?? userData[field.id] ?? ""
      }
    })
    setFormValues(init)
  }, [isOpen, userData])

  if (!isOpen) return null

  const handleChange = (key, value) => setFormValues(prev => ({ ...prev, [key]: value }))

  const handleOverlayClick = e => { if (e.target === overlayRef.current) onClose() }

  const inputCls =
    "w-full px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#f7f5f5] rounded-lg sm:rounded-xl text-xs sm:text-sm text-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"

  const labelCls = "block text-xs font-semibold text-[#572e91] mb-1"

  function renderField(field) {
    if (field.type === "split") {
      return (
        <div key={field.id} className="mb-3 sm:mb-4">
          <div className="label-div">
            <b className={labelCls}>{t(field.labelKey || field.labelName, field.labelName)}</b>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {field.fields?.map(f => (
              <div key={f.id} className="w-full">
                <FormData
                  layOut={f.layOut || 1}
                  id={f.id}
                  inputType={f.inputType || "text"}
                  inputName={f.inputName}
                  inputValue={formValues[f.dataKey] || ""}
                  inputOnChange={e => handleChange(f.dataKey, e.target.value)}
                  placeholder={t(f.placeholderKey || f.placeholder, f.placeholder)}
                  inputClass={inputCls}
                />
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (field.layOut === 2) {
      const opts = options[field.optionsKey] || []
      return (
        <div key={field.id} className="mb-3 sm:mb-4">
          <FormData
            layOut={2}
            selectID={field.id}
            labelName={t(field.labelKey || field.labelName, field.labelName)}
            labelClass={labelCls}
            selectName={field.selectName}
            selectValue={formValues[field.dataKey] || ""}
            selectOnChange={e => handleChange(field.dataKey, e.target.value)}
            selectOptions={opts}
            selectClassName={inputCls}
          />
          {field.hint && <p className="text-[11px] sm:text-xs text-gray-400 mt-1">{t(field.hintKey || field.hint, field.hint)}</p>}
        </div>
      )
    }

    return (
      <div key={field.id} className="mb-3 sm:mb-4">
        <FormData
          layOut={1}
          id={field.id}
          labelName={t(field.labelKey || field.labelName, field.labelName)}
          labelClass={labelCls}
          inputType={field.inputType || "text"}
          inputName={field.inputName}
          inputValue={formValues[field.dataKey] || ""}
          inputOnChange={e => handleChange(field.dataKey, e.target.value)}
          placeholder={t(field.placeholderKey || field.placeholder, field.placeholder)}
          inputClass={inputCls}
        />
      </div>
    )
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-3 sm:p-4 backdrop-blur-xs"
    >
      <div
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden max-h-[92vh] sm:max-h-[88vh]"
        style={{ maxWidth: modalConfig.maxWidth || "480px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-[#faf6fb] border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 mr-2">
            <AvatarInitial name={userData.name} size={44} />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-800 text-sm sm:text-base leading-snug truncate">
                {userData.name || userData.firstName || t("user", "User")}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {userData.role || userData.designation || ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-200/50 flex-shrink-0"
            aria-label="Close"
          >
            <RxCross2 size={18} />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1">
          {fields.map(field => renderField(field))}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex items-center justify-between gap-2 flex-shrink-0 bg-white">
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors py-1"
          >
            <FiLogOut size={15} />
            {t("logout")}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              onClick={() => onSave(formValues)}
              className="px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-[#572e91] rounded-lg hover:bg-[#4a2780] transition-colors shadow-sm"
            >
              {t("save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileModal
