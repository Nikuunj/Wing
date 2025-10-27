"use client"
import { useProgram } from "@/hook/useProgram";
import { web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Popup from "../ui/Popup";
import { useRouter } from "next/navigation";
import { CircleUser, Copy, SquarePlus, User2Icon } from "lucide-react";
import AboutPopover from "./AboutPopover";

function Profile({ address }: { address: string }) {
  const { program, connection } = useProgram();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const fetchProfile = async () => {
    if (!connection || !program) return;

    try {
      const pubKey = new PublicKey(address);
      const [userProfilePda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user-profile"), pubKey.toBuffer()],
        program.programId
      );
      const userAccount = await program.account.userProfile.fetch(
        userProfilePda
      );
      return userAccount;
    } catch (err) {
      console.error("Error fetching counter value:", err);
      throw new Error(JSON.stringify(err))
    }
  }
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['profile' + address],
    queryFn: fetchProfile,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (isError) {
      setOpen(true)
    }
  }, [isError])

  if (isLoading) {
    return (
      <div className="break-words w-full border-b border-zinc-700   px-7 items-center flex justify-between max-h-36">
        <div className="space-y-2">
          <p className="text-xl font-[650] flex gap-2 items-center">
            <CircleUser className="w-4.5 h-4.5 text-zinc-500 font-light" /> <span className="w-[100%] h-7 inline bg-zinc-800 rounded-xl" />
          </p>
          <p className="items-center flex gap-3">
            {address.slice(0, 3)}...{address.slice(-3)}
            <Copy className="w-4 h-4 text-zinc-500"
              onClick={() => {
                alert('Copy to clipboard')
                navigator.clipboard.writeText(address)
              }}
            />
          </p>
        </div>
        <div>
          <div className="h-5 w-5 rounded-2xl bg-zinc-800" />
        </div>
      </div>
    )
  }

  return (
    <div className="break-words w-full border-b border-zinc-700   px-7 items-center flex justify-between max-h-36">
      <div className="space-y-2">
        <p className="text-xl font-[650] flex gap-2 items-center">
          <CircleUser className="w-4.5 h-4.5 text-zinc-500 font-light" /> {data?.name ? data.name : "-"}
        </p>
        <p className="items-center flex gap-3">
          {address.slice(0, 3)}...{address.slice(-3)}
          <Copy className="w-4 h-4 text-zinc-500"
            onClick={() => {
              alert('Copy to clipboard')
              navigator.clipboard.writeText(address)
            }}
          />
        </p>
      </div>
      <div className="">
        <AboutPopover aboutText={data?.about ? data.about : "-"} />
      </div>
      {open && <Popup
        yesFn={() => setOpen(false)}
        noFn={() => { router.push('/') }}
        text={'Profile is not found still want to continue ?'}
      />
      }
    </div>
  )
}

export default Profile
