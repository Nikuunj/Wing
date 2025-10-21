"use client"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, getTokenMetadata } from '@solana/spl-token';
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Token {
  mint: PublicKey | undefined;
  symbol: string | undefined;
  decimals: number;
}

function SelectMint({
  mintRef
}: {
  mintRef: React.MutableRefObject<{ value: string; symbol: string, decimals: number }>
}) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getTokenInfo = async () => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }
    try {
      const [standardTokens, token2022] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID }),
        connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_2022_PROGRAM_ID }),
      ]);

      const token2022Data = await Promise.all(
        token2022.value.map(async (acc) => {
          const parsedInfo = acc.account.data.parsed.info;
          const mintPubkey = new PublicKey(parsedInfo.mint);
          const data = await getTokenMetadata(connection, mintPubkey);
          const decimals = parsedInfo.tokenAmount?.decimals ?? 0
          return { mint: data?.mint, symbol: data?.symbol, decimals };
        })
      );

      return token2022Data;
    } catch (e) {
      console.error('Error fetching token accounts:', e);
      return [];
    }
  }

  const { data: tokens, isLoading, isError } = useQuery({
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
    ...(tokens?.map(t => ({
      value: t.mint?.toString() || "",
      symbol: t.symbol || "Unknown",
      decimals: t.decimals
    })) || [])
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

export default SelectMint;
