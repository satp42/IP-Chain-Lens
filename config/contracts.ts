import { Address } from "viem"

/**
 * Story Protocol Smart Contract Addresses on Story Mainnet
 * Reference: https://docs.story.foundation/docs/deployed-smart-contracts
 * Last Updated: November 8, 2025
 */

export const STORY_CONTRACTS = {
  // Core Protocol Contracts
  ipAssetRegistry: "0x77319B4031e6eF1250907aa00018B8B1c67a244b" as Address,
  licensingModule: "0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f" as Address,
  royaltyModule: "0xD2f60c40fEbccf6311f8B47c4f2Ec6b040400086" as Address,
  licenseRegistry: "0x529a750E02d8E2f15649c13D69a465286a780e24" as Address,
  pilTemplate: "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316" as Address,
  royaltyPolicyLAP: "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E" as Address,
  wipToken: "0x1514000000000000000000000000000000000000" as Address, // Wrapped IP Token
  
  // Periphery Contracts
  spgNftImpl: "0x6Cfa03Bc64B1a76206d0Ea10baDed31D520449F5" as Address, // SPG NFT Implementation
  registrationWorkflows: "0xbe39E1C756e921BD25DF86e7AAa31106d1eb0424" as Address,
  derivativeWorkflows: "0x9e2d496f72C547C2C535B167e06ED8729B374a4f" as Address,
  licenseAttachmentWorkflows: "0xcC2E862bCee5B6036Db0de6E06Ae87e524a79fd8" as Address,
  royaltyWorkflows: "0x9515faE61E0c0447C6AC6dEe5628A2097aFE1890" as Address,
  
  // Additional Core Contracts
  disputeModule: "0x9b7A9c70AFF961C799110954fc06F3093aeb94C5" as Address,
  coreMetadataModule: "0x6E81a25C99C6e8430aeC7353325EB138aFE5DC16" as Address,
  licenseToken: "0xFe3838BFb30B34170F00030B52eA4893d8aAC6bC" as Address,
  royaltyPolicyLRP: "0x9156e603C949481883B1d3355c6f1132D191fC41" as Address,
  
  // License Hooks
  totalLicenseTokenLimitHook: "0xB72C9812114a0Fc74D49e01385bd266A75960Cda" as Address,
  lockLicenseHook: "0x5D874d4813c4A8A9FB2AB55F30cED9720AEC0222" as Address,
} as const

export const CHAIN_ID = 1514

export const EXPLORER_URL = "https://www.storyscan.io"

// Default License Terms ID (Non-Commercial Social Remixing)
export const DEFAULT_LICENSE_TERMS_ID = 1n

export function getExplorerUrl(address: string, type: "address" | "tx" | "token" = "address"): string {
  return `${EXPLORER_URL}/${type}/${address}`
}

