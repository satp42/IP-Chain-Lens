"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { isAddress, Address } from "viem"
import { IpCard } from "@/components/ip-asset/ip-card"
import { FilterPanel } from "@/components/search/filter-panel"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { searchIpAssets } from "@/lib/story/queries"
import type { IpAssetNode, SearchFilters } from "@/lib/story/types"
import { IpCardSkeleton } from "@/components/loading-skeleton"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const type = searchParams.get("type") || "keyword"

  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<IpAssetNode[]>([])
  const [filters, setFilters] = useState<SearchFilters>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) return

    performSearch()
  }, [query, type, filters])

  async function performSearch() {
    try {
      setLoading(true)
      setError(null)

      const searchFilters: SearchFilters = { ...filters }

      // Determine search type
      if (type === "address" && isAddress(query)) {
        // Could be tokenContract or ownerAddress
        // Try both
        searchFilters.creator = query as Address
        
        // Also try as token contract in a separate query
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
              tokenContract: query,
            },
            pagination: {
              limit: 50,
              offset: 0,
            },
            orderBy: "blockNumber",
            orderDirection: "desc",
            includeLicenses: true,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          const contractAssets = result.data || []
          
          // Also get assets by owner
          const ownerAssets = await searchIpAssets(searchFilters)
          
          // Combine and deduplicate
          const allAssets = [...contractAssets, ...ownerAssets]
          const uniqueAssets = Array.from(
            new Map(allAssets.map((a: any) => [a.ipId || a.id, a])).values()
          )
          
          setResults(uniqueAssets.map((asset: any) => ({
            id: asset.ipId as Address,
            nftContract: asset.tokenContract as Address,
            tokenId: asset.tokenId,
            metadata: {
              title: asset.title || asset.name,
              description: asset.description,
              imageUrl: asset.nftMetadata?.image?.cachedUrl,
              creator: asset.ownerAddress as Address,
            },
            parentCount: asset.parentsCount || 0,
            derivativeCount: asset.childrenCount || 0,
            generation: 0,
          })))
        } else {
          // Fallback to owner search only
          const ownerAssets = await searchIpAssets(searchFilters)
          setResults(ownerAssets)
        }
      } else {
        // Keyword search
        searchFilters.searchQuery = query
        const assets = await searchIpAssets(searchFilters)
        setResults(assets)
      }
    } catch (err) {
      console.error("Search error:", err)
      setError("Failed to search IP assets. Please try again.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Search Results</h1>
          <p className="text-muted-foreground">
            {loading ? "Searching..." : `Found ${results.length} IP asset(s) for "${query}"`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <FilterPanel onFilterChange={handleFilterChange} onClear={handleClearFilters} />

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <IpCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No IP assets found matching your search.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or search query.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((asset) => (
                <IpCard key={asset.id} ipAsset={asset} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

