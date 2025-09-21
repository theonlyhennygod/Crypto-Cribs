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
  const [detectedProviders, setDetectedProviders] = useState<Map<string, EIP6963ProviderDetail>>(new Map())

  // EIP-6963 wallet detection
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleAnnounceProvider = (event: EIP6963AnnounceProviderEvent) => {
      setDetectedProviders(prev => new Map(prev).set(event.detail.info.uuid, event.detail))
    }

    window.addEventListener("eip6963:announceProvider", handleAnnounceProvider)
    window.dispatchEvent(new Event("eip6963:requestProvider"))

    return () => {
      window.removeEventListener("eip6963:announceProvider", handleAnnounceProvider)
    }
  }, [])

  // MetaMask connection using EIP-6963
  const connectMetaMask = async () => {
    try {
      setState((prev) => ({ ...prev, connectionStatus: "connecting", error: null }))

      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        throw new Error("Not in browser environment")
      }

      // Try to find MetaMask provider using EIP-6963
      let provider: EIP1193Provider | undefined
      
      // Look for MetaMask in detected providers first
      for (const [uuid, providerDetail] of detectedProviders) {
        if (providerDetail.info.name.toLowerCase().includes('metamask')) {
          provider = providerDetail.provider
          break
        }
      }

      // Fallback to window.ethereum if EIP-6963 detection didn't work
      if (!provider && window.ethereum) {
        provider = window.ethereum
      }

      if (!provider) {
        throw new Error("MetaMask not detected. Please install MetaMask browser extension.")
      }

      // Check if provider is ready
      if (!provider.request) {
        throw new Error("MetaMask provider not ready. Please refresh and try again.")
      }

      // Add timeout to prevent hanging
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Connection timeout - please try again")), 15000)
      )

      // Request account access with proper error handling
      const accountsPromise = provider.request({
        method: "eth_requestAccounts",
      }).catch((error: any) => {
        console.error("MetaMask connection error:", error)
        if (error.code === 4001) {
          throw new Error("Connection rejected by user")
        } else if (error.code === -32002) {
          throw new Error("MetaMask is already processing a request. Please check MetaMask.")
        } else if (error.code === -32603) {
          throw new Error("MetaMask internal error. Please close and reopen MetaMask, then try again.")
        } else if (error.message && error.message.includes("User rejected")) {
          throw new Error("Connection rejected by user")
        }
        throw new Error(`MetaMask error: ${error.message || "Unknown error"}`)
      })

      const accounts = await Promise.race([accountsPromise, timeout]) as string[]

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found - please unlock MetaMask")
      }

      // Switch to Flare Network (Chain ID: 14)
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xe" }], // 14 in hex
        })
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await provider.request({
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

      // Get balance with timeout and error handling
      const balancePromise = provider.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      }).catch((error: any) => {
        if (error.code === -32603) {
          throw new Error("Failed to get balance. Please refresh and try again.")
        }
        throw error
      })

      const balance = await Promise.race([balancePromise, timeout])
      const balanceInEth = balance ? (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4) : "0.0000"

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

      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        throw new Error("Not in browser environment")
      }

      // Check if Gem Wallet is installed
      if (!window.gemWallet) {
        throw new Error("Gem Wallet not installed. Please install the Gem Wallet browser extension.")
      }

      // Check if gem wallet provider is ready
      if (!window.gemWallet.request) {
        throw new Error("Gem Wallet provider not ready. Please refresh and try again.")
      }

      // Add timeout to prevent hanging
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Connection timeout - please try again")), 15000)
      )

      // Request connection with timeout and error handling
      const responsePromise = window.gemWallet.request({
        method: "wallet_requestPermissions",
        params: [{ wallet_selection: { network: "XRPL" } }],
      }).catch((error: any) => {
        console.error("Gem Wallet connection error:", error)
        if (error.code === 4001) {
          throw new Error("Connection rejected by user")
        } else if (error.code === -32002) {
          throw new Error("Gem Wallet is already processing a request. Please check Gem Wallet.")
        } else if (error.code === -32603) {
          throw new Error("Gem Wallet internal error. Please close and reopen Gem Wallet, then try again.")
        } else if (error.message && error.message.includes("User rejected")) {
          throw new Error("Connection rejected by user")
        }
        throw new Error(`Gem Wallet error: ${error.message || "Unknown error"}`)
      })

      const response = await Promise.race([responsePromise, timeout])

      if (!response || !response.result) {
        throw new Error("Connection rejected or failed")
      }

      // Get account info with timeout and error handling
      const accountInfoPromise = window.gemWallet.request({
        method: "account_info",
        params: {},
      }).catch((error: any) => {
        if (error.code === -32603) {
          throw new Error("Failed to get account info. Please refresh and try again.")
        }
        throw error
      })

      const accountInfo = await Promise.race([accountInfoPromise, timeout])

      if (!accountInfo || !accountInfo.account) {
        throw new Error("Failed to get account information")
      }

      const xrpBalance = accountInfo.balance ? (accountInfo.balance / 1000000).toFixed(2) : "0.00"

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

  // Reset connection state
  const resetConnection = () => {
    setState((prev) => ({
      ...prev,
      connectionStatus: "disconnected",
      error: null,
    }))
  }

  // Connection timeout reset
  useEffect(() => {
    if (state.connectionStatus === "connecting") {
      const timeout = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          connectionStatus: "error",
          error: "Connection timeout - please try again"
        }))
      }, 30000) // 30 second timeout

      return () => clearTimeout(timeout)
    }
  }, [state.connectionStatus])

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum && window.ethereum.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        try {
          if (accounts.length === 0) {
            disconnectWallet("metamask")
          } else if (state.metamaskConnected) {
            setState((prev) => ({
              ...prev,
              metamaskAddress: accounts[0],
              flareWallet: prev.flareWallet ? { ...prev.flareWallet, address: accounts[0] } : null,
            }))
          }
        } catch (error) {
          console.error("Error handling account change:", error)
        }
      }

      const handleChainChanged = () => {
        try {
          window.location.reload()
        } catch (error) {
          console.error("Error handling chain change:", error)
        }
      }

      const handleDisconnect = () => {
        try {
          disconnectWallet("metamask")
        } catch (error) {
          console.error("Error handling disconnect:", error)
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
      window.ethereum.on("disconnect", handleDisconnect)

      return () => {
        try {
          if (window.ethereum && window.ethereum.removeListener) {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
            window.ethereum.removeListener("chainChanged", handleChainChanged)
            window.ethereum.removeListener("disconnect", handleDisconnect)
          }
        } catch (error) {
          console.error("Error removing event listeners:", error)
        }
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

// EIP-6963 interfaces for proper wallet detection
interface EIP6963ProviderInfo {
  rdns: string
  uuid: string
  name: string
  icon: string
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  provider: EIP1193Provider
}

type EIP6963AnnounceProviderEvent = {
  detail: {
    info: EIP6963ProviderInfo
    provider: Readonly<EIP1193Provider>
  }
}

interface EIP1193Provider {
  isStatus?: boolean
  host?: string
  path?: string
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void
  request: (request: { method: string; params?: Array<unknown> }) => Promise<unknown>
}

// Type declarations for window objects
declare global {
  interface Window {
    ethereum?: EIP1193Provider
    gemWallet?: any
  }
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent
  }
}
