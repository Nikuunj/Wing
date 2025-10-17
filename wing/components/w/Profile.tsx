"use client"
import { useProgram } from "@/hook/useProgram";
import { web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Popup from "../ui/Popup";
import { useRouter } from "next/navigation";

function Profile({ address }: { address: string }) {
  const { program, connection } = useProgram();
  const [open, setOpen] = useState<boolean>(true);
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
    return <div>Loading...</div>
  }

  return (
    <div className="w-fit break-words">
      Profile {address}
      <br />
      {JSON.stringify(data)}
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
