'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

import Header from '@/src/components/common/Header';
import { Footer } from '@/src/components/common/Footer';
import IdleLogoutGuard from '@/src/components/common/IdleLogoutGuard';

const TITLE_PREFIX = ' | MOFU';

const ROUTE_TITLE_RULES: Array<{ pattern: RegExp; title: string }> = [
  { pattern: /^\/$/, title: '陪毛孩過好每一天' },
  { pattern: /^\/event\/?$/, title: '活動總覽' },
  { pattern: /^\/activity\/free-shipping-1500\/?$/, title: '滿 1500 免運活動' },
  { pattern: /^\/activity\/new-arrival-season\/?$/, title: '新品嚐鮮季' },
  {
    pattern: /^\/activity\/new-member-first-order-10off\/?$/,
    title: '新會員首購 9 折',
  },
  {
    pattern: /^\/activity\/pet-festival-1000-off-100\/?$/,
    title: '毛孩節滿千折百',
  },
  { pattern: /^\/cart\/?$/, title: '購物車' },
  { pattern: /^\/checkout\/?$/, title: '結帳' },
  { pattern: /^\/checkout\/success\/?$/, title: '付款成功' },
  { pattern: /^\/checkout\/fail\/?$/, title: '付款失敗' },
  { pattern: /^\/checkout\/error\/?$/, title: '結帳錯誤' },
  { pattern: /^\/checkout\/payment-pending\/?$/, title: '付款處理中' },
  { pattern: /^\/auth\/login\/?$/, title: '登入' },
  { pattern: /^\/auth\/register\/?$/, title: '註冊' },
  { pattern: /^\/auth\/register\/verify-email\/?$/, title: '驗證電子信箱' },
  { pattern: /^\/auth\/forgot-password\/?$/, title: '忘記密碼' },
  {
    pattern: /^\/auth\/forgot-password\/verify-otp\/?$/,
    title: '驗證重設碼',
  },
  {
    pattern: /^\/auth\/forgot-password\/reset-password\/?$/,
    title: '重設密碼',
  },
  { pattern: /^\/auth\/lock-status\/?$/, title: '帳號鎖定狀態' },
  { pattern: /^\/member\/?$/, title: '會員中心' },
  { pattern: /^\/member\/dashboard\/?$/, title: '會員儀表板' },
  { pattern: /^\/member\/orders\/?$/, title: '訂單管理' },
  { pattern: /^\/member\/orders\/[^/]+\/?$/, title: '訂單詳情' },
  { pattern: /^\/member\/favorites\/?$/, title: '收藏清單' },
  { pattern: /^\/member\/coupons\/?$/, title: '優惠券' },
  { pattern: /^\/member\/pets\/?$/, title: '我的寵物' },
  { pattern: /^\/member\/pets\/profiles\/?$/, title: '寵物檔案' },
  { pattern: /^\/member\/pets\/profiles\/new\/?$/, title: '新增寵物檔案' },
  {
    pattern: /^\/member\/pets\/profiles\/[^/]+\/edit\/?$/,
    title: '編輯寵物檔案',
  },
  {
    pattern: /^\/member\/pets\/profiles\/[^/]+\/?$/,
    title: '寵物檔案詳情',
  },
  { pattern: /^\/member\/pets\/ai\/?$/, title: 'AI 導購' },
  { pattern: /^\/member\/pets\/ai\/select-pet\/?$/, title: 'AI 導購選擇寵物' },
  { pattern: /^\/member\/pets\/ai\/chat\/?$/, title: 'AI 導購對話' },
  { pattern: /^\/member\/support\/?$/, title: '客服中心' },
  { pattern: /^\/member\/support\/history\/?$/, title: '客服聊天紀錄' },
  { pattern: /^\/member\/support\/chat\/?$/, title: '客服即時聊天' },
  { pattern: /^\/product\/cat\/?$/, title: '貓咪專區' },
  { pattern: /^\/product\/dog\/?$/, title: '狗勾專區' },
  { pattern: /^\/product\/[^/]+\/[^/]+\/?$/, title: '商品詳情' },
];

function resolvePageTitle(pathname: string): string {
  const matchedRule = ROUTE_TITLE_RULES.find((rule) =>
    rule.pattern.test(pathname)
  );

  if (matchedRule) {
    return `${matchedRule.title}${TITLE_PREFIX}`;
  }

  return 'MOFU｜陪毛孩過好每一天';
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    document.title = resolvePageTitle(pathname || '/');
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <IdleLogoutGuard />
      <Header />
      <main className="px-auto flex-1 bg-background py-4 sm:py-16">
        <div className="mx-auto max-w-[1520px]">{children}</div>
      </main>
      <Footer />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: '',
          duration: 3000,
          removeDelay: 1000,
        }}
      />
    </div>
  );
}
