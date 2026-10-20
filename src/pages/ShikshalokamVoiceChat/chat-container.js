import { API_ENDPOINTS } from "../../constants/urls"
import { BiLoader } from "react-icons/bi"
import { getFlowInfoApi } from "../../api/endpoints"
import { getProfileApi, acceptTncApi } from "../../api/endpoints/user"
import { getSessionDetails } from "../../services/api.service"
import { languageList } from "./enum"
import { setLanguage } from "../../i18n"
import { useChatStorage, useUserStorage } from "../../hooks/useStorage"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useSiteDataSessionStore } from "store"
import { validateSession } from "../../utils/session"
import DynamicVoiceChat from "./dynamic-voice-chat"
import PrivacyPolicyPopup from "../../components/TnC/privacyPolicyPopup"
import ProfileChatPopup from "../../components/ProfileChatPopup/ProfileChatPopup"
import ROUTES from "../../url"
import useSmartChatStorage from "../../hooks/useSmartChatStorage"
import useChatDataLocalStore from "../../store/slices/chatData/chatDataLocal"
import useUserDataLocalStore from "../../store/slices/userData/userDataLocal"
import { env } from "utils/env"

// ---------------------------------------------------------------------------
// Profile-session persistence helpers
//
// The profile/onboarding popup runs inside a separate DynamicVoiceChat that
// shares the same chatData localStorage store as the main chat.  Its session
// ID must survive page refreshes so the user can continue an in-progress
// onboarding rather than being sent back to the beginning every time.
//
// We persist the session ID to a per-user localStorage key.  Keying by
// profileId ensures that a session created by User A is never accidentally
// restored for User B after a logout+login cycle.
// ---------------------------------------------------------------------------
const PROFILE_SESSION_STORAGE_KEY = profileId =>
  `saathi_profile_session_${profileId}`

/** Read the persisted onboarding session ID for the given profile, or null. */
const getPersistedProfileSessionId = profileId => {
  if (!profileId) return null
  try {
    return localStorage.getItem(PROFILE_SESSION_STORAGE_KEY(profileId)) || null
  } catch {
    return null
  }
}

/** Write the onboarding session ID to localStorage. */
const setPersistedProfileSessionId = (profileId, sessionId) => {
  if (!profileId || !sessionId) return
  try {
    localStorage.setItem(PROFILE_SESSION_STORAGE_KEY(profileId), sessionId)
  } catch {}
}

/** Remove the persisted onboarding session ID (called on close/complete). */
const clearPersistedProfileSessionId = profileId => {
  if (!profileId) return
  try {
    localStorage.removeItem(PROFILE_SESSION_STORAGE_KEY(profileId))
  } catch {}
}

function ChatContainer() {
  const navigate = useNavigate()
  const flowName = env.FLOW_NAME()
  const { t } = useTranslation()

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log("[CHAT CONTAINER MOUNTED]", { pathname: window.location.pathname })
    }
  }, [])

  const [isLoading, setIsLoading] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [profileCheckDone, setProfileCheckDone] = useState(false)
  const [profileSessionId, setProfileSessionId] = useState(null)
  const [isTncAccepted, setIsTncAccepted] = useState(null)
  const [isProfileComplete, setIsProfileComplete] = useState(null)
  const [isTncLoading, setIsTncLoading] = useState(false)

  const chatLanguage = useSiteDataSessionStore(state => state.chatLanguage)
  const ipFetched = useUserStorage()(state => state.ipFetched)
  const setIpFetched = useUserStorage()(state => state.setIpFetched)
  const setIsNewChatOpen = useChatStorage()(state => state.setIsNewChatOpen)
  const setIsOldChatOpen = useChatStorage()(state => state.setIsOldChatOpen)
  const setSessionId = useChatStorage()(state => state.setSessionId)

  const [chatHistory, setChatHistory, removeChatHistory, getChatHistory] = useSmartChatStorage()

  const accessToken = useUserDataLocalStore(state => state.access_token)
  const profileId = useUserDataLocalStore(state => state.profileId)

  const { data: flowInfo } = useQuery({
    queryKey: [API_ENDPOINTS.FLOW_CONNECTION_INFO, flowName],
    queryFn: () => getFlowInfoApi(flowName),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  useEffect(() => {
    const chat_history = getChatHistory()
    // Remove unreceived messages on mount (e.g. messages sent right before
    // a page reload that were never echoed back by the server).
    // Profile-onboarding messages (saathi_profile) are preserved here so
    // they survive language changes and navigation during the popup session.
    // They are only cleared in handleProfilePopupClose once onboarding completes.
    const updated_chat_history = chat_history.filter(chat => chat.received)
    setChatHistory(updated_chat_history)
  }, [])

  // Check TnC acceptance status
  useEffect(() => {
    if (!accessToken) {
      // Guest — skip TnC, treat as accepted
      setIsTncAccepted(true)
      setIsProfileComplete(true)
      return
    }
    if (!profileId) {
      // Authenticated but missing profile — block until profile is available
      return
    }
    if (isTncAccepted !== null) return

    let cancelled = false
    setIsTncLoading(true)

    ;(async () => {
      try {
        const data = await getProfileApi(profileId, accessToken)
        if (cancelled) return

        if (
          typeof data?.is_tnc_accepted !== "boolean" ||
          typeof data?.is_profile_complete !== "boolean"
        ) {
          console.error("[ChatContainer] TnC check returned malformed data:", data)
          setIsTncAccepted(false)
          setIsProfileComplete(false)
          return
        }

        setIsTncAccepted(data.is_tnc_accepted)
        setIsProfileComplete(data.is_profile_complete)

        if (data.is_tnc_accepted !== false) {
          useUserDataLocalStore.getState().setAcceptedTnC(true)
        }
      } catch (error) {
        if (cancelled) return
        console.error("[ChatContainer] TnC check failed:", error)
        setIsTncAccepted(false)
        setIsProfileComplete(false)
      } finally {
        if (!cancelled) setIsTncLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [accessToken, profileId, isTncAccepted])

  const handleAcceptTnC = useCallback(async () => {
    try {
      await validateSession()
      const result = await acceptTncApi(profileId, accessToken)

      if (result?.is_tnc_accepted === true) {
        setIsTncAccepted(true)
        useUserDataLocalStore.getState().setAcceptedTnC(true)
      } else {
        console.error("[ChatContainer] TnC accept returned unexpected result:", result)
      }
    } catch (error) {
      console.error("[ChatContainer] TnC accept failed:", error)
    }
  }, [profileId, accessToken])

  const showTnCPopup = isTncAccepted === false && !isTncLoading

  // Check if profile onboarding is needed (only after TnC accepted)
  useEffect(() => {
    setProfileCheckDone(false)
    if (!accessToken) {
      setProfileCheckDone(true)
      return
    }
    if (!profileId) {
      // Authenticated but missing profile — keep profileCheckDone false
      // so the spinner stays visible while we wait for profileId
      return
    }
    if (isTncAccepted !== true) {
      setProfileCheckDone(true)
      return
    }

    if (isProfileComplete === false) {
      ;(async () => {
        try {
          // 1. Check localStorage for a session created during a previous
          //    visit — this is the primary restoration path after a refresh.
          const persistedSessionId = getPersistedProfileSessionId(profileId)
          if (persistedSessionId) {
            setProfileSessionId(persistedSessionId)
            setShowProfilePopup(true)
            setProfileCheckDone(true)
            return
          }

          // 2. Fallback: generate a new onboarding session and persist it.
          const profileSession = await getSessionDetails()
          if (profileSession?.sessionid) {
            setPersistedProfileSessionId(profileId, profileSession.sessionid)
            setProfileSessionId(profileSession.sessionid)
          } else {
            console.error("[ChatContainer] profile session fetch returned no sessionid:", profileSession)
          }
        } catch (err) {
          console.error("[ChatContainer] profile session fetch failed:", err)
        }
        setShowProfilePopup(true)
        setProfileCheckDone(true)
      })()
    } else {
      // Profile is already complete. However, if the user finished answering
      // all onboarding questions and then refreshed the page BEFORE
      // handleProfilePopupClose had a chance to run, localStorage still holds
      // the stale onboarding session key and the chatData store may still point
      // at that dead session — causing a blank/stuck loading screen on re-entry.
      // Detect this and perform the same cleanup that handleProfilePopupClose
      // would have done.
      ;(async () => {
        const staleSessionId = getPersistedProfileSessionId(profileId)
        if (staleSessionId) {
          // The key's existence is the definitive signal that the user finished
          // all onboarding questions but refreshed before handleProfilePopupClose
          // ran. The popup DVC writes chat history into the shared store but uses
          // sessionOverride — it never touches store.sessionId — so comparing
          // store.sessionId === staleSessionId is always false and the old guard
          // was silently skipping the cleanup entirely.
          clearPersistedProfileSessionId(profileId)
          const store = useChatDataLocalStore.getState()
          store.setChatHistory([])
          setChatHistory([]) // also clear in-memory React state immediately
          store.setIntroMessage(null)
          store.setStrandStep(null)
          store.setIsNewChatOpen(true)
          store.setIsOldChatOpen(false)
          store.setShowHomepage(true)
          store.setSessionId(null)
          try {
            const session = await getSessionDetails()
            store.setSessionId(session.sessionid)
          } catch (err) {
            console.error("[ChatContainer] stale-session recovery failed:", err)
          }
        }
        setProfileCheckDone(true)
      })()
    }
  }, [accessToken, profileId, isTncAccepted, isProfileComplete])

  const handleProfilePopupClose = useCallback(async () => {
    // 1. Hide the popup first — this unmounts the popup's DynamicVoiceChat
    //    and changes the main DVC's key, causing it to remount fresh.
    setShowProfilePopup(false)
    setProfileSessionId(null)

    // 2. Clear the persisted onboarding session ID so that the next time the
    //    profile check runs (e.g. after another login) a fresh session is
    //    created rather than the now-completed one being restored.
    clearPersistedProfileSessionId(profileId)

    // 3. Now clear the store — no other DVC instance is mounted to write back.
    //    Use a microtask to ensure React has processed the unmount.
    await Promise.resolve()
    const store = useChatDataLocalStore.getState()
    store.setIsOldChatOpen(false)
    store.setIsNewChatOpen(true)
    store.setShowHomepage(true)
    store.setIntroMessage(null)
    store.setSessionId(null)
    store.setStrandStep(null)
    store.setChatHistory([])

    try {
      const session = await getSessionDetails()
      store.setSessionId(session.sessionid)
    } catch (error) {
      console.error("[handleProfilePopupClose] getSessionDetails failed:", error)
    }
  }, [profileId])

  useEffect(() => {
    const runSetup = async () => {
      try {
        if (!accessToken) {
          navigate(ROUTES.SHIKSHALOKAM_HOME_PAGE, { replace: true })
          return
        }

        const currentSessionId = useChatDataLocalStore.getState().sessionId
        if (!currentSessionId) {
          setIsLoading(true)
          setIsOldChatOpen(false)
          setIsNewChatOpen(true)

          try {
            const session = await getSessionDetails()
            setSessionId(session.sessionid)
          } catch (error) {
            console.log("[ChatContainer] authenticated session bootstrap failed:", error)
            navigate(ROUTES.SHIKSHALOKAM_HOME_PAGE)
          }

          const storedLanguage = chatLanguage || languageList[0].value
          setLanguage(storedLanguage)

          setIsLoading(false)
        }
      } finally {
        setIpFetched(true)
      }
    }

    if (!flowInfo) return

    setIpFetched(false)
    runSetup()
  }, [accessToken, flowInfo])

  return (
    <>
      {showTnCPopup && (
        <PrivacyPolicyPopup
          tncText={t("tncText")}
          onAccept={handleAcceptTnC}
          useStaticText={false}
          isGuestChat={false}
        />
      )}
      <div>
        {accessToken && !isLoading && profileCheckDone && isTncAccepted === true && !showProfilePopup && <DynamicVoiceChat key="main" />}
      </div>
      {showProfilePopup && (
        <ProfileChatPopup isOpen={showProfilePopup} onClose={handleProfilePopupClose} sessionId={profileSessionId} />
      )}
      {!showProfilePopup && !showTnCPopup && (isLoading || !ipFetched || !profileCheckDone || isTncLoading) && (
        <div className="loader-load-spinner">
          <div className="div67">
            <BiLoader className="loader-rotate-loader loader-icon" />
          </div>
        </div>
      )}
    </>
  )
}

export default ChatContainer
