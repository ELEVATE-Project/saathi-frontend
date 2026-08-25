export const INITIAL_STATE = (set, get, store) => ({
  llmError: "",
  chatHistory: [],
  introMessage: null,
  flow: null,
  sessionId: null,
  isOldChatOpen: true,
  isNewChatOpen: false,
  showHomepage: null,
  botName: null,
  stateMachineLength: 0,
  projectId: null,
  taskId: null,
  strandStep: null,

  setLlmError: llmError => set({ llmError }),

  setChatHistory: chatHistory => set({ chatHistory }),

  getChatHistory: () => get().chatHistory,

  setIntroMessage: introMessage => set({ introMessage }),

  getIntroMessage: () => get().introMessage,

  setFlow: flow => set({ flow }),

  getFlow: () => get().flow,

  getStrandStep: () => get().strandStep,

  setSessionId: sessionId => set({ sessionId }),

  getSessionId: () => get().sessionId,

  setIsOldChatOpen: isOldChatOpen => set({ isOldChatOpen }),

  setIsNewChatOpen: isNewChatOpen => set({ isNewChatOpen }),

  setShowHomepage: showHomepage => set({ showHomepage }),

  setBotName: botName => set({ botName }),

  setStateMachineLength: stateMachineLength => set({ stateMachineLength }),

  getStateMachineLength: () => get().stateMachineLength,

  setProjectId: projectId => set({ projectId }),

  setTaskId: taskId => set({ taskId }),

  setStrandStep: strandStep => set({ strandStep }),

  reset: () => {
    set(store.getInitialState())
  },
})
