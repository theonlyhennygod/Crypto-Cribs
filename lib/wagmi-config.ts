import { createConfig, http } from 'wagmi'
import { metaMask } from 'wagmi/connectors'

// Define Coston2 chain if not available in wagmi/chains
const coston2Chain = {
  id: 114,
  name: 'Flare Testnet Coston2',
  nativeCurrency: {
    decimals: 18,
    name: 'Coston2 Flare',
    symbol: 'C2FLR',
  },
  rpcUrls: {
    default: {
      http: ['https://coston2-api.flare.network/ext/C/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Coston2 Explorer',
      url: 'https://coston2.testnet.flarescan.com',
    },
  },
  testnet: true,
} as const

// Define Flare mainnet chain
const flareChain = {
  id: 14,
  name: 'Flare Network',
  nativeCurrency: {
    decimals: 18,
    name: 'Flare',
    symbol: 'FLR',
  },
  rpcUrls: {
    default: {
      http: ['https://flare-api.flare.network/ext/C/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Flare Explorer', 
      url: 'https://flarescan.com',
    },
  },
} as const

export const config = createConfig({
  chains: [coston2Chain, flareChain],
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'Crypto Cribs',
        url: 'https://cryptocribs.com',
        iconUrl: '/logo.png',
      },
    }),
  ],
  transports: {
    [coston2Chain.id]: http('https://coston2-api.flare.network/ext/C/rpc'),
    [flareChain.id]: http('https://flare-api.flare.network/ext/C/rpc'),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
