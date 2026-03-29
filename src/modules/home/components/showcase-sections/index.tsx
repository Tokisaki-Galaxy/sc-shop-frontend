import LocalizedClientLink from "@modules/common/components/localized-client-link"

const HOMEPAGE_REFERENCE_IMAGE_URL =
  process.env.NEXT_PUBLIC_HOMEPAGE_REFERENCE_IMAGE_URL

const categories = [
  {
    key: "toner-cartridge",
    title: "Toner Cartridge",
    desc: "Laser printing consumables for office and retail scenarios.",
  },
  {
    key: "toner-copier-kit",
    title: "Toner Copier Kit",
    desc: "OEM-similar performance with stable page yield.",
  },
  {
    key: "inkjet-cartridges",
    title: "Inkjet Cartridges",
    desc: "High color fidelity for home and business use.",
  },
  {
    key: "refill-bottle-ink",
    title: "Refill Bottle Ink",
    desc: "Premium refill solutions for continuous systems.",
  },
  {
    key: "dye-sublimation-ink",
    title: "Dye & Sublimation Ink",
    desc: "Vivid color reproduction for transfer applications.",
  },
  {
    key: "accessories-parts",
    title: "Accessories & Parts",
    desc: "Complete components for printer maintenance workflow.",
  },
]

const SliceBanner = ({
  heightClass,
  position,
  label,
}: {
  heightClass: string
  position: string
  label: string
}) => {
  return (
    <div
      className={`w-full rounded-xl overflow-hidden border border-[#DDEFD0] shadow-sm ${heightClass}`}
      style={{
        ...(HOMEPAGE_REFERENCE_IMAGE_URL
          ? {
              backgroundImage: `url(${HOMEPAGE_REFERENCE_IMAGE_URL})`,
              backgroundSize: "cover",
              backgroundPosition: position,
            }
          : {}),
      }}
      role="img"
      aria-label={label}
    />
  )
}

const SectionTitle = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => {
  return (
    <div className="mb-8 text-center">
      <p className="text-xs tracking-[0.22em] uppercase text-[#7EA965] mb-2">
        {subtitle}
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#23323A]">
        {title}
      </h2>
    </div>
  )
}

const InkSplash = ({
  className,
  color,
}: {
  className: string
  color: string
}) => {
  return (
    <div
      className={`pointer-events-none absolute rounded-full blur-2xl opacity-40 ${className}`}
      style={{
        background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
      }}
    />
  )
}

const ShowcaseSections = () => {
  return (
    <div className="relative overflow-hidden">
      <InkSplash className="-left-20 top-10 h-52 w-52" color="#7DBB4C" />
      <InkSplash className="right-0 top-[32rem] h-72 w-72" color="#6BB8FF" />
      <InkSplash className="-left-12 bottom-[28rem] h-56 w-56" color="#D66CFF" />

      <section className="content-container py-14 md:py-16 relative z-10">
        <SectionTitle title="Best Category" subtitle="Featured Matrix" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((item, idx) => (
            <LocalizedClientLink
              key={item.key}
              href={`/store?category=${encodeURIComponent(item.key)}`}
              className="block rounded-xl border border-[#DDEFD0] bg-white/95 p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7DBB4C] focus-visible:ring-offset-2"
            >
              <div className="mb-3 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#EAF6DF] px-3 text-xs font-semibold text-[#5D8E3D]">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <h3 className="text-base font-semibold text-[#23323A] mb-2 leading-6">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-6">{item.desc}</p>
            </LocalizedClientLink>
          ))}
        </div>
      </section>

      <section className="content-container py-14 md:py-16 relative z-10">
        <SectionTitle title="Events & Exhibitions" subtitle="Global Presence" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SliceBanner
            heightClass="h-40 md:h-48"
            position="center 76%"
            label="Exhibition hall overview"
          />
          <SliceBanner
            heightClass="h-40 md:h-48"
            position="center 80%"
            label="Trade show booth activity"
          />
          <SliceBanner
            heightClass="h-40 md:h-48"
            position="center 84%"
            label="Product showcase at event"
          />
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <SliceBanner
            heightClass="h-28 md:h-32"
            position="center 72%"
            label="Event scene detail one"
          />
          <SliceBanner
            heightClass="h-28 md:h-32"
            position="center 78%"
            label="Event scene detail two"
          />
          <SliceBanner
            heightClass="h-28 md:h-32"
            position="center 86%"
            label="Event scene detail three"
          />
          <SliceBanner
            heightClass="h-28 md:h-32"
            position="center 90%"
            label="Event scene detail four"
          />
        </div>
      </section>

      <section className="content-container py-14 md:py-16 relative z-10">
        <SectionTitle title="Certificates & Honors" subtitle="Credibility" />
        <div className="rounded-2xl border border-[#DDEFD0] bg-[#F2FAEC] p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SliceBanner
              heightClass="h-48"
              position="center 70%"
              label="Certificate display panel one"
            />
            <SliceBanner
              heightClass="h-48"
              position="center 71%"
              label="Certificate display panel two"
            />
            <SliceBanner
              heightClass="h-48"
              position="center 73%"
              label="Certificate display panel three"
            />
          </div>
          <div className="mt-6">
            <SliceBanner
              heightClass="h-44 md:h-52"
              position="center 66%"
              label="Quality control process overview"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default ShowcaseSections
