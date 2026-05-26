import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import './globals.css';
import '@/styles/commodity-variables.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CommodityBubbles - Realtime Commodity Insights',
  description: 'Real-time bubble map visualization of commodity markets with AI sentiment analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} bg-primary text-secondary`}>
        <Navbar />
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
