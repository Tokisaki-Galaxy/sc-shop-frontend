"use client"

import Link from "next/link"
import { HelpCircle, Phone, User } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const TopBar = () => {
  return (
    <div className="bg-slate-100 border-b border-slate-200">
      <div className="content-container flex h-11 items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-5">
          <LocalizedClientLink
            href="/account/orders?entry=reorder"
            className="hidden sm:inline-flex items-center gap-1.5 transition-colors hover:text-slate-900"
          >
            快速复购
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/account/orders"
            className="hidden sm:inline-flex items-center gap-1.5 transition-colors hover:text-slate-900"
          >
            追踪订单
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/help"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-900"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            帮助中心
          </LocalizedClientLink>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="tel:+8618888888888"
            className="hidden md:inline-flex items-center gap-1.5 transition-colors hover:text-slate-900"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>+86 188 8888 8888</span>
          </Link>
          <LocalizedClientLink
            href="/account?view=register"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-900"
          >
            <User className="h-3.5 w-3.5" />
            创建账户
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/account?view=sign-in"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-900"
          >
            登录
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default TopBar
