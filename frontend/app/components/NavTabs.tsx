'use client';

import { useState, useRef, useEffect } from 'react';
import { Atom, Coins, Zap, Leaf } from 'lucide-react';

interface NavTab {
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface NavTabsProps {
  onTabChange?: (label: string) => void;
}

export default function NavTabs({ onTabChange }: NavTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs: NavTab[] = [
    { label: 'All Commodities', icon: <Atom size={18} />, color: 'blue' },
    { label: 'Metals', icon: <Coins size={18} />, color: 'cyan' },
    { label: 'Energy', icon: <Zap size={18} />, color: 'yellow' },
    { label: 'Agriculture', icon: <Leaf size={18} />, color: 'green' },
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          handleTabChange((activeTab + 1) % tabs.length);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleTabChange((activeTab - 1 + tabs.length) % tabs.length);
          break;
        case 'Home':
          e.preventDefault();
          handleTabChange(0);
          break;
        case 'End':
          e.preventDefault();
          handleTabChange(tabs.length - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, tabs.length]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    tabRefs.current[index]?.focus();
    onTabChange?.(tabs[index].label);
  };

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipple({ x, y });

    setTimeout(() => setRipple(null), 600);
    handleTabChange(index);
  };

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors: Record<string, { active: string; inactive: string }> = {
      blue: {
        active: 'from-blue-500/25 to-blue-600/5 border-blue-500/60 shadow-blue-500/40 text-white',
        inactive: 'from-slate-600/10 to-slate-700/5 border-slate-600/30 text-slate-400',
      },
      cyan: {
        active: 'from-cyan-500/25 to-cyan-600/5 border-cyan-500/60 shadow-cyan-500/40 text-white',
        inactive: 'from-slate-600/10 to-slate-700/5 border-slate-600/30 text-slate-400',
      },
      yellow: {
        active: 'from-yellow-500/25 to-yellow-600/5 border-yellow-500/60 shadow-yellow-500/40 text-white',
        inactive: 'from-slate-600/10 to-slate-700/5 border-slate-600/30 text-slate-400',
      },
      green: {
        active: 'from-green-500/25 to-green-600/5 border-green-500/60 shadow-green-500/40 text-white',
        inactive: 'from-slate-600/10 to-slate-700/5 border-slate-600/30 text-slate-400',
      },
    };

    return isActive ? colors[color].active : colors[color].inactive;
  };

  return (
    <div
      ref={containerRef}
      className="mb-8 sm:mb-12 flex gap-2 sm:gap-3 border-b border-white/20 pb-4 sm:pb-6 overflow-x-auto group scroll-smooth snap-x snap-mandatory"
      role="tablist"
      aria-label="Commodity categories"
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.label}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
          onClick={(e) => handleRipple(e, index)}
          onMouseEnter={() => setHoveredTab(index)}
          onMouseLeave={() => setHoveredTab(null)}
          className={`
            relative px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm whitespace-nowrap
            transition-all duration-400 ease-premium rounded-lg border flex items-center gap-2 sm:gap-3
            group/tab snap-center flex-shrink-0 overflow-hidden
            bg-gradient-to-b ${getColorClasses(tab.color, activeTab === index)}
            ${activeTab === index ? 'border-2 shadow-lg hover:shadow-2xl' : 'border'}
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400
          `}
          role="tab"
          aria-selected={activeTab === index}
          tabIndex={activeTab === index ? 0 : -1}
        >
          {/* Icon with subtle hover scale */}
          <span
            className="flex-shrink-0 transition-transform duration-300 ease-premium"
            style={{
              transform: hoveredTab === index ? 'scale(1.2) rotate(5deg)' : 'scale(1)',
            }}
          >
            {tab.icon}
          </span>

          {/* Label */}
          <span className="relative z-10 font-semibold">{tab.label}</span>

          {/* Ripple effect */}
          {ripple && activeTab === index && (
            <div
              className="absolute rounded-full bg-white/20 animate-ripple"
              style={{
                left: `${ripple.x}px`,
                top: `${ripple.y}px`,
                width: '10px',
                height: '10px',
              }}
            />
          )}

          {/* Active state decorations */}
          {activeTab === index && (
            <>
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-lg ring-2 ring-offset-0 pointer-events-none animate-pulse" />

              {/* Top accent bar */}
              <div className="absolute -top-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer" />
            </>
          )}

          {/* Tooltip (hidden until hover) */}
          {hoveredTab === index && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-md bg-slate-950 border border-white/20 text-xs whitespace-nowrap text-white/90 shadow-lg animate-spring-pop pointer-events-none">
              {tab.label}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
