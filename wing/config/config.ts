import { clusterApiUrl, Connection } from "@solana/web3.js";
import idl from '@/idl/contract.json';
import type { Contract as WingContract } from '@/types/contract'
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

const { connection } = useConnection();
const wallet = useAnchorWallet();

const provider = new AnchorProvider(connection, wallet, {});

setProvider(provider);

export const program = new Program(idl as WingContract, {
  connection,
});
