import { Text } from "@medusajs/ui"

const MedusaCTA = () => {
  return (
    <Text className="flex gap-x-2 txt-compact-small-plus items-center text-ui-fg-muted">
      Official website:
      <a
        href="https://shincolor.en.alibaba.com/zh_CN/index.html"
        target="_blank"
        rel="noreferrer"
        className="hover:text-ui-fg-base"
      >
        shincolor.en.alibaba.com
      </a>
    </Text>
  )
}

export default MedusaCTA
