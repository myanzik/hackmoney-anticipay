'use client';

import React, { useState } from 'react';
import { formatEther } from 'viem';
import Link from 'next/link';
import { DonationModal } from './donation-modal';
import { communities } from '@/lib/communities';

interface CommunityCardProps {
  id: string;
  name: string;
  description: string;
  walletAddress: string;
  currentFunding: number;
  targetFunding: number;
  region: string;
  hazardType: string;
  beneficiaries: number;
  logo?: string;
  balance?: string;
  contractAddress?: string;
  ensName?: string;
}

export function CommunityCard({
  id,
  name,
  description,
  walletAddress,
  currentFunding,
  targetFunding,
  region,
  hazardType,
  beneficiaries,
  logo = "💰",
  balance,
  contractAddress,
  ensName,
}: CommunityCardProps) {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  
  // Get the full community object from the list for the modal
  const fullCommunity = communities.find(c => c.id === id);
  const fundingPercentage = (currentFunding / targetFunding) * 100;
  const displayBalance = balance || formatEther(BigInt(currentFunding));

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <>
      <Link href={`/communities/${id}`}>
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-6 cursor-pointer h-full">
          {/* Header with logo and name */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-4xl">{logo}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                <p className="text-sm text-gray-500 mt-1">{region}</p>
              </div>
            </div>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded">
              {hazardType}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

          {/* Wallet address */}
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Wallet Address</p>
            <p className="text-sm font-mono text-gray-900 break-all">{walletAddress}</p>
          </div>

          {/* Funding progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Funding Progress</span>
              <span className="text-sm font-semibold text-blue-600">
                {fundingPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-600">
                {displayBalance} ETH
              </span>
              <span className="text-xs text-gray-600">
                {formatEther(BigInt(targetFunding))} ETH target
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm mb-4">
            <div className="flex-1">
              <p className="text-gray-500 text-xs">Beneficiaries</p>
              <p className="font-semibold text-gray-900">{beneficiaries}</p>
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-xs">Raised</p>
              <p className="font-semibold text-gray-900">
                {(fundingPercentage).toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Donate Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDonationModalOpen(true);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            💝 Donate Now
          </button>
        </div>
      </Link>
      
      {/* Donation Modal */}
      {fullCommunity && (
        <DonationModal
          community={fullCommunity}
          isOpen={isDonationModalOpen}
          onClose={() => setIsDonationModalOpen(false)}
        />
      )}
    </>
  );
}
