import Profile from "@/components/w/Profile"
import Tip from "@/components/w/Tip"

async function TipPage({ params }: { params: Promise<{ address: string }> }) {
  const address = (await params).address
  return (
    <div className="flex flex-col md:flex-row gap-4 min-h-screen justify-center items-center overflow-hidden">
      <Profile address={address} />
      <Tip address={address} />
    </div>
  )
}

export default TipPage
