"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { isAddress, Address } from "viem"

interface SearchBarProps {
  onSearch?: (query: string, type: "ipId" | "tokenContract" | "ownerAddress") => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) return

    const trimmedQuery = query.trim()

    // Check if it's a valid Ethereum address
    if (isAddress(trimmedQuery)) {
      setIsSearching(true)
      
      // Try as IP Asset ID first
      try {
        const { getIpAsset } = await import("@/lib/story/queries")
        const asset = await getIpAsset(trimmedQuery as Address)
        
        if (asset) {
          // Valid IP Asset ID - navigate to detail page
          router.push(`/ip/${trimmedQuery}`)
          return
        }
      } catch (err) {
        console.error("Error checking IP asset:", err)
      }

      // Not an IP Asset, could be tokenContract or ownerAddress
      // Navigate to search results page with the query
      const searchParams = new URLSearchParams({
        q: trimmedQuery,
        type: "address",
      })
      router.push(`/search?${searchParams.toString()}`)
      setIsSearching(false)
      
      // Also call the callback if provided
      if (onSearch) {
        onSearch(trimmedQuery, "tokenContract")
      }
    } else {
      // Not a valid address - treat as keyword search
      const searchParams = new URLSearchParams({
        q: trimmedQuery,
        type: "keyword",
      })
      router.push(`/search?${searchParams.toString()}`)
      
      if (onSearch) {
        onSearch(trimmedQuery, "tokenContract")
      }
    }
  }

  const clearSearch = () => {
    setQuery("")
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by IP ID, NFT contract, creator address, or keywords..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
          disabled={isSearching}
        />
        {query && !isSearching && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button type="submit" disabled={isSearching}>
        {isSearching ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Searching...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Search
          </>
        )}
      </Button>
    </form>
  )
}


