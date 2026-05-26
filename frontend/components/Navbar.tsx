'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [disruptionCount, setDisruptionCount] = useState(0);

  useEffect(() => {
    const fetchDisruptions = async () => {
      try {
        const res = await fetch('/api/mines/disruptions');
        const data = await res.json();
        if (data.disruptions) {
          setDisruptionCount(data.disruptions.length);
        }
      } catch (error) {
        // Silent fail - mines API may not be ready yet
      }
    };

    fetchDisruptions();
    const interval = setInterval(fetchDisruptions, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:from-emerald-300 hover:to-cyan-300 transition">
            💎 CommodityBubbles
          </Link>
        </div>

        <div className="flex gap-2">
          <Link href="/dashboard" className={`px-6 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 ${isActive('/dashboard') ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/50' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'}`}>
            📊 Dashboard
          </Link>

          <Link href="/bubbles" className={`px-6 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 ${isActive('/bubbles') ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/50' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'}`}>
            🫧 Bubbles
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          </Link>

          <Link href="/mines" className={`px-6 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 ${isActive('/mines') ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/50' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'}`}>
            ⛏️ Mines
            {disruptionCount > 0 && <span className="h-5 w-5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center ml-1">{disruptionCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
