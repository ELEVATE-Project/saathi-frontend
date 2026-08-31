#!/bin/bash

# Generate env-config.js from environment variables at runtime
# This script should be run when deploying or starting the application

# Output file
OUTPUT_FILE="${1:-./public/env-config.js}"

echo "Generating runtime environment configuration..."

cat > "$OUTPUT_FILE" << EOF
// Runtime environment configuration
// Generated at: $(date)
// This file is auto-generated. Do not edit manually.
window._env_ = {
  REACT_APP_LOCAL_PROXY: "${REACT_APP_LOCAL_PROXY:-http://localhost:8000}",
  REACT_APP_WEBSOCKET_HOST: "${REACT_APP_WEBSOCKET_HOST:-localhost:8000}",
  REACT_APP_WEBSOCKET_RETRY_NUM: "${REACT_APP_WEBSOCKET_RETRY_NUM:-2}",
  REACT_APP_WEBSOCKET_RECONNECT_INTERVAL: "${REACT_APP_WEBSOCKET_RECONNECT_INTERVAL:-3000}",
  REACT_APP_S3_UPLOAD_RETRY_NUM: "${REACT_APP_S3_UPLOAD_RETRY_NUM:-3}",
  REACT_APP_DEFAULT_LANGUAGE: "${REACT_APP_DEFAULT_LANGUAGE:-en}",
  REACT_APP_ROOT_PATH: "${REACT_APP_ROOT_PATH:-}",
  REACT_APP_WS_PROTOCOL: "${REACT_APP_WS_PROTOCOL:-wss}",
  REACT_APP_AUTH_METHOD: "${REACT_APP_AUTH_METHOD:-url}",
  REACT_APP_AUTH_ROUTE: "${REACT_APP_AUTH_ROUTE:-/api/shikshalokam/read-elevate-profile/}",
  REACT_APP_ONBOARDING_REDIRECT_DELAY: "${REACT_APP_ONBOARDING_REDIRECT_DELAY:-3000}",
  REACT_APP_SAATHI_FE_URL: "${REACT_APP_SAATHI_FE_URL:-}",
  REACT_APP_LOGIN_REDIRECT_URL: "${REACT_APP_LOGIN_REDIRECT_URL:-}",
  REACT_APP_REDIRECT_URL_PATH: "${REACT_APP_REDIRECT_URL_PATH:-}",
  REACT_APP_FLOW_NAME: "${REACT_APP_FLOW_NAME:-saathi}",
  REACT_APP_WS_ERROR_SOURCE: "${REACT_APP_WS_ERROR_SOURCE:-system}",
  REACT_APP_WS_IDLE_TIMEOUT_SOURCE: "${REACT_APP_WS_IDLE_TIMEOUT_SOURCE:-system}",
  REACT_APP_WS_IDLE_TIMEOUT_EVENT: "${REACT_APP_WS_IDLE_TIMEOUT_EVENT:-idle_timeout}"
};
EOF

echo "✓ Environment configuration generated at: $OUTPUT_FILE"
