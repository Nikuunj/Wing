"use client"
import { useRef } from "react";
import InputBox from "../ui/InputBox";
import { useProgram } from "@/hook/useProgram";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import SelectMint from "../w/SelectMint";

function WithdrawForm({ address }: { address: string }) {

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

export default WithdrawForm;
