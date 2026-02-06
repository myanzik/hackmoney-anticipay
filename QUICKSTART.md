# AnticiPay Next.js MVP - Quick Start Guide

## 🚀 Project Created Successfully!

Your AnticiPay community listing and funding application is ready to run!

### What's Included

✅ **Community Discovery Page** - Browse 6 pre-created communities with funding progress  
✅ **Community Detail Pages** - Explore individual communities with full information  
✅ **Blockchain Wallet Integration** - Connect MetaMask, WalletConnect, and other wallets  
✅ **Base Sepolia Testnet** - All transactions on testnet for safe testing  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Search & Filter** - Discover communities by hazard type and location  

### Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Connect Your Wallet:**
   - Click "Connect Wallet" in the top right
   - Select MetaMask, WalletConnect, or another provider
   - Ensure your wallet is on Base Sepolia network
   - If not on Base Sepolia, MetaMask will prompt you to switch

3. **Explore Communities:**
   - View all 6 communities on the homepage
   - Use filters to sort by hazard type
   - Search by community name or region
   - Click any community card for details

4. **View Community Details:**
   - See funding progress and goals
   - View wallet addresses for contributions
   - Connect wallet to prepare for donations (UI only in MVP)

### File Structure

```
project/
├── app/
│   ├── layout.tsx                    # Root layout with Providers
│   ├── page.tsx                      # Homepage with community list
│   ├── providers.tsx                 # Wagmi + RainbowKit config
│   ├── globals.css                   # Global tailwind styles
│   ├── communities/
│   │   └── [id]/
│   │       └── page.tsx              # Community detail page
├── components/
│   ├── header.tsx                    # Header with wallet connection
│   ├── footer.tsx                    # Footer
│   └── community-card.tsx            # Community card component
├── lib/
│   └── communities.ts                # Community data
├── package.json                      # Dependencies
├── next.config.js                    # Next.js config
├── tailwind.config.ts                # Tailwind configuration
└── tsconfig.json                     # TypeScript config
```

### Communities in the MVP

1. 🌊 **Kathmandu Flood Relief** - Flood protection (250 beneficiaries)
2. 🔥 **Terai Heatwave Protection** - Heat emergency support (180 beneficiaries)
3. ⛰️ **Mountain Landslide Response** - Disaster relief (150 beneficiaries)
4. 🏕️ **Refugee Camp Assistance** - Displaced populations (500 beneficiaries)
5. 🏙️ **Urban Poverty Safety Net** - Basic income (320 beneficiaries)
6. 🌾 **Agricultural Drought Relief** - Farming communities (200 beneficiaries)

### Next Steps

To extend this MVP, you can:

1. **Add Donation Logic:**
   - Implement transaction handling in the donate button
   - Add transaction confirmation UI
   - Display transaction status and receipts

2. **Connect Real Data:**
   - Replace mock data with API calls
   - Integrate with smart contracts
   - Fetch real community wallet balances from Base Sepolia

3. **Donor Dashboard:**
   - Track contributions
   - View transaction history
   - See impact metrics

4. **Trigger Engine:**
   - Integrate risk forecasts
   - Implement adaptive streaming rates
   - Display risk indicators

### Base Sepolia Network Info

- **Network ID:** 84532
- **RPC URL:** https://sepolia.base.org
- **Explorer:** https://sepolia.basescan.org
- **Currency:** ETH (Sepolia testnet)

### Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Troubleshooting

**Wallet not connecting?**
- Ensure MetaMask is installed
- Check that you're on Base Sepolia network
- Refresh the page and try again

**Page looks broken?**
- Clear browser cache
- Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check browser console for errors

**Build errors?**
- Delete `node_modules` and `.next` folders
- Run `npm install --legacy-peer-deps`
- Run `npm run build` again

### Learn More

- [AnticiPay Concept Note](./CONCEPT_NOTE.md) - Full project vision
- [Next.js Docs](https://nextjs.org/docs) - Framework documentation
- [Wagmi Docs](https://wagmi.sh) - Web3 hooks library
- [RainbowKit Docs](https://rainbowkit.com) - Wallet connection UI
- [Base Docs](https://docs.base.org) - Base blockchain documentation

---

**Happy coding! 🎉**

Questions or issues? Check the README.md or CONCEPT_NOTE.md for more details.
