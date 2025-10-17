import { useProgram } from "@/hook/useProgram";
import { web3 } from "@coral-xyz/anchor";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

function CreateProfile() {
  const { program, publicKey, connection } = useProgram();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const ref = useRef<(HTMLInputElement | null)[]>(Array(3).fill(null));
  const router = useRouter();

  const handleSubmit = async () => {
    const name = ref.current[0]?.value;
    const about = ref.current[1]?.value;

    if (!name || name.length > 20) return;

    if (!about || about.length > 250) return;

    if (!connection || !program || !publicKey) return;
    try {

      setIsFetching(true);
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
      setIsFetching(false)
    }
  }
  return (
    <div>
      <input placeholder="input 1 name" ref={(e) => { ref.current[0] = e }} />
      <br />

      <input placeholder="input 1 name" ref={(e) => { ref.current[1] = e }} />
      <button onClick={handleSubmit}>Click me</button>
      {isFetching && 'Loading...'}
    </div>
  )
}

export default CreateProfile
