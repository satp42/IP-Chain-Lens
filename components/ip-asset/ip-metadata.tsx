"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy, Check } from "lucide-react"
import { shortenAddress } from "@/lib/utils"
import { getExplorerUrl } from "@/config/contracts"
import type { IpAssetNode } from "@/lib/story/types"
import { useState } from "react"
import Image from "next/image"

interface IpMetadataProps {
  ipAsset: IpAssetNode
}

export function IpMetadata({ ipAsset }: IpMetadataProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const metadata = ipAsset.metadata

  return (
    <Card>
      <CardHeader>
        <CardTitle>IP Asset Metadata</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image */}
        {metadata?.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src={metadata.imageUrl}
              alt={metadata?.title || "IP Asset"}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Title & Description */}
        {metadata?.title && (
          <div>
            <h3 className="text-lg font-semibold">{metadata.title}</h3>
            {metadata.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {metadata.description}
              </p>
            )}
          </div>
        )}

        {/* IP Asset ID */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">IP Asset ID</span>
            <div className="flex items-center gap-2">
              <code className="rounded bg-muted px-2 py-1 text-xs">
                {shortenAddress(ipAsset.id)}
              </code>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => copyToClipboard(ipAsset.id, "ipId")}
              >
                {copiedField === "ipId" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                asChild
              >
                <a
                  href={getExplorerUrl(ipAsset.id, "address")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* NFT Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">NFT Contract</span>
            <div className="flex items-center gap-2">
              <code className="rounded bg-muted px-2 py-1 text-xs">
                {shortenAddress(ipAsset.nftContract)}
              </code>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => copyToClipboard(ipAsset.nftContract, "nftContract")}
              >
                {copiedField === "nftContract" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Token ID</span>
            <code className="rounded bg-muted px-2 py-1 text-xs">
              #{ipAsset.tokenId}
            </code>
          </div>
        </div>

        {/* Creator */}
        {metadata?.creator && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Creator</span>
            <div className="flex items-center gap-2">
              <code className="rounded bg-muted px-2 py-1 text-xs">
                {shortenAddress(metadata.creator)}
              </code>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                asChild
              >
                <a
                  href={getExplorerUrl(metadata.creator, "address")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Relationship Stats */}
        <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {ipAsset.parentCount}
            </div>
            <div className="text-xs text-muted-foreground">Parent IPs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {ipAsset.derivativeCount}
            </div>
            <div className="text-xs text-muted-foreground">Derivatives</div>
          </div>
        </div>

        {/* Generation Badge */}
        {ipAsset.generation !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Generation Depth</span>
            <Badge variant="secondary">Generation {ipAsset.generation}</Badge>
          </div>
        )}

        {/* Metadata URIs */}
        {(metadata?.ipMetadataURI || metadata?.nftMetadataURI) && (
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-sm font-medium">Metadata Links</h4>
            {metadata?.ipMetadataURI && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <a
                  href={metadata.ipMetadataURI}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-3 w-3" />
                  IP Metadata
                </a>
              </Button>
            )}
            {metadata?.nftMetadataURI && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <a
                  href={metadata.nftMetadataURI}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-3 w-3" />
                  NFT Metadata
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

