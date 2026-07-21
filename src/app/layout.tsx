import type { Metadata } from 'next';
import '@radix-ui/themes/styles.css';
import './globals.css';
import './globals-extra.css';
import AppShell from '@/src/components/common/AppShell';
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'Team3 專題',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" style={{ colorScheme: 'light' }}>
      <body
        suppressHydrationWarning
        className={`${notoSansTc.variable} ${notoSerifTc.variable} flex min-h-full flex-col`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
