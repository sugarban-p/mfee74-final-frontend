'use client';
import { useState, useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import { LuClipboardList, LuCircleCheck, LuChevronRight } from 'react-icons/lu';
import type { ChatCaseSummary } from '@/src/types';
import SupportSwitcher from '@/src/components/support-switcher';

const ENABLE_MEMBER_API = process.env.NEXT_PUBLIC_ENABLE_MEMBER_API !== 'false';

const SANS_TC_BOLD: CSSProperties = {
  fontFamily: "'Noto Sans TC', 'Noto Sans JP', 'DM Sans', sans-serif",
  fontWeight: 700,
};

const SANS_TC_MEDIUM: CSSProperties = {
  fontFamily: "'Noto Sans TC', 'Noto Sans JP', 'DM Sans', sans-serif",
  fontWeight: 500,
};

const SERIF_TC_CARD_TITLE: CSSProperties = {
  fontFamily: "'Noto Serif TC', serif",
  fontWeight: 700,
};

const MOCK_CASES: ChatCaseSummary[] = [
  {
    caseId: 'CASE-DEMO-001',
    status: 'OPEN',
    openedAt: '2026-07-08T10:00:00.000Z',
    closedAt: null,
    lastMessageAt: '2026-07-08T10:35:00.000Z',
    messageCount: 6,
    preview: '您好，我想詢問罐頭口味推薦。',
  },
  {
    caseId: 'CASE-DEMO-002',
    status: 'CLOSED',
    openedAt: '2026-07-07T08:20:00.000Z',
    closedAt: '2026-07-07T09:10:00.000Z',
    lastMessageAt: '2026-07-07T09:10:00.000Z',
    messageCount: 4,
    preview: '已收到，謝謝客服協助。',
  },
];

function filterCasesByRange(
  source: ChatCaseSummary[],
  range: 'today' | 'week' | 'all'
) {
  if (range === 'all') return source;

  const now = new Date();
  const start = new Date(now);

  if (range === 'today') {
    start.setHours(0, 0, 0, 0);
  } else {
    start.setDate(start.getDate() - 7);
  }

  return source.filter((item) => new Date(item.lastMessageAt) >= start);
}

export default function MemberSupportHistoryPage() {
  const [cases, setCases] = useState<ChatCaseSummary[]>(
    ENABLE_MEMBER_API ? [] : MOCK_CASES
  );
  const [filter, setFilter] = useState<'today' | 'week' | 'all'>('today');
  const [loading, setLoading] = useState(ENABLE_MEMBER_API);

  useEffect(() => {
    if (!ENABLE_MEMBER_API) return;

    fetch(`/api/chat/history?range=${filter}`)
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('api unavailable'))
      )
      .then((data) => setCases(data.cases ?? []))
      .catch(() => setCases(MOCK_CASES))
      .finally(() => setLoading(false));
  }, [filter]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  const visibleCases = ENABLE_MEMBER_API
    ? cases
    : filterCasesByRange(MOCK_CASES, filter);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h1
          className="text-[22px] leading-tight text-text-primary"
          style={SANS_TC_BOLD}
        >
          客服中心
        </h1>
        <SupportSwitcher />
      </div>

      <div className="flex items-center justify-end">
        <div className="tabs tabs-box rounded-2xl bg-base-200 border border-base-300 p-1">
          {(['today', 'week', 'all'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                if (f === filter) return;
                if (ENABLE_MEMBER_API) setLoading(true);
                setFilter(f);
              }}
              className={`tab tab-sm rounded-xl 2xl:rounded-[12px] px-4 2xl:px-6 h-6 2xl:h-8 min-h-8 2xl:min-h-10 text-[14px] font-medium transition-all whitespace-nowrap inline-flex items-center justify-center text-center ${filter === f ? 'tab-active bg-base-100 shadow-sm' : 'text-text-primary/60'}`}
              style={SANS_TC_MEDIUM}
            >
              {f === 'today' ? '今天' : f === 'week' ? '最近 7 天' : '全部紀錄'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="loading loading-spinner loading-md text-primary" />
        </div>
      ) : visibleCases.length === 0 ? (
        <div className="card bg-base-100 border border-base-300 rounded-3xl">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-primary/15 rounded-2xl flex items-center justify-center mb-4">
              <LuClipboardList size={24} className="text-primary" />
            </div>
            <p className="text-[16px] text-text-primary" style={SANS_TC_MEDIUM}>
              此期間無諮詢紀錄
            </p>
            <p
              className="text-[16px] text-text-primary/60 mt-1"
              style={SANS_TC_MEDIUM}
            >
              選擇其他時間範圍或前往客服總覽建立新諮詢。
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleCases.map((item) => (
            <Link
              key={item.caseId}
              href={`/member/support/chat?caseId=${encodeURIComponent(item.caseId)}`}
              className="card bg-base-100 border border-base-300 rounded-2xl hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <div className="card-body p-4">
                <div className="flex items-start gap-3 justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className="typo-h4 text-text-primary"
                        style={SERIF_TC_CARD_TITLE}
                      >
                        諮詢 {item.caseId.slice(0, 14)}
                      </h3>
                      {item.status === 'OPEN' ? (
                        <span className="badge badge-warning badge-sm px-2">
                          處理中
                        </span>
                      ) : (
                        <span className="badge badge-success badge-sm gap-1 px-2">
                          <LuCircleCheck size={12} />
                          已結案
                        </span>
                      )}
                    </div>
                    <p
                      className="typo-card-body text-text-primary/60 mt-1 truncate"
                      style={SANS_TC_MEDIUM}
                    >
                      {item.preview || '（無文字內容）'}
                    </p>
                  </div>
                  <LuChevronRight
                    size={16}
                    className="text-text-primary/40 shrink-0"
                  />
                </div>
                <div
                  className="mt-2 typo-tab text-text-primary/55 flex items-center gap-3"
                  style={SANS_TC_MEDIUM}
                >
                  <span>訊息 {item.messageCount} 則</span>
                  <span>最後更新 {fmt(item.lastMessageAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
