'use client';

import React, { useState } from 'react';
import { LiFiDonateWidget } from './lifi-donate-widget';
import { Community } from '@/lib/communities';

interface DonationModalProps {
  community: Community;
  isOpen: boolean;
  onClose: () => void;
}

export function DonationModal({ community, isOpen, onClose }: DonationModalProps) {
  const [activeTab, setActiveTab] = useState('lifi'); // 'lifi' or 'eth'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Donate to {community.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-size-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Community Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Contract Address:</strong>
              <span className="block font-mono text-xs text-gray-800 break-all mt-1">
                {community.contractAddress}
              </span>
            </p>
            {community.ensName && (
              <p className="text-sm text-gray-600 mt-2">
                <strong>ENS Name:</strong>
                <span className="block font-mono text-xs text-gray-800">{community.ensName}</span>
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              <strong>Beneficiaries:</strong> {community.beneficiaries} people
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Region:</strong> {community.region}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('lifi')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'lifi'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              💱 Swap to USDC (Li.Fi)
            </button>
            <button
              onClick={() => setActiveTab('eth')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'eth'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Ξ Donate ETH
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'lifi' && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Use any token on any chain. Li.Fi will automatically swap and bridge it to USDC on Base Sepolia.
              </p>
              <LiFiDonateWidget
                communityAddress={community.contractAddress}
                communityName={community.name}
                communityEnsName={community.ensName}
              />
            </div>
          )}

          {activeTab === 'eth' && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <p className="mb-4">Direct ETH donation coming soon</p>
                <p className="text-sm text-gray-400">
                  Please use the Li.Fi tab to donate USDC, or connect your wallet for direct ETH donations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
