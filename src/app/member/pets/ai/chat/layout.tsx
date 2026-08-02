import type { Metadata } from 'next';

// 父層會自動組成「新增毛孩 | MOFU」。
export const metadata: Metadata = {
  title: 'AI 商品推薦| MOFU',
};

export default function PetAiChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
