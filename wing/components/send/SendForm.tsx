"use client"
import { MutableRefObject, useEffect, useRef, useState } from "react";
import InputBox from "../ui/InputBox";
import { useProgram } from "@/hook/useProgram";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, getMint, getTokenMetadata, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import BorderDiv from "../ui/BorderDiv";

function SendForm() {

  const { program, publicKey, connection } = useProgram();

  const reference = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>(Array(2).fill(null));
  const mintRef = useRef({ value: "SOL", symbol: "SOL", decimals: 9, amount: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const mint = mintRef.current.value;
    const reciever = reference.current[0]?.value;
    const amount = reference.current[1]?.value;
    const decimals = mintRef.current.decimals;

    if (!publicKey) {
      alert('Please connect your wallet')
      return
    }
    if (!mint) {
      alert('Mint Address is not valid')
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount')
      return;
    }

    if (!reciever) {
      alert('Please enter a reciever address ')
      return
    }

    // Check if amount exceeds balance
    if (Number(amount) > mintRef.current.amount) {
      alert('Insufficient balance')
      return;
    }

    setIsLoading(true);

    try {
      let tx;
      const recieverPubkey = new PublicKey(reciever);

      if (mint === "So11111111111111111111111111111111111111112") {
        const [solVaultPda, _vaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("sol-vault"), publicKey.toBuffer()],
          program.programId)
        const [solVaultDataPda, _vaultDataBump] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("sol-vault-data"), publicKey.toBuffer()],
          program.programId)

        const sendAmount = Number(amount) * 10 ** decimals
        tx = await program.methods
          .sendSol(new anchor.BN(sendAmount))
          .accountsPartial({
            signer: publicKey,
            solVault: solVaultPda,
            solVaultData: solVaultDataPda,
            reciever: recieverPubkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }).rpc()

      } else {
        const mintPubKey = new PublicKey(mint)
        const mintAccountInfo = await connection.getAccountInfo(mintPubKey);
        if (!mintAccountInfo) {
          alert('Invalid mint address');
          return;
        }
        const TOKEN_PROGRAM_ID = mintAccountInfo.owner.toString() === TOKEN_2022_PROGRAM_ID.toString()
          ? TOKEN_2022_PROGRAM_ID
          : new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');


        const recieverTokenAccount = getAssociatedTokenAddressSync(mintPubKey, recieverPubkey, true, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
        const [vaultTokenAccountPda, _vaultTokenAccountBump] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("spl-vault"), publicKey.toBuffer(), mintPubKey.toBuffer()],
          program.programId
        );
        const [userVaultDataPda, _userVaultDataBump] = anchor.web3.PublicKey.findProgramAddressSync(
          [
            Buffer.from('user-vault'),
            publicKey.toBuffer(),
            mintPubKey.toBuffer()
          ], program.programId);

        const [vaultAutherPda, _vaultAutherBump] = anchor.web3.PublicKey.findProgramAddressSync(
          [
            Buffer.from('vault'),
            publicKey.toBuffer(),
            mintPubKey.toBuffer()
          ], program.programId)

        const sendAmount = Number(amount) * 10 ** decimals
        tx = await program.methods
          .sendSpl(new anchor.BN(sendAmount))
          .accountsPartial({
            signer: publicKey,
            reciever: recieverPubkey,
            recieverTokenAccount: recieverTokenAccount,
            vaultTokenAccount: vaultTokenAccountPda,
            userVault: userVaultDataPda,
            vault: vaultAutherPda,
            mint: mintPubKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
          }).rpc()
      }

      console.log('Transaction signature:', tx);

      // Clear the input field
      if (reference.current[0]) {
        reference.current[0].value = '';
      }

    } catch (error) {
      console.error('Transaction failed:', error);
      alert(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-3 sm:px-8 py-10  row-span-3 gap-9 border border-zinc-700 border-dashed   h-full relative flex flex-col items-center justify-center">
      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-zinc-400 font-bold">Send Assets</h1>
      <div className="space-y-7 flex flex-col justify-center w-fit items-center sm:items-start  ">
        <div className="space-y-7 flex flex-col items-center justify-center w-full min-w-64 sm:min-w-96">
          <InputBox
            refrence={(e) => { reference.current[0] = e }}
            typeOfIn="text"
            placeHolder="Address"
          />

          <InputBox
            refrence={(e) => { reference.current[1] = e }}
            typeOfIn="number"
            placeHolder="Amount"
          />
          <SelectMint mintRef={mintRef} />
          <BorderDiv className="relative flex justify-center w-fit" borderSize="w-1.5 h-1.5" borderWidth={1}>
            <button
              className="px-4 py-3 min-w-44 w-fit cursor-pointer border outline-0 border-zinc-700 border-dotted"
              onClick={handleSubmit}
            >
              Wing
            </button>
          </BorderDiv>
        </div>
      </div >

      {isLoading && (
        <div className="absolute top-1/2 left-2/5 animate-pulse">
          <BorderDiv className="w-fit px-4 py-2 bg-zinc-900" borderWidth={1} borderSize="w-2 h-2 border-b-blue-500 border-t-yellow-500 border-r-green-500 border-l-purple-500 ">
            <p>
              Sending...
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
  );
}

function SelectMint({
  mintRef
}: {
  mintRef: MutableRefObject<{ value: string; symbol: string, decimals: number, amount: number }>
}) {
  const { program, publicKey, connection } = useProgram();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getTokenInfo = async () => {
    if (!connection || !program || !publicKey) return;

    const [solVaultDataPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("sol-vault-data"), publicKey!.toBuffer()],
      program.programId
    )

    let solVaultData = null;
    let splVaultData = null;

    try {
      solVaultData = await program.account.solVaultData.fetch(solVaultDataPda);
    } catch (err) {
      console.warn("No solVaultData found for user:", err);
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
    }

    const mergerAllPlainData = splVaultData?.map(val => {
      return {
        amount: val.account.amount.toString() as string,
        symbol: val.symbol,
        decimals: val.decimals,
        mint: val.account.mint
      }
    });
    mergerAllPlainData?.unshift({
      amount: solVaultData?.amount.toString() || "0",
      symbol: "SOL",
      decimals: 9,
      mint: new PublicKey('So11111111111111111111111111111111111111112')
    })

    handleSelect("So11111111111111111111111111111111111111112", "SOL", 9, Number(solVaultData?.amount.toString()) / 10 ** 9)
    return mergerAllPlainData
  }

  const { data: allTokens, isLoading } = useQuery({
    queryKey: ['tokens', publicKey?.toBase58()],
    queryFn: getTokenInfo,
    enabled: !!publicKey
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string, symbol: string, decimals: number, amount: number) => {
    mintRef.current = { value, symbol, decimals, amount };
    setIsOpen(false);
  };

  if (isLoading) return <div className="text-zinc-400">Loading tokens...</div>;


  return (

    <div ref={dropdownRef} className="flex gap-3 items-center">
      <div className="text-xl font-semibold flex items-center gap-2">
        Balance: {mintRef.current.amount}
      </div>
      <div className="relative">
        {/* Selected Item Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 border border-zinc-700 bg-transparent text-white flex items-center outline-0 justify-between hover:border-zinc-600 transition-colors"
        >
          <span>{mintRef.current.symbol}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 border border-zinc-700 bg-zinc-900 max-h-28 outline-0 overflow-y-scroll scroll-smooth no-scrollbar">
            {allTokens?.map((token, idx) => (
              <button
                key={token.mint.toString() || idx}
                onClick={() => handleSelect(token.mint.toString(), token.symbol, token.decimals, Number(token.amount) / 10 ** token.decimals)}
                className={`w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors border-t border-zinc-700 ${mintRef.current.value === token.mint.toString() ? 'bg-zinc-800' : ''
                  }`}
              >
                {token.symbol}
              </button>
            ))}
          </div>
        )}
        <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" />
        <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l" />
        <div className="absolute top-0 right-0 w-1 h-1 border-t border-r" />
        <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r" />
      </div>
    </div>
  );
}



export default SendForm
