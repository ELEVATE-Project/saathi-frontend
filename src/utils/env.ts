/**
 * Environment configuration utility
 * Supports both build-time (process.env) and runtime (window._env_) variables
 *
 * Priority: window._env_ > process.env
 */

const getEnv = (key: string, defaultValue: string = "") => {
  // Check runtime environment variables first (window._env_)
  if ((window as any)._env_ && (window as any)._env_[key] !== undefined) {
    return (window as any)._env_[key]
  }

  // Fallback to build-time environment variables
  if (process.env[key] !== undefined) {
    return process.env[key]
  }

  // Return default value if not found
  return defaultValue
}

// Export all environment variables with their getters
export const env = {
  // API Configuration
  LOCAL_PROXY: () => getEnv("REACT_APP_LOCAL_PROXY", "http://localhost:8000"),
  WEBSOCKET_HOST: () => getEnv("REACT_APP_WEBSOCKET_HOST", "localhost:8000"),

  // Retry Configuration
  WEBSOCKET_RETRY_NUM: () => parseInt(getEnv("REACT_APP_WEBSOCKET_RETRY_NUM", "2"), 10),
  S3_UPLOAD_RETRY_NUM: () => parseInt(getEnv("REACT_APP_S3_UPLOAD_RETRY_NUM", "3"), 10),

  // Profile IDs
  MEGA_PTM_PROFILE_ID: () => getEnv("REACT_APP_MEGA_PTM_PROFILE_ID", "3"),
  YLC_PROFILE_ID: () => getEnv("REACT_APP_YLC_PROFILE_ID", "127"),

  // Paths
  AUDIO_PATH: () => getEnv("REACT_APP_ADUIO_PATH", "/"),
  ROOT_PATH: () => getEnv("REACT_APP_ROOT_PATH", ""),

  // URLs
  RECORD_STORY_URL: () => getEnv("REACT_APP_RECORD_STORY_URL", ""),

  WS_PROTOCOL: () => getEnv("REACT_APP_WS_PROTOCOL", "wss"),

  AUTH_METHOD: () => getEnv("REACT_APP_AUTH_METHOD", "url"),

  AUTH_ROUTE: () => getEnv("REACT_APP_AUTH_ROUTE", "/api/shikshalokam/read-elevate-profile/"),

  ONBOARDING_REDIRECT_DELAY: () => parseInt(getEnv("REACT_APP_ONBOARDING_REDIRECT_DELAY", "3000"), 10),

  CHAT_SESSION_TYPE: () => getEnv("REACT_APP_CHAT_SESSION_TYPE", "saathi"),

  // Login redirect configuration
  SAATHI_FE_URL: () => getEnv("REACT_APP_SAATHI_FE_URL", ""),
  LOGIN_REDIRECT_URL: () => getEnv("REACT_APP_LOGIN_REDIRECT_URL", ""),
  REDIRECT_URL_PATH: () => getEnv("REACT_APP_REDIRECT_URL_PATH", ""),
  FLOW_NAME: () => getEnv("REACT_APP_FLOW_NAME", ""),

  // WebSocket error source identifier
  WS_ERROR_SOURCE: () => getEnv("REACT_APP_WS_ERROR_SOURCE", "system"),

  // Generic getter for any environment variable
  get: (key: string, defaultValue: string = "") => getEnv(key, defaultValue),
}

export default env