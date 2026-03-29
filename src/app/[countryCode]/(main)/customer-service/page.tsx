import { redirect } from "next/navigation"

type Props = {
  params: Promise<{
    countryCode: string
  }>
}

export default async function CustomerServicePage({ params }: Props) {
  const { countryCode } = await params
  redirect(`/${countryCode}/help`)
}
