"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, ShoppingCart, X } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const MainHeader = () => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  return (
    <>
      <header className="bg-white border-b border-slate-200">
        <div className="content-container h-20 md:h-24 flex items-center justify-between gap-4">
          <div className="flex items-center min-w-[120px]">
            <LocalizedClientLink href="/" className="inline-flex items-center">
              <Image
                src="/brand-logo.svg"
                alt="SC Shop"
                width={180}
                height={40}
                priority
                className="h-8 w-auto md:h-10"
              />
            </LocalizedClientLink>
          </div>

          <div className="hidden md:flex flex-1 max-w-4xl">
            <form className="w-full">
              <div className="flex h-12 items-center rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-4 text-slate-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="搜索商品型号或 ID..."
                  className="flex-1 h-full text-sm text-slate-700 placeholder:text-slate-400 bg-transparent outline-none"
                  aria-label="搜索商品型号或 ID"
                />
                <button
                  type="submit"
                  className="h-full px-4 bg-emerald-600 text-white transition-colors hover:bg-emerald-700"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center gap-3 md:min-w-[120px] md:justify-end">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-200 text-slate-600 transition-colors hover:text-slate-900 hover:border-slate-300"
              aria-label="打开搜索"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>
            <LocalizedClientLink
              href="/cart"
              className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-slate-700 transition-colors hover:text-slate-900"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm font-medium whitespace-nowrap">0 Items</span>
            </LocalizedClientLink>
          </div>
        </div>
      </header>

      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[70] bg-white p-4 md:hidden">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-base font-semibold text-slate-900">搜索商品</span>
            <button
              type="button"
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-200 text-slate-600"
              aria-label="关闭搜索"
              onClick={() => setMobileSearchOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form className="w-full">
            <div className="flex h-12 items-center rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-4 text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="搜索商品型号或 ID..."
                className="flex-1 h-full text-sm text-slate-700 placeholder:text-slate-400 bg-transparent outline-none"
                aria-label="搜索商品型号或 ID"
                autoFocus
              />
              <button
                type="submit"
                className="h-full px-4 bg-emerald-600 text-white transition-colors hover:bg-emerald-700"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default MainHeader
