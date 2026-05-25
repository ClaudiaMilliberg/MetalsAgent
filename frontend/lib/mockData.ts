// Mock data for development - replace with real API calls in Week 1

export const mockCommodities = [
  {
    id: 'copper',
    name: 'Copper',
    symbol: 'CU',
    currentPrice: 4.65,
    change24h: 2.34,
    sentiment: 'bullish' as const, // bullish | bearish | neutral
    volatility: 8.5,
    emoji: '🟠',
  },
  {
    id: 'nickel',
    name: 'Nickel',
    symbol: 'NI',
    currentPrice: 8.92,
    change24h: -1.22,
    sentiment: 'bearish' as const,
    volatility: 12.3,
    emoji: '🩶',
  },
  {
    id: 'zinc',
    name: 'Zinc',
    symbol: 'ZN',
    currentPrice: 2.67,
    change24h: 0.45,
    sentiment: 'neutral' as const,
    volatility: 5.2,
    emoji: '⚪',
  },
  {
    id: 'gold',
    name: 'Gold',
    symbol: 'AU',
    currentPrice: 2078.50,
    change24h: 1.89,
    sentiment: 'bullish' as const,
    volatility: 3.1,
    emoji: '🟡',
  },
];

export const mockNews = [
  {
    id: 1,
    title: 'Copper prices hit 5-year high amid supply concerns',
    sentiment: 'bullish' as const,
    source: 'Reuters',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    excerpt: 'Global supply constraints drive copper demand higher as construction activity rebounds.',
  },
  {
    id: 2,
    title: 'Nickel market faces pressure from oversupply',
    sentiment: 'bearish' as const,
    source: 'Bloomberg',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    excerpt: 'Indonesian production surge weighs on prices as inventories accumulate at London Metal Exchange.',
  },
  {
    id: 3,
    title: 'Gold strengthens as bond yields decline',
    sentiment: 'bullish' as const,
    source: 'CNBC',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    excerpt: 'Falling interest rates make gold more attractive, with central banks continuing to buy.',
  },
  {
    id: 4,
    title: 'Zinc storage at Shanghai falls to 3-year lows',
    sentiment: 'neutral' as const,
    source: 'MarketWatch',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    excerpt: 'While inventory draws support prices, industrial demand growth remains uncertain.',
  },
  {
    id: 5,
    title: 'ECB signals potential rate cuts later this year',
    sentiment: 'bullish' as const,
    source: 'FT',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    excerpt: 'Easier monetary policy expected to boost commodity prices as inflation moderates.',
  },
];

export const mockPortfolioValue = {
  total: 41812.14,
  change24h: 10859.48,
  changePercent: 35.1,
  status: 'watching', // watching | bullish | bearish
};

export const mockPriceHistory = {
  copper: [45, 48, 52, 49, 55, 58, 62, 65, 63, 67, 70, 74],
  nickel: [82, 79, 77, 75, 71, 68, 72, 70, 65, 63, 60, 59],
  zinc: [21, 22, 23, 22, 24, 25, 24, 26, 27, 28, 29, 27],
  gold: [2020, 2035, 2050, 2045, 2060, 2065, 2075, 2080, 2085, 2090, 2095, 2078],
};

export const mockBubblePositions = {
  copper: { x: 25, y: 35, size: 120 },
  nickel: { x: 75, y: 25, size: 95 },
  zinc: { x: 15, y: 75, size: 80 },
  gold: { x: 70, y: 70, size: 110 },
};
