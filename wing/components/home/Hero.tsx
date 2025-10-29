"use client"
import Image from "next/image";
import logo from "@/public/logo.svg"
import { Meteors } from "../ui/meteors";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { CONNECT_LABELS } from "@/lib/lable";
import ConnectBtn from "../ui/ConnectBtn";
import { useWallet } from "@solana/wallet-adapter-react";
import { HoverBorderGradient } from "../ui/HoverBorderGradient";
import heroImg from '@/public/hero.png';
import { useRouter } from "next/navigation";

function Hero() {
  const wallet = useWallet();
  const router = useRouter()
  return (
    <div className="w-full relative">
      <Meteors number={15} />
      <Image src={heroImg} alt="hero" className="absolute bg-cover -z-10  w-full h-full hue-rotate-270 saturate-100 grayscale-100 contrast-120 brightness-25" />
      <div className=" min-h-screen flex flex-col justify-center items-center gap-7">
        <p className=" text-5xl/13 sm:text-7xl/18 md:text-8xl/27 lg:text-9xl/33 w-3/4 sm:w-2/3 font-bold text-center text-balance capitalize">

          Fund give you {' '}
          <span className="inline-block -space-x-4 sm:-space-x-6 md:-space-x-8 lg:-space-x-10">
            <span className="z-10">wings</span> <Image src={logo} className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-13 lg:h-13 lg:top-5 md:top-2 relative md:right-1 -z-10 inline-block align-top drop-shadow-[0px_0px_4px] drop-shadow-amber-200" alt={'logo'}></Image>
          </span>
        </p>
        <div className="flex items-center gap-2 sm:gap-5">
          <BaseWalletMultiButton labels={CONNECT_LABELS} style={{ outline: '0', background: 'transparent', padding: 0, height: 'fit-content' }} >
            <ConnectBtn className="sm:px-9 px-5 py-2 sm:text-base">
              {
                wallet.connected && wallet.publicKey ?
                  wallet.publicKey.toBase58().slice(0, 3) + ".." + wallet.publicKey.toBase58().slice(-3)
                  : 'Connect'
              }
            </ConnectBtn>
          </BaseWalletMultiButton>
          <div>
            <HoverBorderGradient
              containerClassName="rounded-full"
              as={'button'}
              className="text-white flex items-center space-x-2"
              onClick={() => router.push('/profile')}
            >
              <Image src={logo} className="w-6 h-6" alt="logo" />
              <span className="font-semibold">
                Create wings
              </span>
            </HoverBorderGradient>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
