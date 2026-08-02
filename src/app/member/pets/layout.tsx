import type { Metadata } from 'next';

/**
 * 寵物功能共用的 Metadata。
 *
 * default：
 * /member/pets 沒有其他子頁標題時使用的名稱。
 *
 * template：
 * 子頁只要設定「新增毛孩」，
 * 瀏覽器就會自動組成「新增毛孩 | MOFU」。
 */
export const metadata: Metadata = {
  title: {
    default: '我的寵物 | MOFU',
    template: '%s | MOFU',
  },
  description: '管理毛孩資料，並使用 MOFU AI 導購尋找合適商品。',
};

/**
 * 這個 layout 只負責 Metadata。
 * 直接回傳 children，因此不會增加新的 HTML 外框或改變畫面。
 */
export default function PetsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}