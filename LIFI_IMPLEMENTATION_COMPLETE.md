# Li.Fi Integration - Implementation Complete ✅

Your AnticiPay platform now supports **multi-chain token donations via Li.Fi**! Donors can use any token, which gets automatically swapped to USDC and sent to communities.

## What Was Changed

### 1. Smart Contracts (Updated)

**Community.sol** - Now supports both ETH and USDC:
- ✅ Accept ETH deposits (via `receive()`)
- ✅ Accept USDC deposits (via `depositUSDC()`)
- ✅ Track ETH and USDC separately
- ✅ Separate withdrawal functions for each token
- ✅ Admin functions for treasury management

**Key additions:**
```solidity
address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

function depositUSDC(uint256 _amount) external
function withdrawUSDC(uint256 _amount) external
function getUSDCBalance() public view returns (uint256)
function getAvailableUSDC() public view returns (uint256)
```

**CommunityTreasury.sol** - Enhanced donation routing:
- ✅ Support USDC donations through treasury
- ✅ Separate events for ETH and USDC
- ✅ Direct routing to community contracts

### 2. Frontend Components (New)

**`components/lifi-donate-widget.tsx`**
- Pre-configured Li.Fi widget
- Automatically swaps any token to USDC
- Sends directly to community contract address
- Testnet (Base Sepolia) configured

**`components/donation-modal.tsx`**
- Beautiful donation UI with two methods:
  1. **Li.Fi USDC Swap** (recommended)
  2. **Direct ETH Donation** (for connected wallets)
- Shows community details
- ENS name display
- Responsive design

### 3. Dependencies Added

```json
{
  "@lifi/widget": "latest",
  "@openzeppelin/contracts": "latest",
  "ethers": "^6.16.0"
}
```

**Installation:**
```bash
# Contracts
cd contracts
npm install @openzeppelin/contracts

# Frontend
cd frontend
npm install @lifi/widget ethers
```

## How It Works

### Donation Flow

```
Any Token (on any chain)
    ↓
Donor clicks "Donate"
    ↓
Li.Fi Widget opens
    ↓
Donor selects token + amount
    ↓
Li.Fi finds best swap route
    ↓
Donor approves token transfer
    ↓
Li.Fi executes swap/bridge
    ↓
USDC arrives in Community Contract
    ↓
Community tracks USDC received
    ↓
Beneficiaries can withdraw USDC
```

### Token Details

- **USDC Address (Base Sepolia)**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Decimals**: 6 (standard for USDC)
- **Network**: Base Sepolia (84532)

## Using the Components

### In Your Community Card

```tsx
import { DonationModal } from "@/components/donation-modal";
import { useState } from "react";
import { Community } from "@/lib/communities";

export function CommunityCard({ community }: { community: Community }) {
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  return (
    <>
      <div className="card">
        <h3>{community.name}</h3>
        <p>{community.description}</p>
        
        {/* Donate Button */}
        <button
          onClick={() => setIsDonationOpen(true)}
          className="btn btn-primary"
        >
          💝 Donate
        </button>
      </div>

      {/* Donation Modal */}
      <DonationModal
        community={community}
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
    </>
  );
}
```

### Direct Li.Fi Widget Usage

```tsx
import { LiFiDonateWidget } from "@/components/lifi-donate-widget";

function MinimalDonate() {
  return (
    <LiFiDonateWidget
      communityName="Kathmandu Flood Relief"
      communityAddress="0xd9eEDd9838d6328cF16e20a4C536d57b257eaa85"
      ensName="kathmandu-flood-relief.eth"
    />
  );
}
```

## Testing & Verification

### Prerequisites

1. **MetaMask or similar wallet**
2. **Base Sepolia testnet added**
3. **Testnet USDC or ETH** (optional - Li.Fi can simulate)

### Testing Steps

```bash
# 1. Compile updated contracts
cd contracts
npm run compile

# 2. Run deployment (if needed to deploy USDC-enabled contracts)
npm run deploy

# 3. Start frontend
cd frontend
npm run dev

# 4. Add Base Sepolia to wallet
#    Chain ID: 84532
#    RPC: https://sepolia.base.org

# 5. Test donation flow:
#    - Click Donate button
#    - Select Li.Fi USDC tab
#    - Choose token and amount
#    - Confirm transaction
#    - Watch USDC arrive in community contract
```

### Verify on Block Explorer

```
Base Sepolia Block Explorer: https://sepolia.basescan.org/

Community Contract Address: 0xd9eEDd9838d6328cF16e20a4C536d57b257eaa85
Treasury Address: 0xdb2E9cCb12705D602C917401dF77fa05F465094A
USDC Token: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

## Frontend Configuration

### Li.Fi Widget Options

The widget is currently configured for:
- **Testnet**: Base Sepolia (84532)
- **Output Token**: USDC (`0x833589fCD6...`)
- **Recipient**: Community contract address (auto-set)
- **Slippage**: 3% (configurable)
- **Insurance**: Disabled for MVP

To customize:

```typescript
// In lifi-donate-widget.tsx, modify widgetConfig:
const widgetConfig: WidgetConfig = {
  chains: {
    allow: [84532],        // Change to production chains
  },
  toToken: USDC_ADDRESS,   // Or change output token
  slippage: 0.05,          // Increase/decrease tolerance
  // ...
};
```

## Smart Contract Functions

### Community.sol

```solidity
// Receive ETH (automatic)
receive() external payable

// Deposit USDC
depositUSDC(uint256 _amount) external

// Withdraw as beneficiary
withdrawETH(uint256 _amount) external
withdrawUSDC(uint256 _amount) external

// Admin functions
adminWithdrawETH(uint256 _amount, address payable _recipient) external
adminWithdrawUSDC(uint256 _amount, address _recipient) external

// View functions
getETHBalance() public view returns (uint256)
getUSDCBalance() public view returns (uint256)
getAvailableETH() public view returns (uint256)
getAvailableUSDC() public view returns (uint256)
getBeneficiaryETHWithdrawals(address _beneficiary) external view returns (uint256)
getBeneficiaryUSDCWithdrawals(address _beneficiary) external view returns (uint256)
```

## Key Features

✅ **Multi-token support** - Donors use any token they have  
✅ **Automatic swaps** - Li.Fi handles all swaps and bridges  
✅ **Direct routing** - Funds go straight to community contracts  
✅ **ENS support** - Human-readable addresses  
✅ **Separate tracking** - ETH and USDC tracked independently  
✅ **Testnet ready** - Configured for Base Sepolia  
✅ **Beneficiary control** - Easy withdrawal functionality

## Next Steps

1. **Deploy updated contracts** (if you haven't already)
   ```bash
   cd contracts && npm run deploy
   ```

2. **Integrate components** into your community cards
   - Import `DonationModal` and `LiFiDonateWidget`
   - Add donate button to card
   - Pass community data to modal

3. **Test on Base Sepolia**
   - Add testnet to wallet
   - Test donation flow
   - Verify USDC arrives

4. **Configure for production** (future)
   - Change chain IDs to mainnet
   - Update USDC addresses
   - Adjust slippage and gas settings

## Architecture Diagram

```
Frontend (Next.js + React)
├── Community Cards
│   └── Donate Button
│       └── DonationModal
│           ├── Li.Fi Widget (USDC swap)
│           └── Direct ETH form
│
Smart Contracts (Solidity)
├── CommunityTreasury
│   └── Creates & manages communities
│       ├── donateToCommunity(ETH)
│       └── donateUSDCToCommunity(USDC)
│
└── Community (per-community)
    ├── receive() - ETH deposits
    ├── depositUSDC() - USDC deposits
    ├── withdrawETH() - Beneficiary ETH
    └── withdrawUSDC() - Beneficiary USDC

    External: Li.Fi Protocol
    └── Swaps any token → USDC
        → Sends to Community contract
```

## Resources

- **Full Integration Guide**: [LIFI_INTEGRATION_GUIDE.md](./LIFI_INTEGRATION_GUIDE.md)
- **Li.Fi Docs**: https://docs.li.fi/
- **Base Docs**: https://docs.base.org/
- **Smart Contract Reference**: [contracts/](./contracts/)

## Support

For questions or issues:
1. Check [LIFI_INTEGRATION_GUIDE.md](./LIFI_INTEGRATION_GUIDE.md)
2. Review component comments
3. Check Li.Fi official docs
4. Review Base testnet docs

---

**You're all set!** Your platform now supports world-class cross-chain donations. 🚀
