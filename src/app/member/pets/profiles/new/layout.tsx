import type { Metadata } from 'next';

// 父層會自動組成「新增毛孩 | MOFU」。
export const metadata: Metadata = {
  title: '新增毛孩| MOFU',
};

export default function NewPetProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
