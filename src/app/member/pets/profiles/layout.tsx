import type { Metadata } from 'next';

// 父層會自動組成「新增毛孩 | MOFU」。
export const metadata: Metadata = {
  title: '毛孩檔案管理| MOFU',
};

export default function PetProfilesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
