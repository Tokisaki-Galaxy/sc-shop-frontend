"use client"

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: TurnstileRenderOptions
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
      getResponse: (widgetId: string) => string | undefined
    }
    onTurnstileLoad?: () => void
  }
}

interface TurnstileRenderOptions {
  sitekey: string
  callback?: (token: string) => void
  "error-callback"?: () => void
  "expired-callback"?: () => void
  theme?: "light" | "dark" | "auto"
  size?: "normal" | "compact" | "flexible"
  appearance?: "always" | "execute" | "interaction-only"
}

interface TurnstileProps {
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  theme?: "light" | "dark" | "auto"
  size?: "normal" | "compact" | "flexible"
  className?: string
}

export interface TurnstileRef {
  reset: () => void
}

const TURNSTILE_SCRIPT_ID = "turnstile-script"
const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad"

let scriptLoadPromise: Promise<void> | null = null

function loadTurnstileScript(): Promise<void> {
  if (scriptLoadPromise) {
    return scriptLoadPromise
  }

  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is undefined"))
  }

  if (window.turnstile) {
    return Promise.resolve()
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID)
    if (existingScript) {
      window.onTurnstileLoad = () => resolve()
      return
    }

    window.onTurnstileLoad = () => resolve()

    const script = document.createElement("script")
    script.id = TURNSTILE_SCRIPT_ID
    script.src = TURNSTILE_SCRIPT_URL
    script.async = true
    script.defer = true
    script.onerror = () => {
      scriptLoadPromise = null
      reject(new Error("Failed to load Turnstile script"))
    }

    document.head.appendChild(script)
  })

  return scriptLoadPromise
}

const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(function Turnstile(
  {
    onVerify,
    onError,
    onExpire,
    theme = "auto",
    size = "normal",
    className = "",
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  const handleVerify = useCallback(
    (token: string) => {
      onVerify(token)
    },
    [onVerify]
  )

  const handleError = useCallback(() => {
    onError?.()
  }, [onError])

  const handleExpire = useCallback(() => {
    onExpire?.()
    // Reset widget on expiration to allow re-verification
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
    }
  }, [onExpire])

  // Expose reset method to parent components
  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
      }
    },
  }))

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

    if (!siteKey) {
      console.warn("Turnstile site key not configured")
      return
    }

    let mounted = true

    loadTurnstileScript()
      .then(() => {
        if (!mounted || !containerRef.current || !window.turnstile) {
          return
        }

        // Clear any existing widget
        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current)
          } catch {
            // Widget may already be removed
          }
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: handleVerify,
          "error-callback": handleError,
          "expired-callback": handleExpire,
          theme,
          size,
        })
      })
      .catch((err) => {
        console.error("Failed to initialize Turnstile:", err)
        handleError()
      })

    return () => {
      mounted = false
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // Widget may already be removed
        }
        widgetIdRef.current = null
      }
    }
  }, [handleVerify, handleError, handleExpire, theme, size])

  return <div ref={containerRef} className={className} />
})

export default Turnstile
