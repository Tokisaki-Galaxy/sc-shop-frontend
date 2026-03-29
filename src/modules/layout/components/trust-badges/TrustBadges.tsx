import { CheckCircle, ShieldCheck, Truck } from "lucide-react"

const badges = [
  {
    icon: CheckCircle,
    text: "30+ Years Industry Experience",
  },
  {
    icon: Truck,
    text: "Fast Global Delivery Support",
  },
  {
    icon: ShieldCheck,
    text: "Strict Quality Control System",
  },
]

const TrustBadges = () => {
  return (
    <div className="bg-[#F1F9EC] border-b border-[#DDEFD0]">
      <div className="content-container py-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon

            return (
              <div
                key={badge.text}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <Icon className="h-4 w-4 text-[#6EA643]" />
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
