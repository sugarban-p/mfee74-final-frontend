import type { Metadata } from 'next';
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google';
import '@radix-ui/themes/styles.css';
import './globals.css';
import './globals-extra.css';
import AppShell from '@/src/components/common/AppShell';

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-tc',
});

const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-serif-tc',
});

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
        className={`${notoSansTC.variable} ${notoSerifTC.variable} flex min-h-full flex-col`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
