"use client"
import BorderDiv from "@/components/ui/BorderDiv";
import { useProgram } from "@/hook/useProgram";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query"
import { Box, Clock1Icon, KeySquareIcon, MessageCircleIcon, PiggyBank, StoreIcon, User, XIcon } from "lucide-react";
import { useState } from "react";

function MessagePage() {
  const { program, publicKey, connection } = useProgram()

  async function fetchData() {
    if (!connection || !program || !publicKey) return;
    let messages = null;

    try {
      messages = await program.account.donationMessage.all([
        {
          memcmp: {
            offset: 8,
            bytes: publicKey.toBase58()
          }
        }
      ])
    } catch (e) {
      console.warn("No messages for user:", e);
    }
    return messages;
  }
  const { data, isLoading } = useQuery({
    queryKey: ['messages' + publicKey?.toString()],
    queryFn: fetchData,
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        Loading...
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        No messages found
      </div>
    )
  }
  const render = data.map((val, idx) => <Message
    name={val.account.senderName}
    address={val.account.senderPubkey.toString()}
    pubkey={val.publicKey.toString()}
  />)
  return (
    <div className="flex flex-col items-center min-w-screen justify-center min-h-screen px-2 sm:px-10 space-y-10  break-words">
      {render}
    </div>
  )
}

function Message({ name, address, pubkey }: { name: string, address: string, pubkey: string }) {
  const [open, setOpen] = useState(false);
  return (
    <BorderDiv borderSize="w-1 h-1" borderWidth={1}>
      <div className="flex  max-w-2xl justify-between items-center w-full px-5 sm:px-9 py-10 bg-zinc-800/60 gap-2 sm:gap-11 " >
        <div className="space-y-2 ">
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-zinc-400  break-words max-w-44 sm:max-w-full ">{address}</p>
        </div>
        <p className="px-5 py-2 bg-white text-black rounded-3xl font-semibold shadow-[0px_0px_8px] shadow-amber-300 cursor-pointer " onClick={() => setOpen(true)} >
          View
        </p>
      </div>
      {open && <MessageOpen pubKey={pubkey} closeFn={() => { setOpen(false) }} />}
    </BorderDiv>
  )
}

function MessageOpen({ pubKey, closeFn }: { pubKey: string, closeFn: () => void }) {
  const { program } = useProgram();
  async function fetchData() {
    let acc = null;
    try {
      const publicKey = new PublicKey(pubKey);
      acc = await program.account.donationMessage.fetch(publicKey);
    } catch (e) {

    }
    return acc
  }
  const { data } = useQuery({
    queryKey: ['message' + pubKey],
    queryFn: fetchData

  })

  return (
    <div onClick={closeFn} className="fixed left-0 z-[100] top-0  h-full w-full flex justify-center items-center bg-zinc-900/50">
      <div className=" max-w-2xl  w-full px-5 sm:px-9 py-10 bg-zinc-800/70 relative "
        onClick={(e) => e.stopPropagation()}>
        <div className="space-y-5">
          <div className="absolute top-3.5 right-5 cursor-pointer" onClick={closeFn}><XIcon className="text-red-600" /></div>
          <p className="flex gap-2 items-center text-lg font-semibold">
            <User className="w-4 h-4 drop-shadow-[0px_0px_5px] drop-shadow-amber-200" />          {data?.senderName}
          </p>
          <p className="flex gap-2 items-center">
            <MessageCircleIcon className="w-4 h-4 drop-shadow-[0px_0px_5px] drop-shadow-amber-200" />          {data?.message}
          </p>
          <p className="flex items-center gap-2">
            <PiggyBank className="w-4 h-4 drop-shadow-[0px_0px_5px] drop-shadow-amber-200" />          {data?.amount.toString()}
          </p>
          <p className="flex items-center gap-2">
            <Clock1Icon className="w-4 h-4 drop-shadow-[0px_0px_5px] drop-shadow-amber-200" /> {data?.ts.toString()}
          </p>
          <p className="flex gap-2 items-center break-words text-zinc-400">
            <KeySquareIcon className="w-4 h-4 drop-shadow-[0px_0px_5px] drop-shadow-amber-200" />{data?.senderPubkey.toString()}
          </p>

          <p className="flex items-center gap-2 text-zinc-400">
            <Box className="w-4 h-4 drop-shadow-[0px_0px_5px] drop-shadow-amber-200" /> {pubKey}
          </p>

        </div>
        <div className="absolute top-0 right-0 w-5 h-5 border-r border-t" />
        <div className="absolute top-0 left-0 w-5 h-5 border-l border-t" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-l border-b  " />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-r border-b " />
      </div>
    </div>
  )
}
export default MessagePage
