import type { Metadata } from 'next';
import './globals.css';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';

const departureMono = localFont({
  src: [
    {
      path: '../assets/fonts/DepartureMono/DepartureMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-departure-mono',
});

export const metadata: Metadata = {
  title: 'Jonathan Gustafsson',
  description: '11+ year experienced CTO and full stack software engineer',
  keywords: [
    'Jonathan Gustafsson',
    'Web3',
    'Blockchain',
    'Frontend Developer',
    'CTO',
    'DeFi',
  ],
  authors: [{ name: 'Jonathan Gustafsson' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={departureMono.variable}>
      <body className="antialiased">{children}</body>
      <Analytics />
    </html>
  );
}
