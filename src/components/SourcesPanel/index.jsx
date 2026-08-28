import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { RxCross2 } from "react-icons/rx"
import { FiGlobe } from "react-icons/fi"
import { BiLibrary } from "react-icons/bi"
import { SOURCE_TYPE, DEFAULT_KB_LOGO, DEFAULT_WEB_LOGO } from "constants/dynamic-chat"

function getSourceIcon(sourceType) {
  if (sourceType === SOURCE_TYPE.WEB_SEARCH) {
    return <img src={DEFAULT_WEB_LOGO} className="source-item-logo" alt="Web search source" />
  }
  return <img src={DEFAULT_KB_LOGO} className="source-item-logo" alt="Knowledge base source" />
}

function SourceIcon({ src }) {
  const [imgError, setImgError] = useState(false)
  if (src.logo && !imgError) {
    return (
      <img
        src={src.logo}
        className="source-item-logo"
        alt={src.company || src.domain || "logo"}
        onError={() => setImgError(true)}
      />
    )
  }
  return getSourceIcon(src.source)
}


function isValidUrl(urlString) {
  if (!urlString || typeof urlString !== "string") return false
  try {
    const parsed = new URL(urlString)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

/**
 * SourcesPanel — bottom sheet on mobile, right slide-in on desktop.
 * @param {{ isOpen: boolean, sources: Array, isMobile: boolean, onClose: () => void }} props
 */
function SourcesPanel({ isOpen, sources = [], isMobile, onClose }) {
  const { t } = useTranslation()

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = "" }
    }
  }, [isOpen, isMobile])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = e => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  return (
    <>
      {isMobile && isOpen && (
        <div className="sources-overlay" onClick={onClose} aria-hidden="true" />
      )}
      <aside className={`sources-panel ${isMobile ? "sources-panel--mobile" : "sources-panel--desktop"} ${isOpen ? "sources-panel--open" : ""}`} role="dialog" aria-label={t("sources")}>
        <div className="sources-panel-header">
          <h3 className="sources-panel-title">{t("sources")}</h3>
          <button className="sources-panel-close" onClick={onClose} aria-label={t("close")}>
            <RxCross2 />
          </button>
        </div>
        <div className="sources-panel-body">
          {sources.length === 0 ? (
            <p className="sources-empty">{t("noSources")}</p>
          ) : (
            <ul className="sources-list">
              {sources.map((src, idx) => {
                const validUrl = isValidUrl(src?.url)
                const label = src.company || src.domain
                return (
                  <li key={idx} className="source-item">
                    <SourceIcon src={src} />
                    <div className="source-item-content">
                      {validUrl ? (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="source-item-title"
                          title={src.title}
                        >
                          {src.title}
                        </a>
                      ) : (
                        <span className="source-item-title" title={src.title}>
                          {src.title}
                        </span>
                      )}
                      {label && (
                      <div className="source-item-meta">
                        <span className="source-item-badge">
                          {label}
                        </span>
                      </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  )
}

export default SourcesPanel
