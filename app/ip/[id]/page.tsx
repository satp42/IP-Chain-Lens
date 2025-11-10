"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Address, isAddress } from "viem"
import { IpGraph } from "@/components/ip-asset/ip-graph"
import { IpMetadata } from "@/components/ip-asset/ip-metadata"
import { LicenseTermsDisplay } from "@/components/ip-asset/license-terms"
import { RoyaltyInfoDisplay } from "@/components/ip-asset/royalty-info"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import {
  buildIpGraph,
  getIpAsset,
  getLicenseTerms,
  getRoyaltyInfo,
} from "@/lib/story/queries"
import type { GraphData, LicenseTerms, RoyaltyInfo } from "@/lib/story/types"

export default function IpAssetPage() {
  const params = useParams()
  const ipId = params.id as Address

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [licenseTerms, setLicenseTerms] = useState<LicenseTerms[]>([])
  const [royaltyInfo, setRoyaltyInfo] = useState<RoyaltyInfo | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<Address | null>(null)
  const [isLargeGraph, setIsLargeGraph] = useState(false)

  useEffect(() => {
    if (!isAddress(ipId)) {
      setError("Invalid IP Asset ID")
      setLoading(false)
      return
    }

    loadIpAssetData()
  }, [ipId])

  async function loadIpAssetData() {
    try {
      setLoading(true)
      setError(null)

      // Use Promise.race to add a timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 30000) // 30 second timeout
      })

      // First check if this is a large graph
      const rootAsset = await getIpAsset(ipId)
      const totalRelationships = (rootAsset?.parentCount || 0) + (rootAsset?.derivativeCount || 0)
      
      if (totalRelationships > 100) {
        setIsLargeGraph(true)
        console.warn(`Large graph detected: ${totalRelationships} total relationships. Limiting to 50 nodes.`)
      }

      // Fetch graph data with limits to handle large graphs
      // depth: 1 = only immediate parents/children
      // maxNodes: 50 = maximum nodes to display (prevents overload on large graphs)
      const graphPromise = buildIpGraph(ipId, 1, 50)
      const graph = await Promise.race([graphPromise, timeoutPromise])
      setGraphData(graph)

      // Fetch license terms and royalty info in parallel
      const [terms, royalty] = await Promise.all([
        getLicenseTerms(ipId),
        getRoyaltyInfo(ipId).catch(err => {
          console.warn("Could not fetch royalty info:", err)
          return null
        }),
      ])
      
      setLicenseTerms(terms)
      setRoyaltyInfo(royalty)
    } catch (err) {
      console.error("Error loading IP asset data:", err)
      setError(err instanceof Error ? err.message : "Failed to load IP asset data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleNodeClick = (nodeId: Address) => {
    setSelectedNodeId(nodeId)
  }

  const currentIpAsset = graphData?.nodes.find((n) => n.id === ipId)
  const selectedIpAsset = selectedNodeId
    ? graphData?.nodes.find((n) => n.id === selectedNodeId)
    : currentIpAsset

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading IP asset data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !graphData || !currentIpAsset) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold text-destructive">
              {error || "IP Asset not found"}
            </p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold">
            {currentIpAsset.metadata?.title || "IP Asset Details"}
          </h1>
          <p className="text-muted-foreground">
            Explore the IP graph and relationships
          </p>
        </div>
      </div>

      {/* Large Graph Warning */}
      {isLargeGraph && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Large Graph Detected</AlertTitle>
          <AlertDescription>
            This IP asset has {currentIpAsset.parentCount + currentIpAsset.derivativeCount} total relationships. 
            For performance, we're showing only the first 50 nodes. The full graph may contain {currentIpAsset.derivativeCount} derivatives and {currentIpAsset.parentCount} parents.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Graph Visualization - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[600px] rounded-lg border">
            <IpGraph
              graphData={graphData}
              focusNodeId={ipId}
              onNodeClick={handleNodeClick}
              className="h-full"
            />
          </div>

          {/* Tabs for additional info */}
          <Tabs defaultValue="license" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="license" className="flex-1">
                License Terms
              </TabsTrigger>
              <TabsTrigger value="royalty" className="flex-1">
                Royalty Info
              </TabsTrigger>
            </TabsList>
            <TabsContent value="license" className="mt-6">
              <LicenseTermsDisplay licenseTerms={licenseTerms} />
            </TabsContent>
            <TabsContent value="royalty" className="mt-6">
              <RoyaltyInfoDisplay royaltyInfo={royaltyInfo} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Metadata Sidebar */}
        <div className="space-y-6">
          {selectedIpAsset && <IpMetadata ipAsset={selectedIpAsset} />}

          {/* Graph Stats */}
          <div className="rounded-lg border p-4 space-y-2">
            <h3 className="font-semibold text-sm">Graph Statistics</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Nodes:</span>
                <span className="font-medium">{graphData.nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Edges:</span>
                <span className="font-medium">{graphData.edges.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Generation:</span>
                <span className="font-medium">
                  {Math.max(...graphData.nodes.map((n) => n.generation || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

