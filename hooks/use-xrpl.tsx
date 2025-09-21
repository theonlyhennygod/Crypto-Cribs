"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  Client,
  Wallet,
  Payment,
  TransactionMetadata,
  dropsToXrp,
  xrpToDrops,
} from "xrpl";

// XRPL testnet configuration
const XRPL_TESTNET_SERVER = "wss://s.altnet.rippletest.net:51233";

interface XRPLTransaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string;
  memo?: string;
  timestamp: number;
  status: "pending" | "validated" | "failed";
}

interface XRPLState {
  isConnected: boolean;
  isConnecting: boolean;
  client: Client | null;
  wallet: Wallet | null;
  address: string | null;
  balance: string | null;
  error: string | null;
  transactions: XRPLTransaction[];
}

interface XRPLActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  createWallet: () => Promise<void>;
  importWallet: (seed: string) => Promise<void>;
  sendPayment: (
    destination: string,
    amount: string,
    memo?: string
  ) => Promise<string>;
  getAccountInfo: () => Promise<void>;
  getTransactionHistory: () => Promise<void>;
  fundWallet: () => Promise<void>;
  verifyTransaction: (txHash: string) => Promise<boolean>;
  clearError: () => void;
}

type XRPLContextType = XRPLState & XRPLActions;

const XRPLContext = createContext<XRPLContextType | undefined>(undefined);

const initialState: XRPLState = {
  isConnected: false,
  isConnecting: false,
  client: null,
  wallet: null,
  address: null,
  balance: null,
  error: null,
  transactions: [],
};

export function XRPLProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<XRPLState>(initialState);

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const connect = async () => {
    try {
      setState((prev) => ({ ...prev, isConnecting: true, error: null }));

      const client = new Client(XRPL_TESTNET_SERVER);
      await client.connect();

      setState((prev) => ({
        ...prev,
        client,
        isConnected: true,
        isConnecting: false,
      }));

      console.log("Connected to XRPL testnet");
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to connect to XRPL testnet",
        isConnecting: false,
      }));
    }
  };

  const disconnect = () => {
    if (state.client) {
      state.client.disconnect();
    }
    setState(initialState);
  };

  const createWallet = async () => {
    try {
      if (!state.client) {
        throw new Error("Not connected to XRPL");
      }

      setState((prev) => ({ ...prev, error: null }));

      // Generate new wallet
      const wallet = Wallet.generate();

      setState((prev) => ({
        ...prev,
        wallet,
        address: wallet.address,
      }));

      // Fund the wallet from testnet faucet
      await fundWallet();

      console.log("Wallet created:", wallet.address);
      console.log("Wallet seed (SAVE THIS!):", wallet.seed);
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to create wallet",
      }));
      throw error;
    }
  };

  const importWallet = async (seed: string) => {
    try {
      if (!state.client) {
        throw new Error("Not connected to XRPL");
      }

      setState((prev) => ({ ...prev, error: null }));

      const wallet = Wallet.fromSeed(seed);

      setState((prev) => ({
        ...prev,
        wallet,
        address: wallet.address,
      }));

      await getAccountInfo();

      console.log("Wallet imported:", wallet.address);
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to import wallet",
      }));
      throw error;
    }
  };

  const fundWallet = async () => {
    try {
      if (!state.client || !state.wallet) {
        throw new Error("Wallet not available");
      }

      const response = await state.client.fundWallet(state.wallet);

      setState((prev) => ({
        ...prev,
        balance: dropsToXrp(response.balance),
      }));

      console.log("Wallet funded with 1000 XRP from testnet faucet");
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to fund wallet",
      }));
      throw error;
    }
  };

  const getAccountInfo = async () => {
    try {
      if (!state.client || !state.address) {
        throw new Error("Wallet not connected");
      }

      const response = await state.client.request({
        command: "account_info",
        account: state.address,
        ledger_index: "validated",
      });

      const balance = dropsToXrp(response.result.account_data.Balance);

      setState((prev) => ({
        ...prev,
        balance,
      }));

      return response.result.account_data;
    } catch (error: any) {
      // Account might not exist yet
      setState((prev) => ({
        ...prev,
        balance: "0",
      }));
      return null;
    }
  };

  const sendPayment = async (
    destination: string,
    amount: string,
    memo?: string
  ): Promise<string> => {
    try {
      if (!state.client || !state.wallet) {
        throw new Error("Wallet not connected");
      }

      setState((prev) => ({ ...prev, error: null }));

      // Prepare payment transaction
      const payment: Payment = {
        TransactionType: "Payment",
        Account: state.wallet.address,
        Destination: destination,
        Amount: xrpToDrops(amount),
      };

      // Add memo if provided
      if (memo) {
        payment.Memos = [
          {
            Memo: {
              MemoData: Buffer.from(memo, "utf8").toString("hex").toUpperCase(),
            },
          },
        ];
      }

      // Submit and wait for validation
      const response = await state.client.submitAndWait(payment, {
        wallet: state.wallet,
      });

      // Add transaction to local state
      const transaction: XRPLTransaction = {
        id: `${response.result.hash}-${Date.now()}`,
        hash: response.result.hash,
        from: state.wallet.address,
        to: destination,
        amount,
        memo,
        timestamp: Date.now(),
        status: response.result.meta ? "validated" : "pending",
      };

      setState((prev) => ({
        ...prev,
        transactions: [transaction, ...prev.transactions],
      }));

      // Update balance
      await getAccountInfo();

      console.log("Payment sent:", response.result.hash);
      return response.result.hash;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to send payment",
      }));
      throw error;
    }
  };

  const getTransactionHistory = async () => {
    try {
      if (!state.client || !state.address) {
        throw new Error("Wallet not connected");
      }

      const response = await state.client.request({
        command: "account_tx",
        account: state.address,
        ledger_index_min: -1,
        ledger_index_max: -1,
        limit: 50,
      });

      const transactions: XRPLTransaction[] = response.result.transactions
        .filter((tx: any) => tx.tx.TransactionType === "Payment")
        .map((tx: any, index: number) => {
          const isOutgoing = tx.tx.Account === state.address;
          const amount =
            typeof tx.tx.Amount === "string"
              ? dropsToXrp(tx.tx.Amount)
              : tx.tx.Amount.value;

          return {
            id: `${tx.tx.hash}-${index}`,
            hash: tx.tx.hash,
            from: tx.tx.Account,
            to: isOutgoing ? tx.tx.Destination : state.address!,
            amount,
            memo: tx.tx.Memos?.[0]?.Memo?.MemoData
              ? Buffer.from(tx.tx.Memos[0].Memo.MemoData, "hex").toString(
                  "utf8"
                )
              : undefined,
            timestamp: (tx.tx.date || 0) * 1000,
            status:
              (tx.meta && typeof tx.meta === 'object' && 'TransactionResult' in tx.meta && tx.meta.TransactionResult === "tesSUCCESS")
                ? "validated"
                : "failed",
          };
        });

      setState((prev) => ({
        ...prev,
        transactions,
      }));

      return transactions;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to get transaction history",
      }));
      return [];
    }
  };

  const verifyTransaction = async (txHash: string): Promise<boolean> => {
    try {
      if (!state.client) {
        throw new Error("Not connected to XRPL");
      }

      const response = await state.client.request({
        command: "tx",
        transaction: txHash,
      });

      return (
        response.result.validated === true &&
        response.result.meta?.TransactionResult === "tesSUCCESS"
      );
    } catch (error: any) {
      console.error("Transaction verification failed:", error);
      return false;
    }
  };

  // Auto-connect on mount
  useEffect(() => {
    connect();

    return () => {
      if (state.client) {
        state.client.disconnect();
      }
    };
  }, []);

  // Update balance periodically when connected
  useEffect(() => {
    if (state.isConnected && state.address) {
      const interval = setInterval(() => {
        getAccountInfo();
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [state.isConnected, state.address]);

  const contextValue: XRPLContextType = {
    ...state,
    connect,
    disconnect,
    createWallet,
    importWallet,
    sendPayment,
    getAccountInfo,
    getTransactionHistory,
    fundWallet,
    verifyTransaction,
    clearError,
  };

  return (
    <XRPLContext.Provider value={contextValue}>{children}</XRPLContext.Provider>
  );
}

export function useXRPL() {
  const context = useContext(XRPLContext);
  if (context === undefined) {
    throw new Error("useXRPL must be used within a XRPLProvider");
  }
  return context;
}
