'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-premium-strong border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-1 sm:gap-3 min-w-0 flex-shrink-0">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1 sm:gap-3 hover:opacity-80 transition-opacity duration-300 rounded-lg px-2 sm:px-3 py-1.5 hover:bg-white/5 touch-target"
            >
              <div className="text-xl sm:text-2xl lg:text-3xl flex-shrink-0">🫧</div>
              <h1 className="text-sm sm:text-base lg:text-xl font-black text-white hidden sm:block tracking-tight whitespace-nowrap">
                CommodityBubbles
              </h1>
            </button>
          </div>

          {/* Center Navigation Links - Hidden on Mobile */}
          <div className="hidden lg:flex items-center gap-1">
            <a href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition duration-300">
              Dashboard
            </a>
            <a href="/bubbles" className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition duration-300">
              Bubbles
            </a>
            <a href="/mines" className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition duration-300">
              Mines
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex-shrink-0 p-2 rounded-lg hover:bg-white/10 transition duration-300 text-gray-300 hover:text-white"
            title="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Status Indicator - Hidden on Mobile */}
          <div className="hidden lg:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 mx-2 sm:mx-4">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-500/50 flex-shrink-0"></div>
            <span className="text-xs text-emerald-300 font-semibold uppercase tracking-widest whitespace-nowrap">Live</span>
          </div>

          {/* User Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-white/10 transition duration-300 ease-premium border border-transparent hover:border-white/20 touch-target"
              title="User menu"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full border border-blue-500/50 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                <span className="text-xs font-bold text-blue-300">👤</span>
              </div>
              <span className="text-sm text-gray-300 hidden sm:block font-semibold">User</span>
              <span className={`text-gray-400 text-xs sm:text-sm transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <>
                {/* Backdrop for mobile */}
                <div
                  className="fixed inset-0 sm:absolute z-40"
                  onClick={() => setUserMenuOpen(false)}
                  style={{ top: '100%', left: '-9999px', right: '-9999px', bottom: '-9999px' }}
                />
                <div className="absolute right-0 mt-2 w-56 sm:w-48 glass-premium-strong border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Account</p>
                    <p className="text-sm font-semibold text-white">Demo User</p>
                  </div>
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition duration-300 flex items-center gap-2">
                    <span>👤</span> Profile
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition duration-300 flex items-center gap-2">
                    <span>⚙️</span> Settings
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition duration-300 border-t border-white/10 flex items-center gap-2">
                    <span>❓</span> Help & Support
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition duration-300 border-t border-white/10 flex items-center gap-2 font-semibold"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-black/40 backdrop-blur-md">
            <div className="px-4 py-3 space-y-2">
              <a
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition duration-300 touch-target"
              >
                Dashboard
              </a>
              <a
                href="/bubbles"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition duration-300 touch-target"
              >
                Bubbles
              </a>
              <a
                href="/mines"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition duration-300 touch-target"
              >
                Mines
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
