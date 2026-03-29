"use client"

import { confirmPasswordReset } from "@lib/data/customer"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useActionState } from "react"

type Props = {
  token?: string
  email?: string
}

const ResetPasswordTemplate = ({ token, email }: Props) => {
  const { countryCode } = useParams() as { countryCode: string }
  const [state, formAction] = useActionState(confirmPasswordReset, null)

  if (!token) {
    return (
      <div className="w-full flex justify-center px-8 py-8">
        <div className="max-w-sm w-full flex flex-col items-center">
          <h1 className="text-large-semi uppercase mb-6">Invalid Link</h1>
          <p className="text-center text-base-regular text-ui-fg-base mb-8">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href={`/${countryCode}/account`}
            className="underline text-ui-fg-base text-small-regular"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  if (state?.success) {
    return (
      <div className="w-full flex justify-center px-8 py-8">
        <div className="max-w-sm w-full flex flex-col items-center">
          <h1 className="text-large-semi uppercase mb-6">Password Updated</h1>
          <p className="text-center text-base-regular text-ui-fg-base mb-8">
            {state.message}
          </p>
          <Link
            href={`/${countryCode}/account`}
            className="underline text-ui-fg-base text-small-regular"
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center px-8 py-8">
      <div
        className="max-w-sm w-full flex flex-col items-center"
        data-testid="reset-password-page"
      >
        <h1 className="text-large-semi uppercase mb-6">Reset Password</h1>
        {email && (
          <p className="text-center text-base-regular text-ui-fg-base mb-8">
            Setting a new password for <strong>{email}</strong>
          </p>
        )}
        <form className="w-full" action={formAction}>
          <input type="hidden" name="token" value={token} />
          <div className="flex flex-col w-full gap-y-2">
            <Input
              label="New Password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              data-testid="new-password-input"
            />
            <Input
              label="Confirm New Password"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              required
              data-testid="confirm-password-input"
            />
          </div>
          <ErrorMessage
            error={state?.success === false ? state.message : null}
            data-testid="reset-password-error"
          />
          <SubmitButton
            data-testid="reset-password-submit"
            className="w-full mt-6"
          >
            Update Password
          </SubmitButton>
        </form>
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          <Link
            href={`/${countryCode}/account`}
            className="underline"
          >
            Back to sign in
          </Link>
        </span>
      </div>
    </div>
  )
}

export default ResetPasswordTemplate
