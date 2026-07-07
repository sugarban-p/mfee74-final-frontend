import type { Metadata } from 'next';
import './globals.css';
import Header from '@/src/components/common/header';

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
      <body className="flex min-h-full flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
