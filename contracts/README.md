# AnticiPay Smart Contracts

Smart contracts for the AnticiPay humanitarian finance system. Enables community treasuries, anticipatory action, and adaptive basic income streaming.

## Quick Start

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Deploy to Base Sepolia
npm run deploy
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## Contracts

### CommunityTreasury.sol

The main hub contract that:
- Creates individual community contracts
- Routes donations to specific communities
- Maintains a registry of all communities

**Key Functions:**
- `createCommunity(string memory _communityName)` - Create a new community
- `donateToCommunity(string memory _communityName)` - Donate to a specific community
- `getCommunityContract(string memory _communityName)` - Get community contract address
- `getAllCommunities()` - Get all community names
- `getCommunityCount()` - Get number of communities

### Community.sol

Individual treasury contract for each community that:
- Receives and holds ETH
- Tracks funds raised and withdrawn
- Allows beneficiary withdrawals
- Supports admin/treasury withdrawals

**Key Functions:**
- `receive()` - Accept ETH donations
- `withdraw(uint256 _amount)` - Withdraw as beneficiary
- `adminWithdraw(uint256 _amount, address _recipient)` - Treasury withdrawal
- `getBalance()` - Get current balance
- `getAvailableFunds()` - Get funds available (raised - withdrawn)
- `getBeneficiaryWithdrawals(address _beneficiary)` - Get beneficiary's total withdrawals

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend Donors                    │
│              (web3.js / ethers.js)                  │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ donate()
                       ▼
        ┌──────────────────────────────┐
        │  CommunityTreasury Contract  │
        │     (Main Hub)               │
        │                              │
        │  - createCommunity()         │
        │  - donateToCommunity()       │
        │  - getAllCommunities()       │
        └─────────┬──────────┬───┬─────┘
                  │          │   │
        ┌─────────▼┐   ┌─────▼─┐ └──────────┐
        │Community  │   │Community│  Community│
        │Contract 1 │   │Contract 2│ Contract N│
        │           │   │        │  │         │
        │ Kathmandu │   │ Terai  │  │ Urban   │
        │ Flood     │   │Heatwave│  │Poverty  │
        │ Relief    │   │ Protect│  │ Safety  │
        └─────────────────────────────────────┘
              │              │           │
              ├─ Beneficiary Withdrawals
              ├─ Fund Balance Tracking
              └─ ENS Names (human-readable)
```

## Environment Setup

Create a `.env` file:

```bash
cp .env.example .env
```

Update with your values:
```
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key_here
```

## Network Configuration

Currently configured for **Base Sepolia** (testnet):
- Chain ID: 84532
- RPC: https://sepolia.base.org
- Block Explorer: https://sepolia.basescan.org/

To add more networks, edit `hardhat.config.js` and add to the `networks` section.

## Scripts

```bash
# Compile contracts
npm run compile

# Deploy to Base Sepolia
npm run deploy

# Run tests
npm run test
```

## Deployment Output

The deploy script saves contract details to `deployments/`:
- `deployments/latest.json` - Latest deployment (always overwritten)
- `deployments/deployment-<timestamp>.json` - Timestamped archive

Example output:
```json
{
  "network": {
    "name": "baseSepolia",
    "chainId": 84532,
    "deployer": "0x..."
  },
  "treasury": {
    "address": "0x..."
  },
  "communities": [
    {
      "name": "Kathmandu Flood Relief",
      "contractAddress": "0x...",
      "ensName": "kathmandu-flood-relief.eth"
    }
  ]
}
```

## Frontend Integration

The frontend should:
1. Read community data from `frontend/lib/communities.ts`
2. Use `contractAddress` field for contract interactions
3. Use `ensName` for human-readable references

Example:
```typescript
// In frontend
const community = communities[0];

// Donate to community
const tx = await treasury.donateToCommunity(
  community.name,
  { value: ethers.parseEther("1.0") }
);

// Or reference by ENS
// const community = ethers.getAddress(community.ensName);
```

## Technology Stack

- **Smart Contracts**: Solidity ^0.8.20
- **Framework**: Hardhat
- **Testing**: Hardhat + ethers.js
- **Blockchain**: Base Sepolia (testnet) → Base Mainnet (production)
- **ENS**: Ethereum Name Service (for human-readable addresses)

## Smart Contract Addresses

[Add deployed addresses here after mainnet launch]

## License

MIT

## Security

This is a testnet MVP implementation. For production:
- Conduct security audit
- Add access controls
- Implement withdrawal limits
- Add multi-sig treasury
- Consider upgradeable proxy pattern
