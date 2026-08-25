import "../components/custom-style.css"
import "../index.css"
import { BiLoader } from "react-icons/bi"
import { clearFromStorage } from "../services/storage_service"
import { getSessionDetailsApi } from "../api/endpoints/chat"
import { DEFAULT_LANGUAGE, languageList } from "./ShikshalokamVoiceChat/enum"
import { sessionFlowName } from "../constants/session"
import { readElevateProfileApi } from "../api/endpoints/user"
import { setLanguage } from "../i18n"
import { URL_PARAMS } from "constants/urls"
import { useChatDataSessionStore, useSiteDataLocalStore, useUserDataLocalStore } from "store"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import ROUTES from "../url"
import { env } from "utils/env"

function SsoFlow() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { setChatLanguage, setHasSelectedLanguage, setSsoRerouteURL } = useSiteDataLocalStore.getState()
  const { setFlow, setSessionId, setIsNewChatOpen, setProjectId, setTaskId } = useChatDataSessionStore.getState()
  const { setFirstName, setCompanyName, setState, setAcceptedTnC, setAccessToken, setRefreshToken, setProfileId } = useUserDataLocalStore.getState()

  useEffect(() => {
    async function fetchProfileDetails() {
      const accessToken = searchParams.get(URL_PARAMS.ACCESS_TOKEN)
      const refreshToken = searchParams.get(URL_PARAMS.REFRESH_TOKEN)
      const projectId = searchParams.get(URL_PARAMS.PROJECT_ID)
      const taskId = searchParams.get(URL_PARAMS.TASK_ID)
      const sessionId = searchParams.get(URL_PARAMS.SESSION_ID)
      const languagePassed = searchParams.get(URL_PARAMS.LANGUAGE)
      let rerouteRaw = searchParams.get(URL_PARAMS.RE_ROUTE_URL) || ""
      if (rerouteRaw.startsWith('"') && rerouteRaw.endsWith('"')) {
        rerouteRaw = rerouteRaw.slice(1, -1)
      }

      if (env.AUTH_METHOD() === "url" && (!accessToken || accessToken === "")) {
        navigate(ROUTES.SHIKSHALOKAM_HOME_PAGE, { replace: true });
        return
      }

     let data
     try {
        data = await readElevateProfileApi(accessToken)
      } 
      catch (error) {
        console.error("[SsoFlow] readElevateProfileApi failed:", error)
        clearFromStorage()
        navigate(ROUTES.SHIKSHALOKAM_HOME_PAGE, { replace: true })
        return
     }

      if (data) {
        const profile_details = data?.profile_details
        if (profile_details) {
          clearFromStorage()
          setLanguage(DEFAULT_LANGUAGE)
          setChatLanguage(DEFAULT_LANGUAGE)
          if (sessionId && sessionId !== "" && sessionId !== "null") {
            setSessionId(sessionId)
          } else {
            let session = await getSessionDetailsApi()
            setSessionId(session.sessionid)
          }
          if (languagePassed && languagePassed !== "" && languagePassed !== "null" && languageList.some(l => l.value === languagePassed)) {
            setHasSelectedLanguage(true)
            setChatLanguage(languagePassed)
            setLanguage(languagePassed)
          } else if (profile_details.route) {
            setChatLanguage(profile_details.route)
            setLanguage(profile_details.route)
          }

          setSsoRerouteURL(rerouteRaw)
          setFirstName(profile_details.first_name)
          setCompanyName(profile_details.company)
          setState(profile_details.state)
          setFlow(env.FLOW_NAME())
          const hasAcc = profile_details.has_accepted_tnc;
          setAcceptedTnC(typeof hasAcc === "string" ? hasAcc : "ONGOING")
          setAccessToken(env.AUTH_METHOD() === "url" ? accessToken : true)
          if (refreshToken) setRefreshToken(refreshToken)
          setProfileId(profile_details.profileid)
          setIsNewChatOpen(true)
          setProjectId(projectId)
          setTaskId(taskId)

          const params = new URLSearchParams()
          if (languagePassed && languagePassed !== "" && languagePassed !== "null" && languageList.some(l => l.value === languagePassed)) {
            params.append("language", languagePassed)
          }
          const queryString = params.toString()
          const navigationPath = queryString ? `${ROUTES.SHIKSHALOKAM_HOME_PAGE}?${queryString}` : ROUTES.SHIKSHALOKAM_HOME_PAGE
          navigate(navigationPath, { replace: true })
        } else {
          clearFromStorage()
          navigate(ROUTES.SHIKSHALOKAM_HOME_PAGE, { replace: true })
        }
      } else {
        clearFromStorage()
        navigate(ROUTES.SHIKSHALOKAM_HOME_PAGE, { replace: true })
      }
    }

    fetchProfileDetails()
  }, [searchParams])

  return (
    <div className="container max-w-full md mt-0 mx-auto grid md:grid-cols-2 justify-center h-screen">
      <div className="login-load-spinner">
        <div className="login-div67">
          <BiLoader className="login-rotate-loader login-loader-icon" />
        </div>
      </div>
    </div>
  )
}

export default SsoFlow
