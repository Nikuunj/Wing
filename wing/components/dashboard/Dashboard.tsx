import { useProgram } from "@/hook/useProgram";
import { web3 } from "@coral-xyz/anchor";
import { useQuery } from "@tanstack/react-query";

function Dashboard() {
  const { program, publicKey, connection } = useProgram()
  const fetchData = async () => {

    if (!connection || !program || !publicKey) return;

    const [solVaultDataPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("sol-vault-data"), publicKey.toBuffer()],
      program.programId
    );
    const [userProfilePda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user-profile"), publicKey.toBuffer()],
      program.programId
    );

    let solVaultData = null;
    let profile = null;
    let splVaultData = null;
    try {
      solVaultData = await program.account.solVaultData.fetch(solVaultDataPda);
    } catch (err) {
      console.warn("No solVaultData found for user:", err);
    }

    try {
      profile = await program.account.userProfile.fetch(userProfilePda);
    } catch (err) {
      console.warn("No user profile found:", err);
    }

    try {
      splVaultData = await program.account.userVault.all([
        {
          memcmp: {
            offset: 8,
            bytes: publicKey.toBase58()
          }
        }
      ])
    } catch (err) {
      console.warn("No Spl vault found for user:", err);
    }

    return { solVaultData, profile, splVaultData };
  }
  const { isError, isLoading, data, error } = useQuery({
    queryKey: ['data' + publicKey?.toString()],
    queryFn: fetchData
  });

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Datat not found {error.message}</div>
  }

  return (
    <div>{JSON.stringify(data, null, 2)}</div>
  )
}

export default Dashboard
