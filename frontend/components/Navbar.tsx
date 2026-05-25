'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-secondary/60 backdrop-blur border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-2xl">🫧</div>
            <h1 className="text-xl font-bold text-white hidden sm:block">
              CommodityBubbles
            </h1>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400 hidden sm:block">Live Data</span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700/50 transition"
            >
              <div className="w-8 h-8 bg-accent/20 rounded-full border border-accent flex items-center justify-center">
                <span className="text-xs font-bold text-accent">U</span>
              </div>
              <span className="text-sm text-gray-300 hidden sm:block">User</span>
              <span className="text-gray-400">▼</span>
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-secondary border border-gray-700/50 rounded-lg shadow-lg overflow-hidden">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition">
                  Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition border-t border-gray-700/50">
                  Help
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50 transition border-t border-gray-700/50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
