import {
  login,
  loginWithGithub,
  loginWithGoogle,
  requestPasswordReset,
} from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import { useSearchParams } from "next/navigation"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const searchParams = useSearchParams()
  const oauthError = searchParams.get("error")

  const [message, formAction] = useActionState(login, null)
  const [googleMessage, googleLoginAction] = useActionState(loginWithGoogle, null)
  const [githubMessage, githubLoginAction] = useActionState(loginWithGithub, null)
  const [resetState, resetFormAction] = useActionState(requestPasswordReset, null)
  const ssoErrors = [oauthError, googleMessage, githubMessage]
    .filter(Boolean)
    .join(" | ")

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
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6">
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
            Continue with Google
          </SubmitButton>
        </form>
        <form action={githubLoginAction}>
          <SubmitButton
            type="submit"
            data-testid="github-sso-button"
            className="w-full"
            variant="secondary"
          >
            Continue with GitHub
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
