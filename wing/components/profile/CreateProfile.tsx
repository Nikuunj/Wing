import { useProgram } from "@/hook/useProgram";
import { web3 } from "@coral-xyz/anchor";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import InputBox from "../ui/InputBox";
import BorderDiv from "../ui/BorderDiv";

function CreateProfile() {
  const { program, publicKey, connection } = useProgram();
  const ref = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>(Array(2).fill(null));
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const name = ref.current[0]?.value;
    const about = ref.current[1]?.value;

    if (!name || name.length > 20) return;

    if (!about || about.length > 250) return;

    if (!connection || !program || !publicKey) return;
    try {
      setIsLoading(true)
      const [userProfilePda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user-profile"), publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .initialize(name, about)
        .accountsPartial({
          userProfile: userProfilePda,
          signer: publicKey,
          systemProgram: web3.SystemProgram.programId,
        }).rpc();
      console.log(tx);
      router.refresh();
    } catch (e) {

    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="px-3 sm:px-8 py-10  row-span-3 gap-9 border border-zinc-700   h-full relative flex flex-col items-center justify-center">
      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-zinc-400 font-bold text-center">Create Wing Profile</h1>
      <div className="space-y-7 flex flex-col justify-center w-fit items-center sm:items-start  ">
        <div className="space-y-7 flex flex-col items-center justify-center w-full min-w-64 sm:min-w-96">
          <InputBox
            refrence={(e) => { ref.current[0] = e }}
            typeOfIn="text"
            placeHolder="Enter Your Name"
          />

          <InputBox
            refrence={(e) => { ref.current[1] = e }}
            typeOfIn="textarea"
            placeHolder="Somthing write about you..."
          />
          <BorderDiv className="relative flex justify-center w-fit" borderSize="w-1.5 h-1.5" borderWidth={1}>
            <button
              className="px-4 py-3 min-w-44 w-fit cursor-pointer border outline-0 border-zinc-700 border-dotted"
              onClick={handleSubmit}
            >
              Create
            </button>
          </BorderDiv>
        </div>
      </div >

      {isLoading && (
        <div className="absolute top-1/2 left-2/5 animate-pulse">
          <BorderDiv className="w-fit px-4 py-2 bg-zinc-900" borderWidth={1} borderSize="w-2 h-2 border-b-blue-500 border-t-yellow-500 border-r-green-500 border-l-purple-500 ">
            <p>
              Creating...
            </p>
          </BorderDiv>
        </div>
      )}
      <div className="w-20 h-8 border-2 border-blue-500 bg-gradient-to-br from-blue-500/30 to-transparent absolute top-0 left-0 rounded-br-2xl animate-pulse"
        style={{ animationDelay: '0s', animationDuration: '2s' }} />

      <div className="w-8 h-20 border-2 border-purple-500 bg-gradient-to-bl from-purple-500/30 to-transparent absolute top-0 right-0 rounded-bl-2xl animate-pulse"
        style={{ animationDelay: '0.5s', animationDuration: '2s' }} />

      <div className="w-20 h-8 border-2 border-green-500 bg-gradient-to-tl from-green-500/30 to-transparent absolute bottom-0 right-0 rounded-tl-2xl animate-pulse"
        style={{ animationDelay: '1s', animationDuration: '2s' }} />

      <div className="w-8 h-20 border-2 border-yellow-500 bg-gradient-to-tr from-yellow-500/30 to-transparent absolute bottom-0 left-0 rounded-tr-2xl animate-pulse"
        style={{ animationDelay: '1.5s', animationDuration: '2s' }} />
    </div >
  )
}

export default CreateProfile
