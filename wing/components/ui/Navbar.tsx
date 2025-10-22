"use client"
import Image from "next/image"
import logo from '@/public/logo.svg';
import { SearchIcon, Slash, XIcon } from 'lucide-react';
import { FormEvent, useRef, useState } from "react";
import SideBar from "./SideBar";
import dynamic from 'next/dynamic'
import InputBox from "./InputBox";
import { useRouter } from "next/navigation";

const WalletButtonClient = dynamic(() => import('./WalletButtonClient'), { ssr: false });

export const Navbar = () => {
  const [tap, setTap] = useState<boolean>(false);
  const [search, setSearch] = useState<boolean>(false);
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
        <div className={`flex  items-center relative pe-12 gap-3 `}>
          <div className="pt-1">
            <WalletButtonClient />
          </div>
          <button className="cursor-pointer" onClick={() => setSearch(true)}>
            <SearchIcon className="text-zinc-400 h-5 w-5" />
          </button>
          <div className={`${tap ? '-space-y-6' : '-space-y-3'} absolute right-0 cursor-pointer transition-all duration-300 p-1 flex flex-col justify-center overl`}
            onClick={() => setTap(pre => !pre)}
          >
            <Slash className={`${tap ? 'rotate-90 h-6 w-6' : 'rotate-45 h-5 w-5'} transition-all duration-300`} />
            <Slash className={`${tap ? 'rotate-0 h-6 w-6' : 'rotate-45 h-5 w-5'} transition-all duration-300`} />
          </div>
        </div>
      </div>
      {search && <SearchComponenets closeOpen={() => setSearch(false)} />}
      <SideBar open={tap} closeOpen={() => setTap(false)} />
    </>
  )
}

function SearchComponenets({ closeOpen }: { closeOpen: () => void }) {
  const refKey = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    console.log(refKey.current?.value);
    const pubkey = refKey.current?.value;
    if (!pubkey) {
      return
    }
    router.push(`/w/${pubkey}`)
    closeOpen()
  }
  return (
    <div className="bg-zinc-900/50 w-full px-2 h-full z-[100] fixed flex justify-center items-center" onClick={closeOpen}>
      <form className="bg-zinc-800 px-2 sm:px-10 pb-12 pt-16 rounded-lg relative flex items-center "
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <XIcon className="absolute top-5 right-7 text-zinc-400" onClick={closeOpen} />
        <InputBox typeOfIn={'text'} placeHolder="Enter public key..."
          refrence={(e) => { refKey.current = e }} />
        <button className="border border-dashed py-3 border-zinc-700 px-3 relative" type="submit">
          <SearchIcon className="" />
          <div className="absolute h-1 w-1 border-t border-l top-0 left-0" />
          <div className="absolute h-1 w-1 border-t border-r top-0 right-0" />
          <div className="absolute h-1 w-1 border-b border-l bottom-0 left-0" />
          <div className="absolute h-1 w-1 border-b border-r bottom-0 right-0" />
        </button>
      </form>
    </div>
  )
}
