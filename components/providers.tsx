"use client";

import { WalletProvider } from "@/hooks/use-wallet";
import { XRPLProvider } from "@/hooks/use-xrpl";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi-config";
import { Toaster } from "sonner";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";

// Global wallet detection debug
if (typeof window !== "undefined") {
  setTimeout(() => {
    const walletKeys = Object.keys(window).filter(
      (key) =>
        key.toLowerCase().includes("gem") ||
        key.toLowerCase().includes("xrpl") ||
        key.toLowerCase().includes("wallet")
    );

    console.log("🌍 GLOBAL WALLET DETECTION (on app load):");
    console.log("  ethereum:", !!window.ethereum);
    console.log("  gemWallet:", !!(window as any).gemWallet);
    console.log("  xrpl:", !!(window as any).xrpl);
    console.log("  gem:", !!(window as any).gem);

    // Also check for GemWallet API
    import("@gemwallet/api")
      .then(({ isInstalled }) => {
        isInstalled()
          .then((response) => {
            console.log("  🔍 GemWallet API response:", response);
            console.log("  🔍 Response type:", typeof response);
            console.log(
              "  🔍 Response keys:",
              response ? Object.keys(response) : "null"
            );
            console.log("  🔍 Response.result:", response?.result);
            console.log(
              "  ✅ GemWallet installed:",
              response?.result?.isInstalled === true || response?.result === true || response === true
            );
          })
          .catch((e) => {
            console.log("  ❌ GemWallet API check failed:", e.message);
          });
      })
      .catch(() => {
        console.log("  ❌ GemWallet API not available");
      });

    console.log("  wallet-related keys:", walletKeys);
    console.log("  total window keys:", Object.keys(window).length);
  }, 1000);
}

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
