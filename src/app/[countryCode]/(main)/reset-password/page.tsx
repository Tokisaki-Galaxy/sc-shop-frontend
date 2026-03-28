import { Metadata } from "next"
import ResetPasswordTemplate from "@modules/account/templates/reset-password-template"

type Props = {
  searchParams: Promise<{
    token?: string
    email?: string
  }>
}

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Enter your new password.",
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token, email } = await searchParams

  return <ResetPasswordTemplate token={token} email={email} />
}
