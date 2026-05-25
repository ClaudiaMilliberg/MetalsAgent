-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Users (uses Supabase Auth, this is for profile extensions)
create table if not exists users (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  tier text check (tier in ('free', 'pro', 'enterprise')) default 'free',
  created_at timestamp with time zone default now(),
  last_login timestamp with time zone,
  updated_at timestamp with time zone default now()
);

-- Enable RLS on users
alter table users enable row level security;

create policy "Users can view their own profile"
  on users for select
  using (auth.uid() = id);

-- Subscriptions (Stripe integration)
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  tier text check (tier in ('pro', 'enterprise')) not null,
  status text check (status in ('active', 'canceled', 'expired')) default 'active',
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Commodities
create table if not exists commodities (
  id text primary key, -- copper, nickel, zinc, gold
  name text not null,
  symbol text not null,
  hg_code text, -- HG=F for copper
  category text check (category in ('metals', 'energy', 'agriculture')),
  created_at timestamp with time zone default now()
);

-- Insert default commodities
insert into commodities (id, name, symbol, hg_code, category) values
  ('copper', 'Copper', 'HG=F', 'HG=F', 'metals'),
  ('nickel', 'Nickel', 'NI=F', 'NI=F', 'metals'),
  ('zinc', 'Zinc', 'ZS=F', 'ZS=F', 'metals'),
  ('gold', 'Gold', 'GC=F', 'GC=F', 'metals')
on conflict do nothing;

-- Signals (from bot)
create table if not exists signals (
  id uuid primary key default uuid_generate_v4(),
  commodity_id text not null references commodities(id),
  sentiment text check (sentiment in ('bullish', 'bearish', 'neutral')) not null,
  confidence real check (confidence >= 0 and confidence <= 1) not null,
  edge_pct real not null,
  timestamp timestamp with time zone not null,
  source text default 'unknown',
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- Enable RLS on signals
alter table signals enable row level security;

-- All authenticated users can view signals
create policy "Authenticated users can view signals"
  on signals for select
  using (auth.role() = 'authenticated');

-- Create indexes for signals
create index if not exists idx_signals_commodity_id on signals(commodity_id);
create index if not exists idx_signals_timestamp on signals(timestamp desc);
create index if not exists idx_signals_source on signals(source);

-- Sentiment (from news)
create table if not exists sentiments (
  id uuid primary key default uuid_generate_v4(),
  commodity_id text not null references commodities(id),
  headline text not null,
  source text not null,
  sentiment_score real check (sentiment_score >= -1 and sentiment_score <= 1) not null,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Enable RLS on sentiments
alter table sentiments enable row level security;

-- All authenticated users can view sentiments
create policy "Authenticated users can view sentiments"
  on sentiments for select
  using (auth.role() = 'authenticated');

-- Create indexes for sentiments
create index if not exists idx_sentiments_commodity_id on sentiments(commodity_id);
create index if not exists idx_sentiments_published_at on sentiments(published_at desc);

-- Prices (historical)
create table if not exists prices (
  id uuid primary key default uuid_generate_v4(),
  commodity_id text not null references commodities(id),
  price real not null,
  timestamp timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS on prices
alter table prices enable row level security;

-- All authenticated users can view prices
create policy "Authenticated users can view prices"
  on prices for select
  using (auth.role() = 'authenticated');

-- Create indexes for prices
create index if not exists idx_prices_commodity_id on prices(commodity_id);
create index if not exists idx_prices_timestamp on prices(timestamp desc);
create unique index if not exists idx_prices_commodity_timestamp on prices(commodity_id, timestamp);

-- View: Latest signals per commodity
create or replace view latest_signals_per_commodity as
select distinct on (commodity_id)
  id,
  commodity_id,
  sentiment,
  confidence,
  edge_pct,
  timestamp,
  source
from signals
order by commodity_id, timestamp desc;

-- View: Dashboard data aggregation
create or replace view dashboard_metrics as
select
  c.id,
  c.name,
  c.symbol,
  (select price from prices where commodity_id = c.id order by timestamp desc limit 1) as current_price,
  (select avg(confidence) from signals where commodity_id = c.id and timestamp > now() - interval '24 hours') as avg_sentiment_24h,
  (select count(*) from signals where commodity_id = c.id and timestamp > now() - interval '24 hours') as signal_count_24h
from commodities c;

-- Grant permissions
grant select on users to authenticated;
grant select on commodities to authenticated;
grant select on signals to authenticated;
grant select on sentiments to authenticated;
grant select on prices to authenticated;
grant select on latest_signals_per_commodity to authenticated;
grant select on dashboard_metrics to authenticated;

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for users
create trigger update_users_updated_at before update on users
  for each row execute function update_updated_at_column();

-- Trigger for subscriptions
create trigger update_subscriptions_updated_at before update on subscriptions
  for each row execute function update_updated_at_column();

-- Trigger for last_login
create or replace function update_user_last_login()
returns trigger as $$
begin
  update users set last_login = now() where id = new.id;
  return new;
end;
$$ language plpgsql;

-- Function to handle new user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into users (id, email, tier)
  values (new.id, new.email, 'free');
  return new;
end;
$$ language plpgsql;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Enable Realtime
alter publication supabase_realtime add table signals;
alter publication supabase_realtime add table prices;
alter publication supabase_realtime add table sentiments;

-- Create summary statistics table (for analytics)
create table if not exists analytics (
  id uuid primary key default uuid_generate_v4(),
  date date not null,
  commodity_id text not null references commodities(id),
  signal_count integer default 0,
  avg_sentiment real,
  price_open real,
  price_close real,
  price_high real,
  price_low real,
  created_at timestamp with time zone default now(),
  unique(date, commodity_id)
);

create index if not exists idx_analytics_date on analytics(date desc);
create index if not exists idx_analytics_commodity on analytics(commodity_id);

-- Grant permissions on analytics
grant select on analytics to authenticated;
