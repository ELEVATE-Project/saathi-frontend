import "../../components/custom-style.css"
import "../../index.css"
import "./commonPageStyle.css"
import { LANGUAGE_ENUMS } from "pages/ShikshalokamVoiceChat/enum"
import { sessionFlowName } from "../../constants/session"
import { URL_PARAMS } from "../../constants/urls"
import { useAudio } from "../../hooks/useAudio"
import { useEffect, useMemo, useState, useCallback } from "react"
import { useFlow } from "../../hooks/useFlow"
import { useLanguage } from "../../hooks/useLanguage"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useSiteDataSessionStore } from "store"
import { useSiteStorage } from "hooks/useStorage"
import FlowSelection from "../../components/FlowSelection"
import Header from "../../components/Header"
import LanguageSelectionGrid from "../../components/LanguageSelectionGrid"
import LoadingSpinner from "../../components/LoadingSpinner"
import ROUTES from "../../url"
import useUrlFlow from "hooks/useUrlFlow"
import { useUserDataLocalStore, useChatDataLocalStore } from "store"
import { useTranslation } from "react-i18next"
import PrivacyPolicyPopup from "../../components/TnC/privacyPolicyPopup"
import ProfileChatPopup from "../../components/ProfileChatPopup/ProfileChatPopup"
import { getProfileApi, acceptTncApi } from "api/endpoints/user"
import { getSessionDetails } from "../../services/api.service"

function CommonHomePage({ usecaseType }) {
  const { audioRef, stopAudioTriggered, setStopAudioTriggered, stopAllAudio } = useAudio()
  const { isLoading, setIsLoading, handleFlowSelection } = useFlow()
  const { languageButtonSelect, handleLanguageChange } = useLanguage()
  const chatLanguage = useSiteDataSessionStore(state => state.chatLanguage)
  const hasSelectedLanguage = useSiteDataSessionStore(state => state.hasSelectedLanguage)
  const setChatLanguage = useSiteDataSessionStore(state => state.setChatLanguage)
  const setPreviousUrl = useSiteStorage()(state => state.setPreviousUrl)
  const accessToken =
    useUserDataLocalStore(
      state => state.access_token
    )

  const zustandProfileId = useUserDataLocalStore(state => state.profileId)

  const profileId =
    zustandProfileId ??
    JSON.parse(localStorage.getItem("profileid") || "null")

  const { t } = useTranslation()

  const isSaathiHome = !usecaseType

  const showLanding =
    isSaathiHome &&
    !Boolean(accessToken)

    console.log("[CommonHomePage]", {
      accessToken,
      showLanding,
      isLoading,
      isSaathiHome,
      usecaseType,
      windowLocation: window.location.href,
    })

  const ptm_case = sessionFlowName.megaPTM === usecaseType
  const ylc_case = sessionFlowName.YLC === usecaseType

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const { flow: urlFlow } = useUrlFlow()
  const urlLanguage = useMemo(() => searchParams.get("language"), [searchParams])

  const [isTncAccepted, setIsTncAccepted] = useState(null)
  const [isProfileComplete, setIsProfileComplete] = useState(null)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [isProfileLoading, setIsProfileLoading] = useState(false)

  const languageSelected = hasSelectedLanguage || !!urlLanguage
  const isSaathiOnboarding =
    isSaathiHome &&
    (!urlFlow || urlFlow === "saathi")

  const saathiOnboardingDone =
    !isSaathiOnboarding ||
    (
      isTncAccepted === true &&
      isProfileComplete === true &&
      !showProfilePopup
    )

    console.log("[RENDER CommonHomePage]", {
      isTncAccepted,
      isProfileComplete,
      showProfilePopup,
      isSaathiOnboarding,
      saathiOnboardingDone,
      pathname: window.location.pathname,
      search: window.location.search,
    })

  const showTnCPopup =
    isSaathiOnboarding &&
    languageSelected &&
    isTncAccepted === false &&
    !isProfileLoading

  useEffect(() => {
    if (zustandProfileId || !profileId) return
    useUserDataLocalStore.getState().setProfileId(profileId)
  }, [zustandProfileId, profileId])

  // Initialize language and flow processing
  useEffect(() => {
    if (chatLanguage) return

    if (!urlLanguage && !languageButtonSelect) {
      setChatLanguage(LANGUAGE_ENUMS.ENGLISH)
    }
  }, [chatLanguage])

  useEffect(() => {
    if (!urlFlow) return

    stopAllAudio()
  }, [urlFlow])

  useEffect(() => {
    if (showLanding) return
    if (isSaathiOnboarding && !saathiOnboardingDone) return

    if (!hasSelectedLanguage || !urlFlow) return

    console.log("[NAV EFFECT 1]", {
      isTncAccepted,
      isProfileComplete,
      showProfilePopup,
      isSaathiOnboarding,
      saathiOnboardingDone,
      pathname: window.location.pathname,
    })

    navigate({
      pathname: ROUTES.COMMON_CHAT,
      search: new URLSearchParams({ [URL_PARAMS.FLOW]: urlFlow }).toString(),
    })
  }, [urlFlow, hasSelectedLanguage, showLanding, isSaathiOnboarding, saathiOnboardingDone])

  // Process language selection
  useEffect(() => {
    if (showLanding) return
    if (!urlLanguage && !hasSelectedLanguage) {
      setIsLoading(false)
      return
    }
    if (isSaathiOnboarding && !saathiOnboardingDone) return
    // Don't process if user hasn't selected a language (and no URL language) or if no flow is specified
    console.log({ urlLanguage, hasSelectedLanguage, urlFlow })


    if (ptm_case) {
      navigate(ROUTES.SHIKSHALOKAM_PTM_CHAT_PAGE)
      return
    }

    if (ylc_case) {
      navigate(ROUTES.SHIKSHALOKAM_YLC_CHAT_PAGE)
      return
    }

    if (!urlFlow) {
      setIsLoading(false)
      return
    }

    const URL_PARAMS_MAP = {
      [sessionFlowName.ListeningActivity]: ROUTES.SHIKSHALOKAM_GUEST_LISTENING_CHAT,
      [sessionFlowName.ParentPerceptionSurvey]: ROUTES.SHIKSHALOKAM_PPPI_VOICE_CHAT,
    }
    setPreviousUrl(window.location.href)

    if (URL_PARAMS_MAP[urlFlow]) {
      navigate(URL_PARAMS_MAP[urlFlow])
      return
    }

    console.log("[NAV EFFECT 2]", {
      isTncAccepted,
      isProfileComplete,
      showProfilePopup,
      isSaathiOnboarding,
      saathiOnboardingDone,
      pathname: window.location.pathname,
    })

    
    navigate({
      pathname: ROUTES.COMMON_CHAT,
      search: new URLSearchParams({ [URL_PARAMS.FLOW]: urlFlow }).toString(),
    })
  }, [chatLanguage, urlLanguage, urlFlow, hasSelectedLanguage, showLanding, isSaathiOnboarding, saathiOnboardingDone])

  useEffect(() => {
    handleLanguageChange(chatLanguage, audioRef, stopAllAudio, setStopAudioTriggered)
  }, [chatLanguage])

  useEffect(() => {
    if (showLanding) {
      setIsLoading(false)
    }
  }, [showLanding, setIsLoading])

  useEffect(() => {
    if (!isSaathiOnboarding) return
    if (showLanding) return
    if (!languageSelected) return
    if (isTncAccepted !== null) return

    if (!profileId) {
      setIsTncAccepted(true)
      setIsProfileComplete(true)
      useUserDataLocalStore.getState().setAcceptedTnC(true)
      return
    }

    let cancelled = false
    setIsProfileLoading(true)

    ;(async () => {
      const data = await getProfileApi(profileId)
      if (cancelled) return

      setIsProfileLoading(false)

      if (
        typeof data?.is_tnc_accepted !== "boolean" ||
        typeof data?.is_profile_complete !== "boolean"
      ) {
        setIsTncAccepted(true)
        setIsProfileComplete(true)
        useUserDataLocalStore.getState().setAcceptedTnC(true)
        return
      }

      setIsTncAccepted(data.is_tnc_accepted)
      setIsProfileComplete(data.is_profile_complete)

      if (data.is_tnc_accepted !== false) {
        useUserDataLocalStore.getState().setAcceptedTnC(true)
      }

      if (data.is_tnc_accepted === true && data.is_profile_complete === false) {
        console.log("[TRACE profileCheck] setShowProfilePopup(true) — tnc accepted, profile incomplete", { ts: Date.now() })
        setShowProfilePopup(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isSaathiOnboarding, showLanding, profileId, languageSelected, isTncAccepted])

  const handleAcceptTnC = useCallback(async () => {
    try {
      await acceptTncApi(profileId)
    } catch (error) {
      console.error(error)
    }

    setIsTncAccepted(true)
    console.log("[ACCEPT CLICKED]", {
      isTncAccepted,
      isProfileComplete,
      showProfilePopup,
    })
    useUserDataLocalStore.getState().setAcceptedTnC(true)

    if (isProfileComplete === false) {
      console.log("[TRACE handleAcceptTnC] setShowProfilePopup(true) — profile incomplete", { ts: Date.now() })
      setShowProfilePopup(true)
    }
  }, [profileId, isProfileComplete])

  const handleProfilePopupClose = useCallback(async () => {
    console.log("[TRACE handleProfilePopupClose] ENTER", { showProfilePopup, ts: Date.now() })
    const {
      setIsOldChatOpen,
      setIsNewChatOpen,
      setShowHomepage,
      setSessionId,
      setIntroMessage,
      setStrandStep,
      setChatHistory,
    } = useChatDataLocalStore.getState()

    // Mirror resetChat() lines 1968-1978 (without reload)
    setIsOldChatOpen(false)
    setIsNewChatOpen(true)
    setShowHomepage(true)
    setIntroMessage(null)
    setSessionId(null)
    setStrandStep(null)
    setChatHistory([])

    console.log("[TRACE handleProfilePopupClose] awaiting getSessionDetails", { ts: Date.now() })
    const session = await getSessionDetails()
    console.log("[TRACE handleProfilePopupClose] getSessionDetails resolved", { ts: Date.now() })
    setSessionId(session.sessionid)

    console.log("[TRACE handleProfilePopupClose] calling setShowProfilePopup(false)", { ts: Date.now() })
    setShowProfilePopup(false)
    setIsProfileComplete(true)
    console.log("[TRACE handleProfilePopupClose] EXIT", { ts: Date.now() })
  }, [showProfilePopup])

  const onFlowContinue = () => {
    return handleFlowSelection(stopAllAudio)
  }

  if (showLanding) {
    console.log("[CommonHomePage] LANDING BRANCH")
    return (
      <div className="container max-w-full md mt-0 mx-auto grid md:grid-cols-2 px-0">
        <div className="px-5 hidden sm:block">
          <div className="flex">
            <img
              src={t("pageLogo")}
              className="h-[100px] w-[200px] object-contain aspect-auto align-top object-[center_center] relative ml-0"
              alt="shikshalokam_logo"
            />
          </div>

          <div className="mt-[40px]">
            <div className="text-center sm:text-md text-xl mb-2 text-slate-700">
              <b>{t("landing_heading")}</b>
            </div>

            <p className="text-center text-slate-700">
              {t("landing_tagline")}
            </p>
          </div>

          <img
            src="https://mohini-static.shikshalokam.org/fe-images/PNG/Shikshalokam/innovationpana-1@2x.png"
            width="360"
            height="300"
            className="center-img custom-login-image"
            alt=""
          />
        </div>

        <div className="w-full px-0">
          <div className="justify-center w-full flex sm:hidden">
            <div className="w-full">
              <div className="justify-center w-full flex sm:hidden items-center p-2">
                <img
                  src={t("pageLogo")}
                  className="h-[50px] w-[140px] object-contain"
                  alt="shikshalokam_logo"
                />
              </div>
            </div>
          </div>

          <div className="sm:hidden text-center sm:text-sm mb-1 text-md text-slate-700">
            <b>{t("landing_heading")}</b>
          </div>

          <p className="sm:hidden text-center text-slate-700 px-2">
            {t("landing_tagline")}
          </p>

          <img
            src="https://mohini-static.shikshalokam.org/fe-images/PNG/Shikshalokam/innovationpana-1@2x.png"
            width="170"
            height="100"
            className="center-img custom-login-image sm:hidden"
            alt=""
          />

          <div className="bg-slate-50 sm:pt-6 sm:h-[100%] flex flex-col justify-center mt-0 w-full">
            <div className="p-2 text-center sm:mt-[60px]">
              <div className="flex flex-col mx-auto w-64">
                <button
                  type="button"
                  className="w-full p-3 mt-6 mb-2 px-5 py-3 text-white rounded-md"
                  style={{ backgroundColor: "#572E91" }}
                  onClick={() => navigate(ROUTES.SHIKSHALOKAM_VOICE_CHAT_LOGIN)}
                >
                  {t("landing_login_btn")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <LoadingSpinner isVisible={isLoading} />
      </div>
    )
  }

  console.log("[CommonHomePage] DEFAULT BRANCH")

  
  // Updated render conditions
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

      {console.log("RENDER CONDITION", {
        isSaathiOnboarding,
        showProfilePopup
      })}

      {isSaathiOnboarding && showProfilePopup && (
        <ProfileChatPopup isOpen={showProfilePopup} onClose={handleProfilePopupClose} />
      )}

      <div className="container max-w-full md mt-0 mx-auto grid md:grid-cols-2 px-0">
        {/* Desktop Header */}
        <Header languageButtonSelect={languageButtonSelect} isDesktop={true} />

        {/* Main Content */}
        <div className="w-full px-0">
          {/* Mobile Header */}
          <Header languageButtonSelect={languageButtonSelect} isDesktop={false} />

          <div className="bg-slate-50 sm:pt-6 sm:h-[100%] flex flex-col justify-center mt-0 w-full">
            <div className="flex justify-end mr-6 relative block sm:hidden"></div>

            {!hasSelectedLanguage && <LanguageSelectionGrid usecaseType={usecaseType} />}
            {!ptm_case && !ylc_case && hasSelectedLanguage && !urlFlow && saathiOnboardingDone && (
              <FlowSelection
                audioRef={audioRef}
                stopAudioTriggered={stopAudioTriggered}
                setStopAudioTriggered={setStopAudioTriggered}
                onFlowContinue={onFlowContinue}
                setIsLoading={setIsLoading}
              />
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        <LoadingSpinner isVisible={isLoading || (isSaathiOnboarding && isProfileLoading)} />
      </div>
    </>
  )
}

export default CommonHomePage
