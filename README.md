# IP Chain Lens

A developer-centric toolkit for visualizing, querying, and exploring IP assets on Story Protocol's blockchain. Built with Next.js 14, TypeScript, and Cytoscape.js for interactive graph visualization.

## Features

- 🔍 **Search & Filter** - Find IP assets by ID, creator, license type, or usage category
- 📊 **Graph Visualization** - Interactive Cytoscape.js graphs showing IP relationships
- 🔗 **Remix Path Tracking** - Visualize derivative generations and lineage depth
- ⚖️ **License Terms** - View licensing conditions, commercial use, and derivative permissions
- 💰 **Royalty Distribution** - See revenue shares and royalty recipients
- 🔐 **Wallet Integration** - Connect with MetaMask/WalletConnect to Story Mainnet
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Blockchain**: Wagmi v2 + Viem v2
- **Story Protocol**: @story-protocol/core-sdk
- **Graph Visualization**: Cytoscape.js + Cola layout
- **State Management**: TanStack Query (React Query)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- A WalletConnect Project ID (get from [cloud.walletconnect.com](https://cloud.walletconnect.com/))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd IP-Chain-Lens
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your WalletConnect Project ID:
```env
NEXT_PUBLIC_STORY_RPC_URL=https://rpc.story.foundation
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_actual_project_id
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
IP-Chain-Lens/
├── app/                          # Next.js 14 App Router pages
│   ├── ip/[id]/page.tsx         # IP asset detail page
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/
│   ├── providers/               # React providers (Wagmi, Query)
│   ├── wallet/                  # Wallet connection components
│   ├── ip-asset/                # IP asset display components
│   ├── search/                  # Search and filter components
│   └── ui/                      # Shadcn UI components
├── lib/
│   ├── story/                   # Story Protocol SDK integration
│   │   ├── client.ts            # SDK client initialization
│   │   ├── queries.ts           # Query functions
│   │   └── types.ts             # TypeScript types
│   ├── graph/                   # Cytoscape graph utilities
│   │   ├── cytoscape-config.ts  # Graph styles and config
│   │   └── graph-utils.ts       # Graph helper functions
│   └── utils.ts                 # Utility functions
└── config/
    ├── wagmi.ts                 # Wagmi configuration
    └── contracts.ts             # Contract addresses
```

## Usage

### Searching for IP Assets

1. Enter an IP Asset ID (Ethereum address) in the search bar
2. Use advanced filters to narrow down results by:
   - Creator address
   - License type (commercial, non-commercial, derivatives allowed)
   - Usage category (art, music, video, etc.)
   - Derivative depth range
   - Keywords in metadata

### Exploring the IP Graph

1. Click on any search result to view its detail page
2. The interactive graph shows:
   - **Purple nodes**: Root IP assets (generation 0)
   - **Blue nodes**: Derivative IP assets (colored by generation)
   - **Arrows**: Parent-child relationships
3. Use graph controls to:
   - Zoom in/out
   - Fit to viewport
   - Reset layout
   - Export as PNG

### Tracking Remix Paths

1. On an IP asset detail page, use the "Remix Path Tracker" panel
2. Select a root IP and target derivative
3. Click "Highlight Path" to visualize the lineage
4. View path statistics (depth, generation count)

## Story Protocol Integration

This app connects to Story Protocol Mainnet:
- **Chain ID**: 1513
- **RPC URL**: https://rpc.story.foundation
- **Explorer**: https://explorer.story.foundation

### Key Contracts

Update contract addresses in `config/contracts.ts` with the latest mainnet deployments from [Story Protocol documentation](https://docs.story.foundation/docs/deployed-smart-contracts).

## Development

### Adding New Components

Use Shadcn UI CLI to add components:
```bash
npx shadcn-ui@latest add [component-name]
```

### Type Safety

All Story Protocol types are defined in `lib/story/types.ts`. Update them as the SDK evolves.

### Graph Customization

Customize graph appearance in `lib/graph/cytoscape-config.ts`:
- Node styles (colors, sizes, borders)
- Edge styles (colors, line types, arrows)
- Layout algorithms (cola, concentric, etc.)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

Build the production bundle:
```bash
npm run build
npm run start
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

See [LICENSE](LICENSE) file for details.

## Resources

- [Story Protocol Documentation](https://docs.story.foundation)
- [Story Protocol SDK](https://github.com/storyprotocol/protocol-core)
- [Cytoscape.js Documentation](https://js.cytoscape.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)

## Support

For issues or questions:
- Open an issue on GitHub
- Check Story Protocol documentation
- Join the Story Protocol community

---

Built with ❤️ for the Story Protocol ecosystem
