import { useProgram } from "@/hook/useProgram";
import { web3 } from "@coral-xyz/anchor";
import { getMint, getTokenMetadata } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import BorderDiv from "../ui/BorderDiv";

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
      profile = await program.account.userProfile.fetch(userProfilePda);
    } catch (err) {
      console.warn("No user profile found:", err);
    }

    try {
      const vaults = await program.account.userVault.all([
        {
          memcmp: {
            offset: 8,
            bytes: publicKey.toBase58(),
          },
        },
      ]);

      // enrich each vault entry with token metadata
      splVaultData = await Promise.all(
        vaults.map(async (val) => {
          const mintPubkey = new PublicKey(val.account.mint);
          let symbol = "Unknown";
          let decimals = 0;

          try {
            const meta = await getTokenMetadata(connection, mintPubkey);
            if (meta?.symbol) symbol = meta.symbol;
          } catch (err) {
            // Token-2022 may not have metadata extension, fallback to getMint
            console.warn("Metadata not found, fallback to getMint:", err);
          }

          try {
            const mintInfo = await getMint(connection, mintPubkey);
            decimals = mintInfo.decimals;
          } catch (err) {
            console.warn("Failed to fetch mint info:", err);
          }

          return {
            ...val,
            symbol,
            decimals,
          };
        })
      );
    } catch (err) {
      console.warn("No Spl vault found for user:", err);
    } return { solVaultData, profile, splVaultData };
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
    <div className=" w-full px-2 sm:px-10 space-y-10 ">
      <div className="text-4xl sm:text-8xl text-zinc-400 font-bold">
        Dashboard
      </div>
      <div className="space-y-7">
        <p className="text-4xl font-bold ">
          {data?.profile?.name}
        </p>
        <div className="flex gap-5 flex-wrap  max-w-2xl">
          <BorderDiv borderWidth={1} borderSize="w-3 h-3 border-b-blue-500 border-t-yellow-500 border-r-green-500 border-l-purple-500">
            <div className="px-10 py-20 bg-zinc-800/60">
              <p className="text-2xl font-semibold">
                {Number(data?.solVaultData?.amount.toString()) / 1000_000_000}
                <span className="align-top inline-block text-xs text-zinc-500 font-semibold">SOL</span>
              </p>
            </div>
          </BorderDiv>

          {data?.splVaultData?.map(val => (
            <BorderDiv borderWidth={1} borderSize="w-3 h-3 border-b-blue-500 border-t-yellow-500 border-r-green-500 border-l-purple-500">
              <div className="px-10 py-20 bg-zinc-800/60">
                <p className="text-3xl font-semibold">
                  {Number(val.account.amount) / 10 ** val.decimals}
                  <span className="align-top inline-block text-xs border-b-blue-500 text-zinc-500 font-semibold">{val.symbol}</span>
                </p>
              </div>
            </BorderDiv>
          ))}
          <p>

          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
