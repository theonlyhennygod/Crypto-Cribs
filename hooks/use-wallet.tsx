"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// Wallet types
export type WalletType = "metamask" | "gem" | null
export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error"

// Enhanced wallet state interface
interface WalletState {
  // MetaMask (Flare) state
  metamaskAddress: string | null
  metamaskBalance: string | null
  metamaskConnected: boolean

  // Gem Wallet (XRPL) state
  gemAddress: string | null
  gemBalance: string | null
  gemConnected: boolean

  // General state
  activeWallet: WalletType
  connectionStatus: ConnectionStatus
  error: string | null

  isConnected: boolean
  xrplWallet: { address: string; balance: string } | null
  flareWallet: { address: string; balance: string } | null
}

// Enhanced wallet actions interface
interface WalletActions {
  connectMetaMask: () => Promise<void>
  connectGemWallet: () => Promise<void>
  disconnectWallet: (walletType: WalletType) => void
  switchWallet: (walletType: WalletType) => void
  clearError: () => void

  sendXRPPayment: (amount: number, destination: string, memo?: string) => Promise<string>
  stakeFlare: (amount: number) => Promise<string>
  unstakeFlare: (amount: number) => Promise<string>
  getStakingRewards: () => Promise<number>
}

// Combined context type
type WalletContextType = WalletState & WalletActions

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Initial state
const initialState: WalletState = {
  metamaskAddress: null,
  metamaskBalance: null,
  metamaskConnected: false,
  gemAddress: null,
  gemBalance: null,
  gemConnected: false,
  activeWallet: null,
  connectionStatus: "disconnected",
  error: null,
  isConnected: false,
  xrplWallet: null,
  flareWallet: null,
}

// Wallet Provider Component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(initialState)

  // MetaMask connection
  const connectMetaMask = async () => {
    try {
      setState((prev) => ({ ...prev, connectionStatus: "connecting", error: null }))

      if (!window.ethereum) {
        throw new Error("MetaMask not installed")
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      // Switch to Flare Network (Chain ID: 14)
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xe" }], // 14 in hex
        })
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xe",
                chainName: "Flare Network",
                nativeCurrency: {
                  name: "Flare",
                  symbol: "FLR",
                  decimals: 18,
                },
                rpcUrls: ["https://flare-api.flare.network/ext/C/rpc"],
                blockExplorerUrls: ["https://flare-explorer.flare.network/"],
              },
            ],
          })
        }
      }

      // Get balance
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })

      const balanceInEth = (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)

      setState((prev) => ({
        ...prev,
        metamaskAddress: accounts[0],
        metamaskBalance: balanceInEth,
        metamaskConnected: true,
        activeWallet: "metamask",
        connectionStatus: "connected",
        isConnected: true,
        flareWallet: { address: accounts[0], balance: balanceInEth },
      }))
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        connectionStatus: "error",
        error: error.message || "Failed to connect MetaMask",
      }))
    }
  }

  // Gem Wallet connection
  const connectGemWallet = async () => {
    try {
      setState((prev) => ({ ...prev, connectionStatus: "connecting", error: null }))

      // Check if Gem Wallet is installed
      if (!window.gemWallet) {
        throw new Error("Gem Wallet not installed")
      }

      // Request connection
      const response = await window.gemWallet.request({
        method: "wallet_requestPermissions",
        params: [{ wallet_selection: { network: "XRPL" } }],
      })

      if (!response.result) {
        throw new Error("Connection rejected")
      }

      // Get account info
      const accountInfo = await window.gemWallet.request({
        method: "account_info",
        params: {},
      })

      const xrpBalance = (accountInfo.balance / 1000000).toFixed(2)

      setState((prev) => ({
        ...prev,
        gemAddress: accountInfo.account,
        gemBalance: xrpBalance,
        gemConnected: true,
        activeWallet: "gem",
        connectionStatus: "connected",
        isConnected: true,
        xrplWallet: { address: accountInfo.account, balance: xrpBalance },
      }))
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        connectionStatus: "error",
        error: error.message || "Failed to connect Gem Wallet",
      }))
    }
  }

  const sendXRPPayment = async (amount: number, destination: string, memo?: string): Promise<string> => {
    try {
      if (!window.gemWallet || !state.gemConnected) {
        throw new Error("Gem Wallet not connected")
      }

      const payment = {
        TransactionType: "Payment",
        Account: state.gemAddress,
        Destination: destination,
        Amount: (amount * 1000000).toString(), // Convert XRP to drops
        Fee: "12", // Standard fee in drops
        ...(memo && { Memos: [{ Memo: { MemoData: Buffer.from(memo).toString("hex") } }] }),
      }

      const response = await window.gemWallet.request({
        method: "submit_transaction",
        params: { transaction: payment },
      })

      console.log("[v0] XRPL payment submitted:", response.result.hash)
      return response.result.hash
    } catch (error: any) {
      console.error("[v0] XRPL payment failed:", error)
      throw error
    }
  }

  const stakeFlare = async (amount: number): Promise<string> => {
    try {
      if (!window.ethereum || !state.metamaskConnected) {
        throw new Error("MetaMask not connected")
      }

      // Mock staking contract interaction
      const stakingContractAddress = "0x1234567890123456789012345678901234567890" // Mock address
      const amountInWei = (amount * Math.pow(10, 18)).toString(16)

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: state.metamaskAddress,
            to: stakingContractAddress,
            value: `0x${amountInWei}`,
            data: "0xa694fc3a", // Mock stake() function selector
          },
        ],
      })

      console.log("[v0] Flare staking transaction:", txHash)
      return txHash
    } catch (error: any) {
      console.error("[v0] Flare staking failed:", error)
      throw error
    }
  }

  const unstakeFlare = async (amount: number): Promise<string> => {
    try {
      if (!window.ethereum || !state.metamaskConnected) {
        throw new Error("MetaMask not connected")
      }

      // Mock unstaking contract interaction
      const stakingContractAddress = "0x1234567890123456789012345678901234567890"
      const amountInWei = (amount * Math.pow(10, 18)).toString(16)

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: state.metamaskAddress,
            to: stakingContractAddress,
            data: `0x2e1a7d4d${amountInWei.padStart(64, "0")}`, // Mock withdraw(uint256) function
          },
        ],
      })

      console.log("[v0] Flare unstaking transaction:", txHash)
      return txHash
    } catch (error: any) {
      console.error("[v0] Flare unstaking failed:", error)
      throw error
    }
  }

  const getStakingRewards = async (): Promise<number> => {
    try {
      if (!state.metamaskConnected) {
        return 0
      }

      // Mock rewards calculation - in real app this would query the staking contract
      const mockRewards = Math.random() * 50 + 10 // Random rewards between 10-60 FLR
      console.log("[v0] Fetched staking rewards:", mockRewards)
      return mockRewards
    } catch (error: any) {
      console.error("[v0] Failed to get staking rewards:", error)
      return 0
    }
  }

  // Disconnect wallet
  const disconnectWallet = (walletType: WalletType) => {
    if (walletType === "metamask") {
      setState((prev) => ({
        ...prev,
        metamaskAddress: null,
        metamaskBalance: null,
        metamaskConnected: false,
        flareWallet: null,
        activeWallet: prev.gemConnected ? "gem" : null,
        connectionStatus: prev.gemConnected ? "connected" : "disconnected",
        isConnected: prev.gemConnected,
      }))
    } else if (walletType === "gem") {
      setState((prev) => ({
        ...prev,
        gemAddress: null,
        gemBalance: null,
        gemConnected: false,
        xrplWallet: null,
        activeWallet: prev.metamaskConnected ? "metamask" : null,
        connectionStatus: prev.metamaskConnected ? "connected" : "disconnected",
        isConnected: prev.metamaskConnected,
      }))
    }
  }

  // Switch active wallet
  const switchWallet = (walletType: WalletType) => {
    setState((prev) => ({ ...prev, activeWallet: walletType }))
  }

  // Clear error
  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }))
  }

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet("metamask")
        } else if (state.metamaskConnected) {
          setState((prev) => ({
            ...prev,
            metamaskAddress: accounts[0],
            flareWallet: prev.flareWallet ? { ...prev.flareWallet, address: accounts[0] } : null,
          }))
        }
      }

      const handleChainChanged = () => {
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [state.metamaskConnected])

  const contextValue: WalletContextType = {
    ...state,
    connectMetaMask,
    connectGemWallet,
    disconnectWallet,
    switchWallet,
    clearError,
    sendXRPPayment,
    stakeFlare,
    unstakeFlare,
    getStakingRewards,
  }

  return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>
}

// Hook to use wallet context
export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Type declarations for window objects
declare global {
  interface Window {
    ethereum?: any
    gemWallet?: any
  }
}
