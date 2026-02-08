# Li.Fi Integration Guide

Your AnticiPay platform now supports **cross-chain donations via Li.Fi**! Donors can use any token and have it automatically swapped to USDC on Base Sepolia and sent directly to community contracts.

## Overview

### Architecture

```
Donor with any token (ETH, USDC, DAI, etc.)
        ↓
    Li.Fi Widget
        ↓
  Quote & Route
        ↓
  Swap (if needed) + Bridge (if needed)
        ↓
    USDC on Base Sepolia
        ↓
Community Contract (0x......)
        ↓
Community receives USDC
```

## Components

### 1. **LiFi Donation Widget** (`lifi-donate-widget.tsx`)
- Embedded Li.Fi widget for token swaps
- Pre-configured to swap any token to USDC on Base Sepolia
- Automatically sends to community contract address
- Supports all chains that Li.Fi supports

**Features:**
- ✅ Multi-chain swap support
- ✅ Live quote updates
- ✅ ENS name display
- ✅ 3% slippage tolerance (configurable)
- ✅ Testnet (Base Sepolia) ready

### 2. **Donation Modal** (`donation-modal.tsx`)
- Tab-based UI with two donation methods
- Method 1: **Li.Fi USDC Swap** (recommended)
- Method 2: **Direct ETH Donation** (for wallet-connected users)
- Shows community details and contract info

## Frontend Components

### Using the Li.Fi Widget

```tsx
import { LiFiDonateWidget } from "@/components/lifi-donate-widget";
import { Community } from "@/lib/communities";

function DonateButton({ community }: { community: Community }) {
  return (
    <LiFiDonateWidget
      communityName={community.name}
      communityAddress={community.contractAddress}
      ensName={community.ensName}
    />
  );
}
```

### Opening Donation Modal

```tsx
import { DonationModal } from "@/components/donation-modal";
import { useState } from "react";

function CommunityCard({ community }: { community: Community }) {
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsDonationOpen(true)}>
        Donate to {community.name}
      </button>

      <DonationModal
        community={community}
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
    </>
  );
}
```

## Smart Contracts

### Community Contract Changes

#### New Functions:

**Deposit USDC:**
```solidity
function depositUSDC(uint256 _amount) external
```
- Called when Li.Fi sends USDC to the contract
- Caller: Li.Fi protocol → Community contract
- Tracks total USDC raised

**Withdraw USDC (Beneficiary):**
```solidity
function withdrawUSDC(uint256 _amount) external
```
- Beneficiaries can withdraw their share of USDC
- Only works if sufficient balance available

**Admin Withdraw USDC:**
```solidity
function adminWithdrawUSDC(uint256 _amount, address _recipient) external
```
- Treasury can withdraw USDC for administrative purposes

#### New State Variables:

```solidity
address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

uint256 public totalETHRaised;
uint256 public totalUSDCRaised;
uint256 public totalETHWithdrawn;
uint256 public totalUSDCWithdrawn;

mapping(address => uint256) public beneficiaryETHWithdrawals;
mapping(address => uint256) public beneficiaryUSDCWithdrawals;
```

#### View Functions:

```solidity
function getETHBalance() public view returns (uint256)
function getUSDCBalance() public view returns (uint256)
function getAvailableETH() public view returns (uint256)
function getAvailableUSDC() public view returns (uint256)
function getBeneficiaryETHWithdrawals(address) external view returns (uint256)
function getBeneficiaryUSDCWithdrawals(address) external view returns (uint256)
```

### CommunityTreasury Contract Changes

#### New Functions:

**Donate USDC to Community:**
```solidity
function donateUSDCToCommunity(string memory _communityName, uint256 _amount) external
```
- Alternative donation method through the Treasury
- Less commonly used (Li.Fi direct routing preferred)

#### New Events:

```solidity
event ETHDonated(
    string indexed communityName,
    address indexed donor,
    uint256 amount
);

event USDCDonated(
    string indexed communityName,
    address indexed donor,
    uint256 amount
);
```

## Configuration

### Li.Fi Widget Settings

**Current Base Sepolia testnet config:**

```typescript
{
  chains: { allow: [84532] },      // Base Sepolia only
  fromChain: 84532,
  toChain: 84532,
  fromToken: undefined,             // User selects
  toToken: USDC_BASE_SEPOLIA,       // 0x833589fCD...
  toAddress: communityAddress,      // Auto-set to community
  slippage: 0.03,                   // 3% tolerance
}
```

### USDC Address on Base Sepolia

Official USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

- ✅ Native USDC (recommended)
- Decimals: 6 (standard for USDC)
- Can be swapped from any token Li.Fi supports

## Fund Flow

### Donation via Li.Fi Widget

```
1. Donor clicks "Donate" button
2. Modal opens with Li.Fi widget
3. Donor selects token and amount
4. Li.Fi Quote API finds best route
5. User approves token transfer
6. Li.Fi protocol executes swap/bridge
7. USDC sent directly to Community contract
8. Community contract receives & tracks USDC
9. Beneficiaries can withdraw
```

### Token Tracing

```typescript
// Query community balances
const ethBalance = await community.getETHBalance();      // Wei
const usdcBalance = await community.getUSDCBalance();    // Wei (6 decimals)

// Check funds raised
const ethRaised = await community.totalETHRaised();
const usdcRaised = await community.totalUSDCRaised();

// Track by beneficiary
const ethWithdrawn = await community.getBeneficiaryETHWithdrawals(address);
const usdcWithdrawn = await community.getBeneficiaryUSDCWithdrawals(address);
```

## Testnet Setup

### Prerequisites

1. **MetaMask or compatible wallet**
   - Add Base Sepolia network (if not present)
   - Get testnet USDC or ETH

2. **Testnet ETH on Base Sepolia**
   - Source: [Coinbase Faucet](https://www.coinbase.com/faucets)
   - Used for gas fees only

3. **Test Tokens (optional)**
   - The Li.Fi widget can simulate swaps from any token
   - Or add testnet ETH and test with native currency

### Base Sepolia Network Details

- **Chain ID**: 84532
- **RPC**: `https://sepolia.base.org`
- **Block Explorer**: `https://sepolia.basescan.org/`
- **Native Currency**: ETH
- **Official USDC**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

### Adding Base Sepolia to MetaMask

1. Open MetaMask
2. Click Network dropdown → "Add network"
3. Enter:
   - Network name: `Base Sepolia`
   - RPC URL: `https://sepolia.base.org`
   - Chain ID: `84532`
   - Currency symbol: `ETH`
   - Block explorer: `https://sepolia.basescan.org/`

## Common Issues & Solutions

### "Li.Fi widget not loading"

**Cause**: Network mismatch or incorrect chain configuration

**Solution**: 
- Ensure Base Sepolia is selected in wallet
- Clear browser cache
- Check that widget config has correct chainId: 84532

### "USDC transfer failed"

**Cause**: Insufficient USDC balance or no approval

**Solution**:
- Check USDC balance on community contract
- Verify community contract has USDC interface support
- Ensure Li.Fi route includes Base Sepolia destination

### "Community contract not receiving funds"

**Cause**: Li.Fi routing to wrong address or chain

**Solution**:
- Verify `toAddress` is set to community contract address
- Confirm contract is deployed on Base Sepolia
- Check Li.Fi transaction logs for actual destination

## Testing Checklist

- [ ] Li.Fi widget loads in donation modal
- [ ] Can select different tokens
- [ ] Quote updates in real-time
- [ ] Community contract address shown in widget
- [ ] Swap completes and USDC arrives in contract
- [ ] Contract tracks USDC in `totalUSDCRaised`
- [ ] Beneficiaries can withdraw USDC
- [ ] ETH donations still work via direct transfer

## Future Enhancements

1. **Support more destination tokens**: USDC, sUSDe, stETH, etc.
2. **Multi-chain donations**: Donors on L1 → Community on Base
3. **Streaming donations**: Set up monthly recurring donations
4. **Yield generation**: Deposit USDC into yield protocols
5. **Insurance/Hedging**: Use derivatives to protect fund value
6. **Custom quote optimization**: Favor low fees or fast finality

## Resources

- **Li.Fi Docs**: https://docs.li.fi/
- **Li.Fi Widget**: https://docs.li.fi/li.fi-api/guides/widget
- **Base Docs**: https://docs.base.org/
- **USDC on Base**: https://www.circle.com/en/usdc/bridging
- **OpenZeppelin Contracts**: https://docs.openzeppelin.com/

## Support

For Li.Fi integration issues:
- [Li.Fi Discord](https://discord.gg/lifi)
- [Li.Fi GitHub](https://github.com/lifinance/lifi-sdk)

For Base/contract issues:
- [Base Discord](https://discord.gg/base)
- [Base GitHub](https://github.com/base-org)
