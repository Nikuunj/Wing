"use client"
import { useProgram } from "@/hook/useProgram";
import { web3 } from '@coral-xyz/anchor'
import CreateProfile from "./CreateProfile";
import { WobbleCard } from "../ui/WaobbleCard";
import Image from "next/image";
import logo from '@/public/logo.svg'
import { User, Wallet2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

function Profile() {
  const { program, publicKey, connection } = useProgram();

  const fetchProfile = async () => {

    if (!connection || !program || !publicKey) return;

    try {
      const [userProfilePda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user-profile"), publicKey.toBuffer()],
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
  const { isLoading, isError, data } = useQuery({
    queryKey: ['profile' + publicKey?.toString()],
    queryFn: fetchProfile
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <CreateProfile />
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full translate-y-12 relative px-10">
      <WobbleCard
        containerClassName="relative col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[200px] lg:min-h-[200px] max-h-[200px]"
        className=""
      >
        <Image src={logo} className="w-10 h-10 absolute top-2 right-3 drop-shadow-[0px_0px_4px] drop-shadow-amber-200" alt='logo' />
        <div className="">
          <h2 className=" text-xl md:text-2xl space-x-5 flex items-center ps-1">
            <Wallet2Icon className="inline-block h-8 w-8 drop-shadow-[0px_0px_3px] drop-shadow-amber-200" /> <span className="break-words overflow-hidden font-medium w-fit">{publicKey?.toString()}</span>
          </h2>
        </div>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[200px]  max-h-[200px] relative">
        <h2 className=" text-left text-balance text-2xl md:text-3xl font-semibold tracking-[-0.015em] text-white flex gap-2 items-center">
          <User className="h-7 w-7 drop-shadow-[0px_0px_4px] drop-shadow-amber-200" /> {data?.name}
        </h2>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px] relative">
        <div className="max-w-md">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            About you!
          </h2>
          <p className="mt-4 max-w-[36rem] text-left  text-base/6 text-neutral-200">
            {data?.about}
          </p>
        </div>
      </WobbleCard>
    </div>)
}

export default Profile
