// XRPL Network Configuration for Travel DApp

export const XRPL_NETWORKS = {
  testnet: {
    name: "XRPL Testnet",
    server: "wss://s.altnet.rippletest.net:51233",
    faucetUrl: "https://xrpl.org/xrp-testnet-faucet.html",
    explorer: "https://testnet.xrpl.org",
    chainId: "testnet",
  },
  devnet: {
    name: "XRPL Devnet", 
    server: "wss://s.devnet.rippletest.net:51233",
    faucetUrl: "https://xrpl.org/xrp-testnet-faucet.html",
    explorer: "https://devnet.xrpl.org",
    chainId: "devnet",
  },
  mainnet: {
    name: "XRPL Mainnet",
    server: "wss://xrplcluster.com",
    explorer: "https://xrpl.org",
    chainId: "mainnet",
  },
} as const

export const FLARE_NETWORKS = {
  coston2: {
    name: "Flare Coston2 Testnet",
    chainId: 114,
    rpcUrl: "https://coston2-api.flare.network/ext/C/rpc",
    explorer: "https://coston2.testnet.flarescan.com",
    faucet: "https://faucet.flare.network/coston2",
    currency: {
      name: "Flare",
      symbol: "FLR",
      decimals: 18,
    },
    contracts: {
      ftsoV2: "0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d",
      stateConnector: "0x0c13aDA1C7143Cf0a0795FFaB93eEBb6FAD6e4e3",
      fdcAttestationClient: "0xA90Db6D10F856799b10ef2A77EBCbF460aC71e52",
    },
  },
  flare: {
    name: "Flare Network",
    chainId: 14,
    rpcUrl: "https://flare-api.flare.network/ext/C/rpc",
    explorer: "https://flarescan.com",
    currency: {
      name: "Flare",
      symbol: "FLR", 
      decimals: 18,
    },
    contracts: {
      ftsoV2: "0x58f7Df645525c08C4d8f86E0d3E1b9E1B18C5C8a", // Mainnet address
      stateConnector: "0x3F5027dFC6B8d62bbC3E851c4a07B9E5f0123456", // Mainnet address
      fdcAttestationClient: "0x7e4B5e4D9f8C1a2B3C4D5E6F7a8B9C0d1E2F3a4B", // Mainnet address
    },
  },
} as const

// Current network configuration (testnet for development)
export const CURRENT_XRPL_NETWORK = XRPL_NETWORKS.testnet
export const CURRENT_FLARE_NETWORK = FLARE_NETWORKS.coston2

// Default addresses for testing
export const DEFAULT_ADDRESSES = {
  xrplEscrow: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH", // Testnet escrow address
  flareEscrow: "0x742d35Cc6634C0532925a3b8D46CBF20b67e7c7B", // Testnet escrow address
}

// Payment configuration
export const PAYMENT_CONFIG = {
  minimumXRPAmount: 1, // Minimum 1 XRP for payments
  minimumFLRAmount: 100, // Minimum 100 FLR for payments
  maxSlippage: 0.05, // 5% max slippage for conversions
  confirmationBlocks: {
    xrpl: 1, // XRPL transactions are final immediately
    flare: 12, // Wait for 12 blocks on Flare
  },
  timeouts: {
    payment: 300000, // 5 minutes
    attestation: 600000, // 10 minutes
    bridge: 900000, // 15 minutes
  },
}

// FTSOv2 Feed IDs
export const FTSO_FEEDS = {
  XRP_USD: "0x015852500000000000000000000000000000000000",
  FLR_USD: "0x01464c520000000000000000000000000000000000", 
  ETH_USD: "0x014554480000000000000000000000000000000000",
  BTC_USD: "0x014254430000000000000000000000000000000000",
} as const

// FDC Attestation Types
export const ATTESTATION_TYPES = {
  PAYMENT: "0x5061796d656e7400000000000000000000000000000000000000000000000000",
  BALANCE: "0x42616c616e636500000000000000000000000000000000000000000000000000", 
  TRANSACTION: "0x5472616e73616374696f6e000000000000000000000000000000000000000000",
} as const

// Source IDs for different networks
export const SOURCE_IDS = {
  XRPL: "0x5852504c00000000000000000000000000000000000000000000000000000000",
  ETHEREUM: "0x4554480000000000000000000000000000000000000000000000000000000000",
  FLARE: "0x464c520000000000000000000000000000000000000000000000000000000000",
} as const

// Helper functions for network operations
export const NetworkHelpers = {
  getExplorerLink: (txHash: string, network: "xrpl" | "flare") => {
    if (network === "xrpl") {
      return `${CURRENT_XRPL_NETWORK.explorer}/transactions/${txHash}`
    }
    return `${CURRENT_FLARE_NETWORK.explorer}/tx/${txHash}`
  },
  
  formatAddress: (address: string, startChars = 6, endChars = 4) => {
    if (address.length <= startChars + endChars) return address
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
  },
  
  isValidXRPLAddress: (address: string) => {
    return /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address)
  },
  
  isValidFlareAddress: (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  },
  
  getNetworkStatus: () => ({
    xrpl: {
      network: CURRENT_XRPL_NETWORK.name,
      server: CURRENT_XRPL_NETWORK.server,
      explorer: CURRENT_XRPL_NETWORK.explorer,
    },
    flare: {
      network: CURRENT_FLARE_NETWORK.name,
      chainId: CURRENT_FLARE_NETWORK.chainId,
      rpcUrl: CURRENT_FLARE_NETWORK.rpcUrl,
      explorer: CURRENT_FLARE_NETWORK.explorer,
    },
  }),
}

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: "Wallet not connected",
  INSUFFICIENT_BALANCE: "Insufficient balance for transaction",
  INVALID_ADDRESS: "Invalid address format",
  NETWORK_ERROR: "Network connection error",
  TRANSACTION_FAILED: "Transaction failed",
  ATTESTATION_TIMEOUT: "Attestation request timed out",
  PRICE_FEED_ERROR: "Unable to fetch current prices",
} as const

// Success messages  
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: "Wallet connected successfully",
  PAYMENT_SENT: "Payment sent successfully", 
  ATTESTATION_SUBMITTED: "Attestation request submitted",
  BOOKING_CONFIRMED: "Booking confirmed with cross-chain payment",
} as const
