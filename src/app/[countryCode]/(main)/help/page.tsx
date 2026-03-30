import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "帮助中心",
  description: "获取订单、账户、售后与配送相关帮助。",
}

export default function HelpPage() {
  return (
    <main className="bg-slate-50 min-h-[calc(100vh-8rem)] py-10">
      <div className="content-container">
        <div className="rounded-lg border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">帮助中心</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            如需订单查询、账户支持或售后协助，请优先前往订单页面查看详情，或通过客服电话联系我们。
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <LocalizedClientLink
              href="/account/orders"
              className="rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
            >
              追踪订单
            </LocalizedClientLink>
            <a
              href="tel:+8618888888888"
              className="rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
            >
              联系电话：+86 188 8888 8888
            </a>
            <a
              href="mailto:shincolor@vip.163.com"
              className="rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
            >
              联络邮箱：shincolor@vip.163.com
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
