"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { shortenAddress } from "@/lib/utils"
import type { IpAssetNode } from "@/lib/story/types"
import Link from "next/link"
import { GitBranch, ExternalLink } from "lucide-react"
import Image from "next/image"

interface IpCardProps {
  ipAsset: IpAssetNode
}

export function IpCard({ ipAsset }: IpCardProps) {
  return (
    <Link href={`/ip/${ipAsset.id}`}>
      <Card className="transition-all hover:shadow-lg hover:border-primary cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">
              {ipAsset.metadata?.title || shortenAddress(ipAsset.id)}
            </CardTitle>
            {ipAsset.generation !== undefined && (
              <Badge variant="secondary">Gen {ipAsset.generation}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Image */}
          {ipAsset.metadata?.imageUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <Image
                src={ipAsset.metadata.imageUrl}
                alt={ipAsset.metadata.title || "IP Asset"}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Description */}
          {ipAsset.metadata?.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {ipAsset.metadata.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {ipAsset.derivativeCount} derivatives
                </span>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Creator */}
          {ipAsset.metadata?.creator && (
            <div className="text-xs text-muted-foreground">
              by {shortenAddress(ipAsset.metadata.creator)}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

