import Profile from "@/components/w/Profile"
import Tip from "@/components/w/TipForm"
import Wpage from "@/components/w/Wpage"

async function TipPage({ params }: { params: Promise<{ address: string }> }) {
  const address = (await params).address
  return (
    <Wpage address={address} />
  )
}

export default TipPage
