
'use client'
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import ConnectBtn from "./ConnectBtn";
import { useWallet } from "@solana/wallet-adapter-react";
import { CONNECT_LABELS } from "@/lib/lable";

export default function WalletButtonClient() {
  const wallet = useWallet();

  return (
    <BaseWalletMultiButton
      labels={CONNECT_LABELS}
      style={{
        outline: '0',
        background: 'transparent',
        padding: 0,
        height: 'fit-content',
      }}
    >
      <ConnectBtn className="py-0.5 px-4">
        {wallet.connected && wallet.publicKey
          ? `${wallet.publicKey.toBase58().slice(0, 3)}..${wallet.publicKey.toBase58().slice(-3)}`
          : 'Connect'}
      </ConnectBtn>
    </BaseWalletMultiButton>
  );
}
