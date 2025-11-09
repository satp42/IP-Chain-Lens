import { Search, GitBranch, Wallet, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SearchBar } from "@/components/search/search-bar"

export default function Home() {
  return (
    <div className="container py-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-6 py-12 md:py-24">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Visualize the
            <span className="text-primary"> IP Remix Graph</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Explore IP assets on Story Protocol. Track derivatives, licensing flows,
            and royalty distribution. Shine light on programmable IP relationships.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="#search">
              <Search className="mr-2 h-4 w-4" />
              Search IP Assets
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href="https://docs.story.foundation"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<GitBranch className="h-8 w-8 text-primary" />}
            title="Remix Path Tracking"
            description="Visualize how many derivative generations deep an IP asset has gone. Track the full lineage from root to leaves."
          />
          <FeatureCard
            icon={<Search className="h-8 w-8 text-primary" />}
            title="Advanced Search & Filter"
            description="Search by creator, license terms, usage category, or derivative depth. Find exactly what you need."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-primary" />}
            title="Licensing Flows"
            description="View license terms, usage permissions, and minting fees. Understand commercial rights at a glance."
          />
          <FeatureCard
            icon={<Wallet className="h-8 w-8 text-primary" />}
            title="Royalty Distribution"
            description="See royalty recipients, revenue shares, and distribution flows. Track where value goes."
          />
          <FeatureCard
            icon={<GitBranch className="h-8 w-8 text-primary rotate-90" />}
            title="Parent-Child Relationships"
            description="Explore the full IP graph with interactive visualizations. See derivatives, remixes, and adaptations."
          />
          <FeatureCard
            icon={<Search className="h-8 w-8 text-primary" />}
            title="Metadata Explorer"
            description="View IP metadata, NFT details, creator information, and registration dates in an intuitive interface."
          />
        </div>
      </section>

      {/* Search Section */}
      <section id="search" className="py-12 md:py-24 scroll-mt-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold">Search IP Assets</h2>
            <p className="text-muted-foreground">
              Enter an IP Asset ID or NFT contract address to begin exploring
            </p>
          </div>
          <SearchBar />
          <p className="text-sm text-muted-foreground text-center">
            Connect your wallet to access full functionality and interact with IP assets
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-24 bg-muted/50 -mx-4 px-4 rounded-lg">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">How It Works</h2>
          <div className="space-y-6">
            <Step
              number="1"
              title="Connect Your Wallet"
              description="Connect to Story Mainnet using MetaMask or WalletConnect to access on-chain data."
            />
            <Step
              number="2"
              title="Search or Browse"
              description="Search for specific IP assets by ID, or browse by creator, license type, or usage category."
            />
            <Step
              number="3"
              title="Explore the Graph"
              description="View the interactive relationship graph showing derivatives, parents, licensing, and royalty flows."
            />
            <Step
              number="4"
              title="Track Remix Paths"
              description="See how deep the derivative tree goes and trace the lineage from root IP to final derivatives."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card space-y-4">
      <div className="p-3 rounded-full bg-primary/10">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function Step({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
        {number}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}


