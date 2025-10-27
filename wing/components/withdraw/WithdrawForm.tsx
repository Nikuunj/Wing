"use client"
import { MutableRefObject, useEffect, useRef, useState } from "react";
import InputBox from "../ui/InputBox";
import { useProgram } from "@/hook/useProgram";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, getTokenMetadata, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

function WithdrawForm() {

  const { program, publicKey, connection } = useProgram();

  const reference = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>(Array(1).fill(null));
  const mintRef = useRef({ value: "SOL", symbol: "SOL", decimals: 9 });

  const handleSubmit = async () => {
    const mint = mintRef.current.value;
    const amount = reference.current[1]?.value;
    const decimals = mintRef.current.decimals;
    if (!publicKey) {
      alert('Please connect your wallet')
      return
    }
    if (!mint) {
      alert('Mint Address Is not valid')
      return;
    }
  };

  const fetchBalance = async () => {
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
      splVaultData = await program.account.userVault.all([
        {
          memcmp: {
            offset: 8,
            bytes: publicKey!.toBase58()
          }
        }
      ])
    } catch (err) {
      console.warn("No Spl vault found for user:", err);
    }

    return { solVaultData, splVaultData };
  }
  const { isLoading, data } = useQuery({
    queryKey: ['data' + publicKey?.toString()],
    queryFn: fetchBalance
  });

  if (isLoading) {
    return (
      <div className="px-7 py-8 row-span-3  space-y-5 flex flex-col sm:flex-row lg:flex-col justify-center h-full ">
        Loading...
      </div>
    )
  }

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
  mintRef: MutableRefObject<{ value: string; symbol: string, decimals: number }>
}) {
  const { program, publicKey, connection } = useProgram();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getTokenInfo = async () => {
    return []
  }

  const { data: tokens, isLoading } = useQuery({
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

  const handleSelect = (value: string, symbol: string, decimals: number) => {
    mintRef.current = { value, symbol, decimals };
    setIsOpen(false);
  };

  if (isLoading) return <div className="text-zinc-400">Loading tokens...</div>;

  const allTokens = [
    { value: "SOL", symbol: "SOL", decimals: 9 },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
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
          {allTokens.map((token, idx) => (
            <button
              key={token.value || idx}
              onClick={() => handleSelect(token.value, token.symbol, token.decimals)}
              className={`w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors border-t border-zinc-700 ${mintRef.current.value === token.value ? 'bg-zinc-800' : ''
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
  );
}



export default WithdrawForm;
