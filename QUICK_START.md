# IP Chain Lens - Quick Start Guide

## ✅ Implementation Complete!

All features have been successfully implemented and are ready to use.

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Next.js 14 with TypeScript
- Story Protocol SDK
- Wagmi v2 + Viem v2 (Web3 integration)
- Cytoscape.js (graph visualization)
- Shadcn UI components
- TanStack Query (data caching)

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Story Protocol API Configuration
NEXT_PUBLIC_STORY_RPC_URL=https://rpc.story.foundation
NEXT_PUBLIC_STORY_API_URL=https://api.storyapis.com/api/v4
NEXT_PUBLIC_STORY_API_KEY=your_api_key_here

# WalletConnect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
```

**Get a WalletConnect Project ID:**
1. Visit https://cloud.walletconnect.com/
2. Create a free account
3. Create a new project
4. Copy the Project ID

**Story API Key** (optional but recommended):
- Contact Story Protocol team for API access
- Or use without key for lower rate limits

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Implemented

### 🔍 Search & Discovery
- **Smart Search Bar**: Automatically detects if input is IP ID, contract address, or keyword
- **Advanced Filters**: Filter by creator, license type, usage category, derivative depth
- **Search Results Page**: Grid view of matching IP assets with metadata

### 📊 Graph Visualization
- **Interactive Cytoscape Graph**: Pan, zoom, click nodes to explore
- **Color-Coded Nodes**: 
  - Purple = Root IPs (Generation 0)
  - Blue gradient = Derivatives (darker = deeper generation)
- **Edge Types**:
  - Solid arrows = Parent-child (derivative) relationships
  - Dashed lines = License flows
- **Controls**: Zoom, fit viewport, reset, export as PNG

### 🔗 IP Asset Details
- **Metadata Display**: Title, description, images, creator info
- **Relationship Stats**: Parent count, derivative count, generation depth
- **NFT Information**: Contract address, token ID
- **Explorer Links**: Quick access to Story Explorer

### ⚖️ License Terms
- **Permission Checklist**: Commercial use, derivatives, attribution
- **Fee Information**: Minting fees, revenue share percentages
- **Multiple License Support**: Shows all attached license terms
- **Expiration Tracking**: License expiry dates

### 💰 Royalty Distribution
- **Vault Address**: Shows IP's royalty vault
- **Claimable Revenue**: Live balance check in WIP tokens
- **Recipients List**: Distribution percentages
- **Visual Bars**: Easy-to-read distribution charts

### 🌳 Remix Path Tracking
- **Generation Depth**: Calculates how deep derivatives go
- **Path Highlighting**: Visual path from root to selected derivative
- **Ancestry Tracking**: Shows all parent-child relationships
- **Statistics**: Max depth, total nodes, edge count

## API Integration

All Story Protocol API v4 endpoints are integrated:

| Endpoint | Purpose | Implementation |
|----------|---------|----------------|
| `POST /assets` | Fetch IP assets | `getIpAsset()`, `searchIpAssets()` |
| `POST /assets/edges` | Get relationships | `getParentIps()`, `getDerivativeIps()` |
| `POST /assets/transactions` | License & royalty events | `getLicenseTerms()`, `getRoyaltyRecipients()` |

Plus Story Protocol SDK methods:
- `royalty.getRoyaltyVaultAddress()`
- `royalty.claimableRevenue()`

## Usage Examples

### Search for an IP Asset

**Method 1: By IP Asset ID**
```
0x1234567890abcdef1234567890abcdef12345678
```

**Method 2: By NFT Contract Address**
```
0xabcdef1234567890abcdef1234567890abcdef12
```

**Method 3: By Creator Address**
```
0x...creator-address...
```

**Method 4: By Keywords**
```
"Story Protocol Mascot"
```

### Explore Relationships

1. Click any IP asset card to open detail view
2. See the interactive graph with all connected IPs
3. Click nodes in the graph to select them
4. Use "Remix Path Tracker" to highlight lineage paths

### Apply Filters

1. Click "Filters" button on search results
2. Select criteria:
   - Creator address
   - License type (commercial, derivatives allowed, etc.)
   - Usage category (art, music, video, etc.)
   - Derivative depth range (0-20 generations)
   - Keywords
3. Results update automatically

## Architecture

```
┌─────────────────────────────────────────┐
│         Next.js 14 App Router           │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   React Components (TypeScript)   │ │
│  │  - Search UI                      │ │
│  │  - Graph Visualization            │ │
│  │  - Metadata Display               │ │
│  └───────────────────────────────────┘ │
│                 │                       │
│  ┌──────────────┴──────────────┐       │
│  │                             │       │
│  ▼                             ▼       │
│ ┌─────────────┐         ┌─────────────┐│
│ │ Story API   │         │ Story SDK   ││
│ │ - /assets   │         │ - Royalty   ││
│ │ - /edges    │         │ - License   ││
│ │ - /txs      │         │             ││
│ └─────────────┘         └─────────────┘│
│        │                       │        │
│        └───────────┬───────────┘        │
│                    ▼                    │
│          ┌──────────────────┐           │
│          │ Story Mainnet    │           │
│          │ Chain ID: 1514   │           │
│          └──────────────────┘           │
└─────────────────────────────────────────┘
```

## Key Files

### Configuration
- `config/wagmi.ts` - Blockchain connection
- `config/contracts.ts` - Story Protocol contract addresses

### Data Layer
- `lib/story/client.ts` - SDK initialization
- `lib/story/queries.ts` - API query functions (500+ lines)
- `lib/story/types.ts` - TypeScript type definitions

### Graph Layer
- `lib/graph/cytoscape-config.ts` - Graph styling
- `lib/graph/graph-utils.ts` - Graph utilities

### Components
- `components/ip-asset/ip-graph.tsx` - Main graph component
- `components/ip-asset/ip-metadata.tsx` - Metadata display
- `components/ip-asset/license-terms.tsx` - License display
- `components/ip-asset/royalty-info.tsx` - Royalty display
- `components/search/search-bar.tsx` - Smart search
- `components/search/filter-panel.tsx` - Advanced filters

### Pages
- `app/page.tsx` - Landing page
- `app/ip/[id]/page.tsx` - IP asset detail view
- `app/search/page.tsx` - Search results

## Troubleshooting

### "Failed to fetch IP asset"
- Check your internet connection
- Verify Story Mainnet is accessible
- Check if the IP ID exists on mainnet

### "No graph displayed"
- Ensure Cytoscape.js loaded properly
- Check browser console for errors
- Try refreshing the page

### "Wallet won't connect"
- Ensure WalletConnect Project ID is set
- Check wallet is on Story Mainnet (Chain ID: 1514)
- Try different wallet (MetaMask, WalletConnect)

### Rate Limiting
- Add NEXT_PUBLIC_STORY_API_KEY for higher limits
- Implement caching in production
- Contact Story Protocol for API access

## Performance Tips

1. **Enable Caching**: React Query caches API responses (1 min default)
2. **Limit Graph Depth**: Default depth is 2, increase carefully
3. **Pagination**: Search returns max 50 results by default
4. **Image Optimization**: Uses Next.js Image component for IPFS

## Next Steps

### For Development
1. Test with real IP assets on Story Mainnet
2. Add more event types for richer data
3. Implement royalty recipient contract queries
4. Add export features (CSV, JSON)

### For Production
1. Add proper error tracking (Sentry, etc.)
2. Implement analytics
3. Add SEO metadata
4. Set up CI/CD pipeline
5. Configure CDN for static assets

## API Endpoints Reference

### Story Protocol API v4

**Base URL**: `https://api.storyapis.com/api/v4`

**Implemented Endpoints:**

1. **`POST /assets`** - List/search IP assets
   - Filter by: ipIds, ownerAddress, tokenContract
   - Includes license information
   - Returns: EnrichedIPAsset[]

2. **`POST /assets/edges`** - List derivative relationships
   - Filter by: childIpId, parentIpId, txHash
   - Returns: DerivativeRegisteredEvent[]

3. **`POST /assets/transactions`** - List IP transactions
   - Filter by: ipIds, eventTypes, initiators
   - Event types: LicenseTermsAttached, RoyaltyPaid, etc.
   - Returns: IPTransaction[]

### Story Protocol SDK Methods

**Implemented:**
- `royalty.getRoyaltyVaultAddress(ipId)` - Get vault address
- `royalty.claimableRevenue({ ipId, claimer, token })` - Check claimable amount

## Support

- **Documentation**: https://docs.story.foundation
- **Explorer**: https://www.storyscan.io
- **SDK Reference**: https://docs.story.foundation/docs/typescript-sdk-setup
- **API Reference**: https://api.storyapis.com/api/v4/openapi.json

---

🎉 **Ready to explore the IP remix graph!**

Run `npm run dev` and start visualizing IP assets on Story Protocol!

