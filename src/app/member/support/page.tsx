import type { CSSProperties } from 'react';
import Link from 'next/link';
import {
  LuMessageCircleQuestion,
  LuMessageCircleMore,
  LuClipboardList,
  LuPhone,
  LuMail,
  LuClipboardPen,
  LuChevronRight,
} from 'react-icons/lu';
import SupportSwitcher from '@/src/components/support-switcher';

const SANS_TC_BOLD: CSSProperties = {
  fontFamily: "'Noto Sans TC', 'Noto Sans JP', 'DM Sans', sans-serif",
  fontWeight: 700,
};

const SANS_TC_MEDIUM: CSSProperties = {
  fontFamily: "'Noto Sans TC', 'Noto Sans JP', 'DM Sans', sans-serif",
  fontWeight: 500,
};

export default function MemberSupportPage() {
  const options = [
    {
      href: '/member/support/chat',
      icon: LuMessageCircleQuestion,
      watermarkTone: 'text-cyan-100',
      chipBg: 'bg-cyan-100',
      chipText: 'text-cyan-500',
      chipLabel: '客服入口',
      title: '即時客服聊天',
      desc: 'AI 智能 + 人工客服，快速解決您的問題。',
      badge: '線上',
    },
    {
      href: '/member/support/history',
      icon: LuClipboardPen,
      watermarkTone: 'text-blue-100',
      chipBg: 'bg-blue-100',
      chipText: 'text-blue-500',
      chipLabel: '紀錄查詢',
      title: '聊天紀錄查詢',
      desc: '查看過去的對話紀錄與處理結果。',
    },
  ];

  return (
    <div className="space-y-6 2xl:space-y-4">
      <div>
        <h1
          className="text-[22px] leading-tight text-text-primary"
          style={SANS_TC_BOLD}
        >
          客服中心
        </h1>
        <p
          className="text-[16px] leading-tight text-text-primary/60 mt-1"
          style={SANS_TC_MEDIUM}
        >
          我們很樂意為您提供協助。
        </p>
      </div>

      <SupportSwitcher />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-3">
        {options.map(
          ({
            href,
            icon: Icon,
            watermarkTone,
            chipBg,
            chipText,
            chipLabel,
            title,
            desc,
            badge,
          }) => (
            <Link
              key={href}
              href={href}
              className="relative bg-[#FDFBF6] border border-[#ECE3DA] rounded-2xl shadow-sm overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div
                className={`absolute top-1 right-2 ${watermarkTone} pointer-events-none select-none`}
              >
                <Icon size={88} strokeWidth={1.2} />
              </div>

              <div className="relative px-5 pt-4 pb-4">
                <div
                  className={`inline-flex items-center gap-1.5 ${chipBg} ${chipText} typo-tab px-2.5 py-1 rounded-full mb-3`}
                >
                  <Icon size={13} strokeWidth={2} />
                  <span>{chipLabel}</span>
                </div>

                <div className="mb-1">
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">
                    {title}
                  </span>
                </div>

                <div className="typo-card-body text-gray-400 mb-2">{desc}</div>

                <div className="border-t border-gray-100 my-3" />

                {badge ? (
                  <div className="rounded-xl px-2 py-1.5 bg-gray-100 text-center">
                    <div className="typo-card-body text-gray-400 leading-tight">
                      {badge}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl px-2 py-1.5 bg-gray-100 text-center">
                    <div className="typo-card-body text-gray-400 leading-tight">
                      進入查看詳細內容
                    </div>
                  </div>
                )}
              </div>
            </Link>
          )
        )}
      </div>

      <div className="relative bg-[#FDFBF6] border border-[#ECE3DA] rounded-2xl shadow-sm overflow-hidden">
        <div className="absolute top-1 right-2 text-amber-100 pointer-events-none select-none">
          <LuMessageCircleMore size={88} strokeWidth={1.2} />
        </div>

        <div className="relative px-5 pt-4 pb-4">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-500 typo-tab px-2.5 py-1 rounded-full mb-3">
            <LuMessageCircleMore size={13} strokeWidth={2} />
            <span>常見問題</span>
          </div>

          <div className="space-y-2.5">
            {['運費說明', '退換貨政策', '付款方式', '配送時程', '會員優惠'].map(
              (q) => (
                <Link
                  key={q}
                  href={`/member/support/chat?q=${encodeURIComponent(q)}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-100/40 px-4 py-3 transition-colors hover:border-primary/30 hover:bg-amber-50/50 group"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-amber-500 shadow-sm">
                    <LuMessageCircleMore size={14} strokeWidth={2} />
                  </div>
                  <span
                    className="flex-1 text-[16px] leading-tight text-text-primary"
                    style={SANS_TC_MEDIUM}
                  >
                    {q}
                  </span>
                  <LuChevronRight
                    size={16}
                    className="text-text-primary/35 group-hover:text-primary transition-colors"
                  />
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 2xl:gap-3">
        {[
          {
            icon: LuPhone,
            label: '電話客服',
            value: '0800-XXX-XXX',
            sub: '週一至週五 09:00–18:00',
            watermarkTone: 'text-green-100',
            chipBg: 'bg-green-100',
            chipText: 'text-green-600',
            chipLabel: '電話聯絡',
          },
          {
            icon: LuMail,
            label: '電子郵件',
            value: 'support@petfull.com',
            sub: '24 小時內回覆',
            watermarkTone: 'text-indigo-100',
            chipBg: 'bg-indigo-100',
            chipText: 'text-indigo-600',
            chipLabel: '信箱聯絡',
          },
        ].map(
          ({
            icon: Icon,
            label,
            value,
            sub,
            watermarkTone,
            chipBg,
            chipText,
            chipLabel,
          }) => (
            <div
              key={label}
              className="relative bg-[#FDFBF6] border border-[#ECE3DA] rounded-2xl shadow-sm overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div
                className={`absolute top-1 right-2 ${watermarkTone} pointer-events-none select-none`}
              >
                <Icon size={88} strokeWidth={1.2} />
              </div>

              <div className="relative px-5 pt-4 pb-4">
                <div
                  className={`inline-flex items-center gap-1.5 ${chipBg} ${chipText} typo-tab px-2.5 py-1 rounded-full mb-3`}
                >
                  <Icon size={13} strokeWidth={2} />
                  <span>{chipLabel}</span>
                </div>

                <div className="mb-1">
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">
                    {label}
                  </span>
                </div>

                <div className="mb-1">
                  <span className="typo-card-title text-gray-700">{value}</span>
                </div>

                <div className="typo-card-body text-gray-400 mb-2">{sub}</div>

                <div className="border-t border-gray-100 my-3" />

                <div className="rounded-xl px-2 py-1.5 bg-gray-100 text-center">
                  <div className="typo-card-body text-gray-400 leading-tight">
                    立即聯繫客服
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
