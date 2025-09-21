// Contract types for Crypto Cribs
export interface Property {
  id: bigint;
  owner: string;
  name: string;
  location: string;
  pricePerNightUSD: bigint;
  available: boolean;
  amenities: string[];
  maxGuests: bigint;
}

export interface Booking {
  id: bigint;
  propertyId: bigint;
  guest: string;
  xrplAddress: string;
  checkIn: bigint;
  checkOut: bigint;
  totalPriceUSD: bigint;
  totalPriceXRP: bigint;
  status: BookingStatus;
  expectedXrplTxHash: string;
  paymentVerified: boolean;
}

export enum BookingStatus {
  PENDING_PAYMENT = 0,
  PAYMENT_VERIFIED = 1,
  ACTIVE = 2,
  COMPLETED = 3,
  CANCELLED = 4,
}

export interface AttestationRequest {
  attestationType: string;
  sourceId: string;
  requestBody: string;
}

export interface AttestationResponse {
  attestationType: string;
  sourceId: string;
  votingRound: bigint;
  lowestUsedTimestamp: bigint;
  request: string;
  response: string;
}

export interface FeedData {
  votingRoundId: number;
  id: string;
  value: number;
  turnoutBIPS: number;
  decimals: number;
}

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  coston2: {
    BOOKING_CONTRACT: "0x853e2a374a17eb3a848cca0ba5a571ad495480b0", // Deployed on Coston2
    FLARE_CONTRACT_REGISTRY: "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
    FTSO_V2: "0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d",
    FDC_ATTESTATION_CLIENT: "0xA90Db6D10F856799b10ef2A77EBCbF460aC71e52",
  },
  flare: {
    BOOKING_CONTRACT: "", // Will be set after deployment
    FLARE_CONTRACT_REGISTRY: "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
    FTSO_V2: "0x7BDE3Df0624114eDB3A67dFe6753e62f4e7c1d20",
    FDC_ATTESTATION_CLIENT: "0x89e50DC0380e597ecE79c8494bAAFD84537AD0D4", // Placeholder
  },
} as const;

// Network configuration
export const NETWORK_CONFIG = {
  coston2: {
    chainId: 114,
    name: "Flare Testnet Coston2",
    rpcUrl: "https://coston2-api.flare.network/ext/C/rpc",
    blockExplorer: "https://coston2.testnet.flarescan.com",
    nativeCurrency: {
      name: "Coston2 Flare",
      symbol: "C2FLR",
      decimals: 18,
    },
  },
  flare: {
    chainId: 14,
    name: "Flare Network",
    rpcUrl: "https://flare-api.flare.network/ext/C/rpc",
    blockExplorer: "https://flarescan.com",
    nativeCurrency: {
      name: "Flare",
      symbol: "FLR",
      decimals: 18,
    },
  },
} as const;

// Feed IDs for FTSOv2
export const FEED_IDS = {
  XRP_USD: "0x01585250000000000000000000000000000000000000", // XRP/USD
  FLR_USD: "0x01464c52000000000000000000000000000000000000", // FLR/USD
  ETH_USD: "0x014554480000000000000000000000000000000000", // ETH/USD
  BTC_USD: "0x014254430000000000000000000000000000000000", // BTC/USD
} as const;
