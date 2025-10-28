"use client"
import { MutableRefObject, useEffect, useRef, useState } from "react";
import InputBox from "../ui/InputBox";
import { useProgram } from "@/hook/useProgram";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, getMint, getTokenMetadata, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

function WithdrawForm() {

  const { program, publicKey, connection } = useProgram();

  const reference = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>(Array(1).fill(null));
  const mintRef = useRef({ value: "SOL", symbol: "SOL", decimals: 9, amount: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const mint = mintRef.current.value;
    const amount = reference.current[0]?.value;
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

    // Check if amount exceeds balance
    if (Number(amount) > mintRef.current.amount) {
      alert('Insufficient balance')
      return;
    }

    setIsLoading(true);

    try {
      let tx;

      if (mint === "So11111111111111111111111111111111111111112") {
        const [solVaultPda, _vaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("sol-vault"), publicKey.toBuffer()],
          program.programId)
        const [solVaultDataPda, _vaultDataBump] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("sol-vault-data"), publicKey.toBuffer()],
          program.programId)

        const sendAmount = Number(amount) * 10 ** decimals
        tx = await program.methods
          .claimSol(new anchor.BN(sendAmount))
          .accountsPartial({
            signer: publicKey,
            solVault: solVaultPda,
            solVaultData: solVaultDataPda,
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


        const recieverTokenAccount = getAssociatedTokenAddressSync(mintPubKey, publicKey, true, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
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
          .clainSpl(new anchor.BN(sendAmount))
          .accountsPartial({
            signer: publicKey,
            vaultTokenAccount: vaultTokenAccountPda,
            signerTokenAccount: recieverTokenAccount,
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
    <div className="px-7 py-8 row-span-3  space-y-5 flex flex-col sm:flex-row lg:flex-col justify-center h-full ">
      <div className="space-y-7 flex flex-col justify-center items-center sm:items-start w-full">
        <h1 className="text-4xl sm:text-5xl font-bold">Withdraw Wings</h1>
        <div className="space-y-7 flex flex-col items-center w-full">
          <InputBox
            refrence={(e) => { reference.current[0] = e }}
            typeOfIn="number"
            placeHolder="Amount"
          />
          <SelectMint mintRef={mintRef} />
          <div className="relative flex justify-center w-fit">
            <button
              className="px-4 py-3 min-w-44 w-fit cursor-pointer border outline-0 border-zinc-700 border-dotted"
              onClick={handleSubmit}
            >
              Wing
            </button>
            <div className="absolute top-0 left-0 h-1.5 w-1.5 border-t border-l" />
            <div className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l" />
            <div className="absolute top-0 right-0 h-1.5 w-1.5 border-t border-r" />
            <div className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r" />
          </div>
        </div>
      </div>
    </div>
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



export default WithdrawForm;
