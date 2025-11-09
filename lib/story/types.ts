import { Address } from "viem"

export interface IpAssetNode {
  id: Address
  nftContract: Address
  tokenId: string
  metadata?: IpMetadata
  licenseTermsIds?: bigint[]
  parentCount: number
  derivativeCount: number
  generation?: number // derivative depth
  createdAt?: Date
}

export interface IpAssetEdge {
  source: Address // parent IP
  target: Address // child IP
  type: "derivative" | "license" | "royalty"
  licenseTermsId?: bigint
  licenseTokenId?: string
  licenseTemplate?: Address
  blockNumber?: number
  txHash?: string
}

export interface IpMetadata {
  title?: string
  description?: string
  ipMetadataURI?: string
  ipMetadataHash?: string
  nftMetadataURI?: string
  nftMetadataHash?: string
  imageUrl?: string
  creator?: Address
  attributes?: Record<string, any>
}

export interface LicenseTerms {
  id: bigint
  transferable: boolean
  royaltyPolicy: Address
  defaultMintingFee: bigint
  expiration: bigint
  commercialUse: boolean
  commercialAttribution: boolean
  commercializerChecker: Address
  commercializerCheckerData: string
  commercialRevShare: number
  commercialRevCeiling: bigint
  derivativesAllowed: boolean
  derivativesAttribution: boolean
  derivativesApproval: boolean
  derivativesReciprocal: boolean
  derivativeRevCeiling: bigint
  currency: Address
  uri: string
}

export interface RoyaltyInfo {
  recipients: {
    address: Address
    percentage: number
  }[]
  royaltyPolicy: Address
  totalRevenue?: bigint
  unclaimedRevenue?: bigint
}

export interface SearchFilters {
  creator?: Address
  licenseType?: string
  usageCategory?: string
  minDerivativeDepth?: number
  maxDerivativeDepth?: number
  dateFrom?: Date
  dateTo?: Date
  searchQuery?: string
}

export interface GraphData {
  nodes: IpAssetNode[]
  edges: IpAssetEdge[]
}

