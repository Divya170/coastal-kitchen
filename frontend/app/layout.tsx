import type { Metadata, Viewport } from 'next';
import { DM_Serif_Display, Manrope } from 'next/font/google';
import './globals.css';

const serif = DM_Serif_Display({ subsets: ['latin'], weight: ['400'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const sans = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Coastal Kitchen · Seafood restaurant in Santa Rosa, California', template: '%s · Coastal Kitchen' },
  description: 'Coastal Kitchen is a seafood restaurant at 8945 Forest Road, Santa Rosa, CA. Explore the menu, discover the dining room and send a reservation inquiry.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0F3340' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
