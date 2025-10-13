"use client"
import Image from "next/image"
import logo from '@/public/logo.svg';
import { Slash } from 'lucide-react';
import { useState } from "react";
export const Navbar = () => {
  const [tap, setTap] = useState<boolean>(false);
  return (
    <div className="border border-zinc-800 py-2.5 px-3 sm:px-10 flex justify-between items-center fixed max-w-screen min-w-screen top-0">
      <div className={`h-10 w-10`}>
        <Image
          src={logo}
          alt="logo"
          width={200}
          height={200}
        />
      </div>
      <div className={`flex  items-center relative px-12`}>
        <div className="">
          Connect
        </div>
        <div className={`${tap ? '-space-y-6' : '-space-y-7'} absolute right-0 cursor-pointer transition-all duration-300 p-1 flex flex-col justify-center overl`} onClick={() => setTap(pre => !pre)}>
          <Slash className={`${tap ? 'rotate-90' : 'rotate-45 h-10'} transition-all duration-300`} />
          <Slash className={`${tap ? 'rotate-0' : 'rotate-45 h-10'} transition-all duration-300`} />
        </div>
      </div>
    </div>
  )
}
