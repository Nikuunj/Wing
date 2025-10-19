"use client"

import { useRef } from "react";
import InputBox from "../ui/InputBox";
import Image from "next/image";
import logo from '@/public/logo.svg'

function Tip({ address, mintAddress }: { address: string, mintAddress: string }) {
  /* amout, name, describe, mint address */
  const reference = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>(Array(2).fill(null));

  const handleSubmit = async () => {

  }
  return (
    <div className="px-7 py-8 row-span-4 h-fit   space-y-5 flex flex-col-reverse sm:flex-row lg:flex-col-reverse">
      <div className="space-y-7 flex flex-col justify-center items-center sm:items-start  w-full">
        <h1 className="text-4xl sm:text-5xl  font-bold">Funds gives Wings</h1>
        <InputBox
          refrence={(e) => { reference.current[0] = e }}
          typeOfIn="text"
          placeHolder="Name"
        />
        <InputBox
          refrence={(e) => { reference.current[0] = e }}
          typeOfIn="text"
          placeHolder="Message"
        />
        <div className="relative w-fit lg:w-full">
          <button
            className=" px-4 py-3 min-w-72  cursor-text  border 
          lg:w-full  outline-0 border-zinc-700 border-dotted "
            onClick={handleSubmit}
          >
            Wing
          </button>
          <div className="absolute top-0 left-0 h-1.5 w-1.5 border-t border-l" />
          <div className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l" />
          <div className="absolute top-0 right-0  h-1.5 w-1.5 border-t border-r" />
          <div className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r" />
        </div>
      </div>

      <div className="w-full sm:flex justify-center items-center ">
        <Image src={logo} alt="logo" className="h-full w-full lg:max-w-44 drop-shadow-[0px_0px_5px] drop-shadow-amber-200" />
      </div>
    </div>
  )
}

export default Tip
