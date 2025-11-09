"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { shortenAddress } from "@/lib/utils"
import { getExplorerUrl } from "@/config/contracts"
import { ExternalLink } from "lucide-react"
import type { RoyaltyInfo } from "@/lib/story/types"
import { Button } from "@/components/ui/button"

interface RoyaltyInfoProps {
  royaltyInfo: RoyaltyInfo | null
}

export function RoyaltyInfoDisplay({ royaltyInfo }: RoyaltyInfoProps) {
  if (!royaltyInfo || royaltyInfo.recipients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Royalty Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No royalty information available for this IP asset.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Royalty Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Royalty Policy */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Royalty Policy</span>
          <div className="flex items-center gap-2">
            <code className="rounded bg-muted px-2 py-1 text-xs">
              {shortenAddress(royaltyInfo.royaltyPolicy)}
            </code>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              asChild
            >
              <a
                href={getExplorerUrl(royaltyInfo.royaltyPolicy, "address")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>

        {/* Revenue Stats */}
        {(royaltyInfo.totalRevenue !== undefined ||
          royaltyInfo.unclaimedRevenue !== undefined) && (
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
            {royaltyInfo.totalRevenue !== undefined && (
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {royaltyInfo.totalRevenue.toString()}
                </div>
                <div className="text-xs text-muted-foreground">Total Revenue</div>
              </div>
            )}
            {royaltyInfo.unclaimedRevenue !== undefined && (
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {royaltyInfo.unclaimedRevenue.toString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Unclaimed Revenue
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recipients */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Recipients</h4>
          <div className="space-y-2">
            {royaltyInfo.recipients.map((recipient, index) => (
              <div
                key={`${recipient.address}-${index}`}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-2">
                  <code className="rounded bg-muted px-2 py-1 text-xs">
                    {shortenAddress(recipient.address)}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    asChild
                  >
                    <a
                      href={getExplorerUrl(recipient.address, "address")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
                <Badge variant="secondary">{recipient.percentage}%</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Visualization */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Distribution</h4>
          <div className="space-y-2">
            {royaltyInfo.recipients.map((recipient, index) => (
              <div key={`bar-${recipient.address}-${index}`} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {shortenAddress(recipient.address)}
                  </span>
                  <span className="font-medium">{recipient.percentage}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${recipient.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

