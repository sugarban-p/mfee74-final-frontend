import type { Metadata } from 'next';

// 父層會自動組成「新增毛孩 | MOFU」。
export const metadata: Metadata = {
  title: '毛孩資料詳情| MOFU',
};

export default function PetProfileDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}