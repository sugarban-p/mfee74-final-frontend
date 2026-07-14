'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/member/support', label: '總覽', exact: true },
  { href: '/member/support/chat', label: '即時聊天' },
  { href: '/member/support/history', label: '聊天紀錄' },
];

export default function SupportSwitcher() {
  const pathname = usePathname();

  return (
    <div className="tabs tabs-box rounded-2xl 2xl:rounded-[16px] bg-base-200 2xl:bg-transparent w-fit max-w-full overflow-x-auto p-1 border border-base-300 2xl:border-[#E9DED3] 2xl:shadow-none">
      {ITEMS.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`tab tab-sm rounded-xl 2xl:rounded-[12px] px-6 2xl:px-8 h-8 2xl:h-10 min-h-8 2xl:min-h-10 text-[14px] font-medium transition-all whitespace-nowrap inline-flex items-center justify-center text-center ${
              active
                ? 'tab-active bg-base-100 2xl:bg-[#F4EEE8] shadow-sm text-[#2D2826]'
                : 'text-text-primary/60 2xl:text-[#4A453F]'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
