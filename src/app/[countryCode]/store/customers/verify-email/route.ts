import { NextRequest, NextResponse } from "next/server"

type Params = {
  countryCode: string
}

const getVerificationPath = () => {
  const configuredPath = process.env.STOREFRONT_EMAIL_VERIFICATION_PATH?.trim()
  const path = configuredPath && configuredPath.length > 0 ? configuredPath : "/verify-email"
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const withoutTrailingSlash = normalizedPath.replace(/\/+$/, "")

  if (!withoutTrailingSlash || withoutTrailingSlash === "/") {
    return "/verify-email"
  }

  return withoutTrailingSlash
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  const { countryCode } = await context.params
  const redirectUrl = new URL(
    `/${countryCode}${getVerificationPath()}`,
    request.url
  )

  request.nextUrl.searchParams.forEach((value, key) => {
    redirectUrl.searchParams.set(key, value)
  })

  return NextResponse.redirect(redirectUrl, 307)
}
