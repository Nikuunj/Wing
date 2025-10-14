"use client"
import Image from "next/image";
import logo from "@/public/logo.svg"
import { Meteors } from "../ui/meteors";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { CONNECT_LABELS } from "@/lib/lable";
import ConnectBtn from "../ui/ConnectBtn";
import { useWallet } from "@solana/wallet-adapter-react";

function Hero() {
  const wallet = useWallet();
  return (
    <div className="w-full relative">
      <Meteors number={15} />
      <div className=" min-h-screen flex flex-col justify-center items-center gap-7">
        <p className=" text-5xl/13 sm:text-7xl/18 md:text-8xl/27 lg:text-9xl/33 w-3/4 sm:w-2/3 font-bold text-center text-balance capitalize">

          Fund give you {' '}
          <span className="inline-block -space-x-4 sm:-space-x-6 md:-space-x-8 lg:-space-x-10">
            <span className="z-10">wings</span> <Image src={logo} className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-13 lg:h-13 lg:top-5 md:top-2 relative md:right-1 -z-10 inline-block align-top" alt={'logo'}></Image>
          </span>
        </p>
        <BaseWalletMultiButton labels={CONNECT_LABELS} style={{ outline: '0', background: 'transparent', padding: 0, height: 'fit-content' }} >
          <ConnectBtn className="px-9 py-1.5 text-lg">
            {
              wallet.connected && wallet.publicKey ?
                wallet.publicKey.toBase58().slice(0, 3) + ".." + wallet.publicKey.toBase58().slice(-3)
                : 'Connect'
            }
          </ConnectBtn>
        </BaseWalletMultiButton>
      </div>
    </div>
  )
}

export default Hero
