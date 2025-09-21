# XRPL Testnet Integration Setup Guide

## Overview
This document provides setup instructions for integrating XRPL testnet with Flare Network cross-chain payments in the Crypto Cribs travel dapp.

## Network Configuration

### XRPL Testnet
- **Network**: XRPL Testnet
- **WebSocket URL**: `wss://s.altnet.rippletest.net:51233`
- **Explorer**: https://testnet.xrpl.org
- **Faucet**: https://xrpl.org/xrp-testnet-faucet.html

### Flare Coston2 Testnet
- **Network**: Flare Coston2 Testnet
- **Chain ID**: 114
- **RPC URL**: `https://coston2-api.flare.network/ext/C/rpc`
- **Explorer**: https://coston2.testnet.flarescan.com
- **Faucet**: https://faucet.flare.network/coston2

## Smart Contract Addresses

### Flare Coston2 Testnet Contracts
```
FTSOv2 (Price Feeds): 0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d
StateConnector (FDC): 0x0c13aDA1C7143Cf0a0795FFaB93eEBb6FAD6e4e3
FDC Attestation Client: 0xA90Db6D10F856799b10ef2A77EBCbF460aC71e52
```

### Your Deployed Contracts (Update after deployment)
```
CryptoCribsBooking: [TO_BE_DEPLOYED]
XRPLFlarebridge: [TO_BE_DEPLOYED]
PropertyNFT: [TO_BE_DEPLOYED]
PropertyEscrow: [TO_BE_DEPLOYED]
```

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# XRPL Configuration
NEXT_PUBLIC_XRPL_NETWORK=testnet
NEXT_PUBLIC_XRPL_WEBSOCKET_URL=wss://s.altnet.rippletest.net:51233
NEXT_PUBLIC_XRPL_EXPLORER_URL=https://testnet.xrpl.org

# Flare Network Configuration
NEXT_PUBLIC_FLARE_NETWORK=coston2
NEXT_PUBLIC_FLARE_CHAIN_ID=114
NEXT_PUBLIC_FLARE_RPC_URL=https://coston2-api.flare.network/ext/C/rpc
NEXT_PUBLIC_FLARE_EXPLORER_URL=https://coston2.testnet.flarescan.com

# Contract Addresses
NEXT_PUBLIC_FTSO_V2_ADDRESS=0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d
NEXT_PUBLIC_STATE_CONNECTOR_ADDRESS=0x0c13aDA1C7143Cf0a0795FFaB93eEBb6FAD6e4e3
NEXT_PUBLIC_FDC_CLIENT_ADDRESS=0xA90Db6D10F856799b10ef2A77EBCbF460aC71e52

# Your Deployed Contracts (Update these after deployment)
NEXT_PUBLIC_BOOKING_CONTRACT_ADDRESS=
NEXT_PUBLIC_BRIDGE_CONTRACT_ADDRESS=
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=

# Default Addresses
NEXT_PUBLIC_DEFAULT_XRPL_ESCROW=rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH
NEXT_PUBLIC_DEFAULT_FLARE_ESCROW=0x742d35Cc6634C0532925a3b8D46CBF20b67e7c7B
```

## Wallet Setup Instructions

### 1. XRPL Testnet Wallet Setup

#### Option A: Create New Wallet (Automatic)
The dapp will automatically:
1. Generate a new XRPL testnet wallet
2. Fund it with 1000 XRP from the testnet faucet
3. Display the wallet seed (SAVE THIS SECURELY!)

#### Option B: Import Existing Wallet
1. If you have an existing XRPL testnet wallet seed
2. Use the "Import Wallet" feature in the dapp
3. Enter your seed phrase

### 2. Flare Network (MetaMask) Setup

#### Add Coston2 Testnet to MetaMask:
1. Open MetaMask
2. Click the network dropdown
3. Click "Add Network" → "Add a network manually"
4. Enter the following details:
   - **Network Name**: Flare Coston2 Testnet
   - **New RPC URL**: `https://coston2-api.flare.network/ext/C/rpc`
   - **Chain ID**: `114`
   - **Currency Symbol**: `FLR`
   - **Block Explorer URL**: `https://coston2.testnet.flarescan.com`

#### Get Testnet FLR:
1. Visit: https://faucet.flare.network/coston2
2. Enter your wallet address
3. Request FLR tokens

## Testing Cross-Chain Payments

### Payment Flow

1. **Property Selection**: Browse properties and select one for booking
2. **Wallet Connection**: Connect both XRPL and MetaMask wallets
3. **Payment Currency Selection**: Choose between XRP or FLR
4. **Real-time Price Conversion**: Powered by FTSOv2 oracles
5. **Cross-Chain Payment**: Execute payment on chosen network
6. **Transaction Verification**: Verify using FDC attestations
7. **Booking Confirmation**: Complete booking with verified payment

### Supported Payment Methods

#### XRPL Direct Payment
- Pay directly with XRP on XRPL testnet
- Instant settlement and confirmation
- FDC verification for cross-chain proof

#### Flare Network Payment
- Pay with FLR on Flare Coston2 testnet
- Smart contract escrow
- Automatic price conversion via FTSOv2

## Key Features Implemented

### 🌐 Cross-Chain Integration
- XRPL testnet integration with WebSocket connection
- Flare Coston2 testnet integration via MetaMask
- Real-time network status monitoring

### 💰 Price Oracle Integration (FTSOv2)
- Real-time XRP/USD and FLR/USD price feeds
- Automatic currency conversion
- Price data refresh every 30 seconds
- Slippage protection

### 🔗 Data Connector Integration (FDC)
- XRPL transaction verification
- Cross-chain payment attestations
- Merkle proof validation
- Fraud detection integration

### 🔒 Enhanced Security
- Multi-wallet fraud protection
- Transaction verification
- Risk assessment scoring
- Self-booking prevention
- Rate limiting protection

### 🎯 User Experience
- Unified wallet interface
- Real-time balance updates
- Transaction history tracking
- Progress tracking for cross-chain payments
- Detailed transaction status

## Testing Scenarios

### 1. XRPL Payment Flow
```
1. Create/Import XRPL wallet → Get testnet XRP
2. Select property priced in XRP
3. Initiate booking → Connect XRPL wallet
4. Confirm payment → Transaction submitted to XRPL
5. FDC verification → Attestation submitted
6. Booking confirmed → Cross-chain proof verified
```

### 2. Flare Payment Flow
```
1. Connect MetaMask → Switch to Coston2
2. Get testnet FLR from faucet
3. Select property priced in FLR
4. Initiate booking → Connect MetaMask
5. Confirm payment → Transaction on Flare network
6. Smart contract escrow → Payment held securely
7. Booking confirmed → Immediate confirmation
```

### 3. Cross-Chain Conversion
```
1. Property priced in XRP → Pay with FLR (or vice versa)
2. FTSOv2 fetches current exchange rates
3. Real-time conversion displayed
4. User confirms converted amount
5. Payment processed on selected network
6. Cross-chain verification completes booking
```

## Troubleshooting

### Common Issues

#### XRPL Connection Issues
- Check if testnet is accessible
- Verify WebSocket connection
- Try refreshing the page

#### MetaMask Network Issues
- Ensure Coston2 testnet is added correctly
- Check RPC URL and Chain ID
- Try switching networks and back

#### Price Feed Issues
- Check FTSOv2 contract connectivity
- Verify Flare network connection
- Price feeds update every 30 seconds

#### Payment Failures
- Check wallet balances
- Verify network connectivity
- Check for pending transactions

### Debug Tools

#### Network Status Check
The dapp provides real-time status for:
- XRPL testnet connectivity
- Flare network connectivity
- FTSOv2 price feed availability
- FDC attestation service status

#### Transaction Monitoring
- XRPL Explorer: https://testnet.xrpl.org
- Flare Explorer: https://coston2.testnet.flarescan.com
- In-app transaction tracking

## Next Steps

1. **Deploy Smart Contracts**: Use `cd contracts && make deploy-coston2`
2. **Update Contract Addresses**: Add deployed addresses to environment
3. **Test Payment Flows**: Try both XRPL and Flare payments
4. **Monitor Transactions**: Use explorers to verify payments
5. **Production Setup**: Switch to mainnet configuration when ready

## Support Resources

- **XRPL Documentation**: https://xrpl.org/docs.html
- **Flare Documentation**: https://docs.flare.network/
- **FTSOv2 Guide**: https://docs.flare.network/tech/ftso/
- **FDC Guide**: https://docs.flare.network/tech/state-connector/

---

## Security Notes

⚠️ **Important**: This is testnet configuration only. Never use testnet seeds or keys on mainnet.

🔒 **Wallet Security**: Always backup your wallet seeds securely. Never share them publicly.

🌐 **Network Verification**: Always verify you're on testnet before making transactions.
