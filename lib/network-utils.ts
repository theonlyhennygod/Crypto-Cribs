import { switchChain } from "wagmi/actions";
import { config } from "./wagmi-config";

// Coston2 testnet configuration
export const COSTON2_CHAIN = {
  id: 114,
  name: "Flare Testnet Coston2",
  nativeCurrency: {
    decimals: 18,
    name: "Coston2 Flare",
    symbol: "C2FLR",
  },
  rpcUrls: {
    default: {
      http: ["https://coston2-api.flare.network/ext/C/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Coston2 Explorer",
      url: "https://coston2.testnet.flarescan.com",
    },
  },
} as const;

// Function to switch to Coston2 network
export async function switchToCoston2() {
  try {
    await switchChain(config, { chainId: 114 });

    // Small delay to ensure the switch is registered
    await new Promise((resolve) => setTimeout(resolve, 100));

    return true;
  } catch (error: any) {
    console.error("Failed to switch to Coston2:", error);

    // If the network doesn't exist, try to add it
    if (error.code === 4902 || error.message?.includes("Unrecognized chain")) {
      const added = await addCoston2Network();
      if (added) {
        // Try switching again after adding
        try {
          await switchChain(config, { chainId: 114 });
          await new Promise((resolve) => setTimeout(resolve, 100));
          return true;
        } catch (switchError) {
          console.error("Failed to switch after adding network:", switchError);
        }
      }
      return added;
    }

    return false;
  }
}

// Function to add Coston2 network to MetaMask
export async function addCoston2Network() {
  try {
    if (typeof window !== "undefined" && window.ethereum) {
      // First, try to add the network
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${(114).toString(16)}`, // 0x72 in hex
            chainName: "Flare Testnet Coston2",
            nativeCurrency: {
              name: "Coston2 Flare",
              symbol: "C2FLR",
              decimals: 18,
            },
            rpcUrls: ["https://coston2-api.flare.network/ext/C/rpc"],
            blockExplorerUrls: ["https://coston2.testnet.flarescan.com"],
          },
        ],
      });

      // After adding, try to switch to it
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${(114).toString(16)}` }],
        });
      } catch (switchError) {
        console.log("Network added but couldn't auto-switch:", switchError);
      }

      return true;
    }
    return false;
  } catch (error: any) {
    console.error("Failed to add Coston2 network:", error);

    // If network already exists, try to switch to it
    if (error.code === 4902 || error.message?.includes("already exists")) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${(114).toString(16)}` }],
        });
        return true;
      } catch (switchError) {
        console.error("Failed to switch to existing network:", switchError);
      }
    }

    return false;
  }
}

// Function to get testnet faucet URL
export function getCoston2FaucetUrl() {
  return "https://coston2-faucet.towolabs.com/";
}
