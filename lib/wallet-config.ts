import data from '@/data/data.json';

// Wallet configuration types
export interface WalletInfo {
  address: string;
  network: string;
  description: string;
  balance?: string;
  verified?: boolean;
  transactionHistory?: boolean;
}

export interface WalletConfiguration {
  demo: {
    gemWallet: WalletInfo;
  };
  main: {
    gemWallet: WalletInfo;
  };
}

// Get wallet configuration from data.json
export function getWalletConfig(): WalletConfiguration {
  return data.configuration.wallets as WalletConfiguration;
}

// Get specific wallet address
export function getWalletAddress(type: 'demo' | 'main', network: 'gemWallet'): string {
  const config = getWalletConfig();
  return config[type][network].address;
}

// Get primary wallet address (main gemWallet)
export function getPrimaryWalletAddress(): string {
  return getWalletAddress('main', 'gemWallet');
}

// Get demo wallet address
export function getDemoWalletAddress(): string {
  return getWalletAddress('demo', 'gemWallet');
}

// Get wallet info with all details
export function getWalletInfo(type: 'demo' | 'main', network: 'gemWallet'): WalletInfo {
  const config = getWalletConfig();
  return config[type][network];
}

// Get all available wallet addresses
export function getAllWalletAddresses(): { [key: string]: string } {
  const config = getWalletConfig();
  return {
    demo: config.demo.gemWallet.address,
    main: config.main.gemWallet.address,
    primary: config.main.gemWallet.address, // Alias for main
  };
}

// Validate if an address is one of our configured wallets
export function isConfiguredWallet(address: string): boolean {
  const addresses = getAllWalletAddresses();
  return Object.values(addresses).includes(address);
}

// Get network configuration
export function getNetworkConfig() {
  return data.configuration.networks;
}

// Default addresses for backward compatibility
export const WALLET_ADDRESSES = {
  PRIMARY: getPrimaryWalletAddress(),
  DEMO: getDemoWalletAddress(),
  MAIN: getPrimaryWalletAddress(),
} as const;
