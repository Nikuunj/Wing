"use client"
import Image from "next/image"
import logo from '@/public/logo.svg';
import { Slash } from 'lucide-react';
import { useState } from "react";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { CONNECT_LABELS } from "@/lib/lable";
import ConnectBtn from "./ConnectBtn";
import { useWallet } from "@solana/wallet-adapter-react";
import SideBar from "./SideBar";

export const Navbar = () => {
  const [tap, setTap] = useState<boolean>(false);
  const wallet = useWallet();
  return (
    <>
      <div className="bg-black/3 backdrop-blur-sm  border-b border-zinc-700 py-2.5 px-3 sm:px-10 flex justify-between items-center fixed max-w-screen min-w-screen top-0 z-50">
        <div className={`h-10 w-10`}>
          <Image
            src={logo}
            alt="logo"
            width={200}
            height={200}
            className="contracst-20 drop-shadow-[0px_0px_4px] drop-shadow-amber-200"
          />
        </div>
        <div className={`flex  items-center relative px-12`}>
          <div className="">
            <BaseWalletMultiButton labels={CONNECT_LABELS} style={{ outline: '0', background: 'transparent', padding: 0, height: 'fit-content' }} >
              <ConnectBtn className="py-0.5 px-4">
                {
                  wallet.connected && wallet.publicKey ?
                    wallet.publicKey.toBase58().slice(0, 3) + ".." + wallet.publicKey.toBase58().slice(-3)
                    : 'Connect'
                }
              </ConnectBtn>
            </BaseWalletMultiButton>
          </div>
          <div className={`${tap ? '-space-y-6' : '-space-y-3'} absolute right-0 cursor-pointer transition-all duration-300 p-1 flex flex-col justify-center overl`}
            onClick={() => setTap(pre => !pre)}
          >
            <Slash className={`${tap ? 'rotate-90 h-6 w-6' : 'rotate-45 h-5 w-5'} transition-all duration-300`} />
            <Slash className={`${tap ? 'rotate-0 h-6 w-6' : 'rotate-45 h-5 w-5'} transition-all duration-300`} />
          </div>
        </div>
      </div>
      <SideBar open={tap} closeOpen={() => setTap(false)} />
    </>
  )
}
