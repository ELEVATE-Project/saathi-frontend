import { sessionFlowName } from "../constants/session"

export const FLOW_CONFIG = {
  [sessionFlowName.ListeningActivity]: {
    flowName: sessionFlowName.ListeningActivity,
    storyActions: {
      downloadReportText: "reDownloadReportText",
    },
  },
  [sessionFlowName.LoginDiscussion]: {
    flowName: sessionFlowName.LoginDiscussion,
    storyActions: {
      downloadReportText: "reDownloadReportText",
    },
  },
}

export const getFlowConfig = flowType => {
  const config = FLOW_CONFIG[flowType]
  if (!config) {
    throw new Error(`Flow configuration not found for: ${flowType}`)
  }
  return config
}
