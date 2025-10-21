"use client"
import { useRef } from "react";
import InputBox from "../ui/InputBox";
import Image from "next/image";
import logo from '@/public/logo.svg'
import SelectMint from "./SelectMint";
import { useProgram } from "@/hook/useProgram";


function Tip({ address }: { address: string }) {

  const { program, publicKey, connection } = useProgram();

  const reference = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>(Array(3).fill(null));
  const mintRef = useRef({ value: "SOL", symbol: "SOL" });

  const handleSubmit = async () => {
    const mint = mintRef.current.value;
    const name = reference.current[0]?.value;
    const message = reference.current[1]?.value;
    const amount = reference.current[2]?.value;

    if (!mint) {
      alert('Mint Address Is not valid')
      return;
    }
    if (!name) {
      alert('Enter name')
      return;
    }
    if (!message) {
      alert('Write somthing')
      return;
    }
    if (!amount) {
      alert('Enter valid ammout')
      return;
    }

    let tx;
    if (mint === 'SOL') {
      tx = await program.methods.donateSol

    } else {

    }
    console.log({
      mint,
      symbol: mintRef.current.symbol,
      name,
      message,
      amount
    });
  };

  return (
    <div className="px-7 py-8 row-span-5 h-fit space-y-5 flex flex-col-reverse sm:flex-row lg:flex-col-reverse ">
      <div className="space-y-7 flex flex-col justify-center items-center sm:items-start w-full">
        <h1 className="text-4xl sm:text-5xl font-bold">Funds gives Wings</h1>
        <div className="space-y-7 flex flex-col items-center w-full">
          <InputBox
            refrence={(e) => { reference.current[0] = e }}
            typeOfIn="text"
            placeHolder="Name"
          />
          <InputBox
            refrence={(e) => { reference.current[1] = e }}
            typeOfIn='textarea'
            placeHolder="Type your message..."
          />
          <InputBox
            refrence={(e) => { reference.current[2] = e }}
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
      <div className="w-full sm:flex justify-center items-center">
        <Image src={logo} alt="logo" className="h-full w-full lg:max-w-44 drop-shadow-[0px_0px_5px] drop-shadow-amber-200" />
      </div>
    </div>
  );
}

export default Tip;
