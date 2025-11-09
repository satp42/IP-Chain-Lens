import { http, createConfig } from "wagmi"
import { defineChain } from "viem"
import { injected, walletConnect } from "wagmi/connectors"

// Story Mainnet Chain Definition
export const storyMainnet = defineChain({
  id: 1514,
  name: "Story Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "IP",
    symbol: "IP",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_STORY_RPC_URL || "https://rpc.story.foundation"],
    },
    public: {
      http: ["https://rpc.story.foundation"],
    },
  },
  blockExplorers: {
    default: {
      name: "Story Explorer",
      url: "https://explorer.story.foundation",
    },
  },
  testnet: false,
})

export const config = createConfig({
  chains: [storyMainnet],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
    }),
  ],
  transports: {
    [storyMainnet.id]: http(),
  },
})

