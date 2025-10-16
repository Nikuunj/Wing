"use client";

import * as anchor from "@coral-xyz/anchor";

import { PublicKey } from "@solana/web3.js";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { Contract } from "@/anchor-idl/contract";
import Idl from "@/anchor-idl/contract.json";

interface UseProgramReturn {
  program: anchor.Program<Contract>;
  publicKey: PublicKey | null;
  connected: boolean;
  connection: anchor.web3.Connection;
}

export function useProgram(): UseProgramReturn {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  let program;
  if (wallet) {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "confirmed",
    });
    program = new anchor.Program<Contract>(Idl, provider);
  } else {
    // Create program with just connection for read-only operations
    program = new anchor.Program<Contract>(Idl, { connection });
  }
  return {
    program,
    publicKey,
    connected,
    connection,
  };
}
