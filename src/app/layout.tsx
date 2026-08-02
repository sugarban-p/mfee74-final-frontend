import type { Metadata } from 'next';
import '@radix-ui/themes/styles.css';
import './globals.css';
import './globals-extra.css';
import AppShell from '@/src/components/common/AppShell';
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google';

const notoSansTc = Noto_Sans_TC({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
});

const notoSerifTc = Noto_Serif_TC({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-noto-serif-tc',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MOFU｜陪毛孩過好每一天',
  description:
    'MOFU 提供貓狗主食、零食、保健與生活用品，並依毛孩資料提供 AI 商品選購建議。',
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
