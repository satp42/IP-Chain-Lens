import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WagmiConfigProvider } from "@/components/providers/wagmi-provider"
import { ConnectButton } from "@/components/wallet/connect-button"
import Link from "next/link"
import { Network } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IP Chain Lens - Story Protocol IP Asset Visualizer",
  description: "Visualize, query, and explore IP assets on Story Protocol's blockchain",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfigProvider>
          <div className="relative min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                  <Network className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl">IP Chain Lens</span>
                </Link>
                <nav className="flex items-center space-x-6">
                  <Link
                    href="/"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Home
                  </Link>
                  <Link
                    href="/#search"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Search
                  </Link>
                  <ConnectButton />
                </nav>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="border-t py-6 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-sm text-muted-foreground">
                  Built for Story Protocol. Explore the IP remix graph.
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <a
                    href="https://docs.story.foundation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Docs
                  </a>
                  <a
                    href="https://explorer.story.foundation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Explorer
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </WagmiConfigProvider>
      </body>
    </html>
  )
}


