import Script from "next/script"

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_ID

const CLARITY_SNIPPET = CLARITY_PROJECT_ID
  ? `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", ${JSON.stringify(CLARITY_PROJECT_ID)});`
  : null

export default function MicrosoftClarity() {
  if (process.env.NODE_ENV !== "production" || !CLARITY_SNIPPET) {
    return null
  }

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {CLARITY_SNIPPET}
    </Script>
  )
}
