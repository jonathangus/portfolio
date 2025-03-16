'use client';

import { Navbar } from './nav-bar';

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="justify-center flex py-24 px-12  mx-auto">
      <Navbar />
      <div className="max-w-4xl">{children}</div>
    </main>
  );
}
