"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitBranch, X } from "lucide-react"
import type { Core } from "cytoscape"
import type { IpAssetNode } from "@/lib/story/types"
import { Address } from "viem"
import { highlightRemixPath, clearHighlights } from "@/lib/graph/graph-utils"
import { shortenAddress } from "@/lib/utils"

interface RemixPathHighlighterProps {
  cy: Core | null
  nodes: IpAssetNode[]
  rootNodeId: Address
}

export function RemixPathHighlighter({
  cy,
  nodes,
  rootNodeId,
}: RemixPathHighlighterProps) {
  const [targetNodeId, setTargetNodeId] = useState<Address | null>(null)
  const [isHighlighted, setIsHighlighted] = useState(false)

  const rootNode = nodes.find((n) => n.id === rootNodeId)
  const targetNode = targetNodeId
    ? nodes.find((n) => n.id === targetNodeId)
    : null

  const handleHighlight = () => {
    if (!cy || !targetNodeId) return

    highlightRemixPath(cy, rootNodeId, targetNodeId)
    setIsHighlighted(true)
  }

  const handleClear = () => {
    if (!cy) return

    clearHighlights(cy)
    setIsHighlighted(false)
    setTargetNodeId(null)
  }

  const calculatePathDepth = (): number => {
    if (!targetNode || !rootNode) return 0

    const rootGen = rootNode.generation || 0
    const targetGen = targetNode.generation || 0

    return Math.abs(targetGen - rootGen)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Remix Path Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Root IP Asset</Label>
          <div className="rounded-md border p-3 bg-muted/50">
            <div className="flex items-center justify-between">
              <code className="text-sm">
                {rootNode?.metadata?.title || shortenAddress(rootNodeId)}
              </code>
              {rootNode?.generation !== undefined && (
                <Badge variant="secondary">Gen {rootNode.generation}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target-node">Target Derivative</Label>
          <Select
            value={targetNodeId || ""}
            onValueChange={(value) => setTargetNodeId(value as Address)}
          >
            <SelectTrigger id="target-node">
              <SelectValue placeholder="Select a derivative..." />
            </SelectTrigger>
            <SelectContent>
              {nodes
                .filter((n) => n.id !== rootNodeId)
                .sort((a, b) => (a.generation || 0) - (b.generation || 0))
                .map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>
                        {node.metadata?.title || shortenAddress(node.id)}
                      </span>
                      {node.generation !== undefined && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          Gen {node.generation}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {targetNode && (
          <div className="space-y-2 rounded-lg border p-3 bg-primary/5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Path Depth</span>
              <Badge variant="default">{calculatePathDepth()} generations</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Target Generation</span>
              <Badge variant="secondary">Gen {targetNode.generation || 0}</Badge>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleHighlight}
            disabled={!targetNodeId || isHighlighted}
            className="flex-1"
          >
            <GitBranch className="mr-2 h-4 w-4" />
            Highlight Path
          </Button>
          {isHighlighted && (
            <Button onClick={handleClear} variant="outline" size="icon">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isHighlighted && (
          <p className="text-xs text-muted-foreground text-center">
            Path highlighted in purple. Click clear to reset.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

