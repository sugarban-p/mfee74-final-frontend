'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LuHeart,
  LuHouse,
  LuMessageCircleQuestion,
  LuPackage,
  LuPawPrint,
} from 'react-icons/lu';

const NAV = [
  { href: '/member/dashboard', icon: LuHouse, label: '會員中心' },
  { href: '/member/orders', icon: LuPackage, label: '訂單管理' },
  { href: '/member/favorites', icon: LuHeart, label: '收藏清單' },
  { href: '/member/pets', icon: LuPawPrint, label: '我的寵物' },
  {
    href: '/member/support',
    icon: LuMessageCircleQuestion,
    label: '客服中心',
  },
];

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const renderSideNav = (isMobile = false) => (
    <nav
      className={
        isMobile ? 'inline-flex min-w-max gap-2 p-2' : 'space-y-1.5 p-3'
      }
      aria-label="會員中心導覽"
    >
      {NAV.map(({ href, icon: Icon, label }) => {
        const active =
          pathname === href ||
          (href !== '/member/dashboard' && pathname.startsWith(href));
        return (
          <Link
            key={`${href}${label}`}
            href={href}
            className={`flex items-center font-bold whitespace-nowrap transition-all ${isMobile ? 'shrink-0 gap-2 rounded-full px-4 py-2.5 text-sm leading-none' : 'gap-3 rounded-2xl px-6 py-3 text-base'} ${active ? 'bg-primary text-white' : 'text-[#6B635C] hover:bg-base-200 hover:text-text-primary'}`}
            style={{
              fontFamily:
                "'Noto Sans TC', 'Noto Sans JP', 'DM Sans', sans-serif",
              fontWeight: 500,
            }}
          >
            <Icon size={16} className="shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="page-enter w-full bg-background">
      <div className="mx-auto w-full max-w-[1520px] px-4 py-0 md:px-6 lg:py-0">
        <aside className="mb-4 lg:hidden">
          <div className="[scrollbar-width:none] overflow-x-auto rounded-2xl border border-border/80 bg-card-primary/70 [&::-webkit-scrollbar]:hidden">
            {renderSideNav(true)}
          </div>
        </aside>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[170px_minmax(0,1fr)] lg:gap-8 2xl:gap-7">
          <aside className="hidden lg:block">
            <div className="bg-transparent p-0.5 2xl:pt-3">
              {renderSideNav(false)}
            </div>
          </aside>
          <main className="min-w-0 2xl:pt-3 2xl:pb-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
