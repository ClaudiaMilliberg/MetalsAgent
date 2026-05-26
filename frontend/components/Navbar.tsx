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
    <nav className="sticky top-0 z-50 glass-premium border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-2xl">🫧</div>
            <h1 className="text-xl font-bold text-white hidden sm:block tracking-tight">
              CommodityBubbles
            </h1>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <span className="text-xs text-green-300 font-semibold hidden sm:block uppercase tracking-widest">Live Data</span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition duration-300 ease-premium"
            >
              <div className="w-8 h-8 bg-blue-500/20 rounded-full border border-blue-500 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-400">U</span>
              </div>
              <span className="text-sm text-gray-300 hidden sm:block">User</span>
              <span className="text-gray-400">▼</span>
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 glass-premium border-white/10 rounded-lg shadow-2xl overflow-hidden">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition duration-300">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition duration-300">
                  Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition duration-300 border-t border-white/10">
                  Help
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition duration-300 border-t border-white/10"
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
