import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Customer Service",
  description: "Get help with your orders, shipping, and returns.",
}

export default function CustomerServicePage() {
  return (
    <div className="content-container py-12">
      <div className="max-w-2xl">
        <h1 className="text-2xl-semi mb-4">Customer Service</h1>
        <p className="txt-medium text-ui-fg-subtle mb-6">
          Need help with an order, shipping, or returns? Please contact our
          support team and we&apos;ll assist you as soon as possible.
        </p>
        <p className="txt-medium">
          Email:{" "}
          <a className="text-ui-fg-interactive" href="mailto:support@tokisaki.top">
            support@tokisaki.top
          </a>
        </p>
      </div>
    </div>
  )
}
