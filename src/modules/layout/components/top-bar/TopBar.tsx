"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { HelpCircle, Phone, User } from "lucide-react"

const TopBar = () => {
  const { countryCode } = useParams()
  const localePrefix =
    typeof countryCode === "string" && countryCode.length > 0
      ? `/${countryCode}`
      : ""

  return (
    <div className="bg-slate-100 border-b border-slate-200">
      <div className="content-container flex h-11 items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-5">
          <Link
            href={`${localePrefix}/account/orders`}
            className="hidden sm:inline-flex items-center gap-1.5 transition-colors hover:text-slate-900"
          >
            快速复购
          </Link>
          <Link
            href={`${localePrefix}/account/orders`}
            className="hidden sm:inline-flex items-center gap-1.5 transition-colors hover:text-slate-900"
          >
            追踪订单
          </Link>
          <Link
            href={`${localePrefix}/contact`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-900"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            帮助中心
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="tel:8883212552"
            className="hidden md:inline-flex items-center gap-1.5 transition-colors hover:text-slate-900"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>888-321-2552</span>
          </Link>
          <Link
            href={`${localePrefix}/account`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-900"
          >
            <User className="h-3.5 w-3.5" />
            创建账户
          </Link>
          <Link
            href={`${localePrefix}/account`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-900"
          >
            登录
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TopBar
