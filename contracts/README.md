# Crypto Cribs Smart Contracts

Cross-chain travel booking platform using Flare Network for smart contract logic and XRPL for payment settlement.

## Architecture Overview

### Core Components

1. **Flare Smart Contracts** - Booking logic, property management, dispute resolution
2. **XRPL Payments** - Actual payment settlement in XRP
3. **FDC (Flare Data Connector)** - Verifies XRPL transactions on Flare
4. **FTSOv2** - Provides real-time XRP/USD price feeds

### How It Works

```
1. User creates booking on Flare → Gets XRP price via FTSOv2
2. User pays in XRP on XRPL → Transaction recorded on XRPL ledger  
3. FDC verifies XRPL payment → Proves payment occurred on Flare
4. Smart contract releases booking → User can access property
```

## Contract Addresses

### Coston2 Testnet
- **Booking Contract**: `TBD` (Deploy with `forge script script/Deploy.s.sol`)
- **FDC Verifier**: `0x3f00000000000000000000000000000000000001` (Placeholder)
- **FTSOv2**: `0x3f00000000000000000000000000000000000002` (Placeholder)

## Setup Instructions

### 1. Install Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Install Dependencies
```bash
cd contracts
forge install OpenZeppelin/openzeppelin-contracts
forge install flare-foundation/flare-smart-contracts
```

### 3. Set Environment Variables
```bash
cp env.example .env
# Edit .env with your private key and RPC URLs
```

### 4. Compile Contracts
```bash
forge build
```

### 5. Run Tests
```bash
forge test
```

### 6. Deploy to Coston2 Testnet
```bash
forge script script/Deploy.s.sol --rpc-url $RPC_URL_COSTON2 --broadcast
```

## Key Features

### 🏨 Property Management
- List properties with metadata (name, location, price, amenities)
- Toggle availability
- Set pricing in USD (converted to XRP automatically)

### 💰 Cross-Chain Payments
- **Price Discovery**: FTSOv2 provides real-time XRP/USD rates
- **Payment Settlement**: Users pay in XRP on XRPL network
- **Verification**: FDC proves XRPL payments occurred
- **Escrow Logic**: Smart contract holds booking until verified

### 🔒 Security Features
- **ReentrancyGuard**: Prevents reentrancy attacks
- **Pausable**: Emergency stop functionality
- **Ownable**: Admin controls for platform management
- **Payment Verification**: Cryptographic proof of XRPL transactions

### 🌍 Multi-Chain Integration
- **Flare Network**: Smart contract logic and state management
- **XRPL**: Payment settlement and transaction finality
- **Cross-chain verification**: Trustless bridging via FDC

## Smart Contract Functions

### Property Management
```solidity
function listProperty(
    string memory _name,
    string memory _location,
    uint256 _pricePerNightUSD,
    string[] memory _amenities,
    uint256 _maxGuests
) external
```

### Booking Creation
```solidity
function createBooking(
    uint256 _propertyId,
    string memory _xrplAddress,
    uint256 _checkIn,
    uint256 _checkOut
) external
```

### Payment Verification
```solidity
function verifyXRPLPayment(
    uint256 _bookingId,
    IFlareDataConnector.AttestationResponse calldata _attestationResponse
) external
```

### Price Feeds
```solidity
function getXRPPrice() public view returns (uint256)
```

## Integration with Frontend

The smart contracts integrate with your Next.js frontend through:

1. **Web3 Provider**: Connect via MetaMask to Flare network
2. **Contract Interaction**: Use ethers.js or wagmi for contract calls
3. **XRPL Integration**: Use xrpl.js for payment settlement
4. **Event Listening**: Monitor contract events for booking updates

## Testing Strategy

### Unit Tests
- Property listing and management
- Booking creation and validation
- Price feed integration
- Access control and security

### Integration Tests
- Cross-chain payment flows
- FDC attestation verification
- End-to-end booking process

### Testnet Deployment
- Deploy to Coston2 for full testing
- Test with real XRPL testnet transactions
- Verify FDC integration works correctly

## Security Considerations

1. **Oracle Manipulation**: FTSOv2 uses multiple data sources to prevent price manipulation
2. **Cross-chain Verification**: FDC provides cryptographic proof of XRPL transactions
3. **Reentrancy Protection**: All state-changing functions protected
4. **Access Control**: Proper role-based permissions
5. **Emergency Controls**: Pausable functionality for critical issues

## Deployment Checklist

- [ ] Set correct FDC and FTSOv2 addresses for target network
- [ ] Configure XRPL network settings (mainnet vs testnet)
- [ ] Set appropriate platform fees
- [ ] Configure admin addresses
- [ ] Test price feed integration
- [ ] Verify FDC attestation process
- [ ] Deploy frontend integration contracts

## Next Steps

1. **Deploy to Testnet**: Test full cross-chain flow
2. **Frontend Integration**: Connect React components to contracts
3. **XRPL Integration**: Build payment settlement flow
4. **FDC Implementation**: Complete payment verification logic
5. **Audit Preparation**: Security review before mainnet

## Support

- **Flare Documentation**: https://dev.flare.network/
- **XRPL Documentation**: https://xrpl.org/docs.html
- **Foundry Book**: https://book.getfoundry.sh/
