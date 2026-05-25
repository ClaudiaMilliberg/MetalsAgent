// User & Auth
export interface User {
  id: string;
  email: string;
  tier: 'free' | 'pro' | 'enterprise';
  created_at: string;
  last_login: string;
}

// Subscriptions
export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  tier: 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'expired';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

// Commodities
export interface Commodity {
  id: string;
  name: string;
  symbol: string;
  hg_code: string;
  category: 'metals' | 'energy' | 'agriculture';
}

// Signals from bot
export interface Signal {
  id: string;
  commodity_id: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  edge_pct: number;
  timestamp: string;
  source: string;
  metadata?: Record<string, any>;
}

// Sentiment from news
export interface Sentiment {
  id: string;
  commodity_id: string;
  headline: string;
  source: string;
  sentiment_score: number;
  published_at: string;
}

// Prices
export interface Price {
  id: string;
  commodity_id: string;
  price: number;
  timestamp: string;
}

// Dashboard Data
export interface DashboardData {
  commodities: CommodityBubble[];
  user_subscription: Subscription;
  recent_signals: Signal[];
}

// Bubble visualization
export interface CommodityBubble {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_24h: number;
  sentiment_score: number;
  bubble_size: 'xl' | 'l' | 'm' | 's';
  bubble_color: 'bullish' | 'bearish' | 'neutral' | 'gray';
  latest_signal: Signal | null;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface SignalIngestRequest {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  edge_pct: number;
  commodity: string;
  timestamp: string;
  source?: string;
  metadata?: Record<string, any>;
}

export interface SignalIngestResponse {
  success: boolean;
  signal_id: string;
  stored_at: string;
}
