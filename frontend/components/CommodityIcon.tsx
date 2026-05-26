'use client';

import React from 'react';
import {
  Cable,
  Atom,
  Coins,
  CircleDollarSign,
  Hexagon,
  BatteryCharging,
  Flake,
  Gem,
} from 'lucide-react';
import { getCommodityColor } from '@/lib/cinematic-design-system';

interface CommodityIconProps {
  symbol: string;
  size?: number;
  showGlow?: boolean;
}

/**
 * CommodityIcon
 * Renders the appropriate Lucide icon for a commodity with cinematic styling
 */
export default function CommodityIcon({ symbol, size = 24, showGlow = true }: CommodityIconProps) {
  const commodity = getCommodityColor(symbol);

  const iconMap: Record<string, React.ComponentType<any>> = {
    Cable,
    Atom,
    Coins,
    CircleDollarSign,
    Hexagon,
    BatteryCharging,
    Flake,
    Gem,
  };

  const IconComponent = iconMap[commodity.icon] || Coins;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: showGlow ? `drop-shadow(0 0 12px ${commodity.glow.base})` : 'none',
        transition: 'filter 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <IconComponent
        size={size}
        color={commodity.primary}
        strokeWidth={2}
        style={{
          opacity: 0.9,
          transition: 'opacity 300ms ease-out',
        }}
      />
    </div>
  );
}
