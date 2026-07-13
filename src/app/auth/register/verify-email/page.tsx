'use client';
export const dynamic = 'force-dynamic';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { AuthShell, Btn, ErrorBox } from '@/src/components/ui';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [resent, setResent] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange =
    (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.replace(/\D/g, '').slice(-1);
      const next = [...otp];
      next[i] = v;
      setOtp(next);
      if (v && i < 5) refs.current[i + 1]?.focus();
    };

  const handleKeyDown = (i: number) => (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const verify = async () => {
    const code = otp.join('');
    if (code.length < 6) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, type: 'EMAIL_VERIFY' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? '驗證失敗，請再試一次。');
        return;
      }
      setDone(true);
    } catch {
      setError('網路錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    await fetch('/api/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, type: 'EMAIL_VERIFY' }),
    });
    setResent(true);
    setTimeout(() => setResent(false), 30_000);
  };

  if (done) {
    return (
      <AuthShell title="驗證完成" subtitle="您的帳號已成功啟用">
        <div className="px-7 py-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={30} className="text-green-500" />
          </div>
          <div className="space-y-2">
            <p className="typo-card-title text-base-content">
              電子郵件驗證完成！
            </p>
            <p className="typo-card-body text-base-content/60 mt-1">
              帳號已啟用，現在可以登入。
            </p>
          </div>
          <Btn onClick={() => router.push('/auth/login')} full className="mt-2">
            前往登入
          </Btn>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="電子郵件驗證" subtitle="請查收驗證信">
      <div className="px-7 py-7 space-y-7">
        <div className="alert bg-base-200 rounded-2xl p-6 typo-card-body flex items-start gap-3 border-base-300">
          <Mail size={15} className="shrink-0 mt-0.5 text-primary" />
          <span className="text-base-content/80">
            已發送 6 位數驗證碼至 <strong>{email}</strong>，請於 10 分鐘內輸入。
          </span>
        </div>

        <div className="flex gap-2 justify-center py-2">
          {otp.map((v, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              value={v}
              onChange={handleChange(i)}
              onKeyDown={handleKeyDown(i)}
              maxLength={1}
              autoComplete="one-time-code"
              aria-label={`驗證碼第 ${i + 1} 碼`}
              className="w-13 h-13 rounded-2xl border-2 border-[#E7DDD3] bg-[#FFF8F1] text-[#2F2A26] text-center text-[22px] font-bold shadow-sm outline-none transition-all focus:border-[#E97C37] focus:ring-2 focus:ring-[#F6C6A0]/50"
            />
          ))}
        </div>

        {error && <ErrorBox message={error} />}

        <Btn
          onClick={verify}
          loading={loading}
          full
          className="mt-1"
          disabled={otp.join('').length < 6}
        >
          立即驗證
        </Btn>

        <p className="text-center typo-tab text-base-content/60">
          沒有收到驗證碼？{' '}
          {resent ? (
            <span className="text-green-600">已重新發送</span>
          ) : (
            <button onClick={resend} className="link link-hover text-primary">
              重新發送
            </button>
          )}
        </p>

        <Link
          href="/auth/login"
          className="flex items-center gap-1 typo-tab text-base-content/60 hover:text-base-content mx-auto w-fit transition-colors"
        >
          <ArrowLeft size={12} />
          返回登入
        </Link>
      </div>
    </AuthShell>
  );
}
