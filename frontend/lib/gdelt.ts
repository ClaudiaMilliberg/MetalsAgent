// GDELT API - Global Event, Language and Tone Database
// Free, no key required. Provides real-time news events and sentiment.

export type GDELTEvent = {
  title: string;
  sourceUrl: string;
  sentiment: number; // -10 to +10, negative = bearish, positive = bullish
  tone: number; // Event tone score
  actors: string[];
  themes: string[];
  published: number; // epoch ms
  sourceName: string;
};

export async function fetchGDELTEvents(query: string): Promise<GDELTEvent[]> {
  try {
    // GDELT API v2 - Free, no auth needed
    const url = new URL('https://api.gdeltproject.org/api/v2/doc/doc');
    url.searchParams.append('query', query);
    url.searchParams.append('mode', 'artlist');
    url.searchParams.append('format', 'json');
    url.searchParams.append('sort', 'date');
    url.searchParams.append('timespan', '7d'); // Last 7 days
    url.searchParams.append('maxrecords', '100');

    const response = await fetch(url.toString(), {
      cache: 'no-store',
      headers: {
        'User-Agent': 'MetalsAgent/1.0',
      },
    });

    if (!response.ok) return [];

    const data = await response.json().catch(() => null);
    if (!data?.articles || !Array.isArray(data.articles)) return [];

    return data.articles.slice(0, 50).map((article: any) => ({
      title: article.title || '',
      sourceUrl: article.url || '',
      sentiment: article.tone ? parseFloat(article.tone) : 0,
      tone: article.tone ? parseFloat(article.tone) : 0,
      actors: article.actors ? article.actors.split(';').filter((a: string) => a.trim()) : [],
      themes: article.themes ? article.themes.split(';').filter((t: string) => t.trim()) : [],
      published: article.pubdate ? new Date(article.pubdate).getTime() : Date.now(),
      sourceName: article.sourcecountry || 'Global',
    }));
  } catch (error) {
    console.error('GDELT fetch failed:', error);
    return [];
  }
}

export async function fetchCommodityNews(commodity: string): Promise<GDELTEvent[]> {
  const queries = [
    `"${commodity}" mining supply`,
    `"${commodity}" market price`,
    `"${commodity}" production`,
  ];

  const allEvents: GDELTEvent[] = [];

  for (const query of queries) {
    try {
      const events = await fetchGDELTEvents(query);
      allEvents.push(...events);
    } catch (error) {
      console.error(`GDELT query failed for "${query}":`, error);
    }
  }

  // Deduplicate and sort by recency
  const unique = Array.from(
    new Map(allEvents.map((e) => [e.sourceUrl, e])).values()
  );

  return unique.sort((a, b) => b.published - a.published);
}

export async function fetchDisruptionNews(): Promise<GDELTEvent[]> {
  const queries = [
    'copper mine strike',
    'copper mine flood',
    'copper mine shutdown',
    'copper supply disruption',
    'copper production halt',
  ];

  const allEvents: GDELTEvent[] = [];

  for (const query of queries) {
    try {
      const events = await fetchGDELTEvents(query);
      allEvents.push(...events);
    } catch (error) {
      console.error(`Disruption query failed for "${query}":`, error);
    }
  }

  // Filter for negative sentiment (bearish/disruptive news)
  const disruptions = allEvents.filter((e) => e.sentiment < 0);

  // Deduplicate and sort
  const unique = Array.from(
    new Map(disruptions.map((e) => [e.sourceUrl, e])).values()
  );

  return unique.sort((a, b) => b.published - a.published);
}
