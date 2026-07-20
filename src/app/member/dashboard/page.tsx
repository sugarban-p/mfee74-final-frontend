'use client';
import { useEffect, useRef, useState } from 'react';
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

const ENABLE_MEMBER_API = process.env.NEXT_PUBLIC_ENABLE_MEMBER_API !== 'false';

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
      if (!ENABLE_MEMBER_API) {
        setUser(MOCK_USER);
        setStats(MOCK_STATS);
        setSecurity(MOCK_SECURITY);
        return;
      }

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
        <span className="loading loading-md loading-spinner text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 2xl:space-y-4">
      {/* Welcome hero */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 text-white md:p-7 2xl:rounded-[20px] 2xl:px-7 2xl:py-6"
        style={{
          background: '#F0822F',
        }}
      >
        <div className="pointer-events-none absolute top-7 right-8 rotate-6 text-5xl opacity-20 select-none 2xl:top-3 2xl:right-20 2xl:opacity-30">
          🐾
        </div>
        <div className="pointer-events-none absolute top-16 right-16 -rotate-6 text-4xl opacity-15 select-none 2xl:top-14 2xl:right-28 2xl:opacity-20">
          🐾
        </div>
        <div className="pointer-events-none absolute top-8 right-40 hidden rotate-6 text-3xl opacity-20 select-none 2xl:block">
          🐾
        </div>
        <div className="relative z-10">
          <p className="typo-tab mb-1 text-orange-100 2xl:mb-1.5" style={JP}>
            歡迎回來
          </p>
          <h1
            className="text-3xl font-bold 2xl:text-[46px] 2xl:leading-[1.08]"
            style={{ fontFamily: "'Noto Serif TC', serif" }}
          >
            {user.nickname ?? user.name ?? user.email} 你好！
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 2xl:mt-4 2xl:gap-2.5">
            <span className="typo-tab rounded-full bg-white/20 px-2.5 py-0.5 text-white 2xl:bg-white/24 2xl:py-1">
              會員編號：{user.userNo ?? `U-${user.id}`}
            </span>
            {user.emailVerified && (
              <span className="typo-tab flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-white 2xl:bg-white/24 2xl:py-1">
                <LuCircleCheck size={12} className="hidden 2xl:block" />
                郵件已驗證
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="tabs-box tabs w-fit rounded-2xl border border-base-300 bg-base-200 p-1 2xl:rounded-[16px] 2xl:border-[#E9DED3] 2xl:bg-transparent 2xl:shadow-none">
        {(['overview', 'profile', 'security'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tab-sm tab h-8 min-h-8 rounded-xl px-6 text-[14px] 2xl:h-10 2xl:min-h-10 2xl:rounded-[12px] 2xl:px-8 ${tab === t ? 'tab-active bg-base-100 text-[#2D2826] shadow-sm 2xl:bg-[#F4EEE8]' : 'text-text-primary/60 2xl:text-[#4A453F]'}`}
          >
            {t === 'overview'
              ? '總覽'
              : t === 'profile'
                ? '個人資料'
                : '帳號安全'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <OverviewTab
          stats={stats}
          onOpenProfile={() => setTab('profile')}
          onOpenSecurity={() => setTab('security')}
        />
      )}
      {tab === 'profile' && <ProfileTab user={user} onUpdate={setUser} />}
      {tab === 'security' && <SecurityTab user={user} security={security} />}
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────

function OverviewTab({
  stats,
  onOpenProfile,
  onOpenSecurity,
}: {
  stats: DashboardStats;
  onOpenProfile: () => void;
  onOpenSecurity: () => void;
}) {
  const cards = [
    {
      href: '/member/orders',
      icon: LuPackage,
      watermarkTone: 'text-orange-100',
      chipBg: 'bg-orange-100',
      chipText: 'text-orange-500',
      chipLabel: '訂單總覽',
      title: '訂單',
      num: stats.orders.total,
      unit: '筆',
      hint: '最近 30 天',
      tags: [
        {
          l: '待付款',
          v: stats.orders.pending,
          c: 'text-cyan-600',
          bg: 'bg-sky-100',
        },
        {
          l: '已完成',
          v: stats.orders.completed,
          c: 'text-lime-600',
          bg: 'bg-green-100',
        },
        {
          l: '已取消',
          v: stats.orders.cancelled,
          c: 'text-gray-500',
          bg: 'bg-slate-100',
        },
      ],
    },
    {
      href: '/member/favorites',
      icon: LuHeart,
      watermarkTone: 'text-rose-100',
      chipBg: 'bg-rose-100',
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
      chipBg: 'bg-amber-100',
      chipText: 'text-amber-600',
      chipLabel: '寵物總覽',
      title: '寵物',
      num: stats.pets,
      unit: '隻',
      hint: '查看毛孩資料與狀態',
      tags: [],
    },
  ];

  return (
    <div className="space-y-5 2xl:space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-5">
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
              className="relative overflow-hidden rounded-2xl border border-[#ECE3DA] bg-[#FDFBF6] shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div
                className={`absolute top-1 right-2 ${watermarkTone} pointer-events-none select-none`}
              >
                <Icon size={88} strokeWidth={1.2} />
              </div>

              <div className="relative px-5 pt-4 pb-4">
                <div
                  className={`inline-flex items-center gap-1.5 ${chipBg} ${chipText} typo-tab mb-3 rounded-full px-2.5 py-1`}
                >
                  <Icon size={13} strokeWidth={2} />
                  <span>{chipLabel}</span>
                </div>

                <div className="mb-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {num}
                  </span>
                  <span className="typo-card-body ml-1.5 text-gray-400">
                    {unit}
                  </span>
                  <span className="typo-card-title ml-1 text-gray-700">
                    {title}
                  </span>
                </div>

                <div className="typo-card-body mb-2 text-gray-400" style={JP}>
                  {hint}
                </div>

                <div className="my-3 border-t border-gray-100" />

                {tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    {tags.map((t) => (
                      <div
                        key={t.l}
                        className={`flex-1 ${t.bg} rounded-xl px-2 py-1.5 text-center`}
                      >
                        <div className={`typo-card-title leading-tight ${t.c}`}>
                          {t.v}
                        </div>
                        <div className="typo-card-body mt-0.5 leading-tight text-gray-400">
                          {t.l}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {tags.length === 0 && (
                  <div className="rounded-xl bg-gray-100 px-2 py-1.5 text-center">
                    <div className="typo-card-body leading-tight text-gray-400">
                      前往查看完整{title}內容
                    </div>
                  </div>
                )}
              </div>
            </Link>
          )
        )}
      </div>

      <div className="bg-[#FDFBF6]-100 card">
        <div className="card-body px-6 py-5">
          <h2 className="typo-h4 mb-3 text-text-primary" style={JP}>
            快速操作
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                label: '編輯個人資料',
                onClick: onOpenProfile,
                icon: Edit2,
                chipLabel: '個人資料',
                chipBg: 'bg-blue-100',
                chipText: 'text-blue-500',
                watermarkTone: 'text-blue-100',
                hint: '更新姓名、手機與地址',
              },
              {
                label: '帳號安全設定',
                onClick: onOpenSecurity,
                icon: Shield,
                chipLabel: '安全設定',
                chipBg: 'bg-gray-200',
                chipText: 'text-black-600',
                watermarkTone: 'text-gray-300',
                hint: '修改密碼與登入安全',
              },
              {
                label: '聯繫客服中心',
                href: '/member/support',
                icon: LuMessageCircleQuestion,
                chipLabel: '客服入口',
                chipBg: 'bg-cyan-100',
                chipText: 'text-cyan-500',
                watermarkTone: 'text-cyan-200',
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
                    className="relative overflow-hidden rounded-2xl border border-[#ECE3DA] bg-[#FDFBF6] shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div
                      className={`absolute top-1 right-2 ${watermarkTone} pointer-events-none select-none`}
                    >
                      <Icon size={72} strokeWidth={1.2} />
                    </div>

                    <div className="relative px-4 py-4">
                      <div
                        className={`inline-flex items-center gap-1.5 ${chipBg} ${chipText} typo-tab mb-3 rounded-full px-2.5 py-1`}
                      >
                        <Icon size={13} strokeWidth={2} />
                        <span>{chipLabel}</span>
                      </div>

                      <div className="mb-1">
                        <span className="typo-card-title tracking-tight text-gray-900">
                          {label}
                        </span>
                      </div>

                      <div className="typo-card-body text-gray-400" style={JP}>
                        {hint}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <button
                    key={label}
                    onClick={onClick}
                    className="relative overflow-hidden rounded-2xl border border-[#ECE3DA] bg-[#FDFBF6] text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div
                      className={`absolute top-1 right-2 ${watermarkTone} pointer-events-none select-none`}
                    >
                      <Icon size={72} strokeWidth={1.2} />
                    </div>

                    <div className="relative px-4 py-4">
                      <div
                        className={`inline-flex items-center gap-1.5 ${chipBg} ${chipText} typo-tab mb-3 rounded-full px-2.5 py-1`}
                      >
                        <Icon size={13} strokeWidth={2} />
                        <span>{chipLabel}</span>
                      </div>

                      <div className="mb-1">
                        <span className="typo-card-title tracking-tight text-gray-900">
                          {label}
                        </span>
                      </div>

                      <div className="typo-card-body text-gray-400" style={JP}>
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
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [f, setF] = useState({
    name: user.name ?? '',
    nickname: user.nickname ?? '',
    phone: user.phone ?? '',
    address: user.address ?? '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [avatarFile]);

  const resetEditState = () => {
    setEditing(false);
    setError('');
    setAvatarFile(null);
    setAvatarPreview(null);
    setF({
      name: user.name ?? '',
      nickname: user.nickname ?? '',
      phone: user.phone ?? '',
      address: user.address ?? '',
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('頭像格式僅支援 JPG、PNG、WEBP。');
      event.target.value = '';
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('頭像大小不可超過 2MB。');
      event.target.value = '';
      return;
    }

    setError('');
    setAvatarFile(file);
  };

  const save = async () => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', f.name);
      formData.append('nickname', f.nickname);
      formData.append('phone', f.phone);
      formData.append('address', f.address);

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? '更新失敗。');
        return;
      }
      onUpdate({ ...user, ...data });
      setAvatarFile(null);
      setAvatarPreview(null);
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

      <div className="bg-[#FDFBF6]-100 card rounded-2xl border border-base-300">
        <div className="card-body p-5">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={
                  avatarPreview ??
                  user.avatar ??
                  `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.email}`
                }
                alt={user.name ?? ''}
                className="h-20 w-20 rounded-2xl border-2 border-base-300 bg-base-200 object-cover"
              />

              {editing && (
                <>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                    aria-label="上傳會員頭像"
                  />
                  <button
                    type="button"
                    aria-label="選擇頭像"
                    className="btn absolute -right-1.5 -bottom-1.5 btn-circle shadow btn-light btn-xs"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    <Camera size={13} />
                  </button>
                </>
              )}
            </div>
            <div className="min-w-0 flex-1">
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
                  <p className="text-xs text-text-primary/60">
                    頭像格式僅支援 JPG、PNG、WEBP，大小上限 2MB。
                  </p>
                  {error && <ErrorBox message={error} />}
                  <div className="flex gap-2">
                    <Btn onClick={save} loading={loading} sm>
                      儲存變更
                    </Btn>
                    <Btn onClick={resetEditState} variant="outline" sm>
                      取消
                    </Btn>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="typo-h4 text-text-primary" style={JP}>
                      {user.name ?? '未設定'}
                    </h2>
                    <Btn onClick={() => setEditing(true)} variant="outline" sm>
                      <Edit2 size={13} />
                      編輯
                    </Btn>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {user.emailVerified && (
                      <span className="typo-tab badge gap-1 badge-outline px-2 py-2 badge-success">
                        <LuCircleCheck size={9} />
                        郵件已驗證
                      </span>
                    )}
                    {user.googleLinked && (
                      <span className="typo-tab badge gap-1 badge-outline px-2 py-2 badge-info">
                        Google 已連結
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FDFBF6]-100 card overflow-hidden rounded-2xl border border-base-300">
        <div className="border-b border-base-300 bg-base-200/50 px-5 py-3">
          <h3 className="typo-card-title text-text-primary" style={JP}>
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
            className="flex items-center border-b border-base-300 px-5 py-3.5 transition-colors last:border-0 hover:bg-base-200/40"
          >
            <div className="typo-card-body w-28 shrink-0 text-text-primary/60">
              {label}
            </div>
            <div className="typo-card-body flex-1 truncate font-medium text-text-primary">
              {value}
            </div>
            {locked && (
              <Lock size={12} className="shrink-0 text-text-primary/50" />
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
    <div className="bg-[#FDFBF6]-100 card rounded-2xl border border-base-300">
      <div className="card-body p-5">
        {success && <SuccessBox message="密碼已成功更新。" />}
        <div className="flex items-start justify-between">
          <div>
            <div className="typo-card-title text-text-primary">變更密碼</div>
            <div className="typo-card-body mt-0.5 text-text-primary/60">
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
          <div className="mt-4 space-y-4 border-t border-base-300 pt-4">
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
      <div className="typo-card-body py-12 text-center text-text-primary/60">
        載入中…
      </div>
    );

  return (
    <div className="space-y-5">
      {/* Email verification */}
      <div className="bg-[#FDFBF6]-100 card rounded-2xl border border-base-300">
        <div className="card-body p-5">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${security.emailVerified ? 'bg-green-100' : 'bg-amber-100'}`}
            >
              {security.emailVerified ? (
                <LuCircleCheck size={18} className="text-green-600" />
              ) : (
                <AlertCircle size={18} className="text-amber-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="typo-card-title text-text-primary">
                電子郵件驗證
              </div>
              <div className="typo-card-body mt-0.5 text-text-primary/60">
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
      <div className="bg-[#FDFBF6]-100 card overflow-hidden rounded-2xl border border-base-300">
        <div className="flex items-center justify-between border-b border-base-300 bg-base-200/50 px-5 py-3">
          <h3 className="typo-h4 text-text-primary" style={JP}>
            登入紀錄
          </h3>
          <span className="typo-tab badge badge-outline text-text-primary/60">
            最近 10 筆
          </span>
        </div>
        <div className="divide-y divide-base-300">
          {security.loginLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-base-200/40"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${log.success ? 'bg-green-100' : 'bg-red-100'}`}
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
              <div className="min-w-0 flex-1">
                <div className="typo-card-body font-medium text-text-primary">
                  {log.browser} / {log.os}
                </div>
                <div className="typo-tab text-text-primary/60">
                  {log.time}
                  {log.ip ? ` · ${log.ip}` : ''}
                </div>
              </div>
              <span
                className={`typo-tab badge px-2.5 py-1 ${log.success ? 'badge-outline badge-success' : 'badge-outline badge-error'}`}
              >
                {log.success ? '成功' : '失敗'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Security policy */}
      <div className="bg-[#FDFBF6]-100 card rounded-2xl border border-base-300">
        <div className="card-body p-5">
          <h3 className="typo-h4 mb-4 text-text-primary" style={JP}>
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
                className="flex items-center gap-3 border-b border-base-300 py-2.5 last:border-0"
              >
                <Icon size={14} className="shrink-0 text-primary" />
                <div className="typo-card-body flex-1 text-text-primary">
                  {label}
                </div>
                <div className="typo-tab badge badge-ghost text-text-primary/70">
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
