import type { Metadata } from 'next';
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google';
import './globals.css';
import Header from '@/src/components/common/Header';
import Footer from '@/src/components/common/Footer';

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
  title: 'Team3 專題',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSansTc.variable} ${notoSerifTc.variable} flex min-h-full flex-col`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
