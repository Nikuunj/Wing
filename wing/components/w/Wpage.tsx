"use client"
import dynamic from "next/dynamic";
import Profile from "./Profile"
import Tip from "./TipForm"
import { MoveRight } from "lucide-react";
import { useState } from "react";
const ChartContainer = dynamic(() => import("./ChartContainer"), { ssr: false });
function Wpage({ address }: { address: string }) {
  const [mintAddress, setMintAddress] = useState<string>('');
  return (
    <div className="grid grid-cols-3 translate-y-15 col-span-2 min-h-[91vh] overflow-hidden">
      <div className="lg:border-r border-zinc-700 col-span-3 lg:col-span-1  grid grid-rows-5 grid-cols-1">
        <Profile address={address} />
        <Tip address={address} mintAddress={mintAddress} />
      </div>
      <div className="col-span-3 lg:col-span-2 grid-rows-5 grid grid-cols-1">
        <div className="px-7 py-8 border-t border-zinc-700 border-b row-span-1 flex items-center gap-5 text-5xl font-bold text-zinc-200">
          <span>SOL</span>
          <MoveRight className="text-zinc-500" />
          <span>USD</span>
        </div>
        <div className=" row-span-4 h-full ">
          <ChartContainer />
        </div>
      </div>
    </div>
  )
}

export default Wpage
