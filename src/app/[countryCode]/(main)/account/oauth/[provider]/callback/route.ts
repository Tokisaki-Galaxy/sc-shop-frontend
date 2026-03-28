import { handleOAuthCallback } from "@lib/data/customer"
import { OAuthProvider } from "@lib/types/auth"
import { NextRequest, NextResponse } from "next/server"

type Params = {
  countryCode: string
  provider: OAuthProvider
}

const isSupportedProvider = (provider: string): provider is OAuthProvider => {
  return provider === "google" || provider === "github"
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  const { countryCode, provider } = await context.params

  if (!isSupportedProvider(provider)) {
    return NextResponse.redirect(new URL(`/${countryCode}/account`, request.url))
  }

  const callbackParams = Object.fromEntries(request.nextUrl.searchParams.entries())
  const error = await handleOAuthCallback(provider, callbackParams)

  if (error) {
    const redirectUrl = new URL(`/${countryCode}/account`, request.url)
    redirectUrl.searchParams.set("error", `SSO login failed: ${error}`)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.redirect(new URL(`/${countryCode}/account`, request.url))
}
