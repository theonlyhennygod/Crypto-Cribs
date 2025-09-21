// ABIs for smart contracts
export const CRYPTO_CRIBS_BOOKING_ABI = [
  // Property Management
  {
    "type": "function",
    "name": "listProperty",
    "inputs": [
      { "name": "_name", "type": "string" },
      { "name": "_location", "type": "string" },
      { "name": "_pricePerNightUSD", "type": "uint256" },
      { "name": "_amenities", "type": "string[]" },
      { "name": "_maxGuests", "type": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getProperty",
    "inputs": [{ "name": "_propertyId", "type": "uint256" }],
    "outputs": [{
      "type": "tuple",
      "components": [
        { "name": "id", "type": "uint256" },
        { "name": "owner", "type": "address" },
        { "name": "name", "type": "string" },
        { "name": "location", "type": "string" },
        { "name": "pricePerNightUSD", "type": "uint256" },
        { "name": "available", "type": "bool" },
        { "name": "amenities", "type": "string[]" },
        { "name": "maxGuests", "type": "uint256" }
      ]
    }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "togglePropertyAvailability",
    "inputs": [{ "name": "_propertyId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  
  // Booking Management
  {
    "type": "function",
    "name": "createBooking",
    "inputs": [
      { "name": "_propertyId", "type": "uint256" },
      { "name": "_xrplAddress", "type": "string" },
      { "name": "_checkIn", "type": "uint256" },
      { "name": "_checkOut", "type": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getBooking",
    "inputs": [{ "name": "_bookingId", "type": "uint256" }],
    "outputs": [{
      "type": "tuple",
      "components": [
        { "name": "id", "type": "uint256" },
        { "name": "propertyId", "type": "uint256" },
        { "name": "guest", "type": "address" },
        { "name": "xrplAddress", "type": "string" },
        { "name": "checkIn", "type": "uint256" },
        { "name": "checkOut", "type": "uint256" },
        { "name": "totalPriceUSD", "type": "uint256" },
        { "name": "totalPriceXRP", "type": "uint256" },
        { "name": "status", "type": "uint8" },
        { "name": "expectedXrplTxHash", "type": "bytes32" },
        { "name": "paymentVerified", "type": "bool" }
      ]
    }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verifyXRPLPayment",
    "inputs": [
      { "name": "_bookingId", "type": "uint256" },
      { 
        "name": "_attestationResponse",
        "type": "tuple",
        "components": [
          { "name": "attestationType", "type": "bytes32" },
          { "name": "sourceId", "type": "bytes32" },
          { "name": "votingRound", "type": "uint64" },
          { "name": "lowestUsedTimestamp", "type": "uint64" },
          { "name": "request", "type": "bytes" },
          { "name": "response", "type": "bytes" }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "completeBooking",
    "inputs": [{ "name": "_bookingId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  
  // User Functions
  {
    "type": "function",
    "name": "getUserBookings",
    "inputs": [{ "name": "_user", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256[]" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getHostProperties",
    "inputs": [{ "name": "_host", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256[]" }],
    "stateMutability": "view"
  },
  
  // Price Feed
  {
    "type": "function",
    "name": "getXRPPrice",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  
  // Events
  {
    "type": "event",
    "name": "PropertyListed",
    "inputs": [
      { "name": "propertyId", "type": "uint256", "indexed": true },
      { "name": "owner", "type": "address", "indexed": true },
      { "name": "name", "type": "string", "indexed": false },
      { "name": "pricePerNightUSD", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "BookingCreated",
    "inputs": [
      { "name": "bookingId", "type": "uint256", "indexed": true },
      { "name": "propertyId", "type": "uint256", "indexed": true },
      { "name": "guest", "type": "address", "indexed": true },
      { "name": "totalPriceUSD", "type": "uint256", "indexed": false },
      { "name": "totalPriceXRP", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "PaymentVerified",
    "inputs": [
      { "name": "bookingId", "type": "uint256", "indexed": true },
      { "name": "xrplTxHash", "type": "bytes32", "indexed": false },
      { "name": "verifiedAmount", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "BookingCompleted",
    "inputs": [
      { "name": "bookingId", "type": "uint256", "indexed": true }
    ]
  }
] as const

export const FTSO_V2_ABI = [
  {
    "type": "function",
    "name": "getFeedById",
    "inputs": [{ "name": "_feedId", "type": "bytes21" }],
    "outputs": [{
      "type": "tuple",
      "components": [
        { "name": "votingRoundId", "type": "uint32" },
        { "name": "id", "type": "bytes21" },
        { "name": "value", "type": "int32" },
        { "name": "turnoutBIPS", "type": "uint16" },
        { "name": "decimals", "type": "int8" }
      ]
    }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCurrentVotingRoundId",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint32" }],
    "stateMutability": "view"
  }
] as const

export const FDC_ABI = [
  {
    "type": "function",
    "name": "verifyAttestation",
    "inputs": [{
      "name": "_response",
      "type": "tuple",
      "components": [
        { "name": "attestationType", "type": "bytes32" },
        { "name": "sourceId", "type": "bytes32" },
        { "name": "votingRound", "type": "uint64" },
        { "name": "lowestUsedTimestamp", "type": "uint64" },
        { "name": "request", "type": "bytes" },
        { "name": "response", "type": "bytes" }
      ]
    }],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMerkleRoot",
    "inputs": [{ "name": "_votingRound", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "bytes32" }],
    "stateMutability": "view"
  }
] as const
