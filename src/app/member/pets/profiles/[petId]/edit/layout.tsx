import type { Metadata } from 'next';

// 父層會自動組成「新增毛孩 | MOFU」。
export const metadata: Metadata = {
  title: '編輯毛孩資料| MOFU',
};

export default function EditPetProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}