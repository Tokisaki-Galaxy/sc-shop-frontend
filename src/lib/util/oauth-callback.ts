type OAuthProvider = "google" | "github"

const OAUTH_CALLBACK_ALLOWED_KEYS = new Set([
  "code",
  "state",
  "error",
  "error_description",
  "error_uri",
])

export const sanitizeOAuthCallbackParams = (
  provider: OAuthProvider,
  callbackParams: Record<string, string>
): Record<string, string> => {
  if (provider !== "github") {
    return callbackParams
  }

  const sanitized = Object.fromEntries(
    Object.entries(callbackParams).filter(([key, value]) => {
      return OAUTH_CALLBACK_ALLOWED_KEYS.has(key) && value.trim().length > 0
    })
  )

  return sanitized
}

export const mapOAuthCallbackErrorMessage = (
  provider: OAuthProvider,
  message: string
) => {
  if (provider !== "github") {
    return message
  }

  if (/invalid time value/i.test(message)) {
    return "GitHub SSO login failed. Please try again or contact support if the issue persists."
  }

  return message
}
