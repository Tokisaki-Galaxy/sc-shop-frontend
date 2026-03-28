import { Metadata } from "next"
import VerifyEmailTemplate from "@modules/account/templates/verify-email-template"

type Props = {
  searchParams: Promise<{
    token?: string
    email?: string
  }>
}

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Confirm your account email address.",
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token, email } = await searchParams

  return <VerifyEmailTemplate token={token} email={email} />
}
