"use client"

import { useEffect, useRef, useState } from "react"
import cytoscape, { Core } from "cytoscape"
import cola from "cytoscape-cola"
import { Button } from "@/components/ui/button"
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  RefreshCw,
} from "lucide-react"
import {
  cytoscapeStylesheet,
  cytoscapeLayout,
  cytoscapeOptions,
} from "@/lib/graph/cytoscape-config"
import {
  buildGraphData,
  exportGraphAsImage,
  fitGraphToViewport,
  centerOnNode,
  highlightRemixPath,
  clearHighlights,
  getGraphStats,
} from "@/lib/graph/graph-utils"
import type { GraphData } from "@/lib/story/types"
import { Address } from "viem"

// Register cola layout
if (typeof cytoscape !== "undefined") {
  cytoscape.use(cola)
}

interface IpGraphProps {
  graphData: GraphData
  focusNodeId?: Address
  onNodeClick?: (nodeId: Address) => void
  onNodeHover?: (nodeId: Address | null) => void
  className?: string
}

export function IpGraph({
  graphData,
  focusNodeId,
  onNodeClick,
  onNodeHover,
  className,
}: IpGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<Core | null>(null)
  const [stats, setStats] = useState<ReturnType<typeof getGraphStats> | null>(
    null
  )

  // Initialize Cytoscape
  useEffect(() => {
    if (!containerRef.current || cyRef.current) return

    const elements = buildGraphData(graphData.nodes, graphData.edges)

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements,
      style: cytoscapeStylesheet,
      layout: cytoscapeLayout as any,
      ...cytoscapeOptions,
    })

    const cy = cyRef.current

    // Event handlers
    cy.on("tap", "node", (evt) => {
      const node = evt.target
      onNodeClick?.(node.id())
    })

    cy.on("mouseover", "node", (evt) => {
      const node = evt.target
      onNodeHover?.(node.id())
    })

    cy.on("mouseout", "node", () => {
      onNodeHover?.(null)
    })

    // Update stats
    setStats(getGraphStats(cy))

    return () => {
      cy.destroy()
      cyRef.current = null
    }
  }, [graphData, onNodeClick, onNodeHover])

  // Focus on specific node
  useEffect(() => {
    if (cyRef.current && focusNodeId) {
      centerOnNode(cyRef.current, focusNodeId, 1.5)
    }
  }, [focusNodeId])

  const handleZoomIn = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 1.2)
      cyRef.current.center()
    }
  }

  const handleZoomOut = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 0.8)
      cyRef.current.center()
    }
  }

  const handleFit = () => {
    if (cyRef.current) {
      fitGraphToViewport(cyRef.current)
    }
  }

  const handleExport = () => {
    if (cyRef.current) {
      exportGraphAsImage(cyRef.current)
    }
  }

  const handleReset = () => {
    if (cyRef.current) {
      clearHighlights(cyRef.current)
      cyRef.current.layout(cytoscapeLayout as any).run()
      fitGraphToViewport(cyRef.current)
    }
  }

  return (
    <div className={`relative h-full w-full ${className || ""}`}>
      {/* Graph Container */}
      <div ref={containerRef} className="h-full w-full bg-muted/20 rounded-lg" />

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button size="icon" variant="secondary" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={handleFit}>
          <Maximize className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={handleReset}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={handleExport}>
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="absolute bottom-4 left-4 rounded-lg border bg-background/95 p-3 text-sm backdrop-blur">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-muted-foreground">Nodes:</span>
            <span className="font-medium">{stats.totalNodes}</span>
            <span className="text-muted-foreground">Edges:</span>
            <span className="font-medium">{stats.totalEdges}</span>
            <span className="text-muted-foreground">Max Depth:</span>
            <span className="font-medium">{stats.maxGeneration}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 rounded-lg border bg-background/95 p-3 text-sm backdrop-blur">
        <div className="font-semibold mb-2">Legend</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-purple-500 border-2 border-purple-700"></div>
            <span>Root IP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-blue-700"></div>
            <span>Derivative</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 bg-blue-500"></div>
            <span>Parent-Child</span>
          </div>
        </div>
      </div>
    </div>
  )
}


