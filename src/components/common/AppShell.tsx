'use client';

import Header from '@/src/components/common/Header';
import { Footer } from '@/src/components/common/Footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-auto bg-(--color-background) py-16">
        <div className="mx-auto max-w-[1520px]">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
