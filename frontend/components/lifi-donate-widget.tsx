"use client";

import { useMemo } from "react";
import { LiFiWidget, WidgetConfig } from "@lifi/widget";
import "@lifi/widget/index.css";

interface LiFiDonateWidgetProps {
  communityName: string;
  communityAddress: string;
  ensName?: string;
}

/**
 * Li.Fi Donation Widget Component
 * Allows donors to swap any token to USDC and send to community
 *
 * @param communityName - Name of the community
 * @param communityAddress - Smart contract address of the community
 * @param ensName - ENS name of the community (for display)
 */
export function LiFiDonateWidget({
  communityName,
  communityAddress,
  ensName,
}: LiFiDonateWidgetProps) {
  // USDC token on Base Sepolia for testnet
  const USDC_BASE_SEPOLIA = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  const widgetConfig: WidgetConfig = useMemo(
    () => ({
      // Base Sepolia testnet config
      chains: {
        allow: [84532], // Base Sepolia (84532)
        deny: [],
      },
      
      // Pre-configure swap to USDC
      fromChain: 84532, // Base Sepolia
      toChain: 84532,   // Base Sepolia
      fromToken: undefined, // User selects
      toToken: USDC_BASE_SEPOLIA, // Always USDC

      // Set recipient to community contract
      toAddress: communityAddress,

      // Feature flags
      appearance: "light",
      theme: {
        borderRadius: 8,
        borderRadiusSecondary: 4,
      },

      // Disable insurance & other optional features for MVP
      insurance: false,
      bridges: {
        allow: [],
        deny: [],
      },

      // Custom slippage settings
      slippage: 0.03, // 3% slippage tolerance

      // Widget title
      containerStyle: {
        border: "1px solid rgb(229, 231, 235)",
        borderRadius: "8px",
        padding: "16px",
      },

      // Appearance tweaks
      hiddenUI: ["language"],
    }),
    [communityAddress]
  );

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Donate to {communityName}
        </h3>
        {ensName && (
          <p className="text-sm text-gray-600 mt-1">
            Recipient: <code className="bg-gray-100 px-2 py-1 rounded">{ensName}</code>
          </p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Swap any token to USDC on Base Sepolia. Funds will be sent directly to the community.
        </p>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <LiFiWidget config={widgetConfig} />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          💡 <strong>How it works:</strong> Choose any token, amount, and Li.Fi will automatically swap it to USDC and send it to the community contract on Base Sepolia.
        </p>
      </div>
    </div>
  );
}

export default LiFiDonateWidget;
