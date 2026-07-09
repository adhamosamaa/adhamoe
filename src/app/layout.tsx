import type { Metadata } from 'next';
import type { ReactNode } from 'react';
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
  title: 'Adham Osama',
  description:
    'Adham Osama is a graphic designer and AI art director based in Egypt, specializing in brand identity, social media design, editorial design, and Midjourney-driven AI art direction.',
  metadataBase: new URL('https://adhamoe.com'),
  alternates: {
    canonical: 'https://adhamoe.com/',
  },
  openGraph: {
    type: 'website',
    title: 'Adham Osama — Graphic Designer',
    description:
      'Brand identity, social media design, editorial design, and AI art direction — strategy-driven design with automation and AI-assisted workflows.',
    images: ['/images/og-cover.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2304D9D9' d='M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSerifDisplay.variable}`} suppressHydrationWarning>
      <body className="bg-bg text-white font-display">
        <SparkSprite />
        {children}
      </body>
    </html>
  );
}
