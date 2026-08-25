import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useRoutes, Navigate } from "react-router-dom"
import CommonHomePage from "./pages/Login/commonPage"
import NotFound from "./pages/shikshagraha-repository/not-found"
import React from "react"
import ROUTES from "./url"
import SsoFlow from "./pages/ssoFlow"
import ChatContainer from "./pages/ShikshalokamVoiceChat/chat-container"

const queryClient = new QueryClient()

function App() {
  const elements = useRoutes(routes)

  return (
    <QueryClientProvider client={queryClient}>
      {elements}
    </QueryClientProvider>
  )
}

export default App

const routes = [
  { path: ROUTES.SHIKSHALOKAM_HOME_PAGE, element: <CommonHomePage /> },
  { path: ROUTES.COMMON_CHAT, element: <ChatContainer /> },
  { path: ROUTES.SSO_FLOW, element: <SsoFlow /> },
  { path: ROUTES.NOT_FOUND, element: <NotFound /> },
  { path: "*", element: <Navigate to={ROUTES.NOT_FOUND} replace /> },
]
