import type { Metadata } from 'next';

// 父層會自動組成「新增毛孩 | MOFU」。
export const metadata: Metadata = {
  title: '毛孩 AI 導購| MOFU',
};

export default function PetAiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
