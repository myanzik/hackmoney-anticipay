'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { communities } from '@/lib/communities';
import { formatEther } from 'viem';
import { ChevronLeft } from 'lucide-react';

export default function CommunityDetail() {
  const params = useParams();
  const communityId = params.id as string;
  const community = communities.find(c => c.id === communityId);

  if (!community) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Community Not Found</h1>
            <Link href="/" className="text-blue-600 hover:underline">
              Back to communities
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const fundingPercentage = (community.currentFunding / community.targetFunding) * 100;
  const currentFundingETH = formatEther(BigInt(community.currentFunding));
  const targetFundingETH = formatEther(BigInt(community.targetFunding));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Back Button */}
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ChevronLeft size={20} />
          Back to Communities
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-start gap-6 mb-6">
            <span className="text-6xl">{community.logo || "💰"}</span>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{community.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{community.region}</p>
              <div className="flex gap-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
                  {community.hazardType}
                </span>
                <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded">
                  {community.beneficiaries} Beneficiaries
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-lg leading-relaxed">{community.description}</p>
        </div>

        {/* Funding Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Funding Status</h2>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold text-gray-900">Progress</span>
              <span className="text-2xl font-bold text-blue-600">{fundingPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Funding Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Raised</p>
              <p className="text-3xl font-bold text-blue-600">{currentFundingETH}</p>
              <p className="text-xs text-gray-600 mt-1">ETH</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Target</p>
              <p className="text-3xl font-bold text-gray-900">{targetFundingETH}</p>
              <p className="text-xs text-gray-600 mt-1">ETH</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Remaining</p>
              <p className="text-3xl font-bold text-green-600">
                {(
                  parseFloat(targetFundingETH) - parseFloat(currentFundingETH)
                ).toFixed(2)}
              </p>
              <p className="text-xs text-gray-600 mt-1">ETH</p>
            </div>
          </div>
        </div>

        {/* Wallet Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Community Wallet</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-2">Smart Contract Address</p>
            <p className="font-mono text-lg text-gray-900 break-all">{community.walletAddress}</p>
          </div>
        </div>

        {/* Donate Button */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Support This Community</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to contribute to this community&apos;s fund. All contributions are transparent and tracked on Base Sepolia blockchain.
          </p>
          <button
            disabled
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Donate to {community.name} (Coming Soon)
          </button>
          <p className="text-xs text-gray-500 text-center mt-4">
            Donation functionality will be available in the next phase of development.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
