import { useChatDataLocalStore } from "../store"
import { useChatStorage, useSiteStorage } from "hooks/useStorage"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import ROUTES from "../url"
import { env } from "utils/env"

export const useFlow = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const selectedFlow = useChatStorage()(state => state.flow)
  const { setPreviousUrl } = useSiteStorage().getState()

  const handleFlowSelection = async stopAllAudio => {
    if (!selectedFlow) return

    setIsLoading(true)
    await stopAllAudio()

    setPreviousUrl(window.location.href)

    useChatDataLocalStore.getState().setFlow(env.FLOW_NAME())

    navigate(ROUTES.COMMON_CHAT)
    setIsLoading(false)
  }

  return {
    isLoading,
    setIsLoading,
    handleFlowSelection,
  }
}
