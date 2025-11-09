"use client"

import { StoryClient, StoryConfig } from "@story-protocol/core-sdk"
import { Address, http, Account } from "viem"
import { storyMainnet } from "@/config/wagmi"

let storyClient: StoryClient | null = null

export function getStoryClient(account?: Account): StoryClient {
  if (!storyClient) {
    const config: StoryConfig = {
      account: account,
      transport: http(process.env.NEXT_PUBLIC_STORY_RPC_URL || "https://rpc.story.foundation"),
      chainId: 1514,
    }
    
    storyClient = StoryClient.newClient(config)
  }
  
  return storyClient
}

export function resetStoryClient() {
  storyClient = null
}

// Helper function to initialize client with wallet account
export async function initializeStoryClient(account: Account): Promise<StoryClient> {
  resetStoryClient()
  return getStoryClient(account)
}


