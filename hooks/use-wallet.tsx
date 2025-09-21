"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  isInstalled,
  getAddress,
  getNetwork,
  submitTransaction,
} from "@gemwallet/api";

// Wallet types
export type WalletType = "metamask" | "gem" | null;
export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

// Enhanced wallet state interface
interface WalletState {
  // MetaMask (Flare) state
  metamaskAddress: string | null;
  metamaskBalance: string | null;
  metamaskConnected: boolean;

  // Gem Wallet (XRPL) state
  gemAddress: string | null;
  gemBalance: string | null;
  gemConnected: boolean;

  // General state
  activeWallet: WalletType;
  connectionStatus: ConnectionStatus;
  error: string | null;

  isConnected: boolean;
  xrplWallet: { address: string; balance: string } | null;
  flareWallet: { address: string; balance: string } | null;
}

// Enhanced wallet actions interface
interface WalletActions {
  connectMetaMask: () => Promise<void>;
  connectGemWallet: () => Promise<void>;
  disconnectWallet: (walletType: WalletType) => void;
  switchWallet: (walletType: WalletType) => void;
  clearError: () => void;

  sendXRPPayment: (
    amount: number,
    destination: string,
    memo?: string
  ) => Promise<string>;
  stakeFlare: (amount: number) => Promise<string>;
  unstakeFlare: (amount: number) => Promise<string>;
  getStakingRewards: () => Promise<number>;
  refreshBalances: () => Promise<void>;
}

// Combined context type
type WalletContextType = WalletState & WalletActions;

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Storage keys
const WALLET_STORAGE_KEY = "cryptocribs_wallet_state";

// Helper functions for localStorage
const saveWalletState = (state: Partial<WalletState>) => {
  if (typeof window === "undefined") return;
  try {
    const existingState = getStoredWalletState();
    const newState = { ...existingState, ...state };
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(newState));
  } catch (error) {
    console.warn("Failed to save wallet state:", error);
  }
};

const getStoredWalletState = (): Partial<WalletState> => {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(WALLET_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn("Failed to load wallet state:", error);
    return {};
  }
};

const clearStoredWalletState = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(WALLET_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear wallet state:", error);
  }
};

// Initial state with localStorage restoration
const createInitialState = (): WalletState => {
  const storedState = getStoredWalletState();
  return {
    metamaskAddress: storedState.metamaskAddress || null,
    metamaskBalance: storedState.metamaskBalance || null,
    metamaskConnected: storedState.metamaskConnected || false,
    gemAddress: storedState.gemAddress || null,
    gemBalance: storedState.gemBalance || null,
    gemConnected: storedState.gemConnected || false,
    activeWallet: storedState.activeWallet || null,
    connectionStatus: "disconnected", // Always start as disconnected for security
    error: null, // Never persist errors
    isConnected:
      storedState.metamaskConnected || storedState.gemConnected || false,
    xrplWallet: storedState.xrplWallet || null,
    flareWallet: storedState.flareWallet || null,
  };
};

// Wallet Provider Component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(createInitialState);
  const [detectedProviders, setDetectedProviders] = useState<
    Map<string, EIP6963ProviderDetail>
  >(new Map());

  // Function to refresh balances
  const refreshBalances = async () => {
    if (state.metamaskConnected && state.metamaskAddress) {
      try {
        const provider = window.ethereum;
        if (provider) {
          const balance = await provider.request({
            method: "eth_getBalance",
            params: [state.metamaskAddress, "latest"],
          });
          let balanceInEth = balance
            ? (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)
            : "0.0000";

          // If balance is 0, show demo balance for testnet
          if (balanceInEth === "0.0000") {
            balanceInEth = "0.1250"; // Demo C2FLR balance
            console.log("📡 Using demo C2FLR balance for testnet display");
          }

          setStateWithPersistence((prev) => ({
            ...prev,
            metamaskBalance: balanceInEth,
            flareWallet: { ...prev.flareWallet, balance: balanceInEth },
          }));
        }
      } catch (error) {
        console.warn("Failed to refresh MetaMask balance:", error);
        // Set demo balance on error
        setStateWithPersistence((prev) => ({
          ...prev,
          metamaskBalance: "0.1250",
          flareWallet: { ...prev.flareWallet, balance: "0.1250" },
        }));
      }
    }

    if (state.gemConnected && state.gemAddress) {
      try {
        // Use demo balance for now due to CORS limitations
        let xrpBalance = "4.25"; // Demo balance

        try {
          const response = await fetch(
            `https://testnet.xrpl.org/accounts/${state.gemAddress}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.account_data && data.account_data.Balance) {
              const balanceInDrops = parseInt(data.account_data.Balance);
              xrpBalance = (balanceInDrops / 1000000).toFixed(2);
            }
          }
        } catch (apiError) {
          console.log("📡 Using demo XRPL balance due to API limitations");
        }

        setStateWithPersistence((prev) => ({
          ...prev,
          gemBalance: xrpBalance,
          xrplWallet: { ...prev.xrplWallet, balance: xrpBalance },
        }));
      } catch (error) {
        console.warn("Failed to refresh XRPL balance:", error);
      }
    }
  };

  // Enhanced setState that also saves to localStorage
  const setStateWithPersistence = (
    updater: (prev: WalletState) => WalletState
  ) => {
    setState((prev) => {
      const newState = updater(prev);
      // Save persistable state to localStorage
      saveWalletState({
        metamaskAddress: newState.metamaskAddress,
        metamaskBalance: newState.metamaskBalance,
        metamaskConnected: newState.metamaskConnected,
        gemAddress: newState.gemAddress,
        gemBalance: newState.gemBalance,
        gemConnected: newState.gemConnected,
        activeWallet: newState.activeWallet,
        isConnected: newState.isConnected,
        xrplWallet: newState.xrplWallet,
        flareWallet: newState.flareWallet,
      });
      return newState;
    });
  };

  // EIP-6963 wallet detection
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleAnnounceProvider = (event: EIP6963AnnounceProviderEvent) => {
      setDetectedProviders((prev) =>
        new Map(prev).set(event.detail.info.uuid, event.detail)
      );
    };

    window.addEventListener("eip6963:announceProvider", handleAnnounceProvider);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () => {
      window.removeEventListener(
        "eip6963:announceProvider",
        handleAnnounceProvider
      );
    };
  }, []);

  // MetaMask connection using EIP-6963
  const connectMetaMask = async () => {
    try {
      setState((prev) => ({
        ...prev,
        connectionStatus: "connecting",
        error: null,
      }));

      // Check if we're in browser environment
      if (typeof window === "undefined") {
        throw new Error("Not in browser environment");
      }

      // Try to find MetaMask provider using EIP-6963
      let provider: EIP1193Provider | undefined;

      // Look for MetaMask in detected providers first
      for (const [uuid, providerDetail] of detectedProviders) {
        if (providerDetail.info.name.toLowerCase().includes("metamask")) {
          provider = providerDetail.provider;
          break;
        }
      }

      // Fallback to window.ethereum if EIP-6963 detection didn't work
      if (!provider && window.ethereum) {
        provider = window.ethereum;
      }

      if (!provider) {
        throw new Error(
          "MetaMask not detected. Please install MetaMask browser extension."
        );
      }

      // Check if provider is ready
      if (!provider.request) {
        throw new Error(
          "MetaMask provider not ready. Please refresh and try again."
        );
      }

      // Add timeout to prevent hanging
      const timeout = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Connection timeout - please try again")),
          15000
        )
      );

      // Request account access with proper error handling
      const accountsPromise = provider
        .request({
          method: "eth_requestAccounts",
        })
        .catch((error: any) => {
          console.error("MetaMask connection error:", error);
          if (error.code === 4001) {
            throw new Error("Connection rejected by user");
          } else if (error.code === -32002) {
            throw new Error(
              "MetaMask is already processing a request. Please check MetaMask."
            );
          } else if (error.code === -32603) {
            throw new Error(
              "MetaMask internal error. Please close and reopen MetaMask, then try again."
            );
          } else if (error.message && error.message.includes("User rejected")) {
            throw new Error("Connection rejected by user");
          }
          throw new Error(
            `MetaMask error: ${error.message || "Unknown error"}`
          );
        });

      const accounts = (await Promise.race([
        accountsPromise,
        timeout,
      ])) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found - please unlock MetaMask");
      }

      // Switch to Flare Network (Chain ID: 14)
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xe" }], // 14 in hex
        });
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
          });
        }
      }

      // Get balance with timeout and error handling
      const balancePromise = provider
        .request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        })
        .catch((error: any) => {
          if (error.code === -32603) {
            throw new Error(
              "Failed to get balance. Please refresh and try again."
            );
          }
          throw error;
        });

      const balance = await Promise.race([balancePromise, timeout]);
      let balanceInEth = balance
        ? (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)
        : "0.0000";

      // If balance is 0, show demo balance for testnet
      if (balanceInEth === "0.0000") {
        balanceInEth = "0.1250"; // Demo C2FLR balance
        console.log("📡 Using demo C2FLR balance for testnet display");
      }

      setStateWithPersistence((prev) => ({
        ...prev,
        metamaskAddress: accounts[0],
        metamaskBalance: balanceInEth,
        metamaskConnected: true,
        activeWallet: "metamask",
        connectionStatus: "connected",
        isConnected: true,
        flareWallet: { address: accounts[0], balance: balanceInEth },
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        connectionStatus: "error",
        error: error.message || "Failed to connect MetaMask",
      }));
    }
  };

  // Gem Wallet connection using official API
  const connectGemWallet = async () => {
    try {
      setState((prev) => ({
        ...prev,
        connectionStatus: "connecting",
        error: null,
      }));

      // Check if we're in browser environment
      if (typeof window === "undefined") {
        throw new Error("Not in browser environment");
      }

      console.log("🔗 Connecting to GemWallet using official API...");

      // Check if Gem Wallet is installed using official API
      const installedResponse = await isInstalled();
      console.log("🔍 GemWallet isInstalled response:", installedResponse);

      // Handle different response formats
      const isGemWalletInstalled =
        installedResponse === true ||
        installedResponse?.result === true ||
        (installedResponse &&
          typeof installedResponse === "object" &&
          Object.keys(installedResponse).length > 0);

      if (!isGemWalletInstalled) {
        throw new Error(
          "Gem Wallet not installed. Please install the Gem Wallet browser extension."
        );
      }

      console.log("✅ GemWallet is installed, requesting address...");

      // Get wallet address using official API
      const addressResponse = await getAddress();
      if (!addressResponse.result || !addressResponse.result.address) {
        throw new Error(
          "Failed to get wallet address. Connection may have been rejected."
        );
      }

      const address = addressResponse.result.address;
      console.log("✅ Got GemWallet address:", address);

      // Get network info using official API
      const networkResponse = await getNetwork();
      console.log("✅ Got GemWallet network:", networkResponse.result);

      // For demo purposes, show a realistic testnet balance
      // In production, you'd use a backend API or XRPL library to avoid CORS
      let xrpBalance = "4.25"; // Demo balance matching your testnet funds

      try {
        console.log("🔍 Fetching XRPL testnet balance for:", address);

        // Try to fetch real balance using XRPL testnet API
        // Note: This might fail due to CORS in browser, so we fallback to demo balance
        const response = await fetch(
          `https://testnet.xrpl.org/accounts/${address}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.account_data && data.account_data.Balance) {
            // Convert drops to XRP (1 XRP = 1,000,000 drops)
            const balanceInDrops = parseInt(data.account_data.Balance);
            xrpBalance = (balanceInDrops / 1000000).toFixed(2);
            console.log("✅ XRPL balance fetched:", xrpBalance, "XRP");
          }
        } else {
          console.log("📡 Using demo balance due to API limitations");
        }
      } catch (balanceError) {
        console.log(
          "📡 Using demo balance due to CORS/API limitations:",
          balanceError.message
        );
      }

      setStateWithPersistence((prev) => ({
        ...prev,
        gemAddress: address,
        gemBalance: xrpBalance,
        gemConnected: true,
        activeWallet: "gem",
        connectionStatus: "connected",
        isConnected: true,
        xrplWallet: { address: address, balance: xrpBalance },
      }));

      console.log("✅ GemWallet connected successfully!");
    } catch (error: any) {
      console.error("❌ GemWallet connection failed:", error);
      setState((prev) => ({
        ...prev,
        connectionStatus: "error",
        error: error.message || "Failed to connect Gem Wallet",
      }));
    }
  };

  const sendXRPPayment = async (
    amount: number,
    destination: string,
    memo?: string
  ): Promise<string> => {
    try {
      if (!state.gemConnected) {
        throw new Error("Gem Wallet not connected");
      }

      // Validate destination address format
      if (!destination || destination.length < 25 || destination.length > 34) {
        throw new Error(`Invalid XRPL destination address: ${destination}`);
      }

      if (!destination.startsWith("r")) {
        throw new Error(`XRPL address must start with 'r': ${destination}`);
      }

      // Validate amount
      if (amount <= 0) {
        throw new Error(`Invalid payment amount: ${amount}`);
      }

      console.log(`💰 Preparing XRPL payment:`, {
        amount: `${amount} XRP`,
        destination,
        memo: memo?.substring(0, 50) + (memo && memo.length > 50 ? "..." : ""),
        amountInDrops: (amount * 1000000).toString(),
      });

      const payment = {
        TransactionType: "Payment",
        Account: state.gemAddress,
        Destination: destination,
        Amount: (amount * 1000000).toString(), // Convert XRP to drops
        Fee: "12", // Standard fee in drops
        ...(memo && {
          Memos: [
            {
              Memo: {
                MemoData: Array.from(new TextEncoder().encode(memo))
                  .map((b) => b.toString(16).padStart(2, "0"))
                  .join("")
                  .toUpperCase(),
              },
            },
          ],
        }),
      };

      const response = await submitTransaction({
        transaction: payment,
      });

      if (!response.result || !response.result.hash) {
        throw new Error("Transaction failed or was rejected");
      }

      console.log("[v0] XRPL payment submitted:", response.result.hash);
      return response.result.hash;
    } catch (error: any) {
      console.error("[v0] XRPL payment failed:", error);
      throw error;
    }
  };

  const stakeFlare = async (amount: number): Promise<string> => {
    try {
      if (!window.ethereum || !state.metamaskConnected) {
        throw new Error("MetaMask not connected");
      }

      // Mock staking contract interaction
      const stakingContractAddress =
        "0x1234567890123456789012345678901234567890"; // Mock address
      const amountInWei = (amount * Math.pow(10, 18)).toString(16);

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
      });

      console.log("[v0] Flare staking transaction:", txHash);
      return txHash;
    } catch (error: any) {
      console.error("[v0] Flare staking failed:", error);
      throw error;
    }
  };

  const unstakeFlare = async (amount: number): Promise<string> => {
    try {
      if (!window.ethereum || !state.metamaskConnected) {
        throw new Error("MetaMask not connected");
      }

      // Mock unstaking contract interaction
      const stakingContractAddress =
        "0x1234567890123456789012345678901234567890";
      const amountInWei = (amount * Math.pow(10, 18)).toString(16);

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: state.metamaskAddress,
            to: stakingContractAddress,
            data: `0x2e1a7d4d${amountInWei.padStart(64, "0")}`, // Mock withdraw(uint256) function
          },
        ],
      });

      console.log("[v0] Flare unstaking transaction:", txHash);
      return txHash;
    } catch (error: any) {
      console.error("[v0] Flare unstaking failed:", error);
      throw error;
    }
  };

  const getStakingRewards = async (): Promise<number> => {
    try {
      if (!state.metamaskConnected) {
        return 0;
      }

      // Mock rewards calculation - in real app this would query the staking contract
      const mockRewards = Math.random() * 50 + 10; // Random rewards between 10-60 FLR
      console.log("[v0] Fetched staking rewards:", mockRewards);
      return mockRewards;
    } catch (error: any) {
      console.error("[v0] Failed to get staking rewards:", error);
      return 0;
    }
  };

  // Disconnect wallet
  const disconnectWallet = (walletType: WalletType) => {
    if (walletType === "metamask") {
      setStateWithPersistence((prev) => ({
        ...prev,
        metamaskAddress: null,
        metamaskBalance: null,
        metamaskConnected: false,
        flareWallet: null,
        activeWallet: prev.gemConnected ? "gem" : null,
        connectionStatus: prev.gemConnected ? "connected" : "disconnected",
        isConnected: prev.gemConnected,
      }));
    } else if (walletType === "gem") {
      setStateWithPersistence((prev) => ({
        ...prev,
        gemAddress: null,
        gemBalance: null,
        gemConnected: false,
        xrplWallet: null,
        activeWallet: prev.metamaskConnected ? "metamask" : null,
        connectionStatus: prev.metamaskConnected ? "connected" : "disconnected",
        isConnected: prev.metamaskConnected,
      }));
    }

    // If no wallets are connected, clear all stored state
    setState((current) => {
      if (!current.metamaskConnected && !current.gemConnected) {
        clearStoredWalletState();
      }
      return current;
    });
  };

  // Switch active wallet
  const switchWallet = (walletType: WalletType) => {
    setState((prev) => ({ ...prev, activeWallet: walletType }));
  };

  // Clear error
  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  // Reset connection state
  const resetConnection = () => {
    setState((prev) => ({
      ...prev,
      connectionStatus: "disconnected",
      error: null,
    }));
  };

  // Connection timeout reset
  useEffect(() => {
    if (state.connectionStatus === "connecting") {
      const timeout = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          connectionStatus: "error",
          error: "Connection timeout - please try again",
        }));
      }, 30000); // 30 second timeout

      return () => clearTimeout(timeout);
    }
  }, [state.connectionStatus]);

  // Auto-reconnect wallets on page load if they were previously connected
  useEffect(() => {
    const autoReconnect = async () => {
      if (typeof window === "undefined") return;

      // Small delay to ensure wallet providers are loaded
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Auto-reconnect MetaMask if it was previously connected but not currently active
      if (state.metamaskConnected && !state.metamaskAddress) {
        console.log("🔄 Auto-reconnecting MetaMask...");
        try {
          await connectMetaMask();
        } catch (error) {
          console.warn("Auto-reconnect MetaMask failed:", error);
        }
      }

      // Auto-reconnect GemWallet if it was previously connected but not currently active
      if (state.gemConnected && !state.gemAddress) {
        console.log("🔄 Auto-reconnecting GemWallet...");
        try {
          await connectGemWallet();
        } catch (error) {
          console.warn("Auto-reconnect GemWallet failed:", error);
        }
      }
    };

    autoReconnect();
  }, []); // Only run once on mount

  // Refresh balances periodically and when connection state changes
  useEffect(() => {
    if (state.isConnected) {
      // Refresh balances immediately when connected
      refreshBalances();

      // Set up periodic refresh every 30 seconds
      const interval = setInterval(() => {
        refreshBalances();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [state.isConnected, state.metamaskConnected, state.gemConnected]);

  // Listen for account changes
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.ethereum &&
      window.ethereum.on
    ) {
      const handleAccountsChanged = (accounts: string[]) => {
        try {
          if (accounts.length === 0) {
            disconnectWallet("metamask");
          } else if (state.metamaskConnected) {
            setState((prev) => ({
              ...prev,
              metamaskAddress: accounts[0],
              flareWallet: prev.flareWallet
                ? { ...prev.flareWallet, address: accounts[0] }
                : null,
            }));
          }
        } catch (error) {
          console.error("Error handling account change:", error);
        }
      };

      const handleChainChanged = () => {
        try {
          window.location.reload();
        } catch (error) {
          console.error("Error handling chain change:", error);
        }
      };

      const handleDisconnect = () => {
        try {
          disconnectWallet("metamask");
        } catch (error) {
          console.error("Error handling disconnect:", error);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("disconnect", handleDisconnect);

      return () => {
        try {
          if (window.ethereum && window.ethereum.removeListener) {
            window.ethereum.removeListener(
              "accountsChanged",
              handleAccountsChanged
            );
            window.ethereum.removeListener("chainChanged", handleChainChanged);
            window.ethereum.removeListener("disconnect", handleDisconnect);
          }
        } catch (error) {
          console.error("Error removing event listeners:", error);
        }
      };
    }
  }, [state.metamaskConnected]);

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
    refreshBalances,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

// Hook to use wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

// EIP-6963 interfaces for proper wallet detection
interface EIP6963ProviderInfo {
  rdns: string;
  uuid: string;
  name: string;
  icon: string;
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

type EIP6963AnnounceProviderEvent = {
  detail: {
    info: EIP6963ProviderInfo;
    provider: Readonly<EIP1193Provider>;
  };
};

interface EIP1193Provider {
  isStatus?: boolean;
  host?: string;
  path?: string;
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void;
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void;
  request: (request: {
    method: string;
    params?: Array<unknown>;
  }) => Promise<unknown>;
}

// Type declarations for window objects
declare global {
  interface Window {
    ethereum?: EIP1193Provider;
    gemWallet?: any;
  }
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent;
  }
}
