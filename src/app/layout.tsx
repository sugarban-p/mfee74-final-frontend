import type { Metadata } from 'next';
import '@radix-ui/themes/styles.css';
import './globals.css';
import './globals-extra.css';
import AppShell from '@/src/components/common/AppShell';

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
        suppressHydrationWarning
        className="flex min-h-full flex-col"
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
