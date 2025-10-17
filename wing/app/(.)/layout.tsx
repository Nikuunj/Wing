"use client"
import { CONNECT_LABELS } from "@/lib/lable";
import { useWallet } from "@solana/wallet-adapter-react";
import { BaseWalletMultiButton, useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ReactNode, useEffect } from "react"

function layout({ children }: { children: ReactNode }) {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    if (!connected) {
      setVisible(true);
    } else {
      setVisible(false)
    }
  }, [connected, setVisible]);
  if (!connected) {
    return <div className="flex flex-col justify-center items-center min-h-screen">
      Connect wallet
      <BaseWalletMultiButton
        labels={CONNECT_LABELS}
        style={{ outline: '0', background: 'transparent', padding: 0, height: 'fit-content' }}
      />
    </div>
  }

  return (
    <div>{children}</div>
  )
}

export default layout
