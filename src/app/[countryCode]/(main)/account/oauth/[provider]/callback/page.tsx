import { handleOAuthCallback } from "@lib/data/customer"
import { OAuthProvider } from "@lib/types/auth"
import { Metadata } from "next"
import { redirect } from "next/navigation"

type Props = {
  params: Promise<{
    countryCode: string
    provider: OAuthProvider
  }>
  searchParams: Promise<{
    code?: string
    state?: string
    error?: string
    error_description?: string
  }>
}

export const metadata: Metadata = {
  title: "Completing sign in",
  description: "Finalizing social login.",
}

export default async function OAuthCallbackPage({ params, searchParams }: Props) {
  const { countryCode, provider } = await params
  const callbackParams = await searchParams

  if (provider !== "google" && provider !== "github") {
    redirect(`/${countryCode}/account`)
  }

  const error = await handleOAuthCallback(provider, callbackParams)

  if (error) {
    redirect(
      `/${countryCode}/account?error=${encodeURIComponent(
        `SSO login failed: ${error}`
      )}`
    )
  }

  redirect(`/${countryCode}/account`)
}
