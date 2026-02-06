# AnticiPay - Community Funding MVP

A Next.js application for discovering and funding disaster relief communities through blockchain on Base Sepolia testnet.

## Overview

AnticiPay is a crowdfunded, adaptive disaster relief streaming platform. This MVP allows users to:

- **Discover Communities**: Browse pre-created list of disaster-prone communities seeking funding
- **View Funding Progress**: See real-time funding status and goals for each community
- **Connect Wallets**: Connect blockchain wallets (MetaMask, WalletConnect, etc.) via RainbowKit
- **Explore Details**: Deep dive into community details, hazard types, and wallet addresses

## Features

- **Public Community Discovery**: No login required to browse communities
- **Base Sepolia Integration**: All wallet connections and fund tracking on Base Sepolia testnet
- **Real-time Balance Fetching**: Display community wallet balances from blockchain
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Advanced Filtering**: Filter communities by hazard type and search by name/region

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: wagmi + ethers.js + viem
- **Wallet Connection**: RainbowKit (MetaMask, WalletConnect, Coinbase Wallet)
- **Network**: Base Sepolia testnet
- **UI Components**: shadcn/ui patterns with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A blockchain wallet (MetaMask recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/myanzik/hackmoney-anticipay.git
cd hackmoney-anticipay
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Network Configuration

The app is pre-configured for **Base Sepolia testnet**:
- Network ID: 84532
- RPC: https://sepolia.base.org
- Explorer: https://sepolia.basescan.org

### Adding Base Sepolia to MetaMask

If not already added, add Base Sepolia to MetaMask:
1. Network Name: `Base Sepolia`
2. RPC URL: `https://sepolia.base.org`
3. Chain ID: `84532`
4. Currency: `ETH`
5. Block Explorer: `https://sepolia.basescan.org`

## Project Structure

```
.
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page with community list
│   ├── providers.tsx           # Wagmi + RainbowKit setup
│   ├── globals.css             # Global styles
│   └── communities/
│       └── [id]/
│           └── page.tsx        # Community detail page
├── components/
│   ├── header.tsx              # Navigation header
│   ├── footer.tsx              # Footer
│   └── community-card.tsx      # Community card component
├── lib/
│   └── communities.ts          # Community data and types
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Community Data

Pre-created communities are stored in `lib/communities.ts` and include:

1. **Kathmandu Flood Relief** - Flood protection for Kathmandu Valley
2. **Terai Heatwave Protection** - Heat emergency support
3. **Mountain Landslide Response** - Landslide disaster relief
4. **Refugee Camp Assistance** - Support for displaced populations
5. **Urban Poverty Safety Net** - Basic income for low-income urban households
6. **Agricultural Drought Relief** - Drought support for farming communities

Each community has:
- Unique wallet address (smart contract)
- Current funding amount in ETH
- Target funding goal
- Number of beneficiaries
- Region and hazard type information

## Features in This Phase

✅ Community discovery page
✅ Search and filter by hazard type
✅ Community detail pages
✅ Wallet connection (RainbowKit)
✅ Base Sepolia testnet integration
✅ Responsive design
✅ Real-time balance display

## Features for Next Phase

- Donation functionality
- Transaction UI and processing
- Donor dashboard
- Treasury management
- Trigger engine integration
- Streaming rate adjustments

## Development

### Build for production:
```bash
npm run build
npm start
```

### Lint code:
```bash
npm run lint
```

## Blockchain Setup Notes

- All test data uses valid Ethereum address format
- Current/target funding amounts are in wei (10^18)
- To see real balances, communities would need funded accounts on Base Sepolia
- Use [BaseScan Sepolia](https://sepolia.basescan.org) to verify addresses and transactions

## Learn More

- [AnticiPay Concept Note](./CONCEPT_NOTE.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [RainbowKit Documentation](https://rainbowkit.com)
- [Base Sepolia Testnet](https://sepolia.base.org)

## License

MIT License - See LICENSE file for details

---

**Note**: This is an MVP focused on community discovery and funding visualization. Actual donation transactions and streaming logic will be implemented in subsequent phases.
