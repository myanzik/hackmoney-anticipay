"use client";

import { useState } from "react";
import { Community } from "@/lib/communities";
import LiFiDonateWidget from "./lifi-donate-widget";

interface DonationModalProps {
  community: Community;
  isOpen: boolean;
  onClose: () => void;
}

export function DonationModal({
  community,
  isOpen,
  onClose,
}: DonationModalProps) {
  const [donationMethod, setDonationMethod] = useState<"eth" | "usdc">("usdc");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Donate to {community.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Donation Method Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setDonationMethod("usdc")}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                donationMethod === "usdc"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              💱 Swap to USDC (Li.Fi)
            </button>
            <button
              onClick={() => setDonationMethod("eth")}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                donationMethod === "eth"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Ξ Donate ETH
            </button>
          </div>

          {/* USDC Donation via Li.Fi */}
          {donationMethod === "usdc" && (
            <div>
              <LiFiDonateWidget
                communityName={community.name}
                communityAddress={community.contractAddress}
                ensName={community.ensName}
              />
            </div>
          )}

          {/* ETH Donation */}
          {donationMethod === "eth" && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                >
                  Connect Wallet to Donate
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  ⚠️ <strong>Note:</strong> Wallet connection needed. ETH will be sent directly to the contract.
                </p>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Contract Address:</strong>
                </p>
                <code className="bg-gray-100 px-3 py-2 rounded block text-xs break-all">
                  {community.contractAddress}
                </code>
                <p>
                  <strong>ENS Name:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{community.ensName}</code>
                </p>
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>About this community:</strong> {community.description}
            </p>
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
              <div>
                <p className="text-gray-600">Region</p>
                <p className="font-semibold text-gray-900">{community.region}</p>
              </div>
              <div>
                <p className="text-gray-600">Beneficiaries</p>
                <p className="font-semibold text-gray-900">{community.beneficiaries}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationModal;
