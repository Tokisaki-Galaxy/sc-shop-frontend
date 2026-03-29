import MainHeader from "@modules/layout/components/main-header/MainHeader"
import TopBar from "@modules/layout/components/top-bar/TopBar"
import { retrieveCart } from "@lib/data/cart"

export default async function Nav() {
  const cart = await retrieveCart().catch(() => null)
  const totalItems =
    cart?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <TopBar />
      <MainHeader totalItems={totalItems} />
    </div>
  )
}
