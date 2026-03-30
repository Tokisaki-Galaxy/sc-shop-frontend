"use client"

import { useActionState, useState, useCallback, useRef, useEffect } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Turnstile, { TurnstileRef } from "@modules/common/components/turnstile"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [state, formAction] = useActionState(signup, null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileError, setTurnstileError] = useState(false)
  const turnstileRef = useRef<TurnstileRef>(null)
  let errorMessage: string | null = null
  let successMessage: string | null = null
  const registerSuccessMessage = "注册成功，请去邮箱点击确认链接后再登录。"

  if (state && typeof state === "object" && "success" in state) {
    if (state.success) {
      successMessage = state.message || registerSuccessMessage
    } else {
      errorMessage = state.message || "注册失败，请稍后重试。"
    }
  } else if (typeof state === "string") {
    errorMessage = state
  }

  // Reset Turnstile when form submission completes with error
  useEffect(() => {
    if (state !== null && !(state && typeof state === "object" && "success" in state && state.success)) {
      setTurnstileToken(null)
      turnstileRef.current?.reset()
    }
  }, [state])

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
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        Become a ShinColor Member
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        Create your ShinColor member profile, and get access to an enhanced
        shopping experience.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="First name"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Last name"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
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
        <ErrorMessage error={errorMessage} data-testid="register-error" />
        {successMessage && (
          <p
            className="pt-2 text-emerald-600 text-small-regular"
            data-testid="register-success"
            role="status"
            aria-live="polite"
          >
            {successMessage}
          </p>
        )}
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          By creating an account, you agree to ShinColor&apos;s{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline"
          >
            Terms of Use
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton
          className="w-full mt-6"
          data-testid="register-button"
          disabled={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? !turnstileToken : false}
        >
          Join
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Already a member?{" "}
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          Sign in
        </button>
        .
      </span>
    </div>
  )
}

export default Register
