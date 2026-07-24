import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { Space_Grotesk, DM_Serif_Display } from 'next/font/google';
import { SparkSprite } from '@/components/ui/SparkSprite';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  style: ['italic'],
  variable: '--font-dm-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Adham Osama - Graphic Designer',
  description:
    'Adham Osama is a Graphic Designer with 2+ years of experience specializing in social media design, visual identity, and AI-powered creative workflows.',
  metadataBase: new URL('https://adhamoe.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: 'Adham Osama - Graphic Designer',
    description:
      'Adham Osama is a Graphic Designer with 2+ years of experience specializing in social media design, visual identity, and AI-powered creative workflows.',
    images: ['/images/adham-pro.png'],
  },
  keywords: ['adhamoe', 'Adham Osama Elghobary', 'Adham Osama', 'Graphic Designer', 'AI Art Director', 'Egypt', 'Portfolio'],
  authors: [{ name: 'Adham Osama Elghobary' }],
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2304D9D9' d='M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z'/%3E%3C/svg%3E",
  },
  verification: {
    google: 'eHgBG4jljzFs9UsI87PZGr06_07rrExX01nltLSNmJY',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSerifDisplay.variable}`}>
      <body className="bg-bg text-white font-display">
        <SparkSprite />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
