import { API_ENDPOINTS } from "../../constants/urls"
import { BiLoader } from "react-icons/bi"
import { getFlowInfoApi, loginApi } from "../../api/endpoints"
import { getSessionDetails } from "../../services/api.service"
import { languageList } from "./enum"
import { setLanguage } from "../../i18n"
import { useChatStorage, useUserStorage } from "../../hooks/useStorage"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useSiteDataSessionStore } from "store"
import DynamicVoiceChat from "./dynamic-voice-chat"
import ROUTES from "../../url"
import useSmartChatStorage from "../../hooks/useSmartChatStorage"
import useUserDataLocalStore from "../../store/slices/userData/userDataLocal"
import { env } from "utils/env"

function ChatContainer() {
  const navigate = useNavigate()
  const flowName = env.FLOW_NAME()

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log("[CHAT CONTAINER MOUNTED]", { pathname: window.location.pathname })
    }
  }, [])

  const [isLoading, setIsLoading] = useState(false)
  const { setFirstName } = useUserStorage().getState()

  const chatLanguage = useSiteDataSessionStore(state => state.chatLanguage)
  const companyName = useUserStorage()(state => state.companyName)
  const deviceId = useUserStorage()(state => state.device_id)
  const ipFetched = useUserStorage()(state => state.ipFetched)
  const sessionId = useChatStorage()(state => state.sessionId)
  const setCompanyName = useUserStorage()(state => state.setCompanyName)
  const setDeviceId = useUserStorage()(state => state.setDeviceId)
  const setIpFetched = useUserStorage()(state => state.setIpFetched)
  const setIsNewChatOpen = useChatStorage()(state => state.setIsNewChatOpen)
  const setSessionId = useChatStorage()(state => state.setSessionId)
  const setUserId = useUserStorage()(state => state.setUserId)

  const [chatHistory, setChatHistory, removeChatHistory, getChatHistory] = useSmartChatStorage()

  const accessToken = useUserDataLocalStore(state => state.access_token)

  const { data: flowInfo } = useQuery({
    queryKey: [API_ENDPOINTS.FLOW_CONNECTION_INFO, flowName],
    queryFn: () => getFlowInfoApi(flowName),
    // staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  useEffect(() => {
    const chat_history = getChatHistory()
    const updated_chat_history = chat_history.filter(chat => chat.received)
    setChatHistory(updated_chat_history)
  }, [])

  function getUserFingerPrint() {
    if (accessToken) return

    try {
      const fingerprint = window.navigator.userAgent + window.navigator.language + window.screen.colorDepth + window.screen.pixelDepth + window.screen.width + window.screen.height

      const newUserId = deviceId || btoa(fingerprint)

      if (!deviceId) setDeviceId(newUserId)
      setUserId(newUserId)
    } catch (error) {
      console.error("Error handling user ID:", error)
      setUserId("guest_" + Date.now())
    }
  }

  async function initialSetup() {
    if (accessToken) return

    try {
      const customEmail = deviceId + "@shikshalokam.org"

      setIsLoading(true)
      let session = await getSessionDetails()
      setSessionId(session.sessionid)

      const response = await loginApi({
        email: customEmail,
        password: "grit@123",
      })

      if (response?.access_token) {
        setCompanyName(response?.company)
        setFirstName(response?.first_name)
      } else {
        window.location.reload()
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error during initial setup:", error)
      navigate(ROUTES.SHIKSHALOKAM_HOME_PAGE)
      setIsLoading(false)
    }
  }

  const setFinalLanguage = async () => {
    if (accessToken) {
      try {const session = await getSessionDetails()
      setSessionId(session.sessionid)}
      catch (error) {
        console.log("[ChatContainer] authenticated session bootstrap failed:", error)
        navigate(ROUTES.SHIKSHALOKAM_HOME_PAGE)
      }
      return
    }

    await initialSetup()
    const storedLanguage = chatLanguage || languageList[0].value
    setLanguage(storedLanguage)
  }

  useEffect(() => {
    const runSetup = async () => {
      try {
        if (!sessionId) {
          setIsLoading(true)
          setIsNewChatOpen(true)

          getUserFingerPrint()
          await setFinalLanguage()

          setIsLoading(false)
        }
      } finally {
        setIpFetched(true)
      }
    }

    if (!flowInfo) return

    setIpFetched(false)
    runSetup()
  }, [accessToken, sessionId, flowInfo])

  return (
    <>
      {(companyName || accessToken) && !isLoading && <DynamicVoiceChat />}
      {(isLoading || !ipFetched) && (
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
