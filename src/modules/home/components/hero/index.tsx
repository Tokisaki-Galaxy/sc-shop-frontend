import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[65vh] w-full border-b border-ui-border-base relative bg-[#EFF7E8]">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-[#23323A] font-semibold"
          >
            ShinColor Premium Printing Supplies
          </Heading>
          <Heading
            level="h2"
            className="text-2xl leading-10 text-[#5D7A49] font-normal"
          >
            OEM Similar Performance, Reliable Quality
          </Heading>
        </span>
        <a
          href="https://shincolor.en.alibaba.com/zh_CN/index.html"
          target="_blank"
          rel="noreferrer"
        >
          <Button
            variant="secondary"
            className="bg-[#7DBB4C] text-white hover:bg-[#6EA643] border-0"
          >
            Visit ShinColor
          </Button>
        </a>
      </div>
    </div>
  )
}

export default Hero
