# Smart Contract Deployment Guide

This guide explains how to deploy the community treasury contracts to Base Sepolia and update the frontend with contract addresses and ENS names.

## Architecture Overview

The system consists of:

1. **CommunityTreasury.sol** - Main hub contract that:
   - Creates individual community contracts
   - Routes donations to specific communities
   - Maintains registry of all community contracts

2. **Community.sol** - Individual community contract (one per community) that:
   - Receives and holds ETH for a specific community
   - Tracks total funds raised and withdrawn
   - Allows beneficiaries to withdraw funds
   - Can be registered with an ENS name for human-readable addressing

## Deployment Steps

### Step 1: Setup Environment

```bash
cd contracts

# Copy environment file
cp .env.example .env

# Edit .env with your private key
nano .env
```

You need:
- `PRIVATE_KEY`: Your private key for Base Sepolia (with testnet ETH for gas)
- `BASESCAN_API_KEY` (optional): For contract verification

### Step 2: Compile Contracts

```bash
npm run compile
```

This compiles the Solidity contracts and generates artifacts in the `artifacts/` directory.

### Step 3: Deploy Contracts

```bash
npm run deploy
```

This script will:
1. Deploy the CommunityTreasury contract
2. Create 4 Community contracts (one for each community)
3. Attempt to register ENS names automatically
4. Save deployment details to `deployments/latest.json`

**Important**: The script outputs the contract addresses and ENS names you need for the frontend.

### Step 4: Update Frontend

After deployment, the script displays the contract addresses and ENS names:

```
Community Contracts:

   1. Kathmandu Flood Relief
      Contract:    0x...
      ENS Name:    kathmandu-flood-relief.eth

   2. Terai Heatwave Protection
      Contract:    0x...
      ENS Name:    terai-heatwave-protection.eth

   3. Urban Poverty Safety Net
      Contract:    0x...
      ENS Name:    urban-poverty-safety-net.eth

   4. Agricultural Drought Relief
      Contract:    0x...
      ENS Name:    agricultural-drought-relief.eth
```

Copy these values into `frontend/lib/communities.ts`:

Update each community object:
```typescript
{
  // ... other fields ...
  contractAddress: "0x...", // Replace with deployed address
  ensName: "...", // Replace with ENS name
}
```

## How It Works

### Fund Flow

1. **Frontend User** sends donation → **CommunityTreasury.donateToCommunity()**
2. **CommunityTreasury** routes funds → **Community contract**
3. **Community contract** receives and holds the ETH
4. **Beneficiaries** withdraw using `Community.withdraw()`

### Using ENS Names

Once deployed, you can use the ENS names to reference community contracts:

```solidity
// Instead of:
// community.donateToCommunity("Kathmandu Flood Relief")

// You can reference it as:
// kathmandu-flood-relief.eth
```

This makes the addresses human-readable and easier to remember.

### Contract Functions

#### CommunityTreasury

```solidity
// Create a new community
createCommunity(string memory _communityName) → address

// Donate to a community
donateToCommunity(string memory _communityName) payable

// Get community contract address
getCommunityContract(string memory _communityName) → address

// Get all community names
getAllCommunities() → string[]

// Get community count
getCommunityCount() → uint256
```

#### Community

```solidity
// Receive funds (via fallback/receive)
receive() payable

// Withdraw funds as beneficiary
withdraw(uint256 _amount)

// Admin withdrawal (treasury only)
adminWithdraw(uint256 _amount, address payable _recipient)

// Get current balance
getBalance() → uint256

// Get available funds (raised - withdrawn)
getAvailableFunds() → uint256

// Get beneficiary's total withdrawals
getBeneficiaryWithdrawals(address _beneficiary) → uint256
```

## Testing Contracts

```bash
# Run tests
npm run test
```

## Deployment Files

After running the deploy script:

- `deployments/latest.json` - Latest deployment details (always overwritten)
- `deployments/deployment-<timestamp>.json` - Timestamped deployment details (archived)

Example structure:
```json
{
  "network": {
    "name": "baseSepolia",
    "chainId": 84532,
    "deployer": "0x...",
    "deploymentDate": "2026-02-08T..."
  },
  "treasury": {
    "address": "0x...",
    "deploymentTx": "0x..."
  },
  "communities": [
    {
      "name": "Kathmandu Flood Relief",
      "contractAddress": "0x...",
      "ensName": "kathmandu-flood-relief.eth"
    },
    // ... more communities
  ]
}
```

## Troubleshooting

### "No Hardhat config file found"
Make sure you're in the `contracts/` directory and `hardhat.config.js` exists.

### "No account provided"
Set the `PRIVATE_KEY` environment variable in `.env`

### "Insufficient funds"
The account needs testnet ETH for gas fees on Base Sepolia.

### "ENS registration failed"
ENS registration is optional. Contracts are still deployed successfully even if ENS registration fails. You can:
- Manually register ENS names later
- Skip ENS registration and use contract addresses directly in the frontend

## Network Information

- **Network**: Base Sepolia (testnet)
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Block Explorer**: https://sepolia.basescan.org/
- **Faucet**: https://www.coinbase.com/faucet

## Future Enhancements

- Dynamic community creation from frontend
- Factory contract for optimized deployment
- Streaming payments (Superfluid integration)
- Risk-based fund multipliers
- Layer 2 settlement optimization
