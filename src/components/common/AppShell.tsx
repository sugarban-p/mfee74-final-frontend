'use client';

import { Toaster } from 'react-hot-toast';

import Header from '@/src/components/common/Header';
import { Footer } from '@/src/components/common/Footer';
import IdleLogoutGuard from '@/src/components/common/IdleLogoutGuard';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <IdleLogoutGuard />
      <Header />
      <main className="px-auto flex-1 bg-background py-4 sm:py-16">
        <div className="mx-auto max-w-[1520px]">{children}</div>
      </main>
      <Footer />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: '',
          duration: 3000,
          removeDelay: 1000,
        }}
      />
    </div>
  );
}
