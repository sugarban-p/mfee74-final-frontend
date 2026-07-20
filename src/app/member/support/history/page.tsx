'use client';
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
} from 'react';
import Link from 'next/link';
import { LuClipboardList, LuCircleCheck, LuChevronRight } from 'react-icons/lu';
import { io, type Socket } from 'socket.io-client';
import type { ChatCaseSummary } from '@/src/types';
import SupportSwitcher from '@/src/components/support-switcher';

const ENABLE_MEMBER_API = process.env.NEXT_PUBLIC_ENABLE_MEMBER_API !== 'false';
const MEMBER_UNREAD_STORAGE_KEY = 'member-support-history-unread-counts';

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
  type HistoryFilter = 'today' | 'week' | 'all' | 'open' | 'closed';

  const [cases, setCases] = useState<ChatCaseSummary[]>(
    ENABLE_MEMBER_API ? [] : MOCK_CASES
  );
  const [filter, setFilter] = useState<HistoryFilter>('today');
  const [loading, setLoading] = useState(ENABLE_MEMBER_API);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [hasHydratedUnreadCache, setHasHydratedUnreadCache] = useState(false);
  const [isSupportViewer, setIsSupportViewer] = useState(false);
  const [hasResolvedViewerRole, setHasResolvedViewerRole] =
    useState(!ENABLE_MEMBER_API);

  const socketRef = useRef<Socket | null>(null);
  const filterRef = useRef<HistoryFilter>(filter);
  const isSupportViewerRef = useRef(isSupportViewer);
  const backendSocketOrigin =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  useEffect(() => {
    isSupportViewerRef.current = isSupportViewer;
  }, [isSupportViewer]);

  const loadCases = useCallback(async (range: HistoryFilter) => {
    if (!ENABLE_MEMBER_API) return;

    try {
      const supportStatus =
        range === 'open' ? 'OPEN' : range === 'closed' ? 'CLOSED' : 'ALL';
      const supportResponse = await fetch(
        `/api/chat/support/cases?status=${supportStatus}&handoff=ALL`,
        {
          credentials: 'include',
          cache: 'no-store',
        }
      );

      if (supportResponse.ok) {
        const supportData = await supportResponse.json();
        const supportCases: unknown[] = Array.isArray(supportData?.cases)
          ? supportData.cases
          : [];

        const normalized: ChatCaseSummary[] = supportCases
          .filter((item: unknown): item is Record<string, unknown> => {
            return Boolean(item) && typeof item === 'object';
          })
          .map((item: Record<string, unknown>): ChatCaseSummary => {
            const lastMessageAt =
              typeof item.lastMessageAt === 'string'
                ? item.lastMessageAt
                : new Date().toISOString();

            return {
              caseId: String(item.caseId || ''),
              status: item.status === 'CLOSED' ? 'CLOSED' : 'OPEN',
              openedAt:
                typeof item.openedAt === 'string'
                  ? item.openedAt
                  : lastMessageAt,
              closedAt:
                typeof item.closedAt === 'string' ? item.closedAt : null,
              lastMessageAt,
              messageCount: Number(item.messageCount || 0),
              preview:
                typeof item.preview === 'string'
                  ? item.preview
                  : '（無文字內容）',
            };
          })
          .filter((item: ChatCaseSummary) => item.caseId);

        setIsSupportViewer(true);
        if (range !== 'open' && range !== 'closed' && range !== 'all') {
          setFilter('all');
        }
        setHasResolvedViewerRole(true);
        setCases(normalized);
        return;
      }

      setIsSupportViewer(false);
      setHasResolvedViewerRole(true);

      const memberRange =
        range === 'today' || range === 'week' || range === 'all'
          ? range
          : 'all';

      const memberResponse = await fetch(
        `/api/chat/history?range=${memberRange}`,
        {
          credentials: 'include',
          cache: 'no-store',
        }
      );
      if (!memberResponse.ok) throw new Error('api unavailable');

      const memberData = await memberResponse.json();
      setCases(memberData.cases ?? []);
    } catch {
      setIsSupportViewer(false);
      setHasResolvedViewerRole(true);
      setCases(MOCK_CASES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCases(filter);
  }, [filter, loadCases]);

  useEffect(() => {
    if (!ENABLE_MEMBER_API) return;

    const socket = io(backendSocketOrigin, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('chat:message', (payload: unknown) => {
      const packet = payload as
        | {
            caseId?: string;
            message?: {
              sender?: 'USER' | 'AI' | 'SYSTEM';
              createdAt?: string;
              content?: string;
            };
          }
        | undefined;

      const caseId = typeof packet?.caseId === 'string' ? packet.caseId : '';
      const sender = packet?.message?.sender;
      if (!caseId || sender === 'USER') return;

      if (isSupportViewerRef.current) {
        void loadCases(filterRef.current);
        return;
      }

      setUnreadCounts((prev) => ({
        ...prev,
        [caseId]: (prev[caseId] || 0) + 1,
      }));

      void loadCases(filterRef.current);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [backendSocketOrigin, loadCases]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const raw = window.localStorage.getItem(MEMBER_UNREAD_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Record<string, number>;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return;
      }

      const safeCounts = Object.entries(parsed).reduce<Record<string, number>>(
        (acc, [caseId, count]) => {
          if (typeof caseId !== 'string') return acc;
          if (!Number.isFinite(count) || count <= 0) return acc;
          acc[caseId] = Math.floor(count);
          return acc;
        },
        {}
      );

      setUnreadCounts(safeCounts);
    } catch {
      // Ignore invalid local cache.
    } finally {
      setHasHydratedUnreadCache(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!hasHydratedUnreadCache) return;

    window.localStorage.setItem(
      MEMBER_UNREAD_STORAGE_KEY,
      JSON.stringify(unreadCounts)
    );
  }, [hasHydratedUnreadCache, unreadCounts]);

  const unreadTotal = Object.values(unreadCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const clearUnreadByCase = (caseId: string) => {
    setUnreadCounts((prev) => {
      if (!prev[caseId]) return prev;
      const next = { ...prev };
      delete next[caseId];
      return next;
    });
  };

  const visibleCases = ENABLE_MEMBER_API
    ? cases
    : filterCasesByRange(
        MOCK_CASES,
        filter === 'today' || filter === 'week' || filter === 'all'
          ? filter
          : 'all'
      );

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h1
          className="text-[22px] leading-tight text-text-primary"
          style={SANS_TC_BOLD}
        >
          客服中心
        </h1>
        {hasResolvedViewerRole && !isSupportViewer && unreadTotal > 0 ? (
          <p className="inline-flex items-center gap-2 rounded-full bg-red-50 px-2.5 py-1 text-[12px] font-medium text-red-600">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            總未讀 {unreadTotal > 99 ? '99+' : unreadTotal}
          </p>
        ) : null}
        <SupportSwitcher />
      </div>

      <div className="flex items-center justify-end">
        {!hasResolvedViewerRole ? (
          <div className="h-10 w-[320px] animate-pulse rounded-2xl border border-base-300 bg-base-200" />
        ) : (
          <div className="tabs-box tabs rounded-2xl border border-base-300 bg-base-200 p-1">
            {(isSupportViewer
              ? (['open', 'closed', 'all'] as const)
              : (['today', 'week', 'all'] as const)
            ).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  if (f === filter) return;
                  if (ENABLE_MEMBER_API) setLoading(true);
                  setFilter(f);
                }}
                className={`tab-sm tab inline-flex h-6 min-h-8 items-center justify-center rounded-xl px-4 text-center text-[14px] font-medium whitespace-nowrap transition-all 2xl:h-8 2xl:min-h-10 2xl:rounded-[12px] 2xl:px-6 ${filter === f ? 'tab-active bg-base-100 shadow-sm' : 'text-text-primary/60'}`}
                style={SANS_TC_MEDIUM}
              >
                {f === 'today'
                  ? '今天'
                  : f === 'week'
                    ? '最近 7 天'
                    : f === 'open'
                      ? '處理中'
                      : f === 'closed'
                        ? '已結案'
                        : isSupportViewer
                          ? '全部案件'
                          : '全部紀錄'}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="loading loading-md loading-spinner text-primary" />
        </div>
      ) : visibleCases.length === 0 ? (
        <div className="card rounded-3xl border border-base-300 bg-base-100">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
              <LuClipboardList size={24} className="text-primary" />
            </div>
            <p className="text-[16px] text-text-primary" style={SANS_TC_MEDIUM}>
              {isSupportViewer ? '目前沒有客服案件' : '此期間無諮詢紀錄'}
            </p>
            <p
              className="mt-1 text-[16px] text-text-primary/60"
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
              onClick={() => clearUnreadByCase(item.caseId)}
              className="card rounded-2xl border border-base-300 bg-base-100 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="card-body p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className="typo-h4 text-text-primary"
                        style={SERIF_TC_CARD_TITLE}
                      >
                        諮詢 {item.caseId.slice(0, 14)}
                      </h3>
                      {item.status === 'OPEN' ? (
                        <span className="badge px-2 badge-sm badge-warning">
                          處理中
                        </span>
                      ) : (
                        <span className="badge gap-1 px-2 badge-sm badge-success">
                          <LuCircleCheck size={12} />
                          已結案
                        </span>
                      )}
                      {!isSupportViewer &&
                      (unreadCounts[item.caseId] || 0) > 0 ? (
                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                          {(unreadCounts[item.caseId] || 0) > 99
                            ? '99+'
                            : unreadCounts[item.caseId]}
                        </span>
                      ) : null}
                    </div>
                    <p
                      className="typo-card-body mt-1 truncate text-text-primary/60"
                      style={SANS_TC_MEDIUM}
                    >
                      {item.preview || '（無文字內容）'}
                    </p>
                  </div>
                  <LuChevronRight
                    size={16}
                    className="shrink-0 text-text-primary/40"
                  />
                </div>
                <div
                  className="typo-tab mt-2 flex items-center gap-3 text-text-primary/55"
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
