"use client"
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function Provider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider endpoint={'https://api.testnet.solana.com'}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  )
}

export default Provider
