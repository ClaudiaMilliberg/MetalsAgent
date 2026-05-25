import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// Subscribe to real-time signals
export const subscribeToSignals = (
  commodity: string,
  callback: (signal: any) => void
) => {
  const subscription = supabase
    .channel('signals')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'signals', filter: `commodity_id=eq.${commodity}` }, (payload) => {
      callback(payload.new);
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};

// Subscribe to real-time prices
export const subscribeToPrices = (
  commodity: string,
  callback: (price: any) => void
) => {
  const subscription = supabase
    .from(`prices:commodity_id=eq.${commodity}`)
    .on('INSERT', (payload) => {
      callback(payload.new);
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};

// Fetch signals for commodity
export const fetchSignals = async (commodity: string, limit: number = 10) => {
  const { data, error } = await supabase
    .from('signals')
    .select('*')
    .eq('commodity_id', commodity)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

// Fetch prices for commodity
export const fetchPrices = async (
  commodity: string,
  days: number = 30,
  interval: '1h' | '1d' = '1d'
) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('prices')
    .select('*')
    .eq('commodity_id', commodity)
    .gte('timestamp', startDate.toISOString())
    .order('timestamp', { ascending: true });

  if (error) throw error;
  return data;
};

// Fetch user subscription
export const fetchSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};
