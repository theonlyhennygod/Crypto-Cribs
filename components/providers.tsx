"use client"

import { WalletProvider } from "@/hooks/use-wallet"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>
}
