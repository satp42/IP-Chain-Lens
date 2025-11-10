"use client"

import { Address } from "viem"
import { getStoryClient } from "./client"
import type {
  IpAssetNode,
  IpAssetEdge,
  IpMetadata,
  LicenseTerms,
  RoyaltyInfo,
  GraphData,
  SearchFilters,
} from "./types"

/**
 * Fetch a single IP Asset by its ID using Story Protocol API
 */
export async function getIpAsset(ipId: Address): Promise<IpAssetNode | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STORY_API_URL || "https://api.storyapis.com/api/v4"
    
    const response = await fetch(`${apiUrl}/assets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.NEXT_PUBLIC_STORY_API_KEY && {
          "X-Api-Key": process.env.NEXT_PUBLIC_STORY_API_KEY,
        }),
      },
      body: JSON.stringify({
        where: {
          ipIds: [ipId],
        },
        pagination: {
          limit: 1,
          offset: 0,
        },
        includeLicenses: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const result = await response.json()
    const asset = result.data?.[0]

    if (!asset) {
      return null
    }

    // Fetch metadata if URI is available
    let metadata: IpMetadata | undefined
    if (asset.ipaMetadataUri) {
      const fetchedMetadata = await fetchIpMetadata(asset.ipaMetadataUri)
      if (fetchedMetadata) {
        metadata = {
          ...fetchedMetadata,
          imageUrl: asset.nftMetadata?.image?.cachedUrl || asset.nftMetadata?.image?.originalUrl,
          creator: asset.ownerAddress as Address,
        }
      }
    }

    return {
      id: asset.ipId as Address,
      nftContract: asset.tokenContract as Address,
      tokenId: asset.tokenId,
      metadata: metadata || {
        title: asset.title || asset.name,
        description: asset.description,
        imageUrl: asset.nftMetadata?.image?.cachedUrl || asset.nftMetadata?.image?.originalUrl,
        ipMetadataURI: asset.ipaMetadataUri,
        nftMetadataURI: asset.nftMetadata?.tokenUri,
        creator: asset.ownerAddress as Address,
      },
      licenseTermsIds: asset.licenses?.map((l: any) => BigInt(l.licenseTermsId)),
      parentCount: asset.parentsCount || 0,
      derivativeCount: asset.childrenCount || 0,
      generation: 0, // Will be calculated based on parent relationships
      createdAt: asset.createdAt ? new Date(asset.createdAt) : undefined,
    }
  } catch (error) {
    console.error("Error fetching IP asset:", error)
    return null
  }
}

/**
 * Get parent IPs for a given child IP using the edges API
 */
export async function getParentIps(childIpId: Address): Promise<Address[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STORY_API_URL || "https://api.storyapis.com/api/v4"
    
    const response = await fetch(`${apiUrl}/assets/edges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.NEXT_PUBLIC_STORY_API_KEY && {
          "X-Api-Key": process.env.NEXT_PUBLIC_STORY_API_KEY,
        }),
      },
      body: JSON.stringify({
        where: {
          childIpId: childIpId,
        },
        pagination: {
          limit: 200, // Max allowed
          offset: 0,
        },
        orderBy: "blockNumber",
        orderDirection: "asc",
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const result = await response.json()
    const edges = result.data || []

    // Extract unique parent IPs from edges
    const parentIds = edges.map((edge: any) => edge.parentIpId as Address)
    return Array.from(new Set(parentIds)) as Address[] // Remove duplicates
  } catch (error) {
    console.error("Error fetching parent IPs:", error)
    return []
  }
}

/**
 * Get derivative IPs for a given parent IP using the edges API
 */
export async function getDerivativeIps(parentIpId: Address): Promise<Address[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STORY_API_URL || "https://api.storyapis.com/api/v4"
    
    const response = await fetch(`${apiUrl}/assets/edges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.NEXT_PUBLIC_STORY_API_KEY && {
          "X-Api-Key": process.env.NEXT_PUBLIC_STORY_API_KEY,
        }),
      },
      body: JSON.stringify({
        where: {
          parentIpId: parentIpId,
        },
        pagination: {
          limit: 200, // Max allowed
          offset: 0,
        },
        orderBy: "blockNumber",
        orderDirection: "asc",
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const result = await response.json()
    const edges = result.data || []

    // Extract unique child IPs from edges
    const childIds = edges.map((edge: any) => edge.childIpId as Address)
    return Array.from(new Set(childIds)) as Address[] // Remove duplicates
  } catch (error) {
    console.error("Error fetching derivative IPs:", error)
    return []
  }
}

/**
 * Get license terms for an IP asset using the transactions endpoint
 */
export async function getLicenseTerms(ipId: Address): Promise<LicenseTerms[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STORY_API_URL || "https://api.storyapis.com/api/v4"
    
    const response = await fetch(`${apiUrl}/assets/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.NEXT_PUBLIC_STORY_API_KEY && {
          "X-Api-Key": process.env.NEXT_PUBLIC_STORY_API_KEY,
        }),
      },
      body: JSON.stringify({
        where: {
          ipId: ipId,
          eventTypes: ["LicenseTermsAttached"],
        },
        pagination: {
          limit: 200,
          offset: 0,
        },
        orderBy: "blockNumber",
        orderDirection: "asc",
      }),
    })

    if (!response.ok) {
      // If transactions endpoint doesn't work, try to get from asset data
      const asset = await getIpAsset(ipId)
      if (asset?.licenseTermsIds && asset.licenseTermsIds.length > 0) {
        // Return minimal license terms data from asset
        return asset.licenseTermsIds.map((id) => ({
          id,
          transferable: true,
          royaltyPolicy: "0x" as Address,
          defaultMintingFee: 0n,
          expiration: 0n,
          commercialUse: false,
          commercialAttribution: false,
          commercializerChecker: "0x" as Address,
          commercializerCheckerData: "",
          commercialRevShare: 0,
          commercialRevCeiling: 0n,
          derivativesAllowed: false,
          derivativesAttribution: false,
          derivativesApproval: false,
          derivativesReciprocal: false,
          derivativeRevCeiling: 0n,
          currency: "0x" as Address,
          uri: "",
        }))
      }
      return []
    }

    const result = await response.json()
    const events = result.data || []

    // Extract unique license terms from events
    const licenseTermsMap = new Map<string, LicenseTerms>()

    for (const event of events) {
      const licenseTermsId = event.licenseTermsId
      if (!licenseTermsId || licenseTermsMap.has(licenseTermsId)) continue

      // Map event data to LicenseTerms
      licenseTermsMap.set(licenseTermsId, {
        id: BigInt(licenseTermsId),
        transferable: event.terms?.transferable ?? true,
        royaltyPolicy: (event.terms?.royaltyPolicy || "0x") as Address,
        defaultMintingFee: event.terms?.defaultMintingFee ? BigInt(event.terms.defaultMintingFee) : 0n,
        expiration: event.terms?.expiration ? BigInt(event.terms.expiration) : 0n,
        commercialUse: event.terms?.commercialUse ?? false,
        commercialAttribution: event.terms?.commercialAttribution ?? false,
        commercializerChecker: (event.terms?.commercializerChecker || "0x") as Address,
        commercializerCheckerData: event.terms?.commercializerCheckerData || "",
        commercialRevShare: event.terms?.commercialRevShare ?? 0,
        commercialRevCeiling: event.terms?.commercialRevCeiling ? BigInt(event.terms.commercialRevCeiling) : 0n,
        derivativesAllowed: event.terms?.derivativesAllowed ?? false,
        derivativesAttribution: event.terms?.derivativesAttribution ?? false,
        derivativesApproval: event.terms?.derivativesApproval ?? false,
        derivativesReciprocal: event.terms?.derivativesReciprocal ?? false,
        derivativeRevCeiling: event.terms?.derivativeRevCeiling ? BigInt(event.terms.derivativeRevCeiling) : 0n,
        currency: (event.terms?.currency || "0x") as Address,
        uri: event.terms?.uri || "",
      })
    }

    return Array.from(licenseTermsMap.values())
  } catch (error) {
    console.error("Error fetching license terms:", error)
    return []
  }
}

/**
 * Get royalty information for an IP asset using SDK
 * Note: Some SDK methods require a connected wallet
 */
export async function getRoyaltyInfo(ipId: Address): Promise<RoyaltyInfo | null> {
  try {
    // Get license terms to extract royalty policy
    const licenseTerms = await getLicenseTerms(ipId)
    const royaltyPolicy = licenseTerms[0]?.royaltyPolicy || ("0x" as Address)

    // Query transactions for royalty distribution events
    const recipients = await getRoyaltyRecipients(ipId)

    // SDK calls require wallet - skip if not connected
    let vaultAddress: Address | undefined
    let unclaimedRevenue: bigint | undefined
    
    try {
      const client = getStoryClient()
      
      // Get royalty vault address for this IP
      vaultAddress = await client.royalty.getRoyaltyVaultAddress(ipId)
      
      if (vaultAddress) {
        // Get claimable revenue in WIP token
        const wipToken = "0x1514000000000000000000000000000000000000" as Address
        
        unclaimedRevenue = await client.royalty.claimableRevenue({
          ipId,
          claimer: ipId, // IP Account is typically the claimer
          token: wipToken,
        })
      }
    } catch (err) {
      // SDK methods require wallet connection - this is expected without wallet
      console.info("Royalty SDK calls skipped (wallet not connected):", err instanceof Error ? err.message : err)
    }

    return {
      recipients,
      royaltyPolicy,
      unclaimedRevenue,
    }
  } catch (error) {
    console.error("Error fetching royalty info:", error)
    return null
  }
}

/**
 * Get royalty recipients from transaction history
 */
async function getRoyaltyRecipients(ipId: Address): Promise<{ address: Address; percentage: number }[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STORY_API_URL || "https://api.storyapis.com/api/v4"
    
    // Query for royalty-related events
    const response = await fetch(`${apiUrl}/assets/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.NEXT_PUBLIC_STORY_API_KEY && {
          "X-Api-Key": process.env.NEXT_PUBLIC_STORY_API_KEY,
        }),
      },
      body: JSON.stringify({
        where: {
          ipIds: [ipId],
          eventTypes: [
            "RoyaltyTokensCollected",
            "RevenueTransferredToVault",
            "RoyaltyPaid",
          ],
        },
        pagination: {
          limit: 200,
          offset: 0,
        },
        orderBy: "blockNumber",
        orderDirection: "desc",
      }),
    })

    if (!response.ok) {
      return []
    }

    const result = await response.json()
    const events = result.data || []

    // Extract unique recipients from royalty events
    const recipientsMap = new Map<Address, number>()

    for (const event of events) {
      // Extract recipient information from event data
      // Note: The exact structure depends on the event type
      // This is a simplified implementation
      if (event.initiator && event.initiator !== ipId) {
        recipientsMap.set(event.initiator as Address, 0) // Percentage would come from event details
      }
    }

    // If no recipients found from events, return empty array
    // In production, you might query the IpRoyaltyVault contract directly
    return Array.from(recipientsMap.entries()).map(([address, percentage]) => ({
      address,
      percentage,
    }))
  } catch (error) {
    console.error("Error fetching royalty recipients:", error)
    return []
  }
}

/**
 * Fetch IP metadata from IPFS or other storage with timeout
 */
export async function fetchIpMetadata(metadataURI: string): Promise<IpMetadata | null> {
  try {
    // Handle IPFS URIs
    const url = metadataURI.startsWith("ipfs://")
      ? metadataURI.replace("ipfs://", "https://ipfs.io/ipfs/")
      : metadataURI

    // Add timeout to IPFS requests (5 seconds)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    
    if (!response.ok) throw new Error("Failed to fetch metadata")

    const metadata = await response.json()
    return metadata as IpMetadata
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.warn("IPFS metadata fetch timed out:", metadataURI)
    } else {
      console.error("Error fetching IP metadata:", error)
    }
    return null
  }
}

/**
 * Build full graph data for an IP asset and its relationships using edges API
 * Optimized for large graphs with configurable limits
 */
export async function buildIpGraph(
  rootIpId: Address, 
  depth: number = 1,
  maxNodes: number = 50
): Promise<GraphData> {
  const nodes: IpAssetNode[] = []
  const edges: IpAssetEdge[] = []
  const visited = new Set<Address>()
  const edgeCache = new Map<string, any[]>()

  // Fetch edges with limit to prevent overwhelming API
  async function fetchEdgesForIp(ipId: Address, direction: "parent" | "child", limit: number = 50): Promise<any[]> {
    const cacheKey = `${ipId}-${direction}`
    if (edgeCache.has(cacheKey)) {
      return edgeCache.get(cacheKey)!
    }

    const apiUrl = process.env.NEXT_PUBLIC_STORY_API_URL || "https://api.storyapis.com/api/v4"
    
    try {
      const response = await fetch(`${apiUrl}/assets/edges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.NEXT_PUBLIC_STORY_API_KEY && {
            "X-Api-Key": process.env.NEXT_PUBLIC_STORY_API_KEY,
          }),
        },
        body: JSON.stringify({
          where: direction === "parent" ? { childIpId: ipId } : { parentIpId: ipId },
          pagination: { limit: Math.min(limit, 200), offset: 0 }, // Limit to prevent overload
          orderBy: "blockNumber",
          orderDirection: "asc",
        }),
      })

      if (!response.ok) {
        edgeCache.set(cacheKey, [])
        return []
      }

      const result = await response.json()
      const edgeData = result.data || []
      edgeCache.set(cacheKey, edgeData)
      return edgeData
    } catch (err) {
      console.error(`Error fetching edges for ${ipId}:`, err)
      edgeCache.set(cacheKey, [])
      return []
    }
  }

  async function traverse(ipId: Address, currentDepth: number, generation: number) {
    // Stop if we've reached depth limit, visited this node, or hit max nodes
    if (currentDepth > depth || visited.has(ipId) || nodes.length >= maxNodes) return
    visited.add(ipId)

    // Fetch IP asset data
    const ipAsset = await getIpAsset(ipId)
    if (!ipAsset) return

    ipAsset.generation = generation
    nodes.push(ipAsset)

    // Only fetch edges if we haven't hit the node limit
    if (nodes.length >= maxNodes) return

    // For depth 0 (root), fetch more children. For other depths, limit more aggressively
    const childLimit = currentDepth === 0 ? 20 : 5
    const parentLimit = currentDepth === 0 ? 20 : 5

    // Get parent edges
    const parentEdges = await fetchEdgesForIp(ipId, "parent", parentLimit)
    for (const edge of parentEdges) {
      if (nodes.length >= maxNodes) break
      
      const parentId = edge.parentIpId as Address
      edges.push({
        source: parentId,
        target: ipId,
        type: "derivative",
        licenseTermsId: edge.licenseTermsId ? BigInt(edge.licenseTermsId) : undefined,
        licenseTokenId: edge.licenseTokenId,
        licenseTemplate: edge.licenseTemplate as Address,
        blockNumber: edge.blockNumber,
        txHash: edge.txHash,
      })
      
      // Only traverse parents if depth > 0
      if (currentDepth < depth) {
        await traverse(parentId, currentDepth + 1, generation - 1)
      }
    }

    // Get derivative edges (children)
    const childEdges = await fetchEdgesForIp(ipId, "child", childLimit)
    for (const edge of childEdges) {
      if (nodes.length >= maxNodes) break
      
      const childId = edge.childIpId as Address
      edges.push({
        source: ipId,
        target: childId,
        type: "derivative",
        licenseTermsId: edge.licenseTermsId ? BigInt(edge.licenseTermsId) : undefined,
        licenseTokenId: edge.licenseTokenId,
        licenseTemplate: edge.licenseTemplate as Address,
        blockNumber: edge.blockNumber,
        txHash: edge.txHash,
      })
      
      // Only traverse children if depth > 0
      if (currentDepth < depth) {
        await traverse(childId, currentDepth + 1, generation + 1)
      }
    }
  }

  await traverse(rootIpId, 0, 0)

  return { nodes, edges }
}

/**
 * Search IP assets with filters
 */
export async function searchIpAssets(filters: SearchFilters): Promise<IpAssetNode[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STORY_API_URL || "https://api.storyapis.com/api/v4"
    
    const whereClause: any = {}
    
    if (filters.creator) {
      whereClause.ownerAddress = filters.creator
    }
    
    const response = await fetch(`${apiUrl}/assets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.NEXT_PUBLIC_STORY_API_KEY && {
          "X-Api-Key": process.env.NEXT_PUBLIC_STORY_API_KEY,
        }),
      },
      body: JSON.stringify({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        pagination: {
          limit: 50,
          offset: 0,
        },
        orderBy: "blockNumber",
        orderDirection: "desc",
        includeLicenses: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const result = await response.json()
    const assets = result.data || []

    return Promise.all(
      assets.map(async (asset: any) => {
        let metadata: IpMetadata | undefined
        if (asset.ipaMetadataUri) {
          const fetchedMetadata = await fetchIpMetadata(asset.ipaMetadataUri)
          if (fetchedMetadata) {
            metadata = fetchedMetadata
          }
        }

        return {
          id: asset.ipId as Address,
          nftContract: asset.tokenContract as Address,
          tokenId: asset.tokenId,
          metadata: metadata || {
            title: asset.title || asset.name,
            description: asset.description,
            imageUrl: asset.nftMetadata?.image?.cachedUrl,
            creator: asset.ownerAddress as Address,
          },
          parentCount: asset.parentsCount || 0,
          derivativeCount: asset.childrenCount || 0,
          generation: 0,
          createdAt: asset.createdAt ? new Date(asset.createdAt) : undefined,
        }
      })
    )
  } catch (error) {
    console.error("Error searching IP assets:", error)
    return []
  }
}

/**
 * Calculate derivative depth (generation) for an IP asset
 */
export async function calculateDerivativeDepth(ipId: Address): Promise<number> {
  let depth = 0
  let currentId = ipId

  while (true) {
    const parents = await getParentIps(currentId)
    if (parents.length === 0) break

    depth++
    currentId = parents[0] // Follow first parent for depth calculation
    
    // Prevent infinite loops
    if (depth > 100) break
  }

  return depth
}

/**
 * Get all ancestors (recursive parent traversal)
 */
export async function getAncestors(ipId: Address): Promise<Address[]> {
  const ancestors: Address[] = []
  const visited = new Set<Address>()

  async function traverse(currentId: Address) {
    if (visited.has(currentId)) return
    visited.add(currentId)

    const parents = await getParentIps(currentId)
    for (const parentId of parents) {
      ancestors.push(parentId)
      await traverse(parentId)
    }
  }

  await traverse(ipId)
  return ancestors
}

/**
 * Get all descendants (recursive derivative traversal)
 */
export async function getDescendants(ipId: Address): Promise<Address[]> {
  const descendants: Address[] = []
  const visited = new Set<Address>()

  async function traverse(currentId: Address) {
    if (visited.has(currentId)) return
    visited.add(currentId)

    const derivatives = await getDerivativeIps(currentId)
    for (const derivId of derivatives) {
      descendants.push(derivId)
      await traverse(derivId)
    }
  }

  await traverse(ipId)
  return descendants
}

