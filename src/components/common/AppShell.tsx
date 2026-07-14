'use client';

import { Toaster } from 'react-hot-toast';
import Header from '@/src/components/common/header';
import { Footer } from '@/src/components/common/Footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-background pb-64 pt-8 md:pb-70 md:pt-10">
        <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6">
          {children}
        </div>
      </main>
      <Footer />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: '',
          duration: 5000,
          removeDelay: 1000,
        }}
      />
    </div>
  );
}
