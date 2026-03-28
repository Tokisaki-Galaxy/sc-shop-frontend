import { CheckCircle, ShieldCheck, Truck } from "lucide-react"

const badges = [
  {
    icon: CheckCircle,
    text: "超2000万订单已发货",
  },
  {
    icon: Truck,
    text: "订单满50美元包邮",
  },
  {
    icon: ShieldCheck,
    text: "终身100%满意保证",
  },
]

const TrustBadges = () => {
  return (
    <div className="bg-blue-50 border-b border-blue-100">
      <div className="content-container py-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon

            return (
              <div
                key={badge.text}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <Icon className="h-4 w-4 text-blue-600" />
                <span className="leading-6">{badge.text}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TrustBadges
