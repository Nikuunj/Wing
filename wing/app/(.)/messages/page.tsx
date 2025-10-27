"use client"
import BorderDiv from "@/components/ui/BorderDiv";
import { useProgram } from "@/hook/useProgram";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query"

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
  return (
    <BorderDiv borderSize="w-1 h-1" borderWidth={1}>
      <div className="flex  max-w-2xl justify-between items-center w-full px-5  py-10 bg-zinc-800/60 gap-2 sm:gap-7">
        <div>
          <p>{name}</p>
          <p className="text-zinc-400  break-words max-w-56 sm:max-w-full ">{address}</p>
        </div>
        <p className="px-5 py-2 bg-white text-black rounded-3xl font-semibold shadow-[0px_0px_8px] shadow-amber-300">
          View
        </p>
      </div>
    </BorderDiv>
  )
}

function MessageOpen({ pubKey }: { pubKey: string }) {
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

}
export default MessagePage
