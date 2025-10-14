"use client"
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { ReactNode } from 'react'

function Provider({ children }: { children: ReactNode }) {
  return (
    <ConnectionProvider endpoint={'https://api.testnet.solana.com'}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default Provider
