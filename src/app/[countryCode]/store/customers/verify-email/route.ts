import { NextRequest, NextResponse } from "next/server"

type Params = {
  countryCode: string
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  const { countryCode } = await context.params
  const redirectUrl = new URL(`/${countryCode}/verify-email`, request.url)

  request.nextUrl.searchParams.forEach((value, key) => {
    redirectUrl.searchParams.set(key, value)
  })

  return NextResponse.redirect(redirectUrl)
}
