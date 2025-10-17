import Profile from "@/components/w/Profile"
import Tip from "@/components/w/TipForm"

async function TipPage({ params }: { params: Promise<{ address: string }> }) {
  const address = (await params).address
  return (
    <div className="grid grid-cols-3 gap-4 justify-center items-start translate-y-15 overflow-hidden min-h-[92vh] ">
      <div className="border-r border-zinc-700 col-span-1 h-full">
        <Profile address={address} />
        <Tip address={address} />
      </div>
      <div className="bg-red-300 col-span-2">
      </div>
    </div>
  )
}

export default TipPage
