# IP Chain Lens Setup Instructions

## Installation

After cloning this repository, run:

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_STORY_RPC_URL=https://rpc.story.foundation
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
```

To get a WalletConnect Project ID:
1. Visit https://cloud.walletconnect.com/
2. Create a new project
3. Copy the Project ID

## Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Story Protocol Configuration

This app connects to Story Protocol Mainnet:
- Chain ID: 1513
- RPC URL: https://rpc.story.foundation
- Explorer: https://explorer.story.foundation

Make sure your wallet is connected to Story Mainnet to interact with IP assets.

