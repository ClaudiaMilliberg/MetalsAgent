// Reddit JSON API - No key required
// Fetches commodity-related posts from relevant subreddits

const SUBREDDITS = [
  'investing',
  'commodities',
  'supplychain',
  'energy',
  'infrastructure',
  'mining',
  'stocks',
] as const;

const ENDPOINTS = ['hot', 'new', 'rising'] as const;

const REDDIT_HEADERS: Record<string, string> = {
  'User-Agent': 'Mozilla/5.0 (compatible; MetalsAgentBot/1.0)',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
};

const FETCH_DELAY_MS = 2000;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export type RedditPost = {
  title: string;
  upvotes: number;
  url: string;
  subreddit: string;
  created: number;
};

async function fetchListing(sub: string, endpoint: string): Promise<RedditPost[]> {
  try {
    const res = await fetch(`https://www.reddit.com/r/${sub}/${endpoint}.json?limit=25`, {
      headers: REDDIT_HEADERS,
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json().catch(() => null);
    const children = data?.data?.children;
    if (!Array.isArray(children) || children.length === 0) return [];

    const posts: RedditPost[] = [];
    for (const c of children) {
      const p = c?.data;
      if (!p || typeof p.title !== 'string') continue;
      posts.push({
        title: p.title,
        upvotes: typeof p.ups === 'number' ? p.ups : 0,
        url: typeof p.permalink === 'string' ? `https://www.reddit.com${p.permalink}` : '',
        subreddit: sub,
        created: typeof p.created_utc === 'number' ? p.created_utc * 1000 : 0,
      });
    }
    return posts;
  } catch {
    return [];
  }
}

async function fetchSubreddit(sub: string): Promise<RedditPost[]> {
  for (const endpoint of ENDPOINTS) {
    const posts = await fetchListing(sub, endpoint);
    if (posts.length > 0) return posts;
  }
  return [];
}

export async function fetchRedditCommodityPosts(): Promise<RedditPost[]> {
  const all: RedditPost[] = [];

  for (let i = 0; i < SUBREDDITS.length; i++) {
    if (i > 0) await sleep(FETCH_DELAY_MS);
    const posts = await fetchSubreddit(SUBREDDITS[i]);
    all.push(...posts);
  }

  return all.sort((a, b) => b.upvotes - a.upvotes);
}

export type CommodityMention = {
  commodity: string;
  mentions: number;
  topUpvotes: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  topPostTitle: string;
  subreddit: string;
};

export function findCommodityMentions(
  posts: RedditPost[],
  commodityNames: string[]
): CommodityMention[] {
  const bullishKeywords = ['surge', 'rise', 'gain', 'boom', 'bull', 'strong', 'record', 'rally', 'breakout'];
  const bearishKeywords = ['fall', 'decline', 'drop', 'crash', 'bear', 'weak', 'loss', 'selloff', 'plunge'];

  const out: CommodityMention[] = [];

  for (const rawName of commodityNames) {
    const name = rawName?.trim();
    if (!name) continue;
    const needle = name.toLowerCase();

    let mentions = 0;
    let topUpvotes = 0;
    let topPostTitle = '';
    let subreddit = '';
    let bullishCount = 0;
    let bearishCount = 0;

    for (const post of posts) {
      const titleLower = post.title.toLowerCase();
      if (titleLower.includes(needle)) {
        mentions++;

        // Sentiment analysis
        bullishKeywords.forEach((kw) => {
          if (titleLower.includes(kw)) bullishCount++;
        });
        bearishKeywords.forEach((kw) => {
          if (titleLower.includes(kw)) bearishCount++;
        });

        if (post.upvotes > topUpvotes) {
          topUpvotes = post.upvotes;
          topPostTitle = post.title;
          subreddit = post.subreddit;
        }
      }
    }

    if (mentions > 0) {
      const sentiment: 'bullish' | 'bearish' | 'neutral' =
        bullishCount > bearishCount ? 'bullish' : bearishCount > bullishCount ? 'bearish' : 'neutral';

      out.push({
        commodity: name,
        mentions,
        topUpvotes,
        sentiment,
        topPostTitle,
        subreddit,
      });
    }
  }

  return out.sort((a, b) => b.topUpvotes - a.topUpvotes);
}
