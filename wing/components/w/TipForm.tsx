"use client"
import { useRef } from "react";
import InputBox from "../ui/InputBox";
import Image from "next/image";
import logo from '@/public/logo.svg'
import SelectMint from "./SelectMint";
import { useProgram } from "@/hook/useProgram";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { acceleratedValues } from "motion/react";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

function Tip({ address }: { address: string }) {

  const { program, publicKey, connection } = useProgram();

  const reference = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>(Array(3).fill(null));
  const mintRef = useRef({ value: "SOL", symbol: "SOL", decimals: 9 });

  const handleSubmit = async () => {
    const mint = mintRef.current.value;
    const name = reference.current[0]?.value;
    const message = reference.current[1]?.value;
    const amount = reference.current[2]?.value;
    const decimals = mintRef.current.decimals;
    if (!publicKey) {
      alert('Please connect your wallet')
      return
    }
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
      alert('Enter valid amount')
      return;
    }
    const timestamp = Date.now();

    const receiver = new PublicKey(address);
    let tx;
    if (mint === 'SOL') {
      const amountNumber = parseFloat(amount);
      const lamport = new anchor.BN(Math.round(amountNumber * 10 ** decimals));
      const [solVaultPda, _vaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("sol-vault"), receiver.toBuffer()],
        program.programId)
      const [solVaultDataPda, _vaultDataBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("sol-vault-data"), receiver.toBuffer()],
        program.programId)
      const [donateMsgPda, _donateMsgBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("donor-msg"),
          receiver.toBuffer(),
          publicKey?.toBuffer(),
          new anchor.BN(timestamp).toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      )

      tx = await program.methods
        .donateSol(lamport, name, message, new anchor.BN(timestamp))
        .accountsPartial({
          donor: publicKey,
          receiver: receiver,
          solVault: solVaultPda,
          solVaultData: solVaultDataPda,
          donateMsg: donateMsgPda,
          systemProgram: anchor.web3.SystemProgram.programId
        })
        .rpc();
    } else {
      const mintPubKey = new PublicKey(mint)

      const donorTokenAccount = getAssociatedTokenAddressSync(mintPubKey, publicKey);
      const [vaultTokenAccountPda, _vaultTokenAccountBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("spl-vault"), receiver.toBuffer(), mintPubKey.toBuffer()],
        program.programId
      );
      const [userVaultDataPda, _userVaultDataBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from('user-vault'),
          receiver.toBuffer(),
          mintPubKey.toBuffer()
        ], program.programId);

      const [vaultAutherPda, _vaultAutherBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from('vault'),
          receiver.toBuffer(),
          mintPubKey.toBuffer()
        ], program.programId)
      const [donateMsgPda, _donateMsgBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("donor-msg"),
          receiver.toBuffer(),
          publicKey?.toBuffer(),
          new anchor.BN(timestamp).toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      )

      const amountNumber = parseFloat(amount);
      const amountSmallUnit = new anchor.BN(Math.round(amountNumber * 10 ** decimals));

      tx = await program.methods
        .donateSpl(new anchor.BN(amountSmallUnit), name, message, new anchor.BN(timestamp))
        .accountsPartial({
          donor: publicKey,
          receiver: receiver,
          donorTokenAccount: donorTokenAccount,
          vaultTokenAccount: vaultTokenAccountPda,
          userVault: userVaultDataPda,
          vault: vaultAutherPda,
          donateMsg: donateMsgPda,
          mint: mintPubKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .rpc()
    }
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
