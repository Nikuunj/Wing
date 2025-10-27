"use client"
import Profile from "@/components/w/Profile"
import { useProgram } from "@/hook/useProgram"
import Image from "next/image"
import logo from '@/public/logo.svg'
import WithdrawForm from "@/components/withdraw/WithdrawForm"

function WithdrawPage() {
  const { program, publicKey, connection } = useProgram()


  return (
    <div className="grid grid-cols-3 translate-y-15 col-span-2  overflow-hidden min-h-screen">
      <div className="lg:border-r border-zinc-700 h-full col-span-3 lg:col-span-1 grid  grid-rows-4 grid-flow-col  gap-0">
        <Profile address={publicKey?.toString() as unknown as string} />
        <WithdrawForm />
      </div>
      <div className="col-span-3 lg:col-span-2 flex justify-center items-center w-full gap-0 ">
        <Image src={logo} alt="logo" className="h-full w-fit  drop-shadow-[0px_0px_5px] drop-shadow-amber-200" />
      </div>
    </div>
  )
}

export default WithdrawPage
