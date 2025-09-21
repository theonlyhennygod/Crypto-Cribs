# Crypto Cribs - Setup Guide

Complete setup guide for the cross-chain travel booking platform using Flare Network + XRPL.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Flare Network   │    │  XRPL Network   │
│                 │    │                  │    │                 │
│ • Property UI   │◄──►│ • Smart Contract │◄──►│ • Payment       │
│ • Booking UI    │    │ • FTSOv2 Prices  │    │   Settlement    │
│ • Wallet Connect│    │ • FDC Verification│   │ • Transaction   │
└─────────────────┘    └──────────────────┘    │   Proofs        │
                                               └─────────────────┘
```

## 🚀 Quick Start

### 1. Prerequisites

Install required tools:

```bash
# Install Foundry (for smart contracts)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Clone the repository (no submodules needed!)
git clone https://github.com/your-username/Crypto-Cribs.git
cd Crypto-Cribs

# Install Node.js dependencies
pnpm install

# Verify installations
forge --version
node --version
pnpm --version
```

### 2. Environment Setup

```bash
# Setup smart contract environment (includes dependency installation)
npm run contracts:setup

# This will automatically:
# 1. Install OpenZeppelin contracts via Forge
# 2. Install Flare contracts via Forge
# 3. Create .env file from template
# 4. Build and test contracts

# Edit contract environment file
cd contracts && nano .env
# Add your private key to .env file
```

### 3. Smart Contract Development

```bash
# Install contract dependencies
npm run contracts:install

# Compile contracts
npm run contracts:build

# Run tests
npm run contracts:test

# Deploy to Coston2 testnet
npm run contracts:deploy:coston2
```

### 4. Frontend Development

```bash
# Install frontend dependencies (already done in step 1)
pnpm install

# Start development server
pnpm dev
```

## 🔧 Detailed Setup

### Smart Contracts

#### 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### 2. Configure Environment

```bash
cd contracts
cp env.example .env
```

Edit `.env` with your configuration:

```bash
# Get a private key from a test wallet
PRIVATE_KEY=0x1234...

# Get testnet FLR from faucet
# https://faucet.flare.network/coston2
```

#### 3. Install Dependencies & Deploy

```bash
# Install OpenZeppelin and Flare contracts
make install

# Compile contracts
make build

# Run comprehensive tests
make test

# Deploy to Coston2 testnet
make deploy-coston2

# Verify contract (optional)
make verify-coston2
```

### Frontend Integration

#### 1. Web3 Setup

The app uses Wagmi for Web3 interactions:

```typescript
// hooks/use-contract.ts - Custom hooks for contract interaction
import {
  useBookingContract,
  useProperty,
  useBooking,
} from "@/hooks/use-contract";

// Example: Get property data
const { data: property } = useProperty(propertyId);

// Example: Create booking
const { createBooking } = useBookingWrite();
```

#### 2. XRPL Integration

Cross-chain payments using XRPL:

```typescript
// lib/xrpl-client.ts - XRPL payment handling
import { xrplClient } from "@/lib/xrpl-client";

// Create payment for booking
const payment = await xrplClient.createBookingPayment(
  sourceWallet,
  destinationWallet,
  amountXRP,
  bookingId
);
```

#### 3. Update Contract Address

After deployment, update the contract address in:

```typescript
// lib/contracts/types.ts
export const CONTRACT_ADDRESSES = {
  coston2: {
    BOOKING_CONTRACT: "0xYourDeployedAddress", // Update this
    // ... other addresses
  },
};
```

## 🌐 Network Configuration

### Coston2 Testnet (Development)

- **Chain ID**: 114
- **RPC URL**: `https://coston2-api.flare.network/ext/C/rpc`
- **Faucet**: https://faucet.flare.network/coston2
- **Explorer**: https://coston2.testnet.flarescan.com

### Flare Mainnet (Production)

- **Chain ID**: 14
- **RPC URL**: `https://flare-api.flare.network/ext/C/rpc`
- **Explorer**: https://flarescan.com

### XRPL Configuration

- **Testnet**: `wss://s.altnet.rippletest.net:51233`
- **Mainnet**: `wss://xrplcluster.com`

## 📋 Development Workflow

### 1. Contract Changes

```bash
# Make changes to contracts/src/
# Run tests
make test

# Deploy to testnet
make deploy-coston2

# Update frontend with new contract address
```

### 2. Frontend Development

```bash
# Start development server
pnpm dev

# The app will be available at http://localhost:3000
# MetaMask will auto-connect to Flare network
# Gem Wallet will handle XRPL transactions
```

### 3. Testing Cross-Chain Flow

1. **Setup Wallets**:

   - MetaMask: Add Coston2 network
   - Gem Wallet: Configure for XRPL testnet

2. **Get Test Tokens**:

   - Coston2 FLR: https://faucet.flare.network/coston2
   - XRPL Test XRP: https://xrpl.org/xrp-testnet-faucet.html

3. **Test Booking Flow**:
   - Connect wallets in app
   - Create property listing
   - Make booking (gets XRP price via FTSOv2)
   - Pay in XRP on XRPL testnet
   - Verify payment using FDC

## 🔐 Security Considerations

### Smart Contracts

- ✅ ReentrancyGuard protection
- ✅ Pausable emergency stops
- ✅ Ownable access control
- ✅ Input validation and bounds checking

### Frontend

- ✅ EIP-6963 wallet detection
- ✅ Proper error handling
- ✅ Secure environment variables
- ✅ Type-safe contract interactions

### Cross-Chain

- ✅ FDC cryptographic verification
- ✅ FTSOv2 decentralized price feeds
- ✅ XRPL transaction validation
- ✅ Timeout protection

## 🐛 Troubleshooting

### Common Issues

1. **MetaMask Connection Issues**:

   - Clear browser cache
   - Reset MetaMask account
   - Check network configuration

2. **Contract Deployment Fails**:

   - Verify sufficient gas
   - Check private key is correct
   - Ensure network RPC is responding

3. **XRPL Connection Issues**:

   - Check Gem Wallet is installed
   - Verify XRPL network selection
   - Try refreshing the connection

4. **Price Feed Issues**:

   - FTSOv2 may have delays
   - Check Coston2 network status
   - Verify contract addresses

5. **Dependency Issues**:
   - `fatal: not a git repository` or missing OpenZeppelin contracts:
     ```bash
     # Clean install dependencies using Forge
     cd contracts
     rm -rf lib/
     make install
     ```
   - If contracts won't compile:
     ```bash
     # Clean and rebuild
     cd contracts
     make clean
     make build
     ```

### Getting Help

- **Flare Documentation**: https://dev.flare.network/
- **XRPL Documentation**: https://xrpl.org/docs.html
- **Foundry Book**: https://book.getfoundry.sh/
- **Wagmi Documentation**: https://wagmi.sh/

## 🚀 Production Deployment

### 1. Smart Contract Audit

Before mainnet deployment:

- [ ] Security audit by certified auditors
- [ ] Comprehensive testing on testnet
- [ ] Gas optimization review
- [ ] Access control verification

### 2. Frontend Deployment

```bash
# Build for production
pnpm build

# Deploy to Vercel/Netlify
# Set environment variables for production
```

### 3. Mainnet Configuration

Update contract addresses and network settings for production deployment.

## 📊 Monitoring & Analytics

The platform includes built-in monitoring for:

- Contract events and transactions
- Cross-chain payment flow
- Price feed accuracy
- User interaction analytics
- Error tracking and reporting

---

**Ready to build the future of decentralized travel!** 🌟
