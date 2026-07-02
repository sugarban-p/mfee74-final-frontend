import type { Metadata } from 'next';
import './globals.css';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

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
        <Theme
          appearance="dark"
          accentColor="orange"
          radius="medium"
          grayColor="sand"
          scaling="100%"
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}
