'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LuPackage,
  LuHeart,
  LuTicketPercent,
  LuPawPrint,
  LuMessageCircleQuestion,
  LuCircleCheck,
} from 'react-icons/lu';
import {
  Edit2,
  Shield,
  AlertCircle,
  Monitor,
  Smartphone,
  Camera,
  Lock,
  Activity,
  Clock,
} from 'lucide-react';
import {
  Btn,
  FieldInput,
  PasswordInput,
  PwBar,
  SuccessBox,
  ErrorBox,
  JP,
} from '@/src/components/ui';
import type { AuthUser, DashboardStats, SecurityInfo } from '@/src/types';

const MOCK_USER: AuthUser = {
  id: 'demo-user',
  userNo: 'U-DEMO-001',
  email: 'demo@petfull.com',
  name: '示範會員',
  nickname: '小毛',
  phone: '0912-000-000',
  address: '台北市中山區示範路 1 號',
  avatar: null,
  emailVerified: true,
  googleLinked: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

const MOCK_STATS: DashboardStats = {
  orders: { total: 12, pending: 2, completed: 9, cancelled: 1 },
  favorites: 18,
  pets: 2,
  coupons: { available: 3, used: 5, expired: 1 },
};

const ENABLE_MEMBER_API = process.env.NEXT_PUBLIC_ENABLE_MEMBER_API === 'true';

const MOCK_SECURITY: SecurityInfo = {
  emailVerified: true,
  emailVerifiedAt: '2026-01-03T09:00:00.000Z',
  googleLinked: true,
  lockedUntil: null,
  loginLogs: [
    {
      id: 'log-1',
      time: '2026-07-08 10:30',
      browser: 'Chrome',
      os: 'macOS',
      device: 'desktop',
      ip: '127.0.0.1',
      success: true,
    },
    {
      id: 'log-2',
      time: '2026-07-07 21:18',
      browser: 'Safari',
      os: 'iOS',
      device: 'mobile',
      ip: '127.0.0.1',
      success: true,
    },
  ],
};

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [security, setSecurity] = useState<SecurityInfo | null>(null);
  const [tab, setTab] = useState<'overview' | 'profile' | 'security'>(
    'overview'
  );

  useEffect(() => {
    const load = async () => {
      try {
        const [uRes, sRes, secRes] = await Promise.all([
          fetch('/api/user/profile'),
          fetch('/api/dashboard/stats'),
          fetch('/api/user/security'),
        ]);

        if (!uRes.ok || !sRes.ok || !secRes.ok) {
          throw new Error('api unavailable');
        }

        const [u, s, sec] = await Promise.all([
          uRes.json(),
          sRes.json(),
          secRes.json(),
        ]);

        setUser(u);
        setStats(s);
        setSecurity(sec);
      } catch {
        if (!ENABLE_MEMBER_API) {
          setUser(MOCK_USER);
          setStats(MOCK_STATS);
          setSecurity(MOCK_SECURITY);
          return;
        }
        setUser(MOCK_USER);
        setStats(MOCK_STATS);
        setSecurity(MOCK_SECURITY);
      }
    };

    load();
  }, []);

  if (!user || !stats) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 2xl:space-y-4">
      {/* Welcome hero */}
      <div
        className="rounded-3xl 2xl:rounded-[20px] p-6 md:p-7 2xl:px-7 2xl:py-6 text-white relative overflow-hidden"
        style={{
          background: '#F0822F',
        }}
      >
        <div className="absolute right-8 top-7 2xl:right-20 2xl:top-3 text-5xl opacity-20 2xl:opacity-30 select-none pointer-events-none rotate-6">
          🐾
        </div>
        <div className="absolute right-16 top-16 2xl:right-28 2xl:top-14 text-4xl opacity-15 2xl:opacity-20 select-none pointer-events-none -rotate-6">
          🐾
        </div>
        <div className="hidden 2xl:block absolute right-40 top-8 text-3xl opacity-20 select-none pointer-events-none rotate-6">
          🐾
        </div>
        <div className="relative z-10">
          <p className="text-orange-100 text-sm mb-1 2xl:mb-1.5" style={JP}>
            歡迎回來
          </p>
          <h1
            className="text-3xl 2xl:text-[46px] 2xl:leading-[1.08] font-bold"
            style={{ fontFamily: "'Noto Serif TC', serif" }}
          >
            {user.nickname ?? user.name ?? user.email} 你好！
          </h1>
          <div className="flex items-center gap-3 2xl:gap-2.5 mt-3 2xl:mt-4 flex-wrap">
            <span className="text-[11px] bg-white/20 2xl:bg-white/24 text-white px-2.5 py-0.5 2xl:py-1 rounded-full">
              會員編號：{user.userNo ?? `U-${user.id}`}
            </span>
            {user.emailVerified && (
              <span className="text-[11px] bg-white/20 2xl:bg-white/24 text-white px-2.5 py-0.5 2xl:py-1 rounded-full flex items-center gap-1">
                <LuCircleCheck size={12} className="hidden 2xl:block" />
                郵件已驗證
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="tabs tabs-box rounded-2xl 2xl:rounded-[16px] bg-base-200 2xl:bg-transparent w-fit p-1 border border-base-300 2xl:border-[#E9DED3] 2xl:shadow-none">
        {(['overview', 'profile', 'security'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tab tab-sm rounded-xl 2xl:rounded-[12px] px-6 2xl:px-8 h-8 2xl:h-10 min-h-8 2xl:min-h-10 text-[14px] ${tab === t ? 'tab-active bg-base-100 2xl:bg-[#F4EEE8] shadow-sm text-[#2D2826]' : 'text-base-content/60 2xl:text-[#4A453F]'}`}
          >
            {t === 'overview'
              ? '總覽'
              : t === 'profile'
                ? '個人資料'
                : '帳號安全'}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab stats={stats} />}
      {tab === 'profile' && <ProfileTab user={user} onUpdate={setUser} />}
      {tab === 'security' && <SecurityTab user={user} security={security} />}
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────

function OverviewTab({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      href: '/member/orders',
      icon: LuPackage,
      watermarkTone: 'text-orange-100',
      chipBg: 'bg-orange-50',
      chipText: 'text-orange-500',
      chipLabel: '訂單概覽',
      title: '訂單',
      num: stats.orders.total,
      unit: '筆',
      hint: '最近 30 天',
      tags: [
        {
          l: '待付款',
          v: stats.orders.pending,
          c: 'text-orange-500',
          bg: 'bg-orange-50',
        },
        {
          l: '已完成',
          v: stats.orders.completed,
          c: 'text-green-600',
          bg: 'bg-green-50',
        },
        {
          l: '取消',
          v: stats.orders.cancelled,
          c: 'text-red-500',
          bg: 'bg-red-50',
        },
      ],
    },
    {
      href: '/member/favorites',
      icon: LuHeart,
      watermarkTone: 'text-rose-100',
      chipBg: 'bg-rose-50',
      chipText: 'text-rose-500',
      chipLabel: '收藏總覽',
      title: '收藏',
      num: stats.favorites,
      unit: '件',
      hint: '管理你的願望清單',
      tags: [],
    },
    {
      href: '/member/pets',
      icon: LuPawPrint,
      watermarkTone: 'text-amber-100',
      chipBg: 'bg-amber-50',
      chipText: 'text-amber-600',
      chipLabel: '寵物總覽',
      title: '寵物',
      num: stats.pets,
      unit: '隻',
      hint: '查看毛孩資料與狀態',
      tags: [],
    },
    {
      href: '/member/coupons',
      icon: LuTicketPercent,
      watermarkTone: 'text-purple-100',
      chipBg: 'bg-purple-50',
      chipText: 'text-purple-500',
      chipLabel: '優惠券概覽',
      title: '優惠券',
      num: stats.coupons.available,
      unit: '張可用',
      hint: '可用與使用狀態',
      tags: [
        {
          l: '已使用',
          v: stats.coupons.used,
          c: 'text-violet-600',
          bg: 'bg-violet-50',
        },
        {
          l: '已過期',
          v: stats.coupons.expired,
          c: 'text-red-500',
          bg: 'bg-red-50',
        },
      ],
    },
  ];

  return (
    <div className="space-y-5 2xl:space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 2xl:gap-5">
        {cards.map(
          ({
            href,
            icon: Icon,
            watermarkTone,
            chipBg,
            chipText,
            chipLabel,
            title,
            num,
            unit,
            hint,
            tags,
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
                  className={`inline-flex items-center gap-1.5 ${chipBg} ${chipText} text-xs font-medium px-2.5 py-1 rounded-full mb-3`}
                >
                  <Icon size={13} strokeWidth={2} />
                  <span>{chipLabel}</span>
                </div>

                <div className="mb-1">
                  <span className="text-4xl font-bold text-gray-900 tracking-tight">
                    {num}
                  </span>
                  <span className="ml-1.5 text-sm text-gray-400 font-normal">
                    {unit}
                  </span>
                  <span className="ml-1 text-base font-semibold text-gray-700">
                    {title}
                  </span>
                </div>

                <div className="text-xs text-gray-400 mb-2" style={JP}>
                  {hint}
                </div>

                <div className="border-t border-gray-100 my-3" />

                {tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    {tags.map((t) => (
                      <div
                        key={t.l}
                        className={`flex-1 ${t.bg} rounded-xl px-2 py-1.5 text-center`}
                      >
                        <div
                          className={`text-base font-bold leading-tight ${t.c}`}
                        >
                          {t.v}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                          {t.l}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {tags.length === 0 && (
                  <div className="rounded-xl px-2 py-1.5 bg-gray-50 text-center">
                    <div className="text-[10px] text-gray-400 leading-tight">
                      前往查看完整{title}內容
                    </div>
                  </div>
                )}
              </div>
            </Link>
          )
        )}
      </div>

      <div className="card bg-[#FDFBF6]-100 border border-[#EDE1D6] rounded-[20px]">
        <div className="card-body px-6 py-5">
          <h2
            className="text-sm font-semibold text-base-content mb-3"
            style={JP}
          >
            快速操作
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: '編輯個人資料',
                onClick: () => {},
                icon: Edit2,
                chipLabel: '個人資料',
                chipBg: 'bg-rose-50',
                chipText: 'text-rose-500',
                watermarkTone: 'text-rose-100',
                hint: '更新姓名、手機與地址',
              },
              {
                label: '帳號安全設定',
                onClick: () => {},
                icon: Shield,
                chipLabel: '安全設定',
                chipBg: 'bg-amber-50',
                chipText: 'text-amber-600',
                watermarkTone: 'text-amber-100',
                hint: '修改密碼與登入安全',
              },
              {
                label: '聯繫客服中心',
                href: '/support/chat',
                icon: LuMessageCircleQuestion,
                chipLabel: '客服入口',
                chipBg: 'bg-orange-50',
                chipText: 'text-orange-500',
                watermarkTone: 'text-orange-100',
                hint: '前往即時客服與紀錄查詢',
              },
            ].map(
              ({
                label,
                href,
                onClick,
                icon: Icon,
                chipLabel,
                chipBg,
                chipText,
                watermarkTone,
                hint,
              }) =>
                href ? (
                  <Link
                    key={label}
                    href={href}
                    className="relative bg-[#FDFBF6] border border-[#ECE3DA] rounded-2xl shadow-sm overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
                  >
                    <div
                      className={`absolute top-1 right-2 ${watermarkTone} pointer-events-none select-none`}
                    >
                      <Icon size={72} strokeWidth={1.2} />
                    </div>

                    <div className="relative px-4 py-4">
                      <div
                        className={`inline-flex items-center gap-1.5 ${chipBg} ${chipText} text-xs font-medium px-2.5 py-1 rounded-full mb-3`}
                      >
                        <Icon size={13} strokeWidth={2} />
                        <span>{chipLabel}</span>
                      </div>

                      <div className="mb-1">
                        <span className="text-lg font-bold text-gray-900 tracking-tight">
                          {label}
                        </span>
                      </div>

                      <div className="text-xs text-gray-400" style={JP}>
                        {hint}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <button
                    key={label}
                    onClick={onClick}
                    className="relative bg-[#FDFBF6] border border-[#ECE3DA] rounded-2xl shadow-sm overflow-hidden hover:border-primary/40 hover:shadow-md transition-all text-left"
                  >
                    <div
                      className={`absolute top-1 right-2 ${watermarkTone} pointer-events-none select-none`}
                    >
                      <Icon size={72} strokeWidth={1.2} />
                    </div>

                    <div className="relative px-4 py-4">
                      <div
                        className={`inline-flex items-center gap-1.5 ${chipBg} ${chipText} text-xs font-medium px-2.5 py-1 rounded-full mb-3`}
                      >
                        <Icon size={13} strokeWidth={2} />
                        <span>{chipLabel}</span>
                      </div>

                      <div className="mb-1">
                        <span className="text-lg font-bold text-gray-900 tracking-tight">
                          {label}
                        </span>
                      </div>

                      <div className="text-xs text-gray-400" style={JP}>
                        {hint}
                      </div>
                    </div>
                  </button>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Profile tab ───────────────────────────────────────────────────────────

function ProfileTab({
  user,
  onUpdate,
}: {
  user: AuthUser;
  onUpdate: (u: AuthUser) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [f, setF] = useState({
    name: user.name ?? '',
    nickname: user.nickname ?? '',
    phone: user.phone ?? '',
    address: user.address ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? '更新失敗。');
        return;
      }
      onUpdate({ ...user, ...data });
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('網路錯誤。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {success && <SuccessBox message="個人資料已成功更新。" />}

      <div className="card bg-base-100 border border-base-300 rounded-2xl">
        <div className="card-body p-5">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={
                  user.avatar ??
                  `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.email}`
                }
                alt={user.name ?? ''}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-base-300 bg-base-200"
              />
              {editing && (
                <button className="btn btn-primary btn-xs btn-circle absolute -bottom-1.5 -right-1.5 shadow">
                  <Camera size={13} />
                </button>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-3">
                  <FieldInput
                    label="姓名"
                    value={f.name}
                    onChange={(v) => setF((p) => ({ ...p, name: v }))}
                    placeholder="林 小花"
                  />
                  <FieldInput
                    label="暱稱"
                    value={f.nickname}
                    onChange={(v) => setF((p) => ({ ...p, nickname: v }))}
                    placeholder="小花"
                  />
                  <FieldInput
                    label="手機"
                    value={f.phone}
                    onChange={(v) => setF((p) => ({ ...p, phone: v }))}
                    placeholder="0912-345-678"
                  />
                  <FieldInput
                    label="地址"
                    value={f.address}
                    onChange={(v) => setF((p) => ({ ...p, address: v }))}
                    placeholder="台北市中山區..."
                  />
                  {error && <ErrorBox message={error} />}
                  <div className="flex gap-2">
                    <Btn onClick={save} loading={loading} sm>
                      儲存變更
                    </Btn>
                    <Btn
                      onClick={() => {
                        setEditing(false);
                        setError('');
                      }}
                      variant="outline"
                      sm
                    >
                      取消
                    </Btn>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2
                        className="text-xl font-bold text-base-content"
                        style={JP}
                      >
                        {user.name ?? '未設定'}
                      </h2>
                      <p className="text-sm text-base-content/60">
                        {user.nickname ?? '未設定'}
                      </p>
                    </div>
                    <Btn onClick={() => setEditing(true)} variant="outline" sm>
                      <Edit2 size={13} />
                      編輯
                    </Btn>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {user.emailVerified && (
                      <span className="badge badge-success badge-outline gap-1 text-[10px] px-2 py-2">
                        <LuCircleCheck size={9} />
                        郵件已驗證
                      </span>
                    )}
                    {user.googleLinked && (
                      <span className="badge badge-info badge-outline gap-1 text-[10px] px-2 py-2 font-medium">
                        G Google 已連結
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-base-300 bg-base-200/50">
          <h3 className="text-sm font-semibold text-base-content" style={JP}>
            帳號資訊
          </h3>
        </div>
        {[
          {
            label: '會員編號',
            value: user.userNo ?? `U-${user.id}`,
            locked: true,
          },
          { label: '電子郵件', value: user.email, locked: true },
          { label: '暱稱', value: user.nickname ?? '未設定', locked: false },
          {
            label: '註冊日期',
            value: String(user.createdAt).slice(0, 10),
            locked: true,
          },
          { label: '姓名', value: user.name ?? '未設定', locked: false },
          { label: '手機', value: user.phone ?? '未設定', locked: false },
          { label: '地址', value: user.address ?? '未設定', locked: false },
        ].map(({ label, value, locked }) => (
          <div
            key={label}
            className="flex items-center px-5 py-3.5 border-b border-base-300 last:border-0 hover:bg-base-200/40 transition-colors"
          >
            <div className="w-28 text-sm text-base-content/60 shrink-0">
              {label}
            </div>
            <div className="flex-1 text-sm font-medium text-base-content truncate">
              {value}
            </div>
            {locked && (
              <Lock size={12} className="text-base-content/50 shrink-0" />
            )}
          </div>
        ))}
      </div>

      <ChangePasswordSection />
    </div>
  );
}

function ChangePasswordSection() {
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState({ old: '', next: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const change = async () => {
    if (!pw.old || !pw.next || !pw.confirm) {
      setError('請填寫所有欄位。');
      return;
    }
    if (pw.next !== pw.confirm) {
      setError('兩次輸入的新密碼不一致。');
      return;
    }
    if (pw.old === pw.next) {
      setError('新密碼不可與目前密碼相同。');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: pw.old, newPassword: pw.next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? '密碼更新失敗。');
        return;
      }
      setOpen(false);
      setPw({ old: '', next: '', confirm: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError('網路錯誤。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 border border-base-300 rounded-2xl">
      <div className="card-body p-5">
        {success && <SuccessBox message="密碼已成功更新。" />}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-semibold text-base-content">
              變更密碼
            </div>
            <div className="text-xs text-base-content/60 mt-0.5">
              建議定期更新密碼以保障帳號安全。
            </div>
          </div>
          {!open && (
            <Btn onClick={() => setOpen(true)} variant="outline" sm>
              立即變更
            </Btn>
          )}
        </div>
        {open && (
          <div className="mt-4 pt-4 border-t border-base-300 space-y-4">
            <PasswordInput
              label="目前密碼"
              value={pw.old}
              onChange={(v) => setPw((p) => ({ ...p, old: v }))}
              autoComplete="current-password"
            />
            <div>
              <PasswordInput
                label="新密碼"
                value={pw.next}
                onChange={(v) => setPw((p) => ({ ...p, next: v }))}
                placeholder="至少 8 個字元"
                autoComplete="new-password"
              />
              <PwBar password={pw.next} />
            </div>
            <PasswordInput
              label="確認新密碼"
              value={pw.confirm}
              onChange={(v) => setPw((p) => ({ ...p, confirm: v }))}
              autoComplete="new-password"
            />
            {error && <ErrorBox message={error} />}
            <div className="flex gap-2">
              <Btn onClick={change} loading={loading} sm>
                確認變更
              </Btn>
              <Btn
                onClick={() => {
                  setOpen(false);
                  setError('');
                }}
                variant="outline"
                sm
              >
                取消
              </Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Security tab ──────────────────────────────────────────────────────────

function SecurityTab({
  user,
  security,
}: {
  user: AuthUser;
  security: SecurityInfo | null;
}) {
  if (!security)
    return (
      <div className="text-center py-12 text-base-content/60 text-sm">
        載入中…
      </div>
    );

  return (
    <div className="space-y-5">
      {/* Email verification */}
      <div className="card bg-base-100 border border-base-300 rounded-2xl">
        <div className="card-body p-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${security.emailVerified ? 'bg-green-100' : 'bg-amber-100'}`}
            >
              {security.emailVerified ? (
                <LuCircleCheck size={18} className="text-green-600" />
              ) : (
                <AlertCircle size={18} className="text-amber-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-base-content">
                電子郵件驗證
              </div>
              <div className="text-xs text-base-content/60 mt-0.5">
                {security.emailVerified
                  ? `${user.email} · 已驗證`
                  : '尚未驗證 — 請發送確認信進行驗證'}
              </div>
            </div>
            {!security.emailVerified && (
              <Btn variant="outline" sm>
                重新發送
              </Btn>
            )}
          </div>
        </div>
      </div>

      {/* Login history */}
      <div className="card bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-base-300 bg-base-200/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-base-content" style={JP}>
            登入紀錄
          </h3>
          <span className="badge badge-outline text-[10px] text-base-content/60">
            最近 10 筆
          </span>
        </div>
        <div className="divide-y divide-base-300">
          {security.loginLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-base-200/40 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${log.success ? 'bg-green-100' : 'bg-red-100'}`}
              >
                {log.device === 'mobile' ? (
                  <Smartphone
                    size={14}
                    className={log.success ? 'text-green-600' : 'text-red-500'}
                  />
                ) : (
                  <Monitor
                    size={14}
                    className={log.success ? 'text-green-600' : 'text-red-500'}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-base-content">
                  {log.browser} / {log.os}
                </div>
                <div className="text-xs text-base-content/60">
                  {log.time}
                  {log.ip ? ` · ${log.ip}` : ''}
                </div>
              </div>
              <span
                className={`badge text-[10px] font-semibold px-2.5 py-1 ${log.success ? 'badge-success badge-outline' : 'badge-error badge-outline'}`}
              >
                {log.success ? '成功' : '失敗'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Security policy */}
      <div className="card bg-base-100 border border-base-300 rounded-2xl">
        <div className="card-body p-5">
          <h3
            className="text-sm font-semibold text-base-content mb-4"
            style={JP}
          >
            安全政策
          </h3>
          <div className="space-y-3">
            {[
              { label: 'JWT Token 有效期限', value: '1 小時', Icon: Clock },
              { label: '閒置自動登出', value: '30 分鐘', Icon: Activity },
              {
                label: '登入失敗鎖定規則',
                value: '連續 5 次失敗 → 鎖定 30 分鐘',
                Icon: Shield,
              },
            ].map(({ label, value, Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 py-2.5 border-b border-base-300 last:border-0"
              >
                <Icon size={14} className="text-primary shrink-0" />
                <div className="flex-1 text-sm text-base-content">{label}</div>
                <div className="badge badge-ghost text-xs text-base-content/70 font-medium">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
