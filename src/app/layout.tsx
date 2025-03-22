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
  openGraph: {
    title: 'Jonathan Gustafsson',
    description: '11+ year experienced CTO and full stack software engineer',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Jonathan Gustafsson - CTO and Full Stack Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jonathan Gustafsson',
    description: '11+ year experienced CTO and full stack software engineer',
    images: ['/og.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
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
