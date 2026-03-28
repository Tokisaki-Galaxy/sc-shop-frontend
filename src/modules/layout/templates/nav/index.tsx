import MainHeader from "@modules/layout/components/main-header/MainHeader"
import TopBar from "@modules/layout/components/top-bar/TopBar"
import TrustBadges from "@modules/layout/components/trust-badges/TrustBadges"

export default async function Nav() {
  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <TopBar />
      <MainHeader />
      <TrustBadges />
    </div>
  )
}
