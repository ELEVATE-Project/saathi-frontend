import { API_ENDPOINTS } from "../../constants/urls"
import { BiLoader } from "react-icons/bi"
import { getFlowInfoApi } from "../../api/endpoints"
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
import useChatDataLocalStore from "../../store/slices/chatData/chatDataLocal"
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

  const chatLanguage = useSiteDataSessionStore(state => state.chatLanguage)
  const ipFetched = useUserStorage()(state => state.ipFetched)
  const sessionId = useChatStorage()(state => state.sessionId)
  const setIpFetched = useUserStorage()(state => state.setIpFetched)
  const setIsNewChatOpen = useChatStorage()(state => state.setIsNewChatOpen)
  const setSessionId = useChatStorage()(state => state.setSessionId)

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
      {accessToken && !isLoading && <DynamicVoiceChat />}
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
