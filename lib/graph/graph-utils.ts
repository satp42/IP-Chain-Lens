import type { Core, ElementDefinition } from "cytoscape"
import type { GraphData, IpAssetNode, IpAssetEdge } from "@/lib/story/types"
import { Address } from "viem"
import { shortenAddress } from "@/lib/utils"

/**
 * Convert IP asset data to Cytoscape format
 */
export function buildGraphData(
  nodes: IpAssetNode[],
  edges: IpAssetEdge[]
): ElementDefinition[] {
  const elements: ElementDefinition[] = []
  const nodeIds = new Set(nodes.map(n => n.id))

  // Add nodes first
  for (const node of nodes) {
    elements.push({
      data: {
        id: node.id,
        label: shortenAddress(node.id),
        generation: node.generation || 0,
        tokenId: node.tokenId,
        nftContract: node.nftContract,
        parentCount: node.parentCount,
        derivativeCount: node.derivativeCount,
        metadata: node.metadata,
      },
      classes: node.generation === 0 ? "root-node" : "",
    })
  }

  // Add edges only if both source and target nodes exist
  for (const edge of edges) {
    // Skip edge if source or target node doesn't exist
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      console.warn(`Skipping edge ${edge.source}-${edge.target}: missing node`)
      continue
    }

    elements.push({
      data: {
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        licenseTermsId: edge.licenseTermsId,
      },
    })
  }

  return elements
}

/**
 * Calculate derivative depth for all nodes in graph
 */
export function calculateNodeGenerations(
  nodes: IpAssetNode[],
  edges: IpAssetEdge[]
): Map<Address, number> {
  const generations = new Map<Address, number>()
  const childToParents = new Map<Address, Address[]>()

  // Build parent lookup
  for (const edge of edges) {
    if (edge.type === "derivative") {
      if (!childToParents.has(edge.target)) {
        childToParents.set(edge.target, [])
      }
      childToParents.get(edge.target)!.push(edge.source)
    }
  }

  // Find root nodes (no parents)
  const roots: Address[] = []
  for (const node of nodes) {
    if (!childToParents.has(node.id)) {
      roots.push(node.id)
      generations.set(node.id, 0)
    }
  }

  // BFS to calculate generations
  const queue: Array<{ id: Address; gen: number }> = roots.map((id) => ({
    id,
    gen: 0,
  }))
  const visited = new Set<Address>()

  while (queue.length > 0) {
    const { id, gen } = queue.shift()!
    if (visited.has(id)) continue
    visited.add(id)

    generations.set(id, gen)

    // Find children (edges where this node is source)
    for (const edge of edges) {
      if (edge.type === "derivative" && edge.source === id) {
        queue.push({ id: edge.target, gen: gen + 1 })
      }
    }
  }

  return generations
}

/**
 * Highlight path between two nodes
 */
export function highlightRemixPath(
  cy: Core,
  rootId: Address,
  targetId: Address
): void {
  // Reset all elements
  cy.elements().removeClass("highlighted dimmed")

  // Find path
  const path = cy
    .elements()
    .aStar({
      root: cy.$id(rootId),
      goal: cy.$id(targetId),
      directed: true,
    })

  if (!path.found) {
    return
  }

  // Highlight path
  path.path.addClass("highlighted")

  // Dim everything else
  cy.elements().not(path.path).addClass("dimmed")
}

/**
 * Clear all highlights
 */
export function clearHighlights(cy: Core): void {
  cy.elements().removeClass("highlighted dimmed")
}

/**
 * Get all nodes at a specific generation
 */
export function getNodesAtGeneration(
  cy: Core,
  generation: number
): cytoscape.CollectionReturnValue {
  return cy.nodes(`[generation = ${generation}]`)
}

/**
 * Get statistics about the graph
 */
export function getGraphStats(cy: Core) {
  const nodes = cy.nodes()
  const edges = cy.edges()

  const generations = new Set<number>()
  nodes.forEach((node) => {
    const gen = node.data("generation")
    if (gen !== undefined) generations.add(gen)
  })

  return {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    maxGeneration: Math.max(...Array.from(generations), 0),
    minGeneration: Math.min(...Array.from(generations), 0),
    generationCount: generations.size,
  }
}

/**
 * Export graph as image
 */
export function exportGraphAsImage(cy: Core, filename: string = "ip-graph.png"): void {
  const png = cy.png({
    full: true,
    scale: 2,
    bg: "#ffffff",
  })

  // Download the image
  const link = document.createElement("a")
  link.href = png
  link.download = filename
  link.click()
}

/**
 * Fit graph to viewport
 */
export function fitGraphToViewport(cy: Core, padding: number = 50): void {
  cy.fit(cy.elements(), padding)
}

/**
 * Center on specific node
 */
export function centerOnNode(cy: Core, nodeId: Address, zoom?: number): void {
  const node = cy.$id(nodeId)
  if (node.length > 0) {
    cy.animate({
      center: { eles: node },
      zoom: zoom || cy.zoom(),
      duration: 500,
      easing: "ease-out",
    })
  }
}


