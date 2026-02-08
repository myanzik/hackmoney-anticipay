'use client';

import React from 'react';
import { LiFiWidget } from '@lifi/widget';
import type { WidgetConfig } from '@lifi/widget';

interface LiFiDonateWidgetProps {
  communityAddress: string;
  communityName: string;
  communityEnsName?: string;
}

export function LiFiDonateWidget({
  communityAddress,
  communityName,
  communityEnsName,
}: LiFiDonateWidgetProps) {
  // USDC address on Base Sepolia
  const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
  const BASE_SEPOLIA_CHAIN_ID = 84532;

  const widgetConfig: WidgetConfig = {
    integrator: 'AnticiPay',
    fromChain: BASE_SEPOLIA_CHAIN_ID,
    toChain: BASE_SEPOLIA_CHAIN_ID,
    toToken: USDC_ADDRESS,
    toAddress: communityAddress as any,
    slippage: 3,
    appearance: 'light',
  };

  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Donating to:</strong> {communityName}
          {communityEnsName && <div className="text-xs text-blue-700 mt-1">{communityEnsName}</div>}
          <div className="text-xs text-blue-600 font-mono mt-1 break-all">{communityAddress}</div>
        </p>
      </div>
      
      <div style={{
        width: '100%',
        height: '600px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
      }}>
        <LiFiWidget {...widgetConfig} />
      </div>
    </div>
  );
}
