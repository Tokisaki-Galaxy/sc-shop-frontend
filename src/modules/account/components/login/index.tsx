import {
  login,
  loginWithGoogle,
  requestPasswordReset,
} from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import Turnstile, { TurnstileRef } from "@modules/common/components/turnstile"
import { useActionState, useState, useCallback, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const searchParams = useSearchParams()
  const oauthError = searchParams.get("error")
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileError, setTurnstileError] = useState(false)
  const turnstileRef = useRef<TurnstileRef>(null)

  const [message, formAction] = useActionState(login, null)
  const [googleMessage, googleLoginAction] = useActionState(loginWithGoogle, null)
  const [resetState, resetFormAction] = useActionState(requestPasswordReset, null)
  const ssoErrors = [oauthError, googleMessage]
    .filter(Boolean)
    .join(" | ")

  // Reset Turnstile when form submission completes (success or failure)
  useEffect(() => {
    if (message !== null) {
      setTurnstileToken(null)
      turnstileRef.current?.reset()
    }
  }, [message])

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
    setTurnstileError(false)
  }, [])

  const handleTurnstileError = useCallback(() => {
    setTurnstileError(true)
    setTurnstileToken(null)
  }, [])

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null)
  }, [])

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-large-semi uppercase mb-6">Welcome back</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        Sign in to access an enhanced shopping experience.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
          <input type="hidden" name="turnstile_token" value={turnstileToken || ""} />
        </div>
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
          <div className="mt-4">
            <Turnstile
              ref={turnstileRef}
              onVerify={handleTurnstileVerify}
              onError={handleTurnstileError}
              onExpire={handleTurnstileExpire}
              size="flexible"
            />
          </div>
        )}
        {turnstileError && (
          <ErrorMessage
            error="验证码加载失败，请刷新页面重试"
            data-testid="turnstile-error-message"
          />
        )}
        <ErrorMessage
          error={
            typeof message === "string" ? message : null
          }
          data-testid="login-error-message"
        />
        <SubmitButton
          data-testid="sign-in-button"
          className="w-full mt-6"
          disabled={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? !turnstileToken : false}
        >
          Sign in
        </SubmitButton>
      </form>
      <div className="w-full mt-4 flex flex-col gap-y-2">
        <form action={googleLoginAction}>
          <SubmitButton
            type="submit"
            data-testid="google-sso-button"
            className="w-full"
            variant="secondary"
          >
            <span className="inline-flex items-center justify-center gap-x-2">
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 24 24"
                className="h-4 w-4"
              >
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.18 3.56-8.65Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.09A12 12 0 0 0 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.3A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.3V6.61H1.26A12 12 0 0 0 0 12c0 1.94.46 3.77 1.26 5.39l4.01-3.09Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.76c1.76 0 3.34.6 4.58 1.78l3.43-3.43C17.96 1.2 15.24 0 12 0A12 12 0 0 0 1.26 6.61L5.27 9.7c.95-2.84 3.6-4.94 6.73-4.94Z"
                />
              </svg>
              Continue with Google
            </span>
          </SubmitButton>
        </form>
      </div>
      <ErrorMessage
        error={ssoErrors || null}
        data-testid="sso-login-error-message"
      />
      <form className="w-full mt-4" action={resetFormAction}>
        <h2 className="text-base-semi mb-2 text-ui-fg-base">Forgot password?</h2>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Reset password email"
            name="reset_email"
            type="email"
            autoComplete="email"
            required
            data-testid="reset-password-email-input"
          />
        </div>
        <SubmitButton
          type="submit"
          data-testid="reset-password-button"
          className="w-full mt-3"
          variant="secondary"
        >
          Reset password
        </SubmitButton>
        {resetState?.success === false ? (
          <ErrorMessage
            error={resetState.message}
            data-testid="reset-password-error-message"
          />
        ) : (
          <p
            className="text-center text-ui-fg-base text-small-regular mt-2"
            data-testid="reset-password-message"
          >
            {resetState?.message}
          </p>
        )}
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Not a member?{" "}
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-button"
        >
          Join us
        </button>
        .
      </span>
    </div>
  )
}

export default Login
