'use client';

import { useMemo } from 'react';

type Sentiment = 'bullish' | 'bearish' | 'neutral';

const sentimentStyles: Record<
  Sentiment,
  { border: string; bg: string; text: string; badge: string; badgeText: string }
> = {
  bullish: {
    border: '#10B981',
    bg: '#10B98108',
    text: '#10B981',
    badge: '#10B98126',
    badgeText: '#10B981',
  },
  bearish: {
    border: '#EF4444',
    bg: '#EF444408',
    text: '#EF4444',
    badge: '#EF444426',
    badgeText: '#EF4444',
  },
  neutral: {
    border: '#F59E0B',
    bg: '#F59E0B08',
    text: '#F59E0B',
    badge: '#F59E0B26',
    badgeText: '#F59E0B',
  },
};

interface NewsItem {
  id: number;
  title: string;
  sentiment: Sentiment;
  source: string;
  timestamp: Date;
  excerpt: string;
}

interface NewsFeedProps {
  news?: NewsItem[];
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function NewsFeed({ news }: NewsFeedProps) {
  const sentimentEmoji: Record<Sentiment, string> = {
    bullish: '📈',
    bearish: '📉',
    neutral: '➡️',
  };

  const sentimentLabel: Record<Sentiment, string> = {
    bullish: 'Bullish',
    bearish: 'Bearish',
    neutral: 'Neutral',
  };

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scroll-smooth">
      {/* Scroll track styling */}
      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.3);
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.5);
        }
      `}</style>

      {news && news.length > 0 ? (
        news.map((item) => {
          const styles = sentimentStyles[item.sentiment];

          return (
            <div
              key={item.id}
              className="group p-4 rounded-lg border-l-4 transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
              style={{
                borderLeftColor: styles.border,
                backgroundColor: styles.bg,
                borderRightColor: 'rgba(107, 114, 128, 0.2)',
                borderTopColor: 'rgba(107, 114, 128, 0.2)',
                borderBottomColor: 'rgba(107, 114, 128, 0.2)',
                borderWidth: '1px',
              }}
            >
              {/* Header with title and sentiment */}
              <div className="flex justify-between items-start gap-3 mb-2">
                <h3 className="text-sm font-semibold text-white flex-1 line-clamp-2 leading-tight group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <span
                  className="px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 text-center"
                  style={{
                    backgroundColor: styles.badge,
                    color: styles.badgeText,
                  }}
                >
                  {sentimentEmoji[item.sentiment]} {sentimentLabel[item.sentiment]}
                </span>
              </div>

              {/* Excerpt */}
              <p className="text-xs text-gray-400 line-clamp-2 mb-2">{item.excerpt}</p>

              {/* Footer with source and time */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="font-medium">{item.source}</span>
                <span className="ml-2">{formatTimeAgo(item.timestamp)}</span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <p className="text-sm">No news available</p>
        </div>
      )}
    </div>
  );
}
