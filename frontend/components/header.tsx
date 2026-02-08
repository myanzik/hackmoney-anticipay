'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌦️</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AnticiPay</h1>
            <p className="text-xs text-gray-600">Crowdfunded Disaster Relief</p>
          </div>
        </Link>
        <ConnectButton />
      </div>
    </header>
  );
}
