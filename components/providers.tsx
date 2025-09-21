"use client";

import { WalletProvider } from "@/hooks/use-wallet";
import { XRPLProvider } from "@/hooks/use-xrpl";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/wagmi-config';
import { Toaster } from "sonner";
import type { ReactNode } from "react";
import { useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="crypto-cribs-theme"
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <XRPLProvider>
            <WalletProvider>
              {children}
              <Toaster richColors position="top-right" />
            </WalletProvider>
          </XRPLProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
