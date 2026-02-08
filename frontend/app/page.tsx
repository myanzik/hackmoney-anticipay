'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CommunityCard } from '@/components/community-card';
import { communities } from '@/lib/communities';

export default function Home() {
  const [selectedHazard, setSelectedHazard] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const hazards = ['All', ...Array.from(new Set(communities.map(c => c.hazardType)))];

  const filteredCommunities = communities.filter(community => {
    const hazardMatch = selectedHazard === 'All' || community.hazardType === selectedHazard;
    const searchMatch = searchTerm === '' || 
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.region.toLowerCase().includes(searchTerm.toLowerCase());
    return hazardMatch && searchMatch;
  });

  const totalFunding = communities.reduce((sum, c) => sum + c.currentFunding, 0);
  const totalTarget = communities.reduce((sum, c) => sum + c.targetFunding, 0);
  const totalBeneficiaries = communities.reduce((sum, c) => sum + c.beneficiaries, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Hero Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Anticipatory Disaster Relief Funding
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Support communities with continuous, adaptive financial assistance before, during, and after disasters.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm mb-2">Active Communities</p>
              <p className="text-3xl font-bold text-blue-600">{communities.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm mb-2">Total Beneficiaries</p>
              <p className="text-3xl font-bold text-blue-600">{totalBeneficiaries.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm mb-2">Total Funding Progress</p>
              <p className="text-3xl font-bold text-blue-600">
                {((totalFunding / totalTarget) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search communities by name or hazard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Hazard Filter */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Filter by Hazard </p>
            <div className="flex flex-wrap gap-2">
              {hazards.map(hazard => (
                <button
                  key={hazard}
                  onClick={() => setSelectedHazard(hazard)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedHazard === hazard
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {hazard}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map(community => (
            <CommunityCard
              key={community.id}
              {...community}
            />
          ))}
        </div>

        {filteredCommunities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No communities found matching your criteria.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
