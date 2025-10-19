"use client"
import Profile from "./Profile"
import Tip from "./TipForm"

function Wpage({ address }: { address: string }) {
  return (
    <div className="grid grid-cols-3 translate-y-15 col-span-2 min-h-[91vh] overflow-hidden">
      <div className="lg:border-r border-zinc-700 col-span-3 lg:col-span-1  grid grid-rows-5 grid-cols-1">
        <Profile address={address} />
        <Tip address={address} mintAddress="1" />
      </div>
      <div className="col-span-3 lg:col-span-2 grid-rows-5 grid grid-cols-1">
        <div className="px-7 py-8 border-t border-zinc-700 border-b row-span-1">
          <span>SOL</span>
          <span>USD</span>
        </div>
        <div className="px-7 py-8 row-span-4 ">
          1
        </div>
      </div>
    </div>
  )
}

export default Wpage
