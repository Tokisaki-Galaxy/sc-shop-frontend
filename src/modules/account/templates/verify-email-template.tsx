"use client"

import { verifyEmailToken } from "@lib/data/customer"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Props = {
  token?: string
  email?: string
}

type VerifyEmailState = {
  loading: boolean
  success: boolean
  message: string
}

const VerifyEmailTemplate = ({ token, email }: Props) => {
  const { countryCode } = useParams() as { countryCode: string }
  const [state, setState] = useState<VerifyEmailState>({
    loading: true,
    success: false,
    message: "正在验证邮箱，请稍候...",
  })

  useEffect(() => {
    let active = true

    const run = async () => {
      const result = await verifyEmailToken(token, email)

      if (!active) {
        return
      }

      setState({
        loading: false,
        success: result.success,
        message: result.message,
      })
    }

    run()

    return () => {
      active = false
    }
  }, [token, email])

  return (
    <div className="w-full flex justify-center px-8 py-8">
      <div className="max-w-sm w-full flex flex-col items-center">
        <h1 className="text-large-semi uppercase mb-6">
          {state.loading
            ? "验证邮箱中"
            : state.success
              ? "邮箱验证成功"
              : "邮箱验证失败"}
        </h1>
        <p
          className={`text-center text-base-regular mb-8 ${
            state.success ? "text-emerald-600" : "text-ui-fg-base"
          }`}
          data-testid="verify-email-message"
        >
          {state.message}
        </p>
        {!state.loading && (
          <Link
            href={`/${countryCode}/account`}
            className="underline text-ui-fg-base text-small-regular"
            data-testid="verify-email-back-to-login"
          >
            去登录页
          </Link>
        )}
      </div>
    </div>
  )
}

export default VerifyEmailTemplate
