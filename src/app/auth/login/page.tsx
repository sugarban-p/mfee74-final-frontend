'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail } from 'lucide-react';
import {
  AuthShell,
  FieldInput,
  PasswordInput,
  Btn,
  GoogleIcon,
  Divider,
  ErrorBox,
} from '@/src/components/ui';

const AUTH_TEXT: React.CSSProperties = {
  fontFamily: "'Noto Sans TC', 'Noto Sans JP', 'DM Sans', sans-serif",
  fontWeight: 500,
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next');
  const canReturnToPurchaseFlow = Boolean(
    nextPath &&
    (nextPath.startsWith('/cart') || nextPath.startsWith('/checkout'))
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(
    searchParams.get('error') === 'oauth_failed'
      ? 'Google 登入失敗，請再試一次。'
      : ''
  );
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      setError('請填寫所有欄位。');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 423) {
          router.push('/auth/lock-status');
        } else if (data?.error === 'EMAIL_NOT_VERIFIED') {
          router.push(
            `/auth/register/verify-email?email=${encodeURIComponent(email)}`
          );
        } else {
          setError(data.message ?? '登入失敗，請再試一次。');
        }
        return;
      }
      window.dispatchEvent(new Event('auth-state-changed'));
      router.push(
        canReturnToPurchaseFlow && nextPath ? nextPath : '/member/dashboard'
      );
    } catch {
      setError('網路錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    const googleLoginUrl = new URL(
      'http://localhost:3001/api/oauth/google/login'
    );

    if (canReturnToPurchaseFlow && nextPath) {
      googleLoginUrl.searchParams.set('next', nextPath);
    }

    window.location.href = googleLoginUrl.toString();
  };

  return (
    <AuthShell title="會員登入" subtitle="歡迎回到 MOFU">
      <div className="bg-[#FFFEFC] px-6 pt-5 pb-2">
        <p
          className="text-[16px] leading-normal text-[#9A9088]"
          style={AUTH_TEXT}
        >
          使用電子郵件登入，或透過 Google 快速登入
        </p>
      </div>

      <div className="space-y-4 px-6 pb-6">
        <FieldInput
          label="電子郵件"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="test@pet.local"
          autoComplete="email"
          left={<Mail size={15} />}
        />

        <PasswordInput
          label="密碼"
          value={password}
          onChange={setPassword}
          placeholder="Password123!"
          autoComplete="current-password"
        />

        {error && <ErrorBox message={error} />}

        <div
          className="flex items-center justify-between text-[16px] leading-[1.35]"
          style={AUTH_TEXT}
        >
          <label
            className="label cursor-pointer justify-start gap-2 text-[#7E746D]"
            style={AUTH_TEXT}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="checkbox h-4.5 w-4.5 rounded-sm border-2 border-[#B8ACA2] bg-[#FFFEFC] checkbox-sm [--chkbg:#E77721] [--chkfg:white] checked:border-[#E77721] checked:bg-[#E77721] checked:text-white focus-visible:ring-2 focus-visible:ring-[#F6C6A0]/60 focus-visible:outline-none"
            />
            保持登入狀態
          </label>
          <Link
            href="/auth/forgot-password"
            className="link text-[#E77721] link-hover"
            style={AUTH_TEXT}
          >
            忘記密碼？
          </Link>
        </div>

        <Btn onClick={submit} loading={loading} full>
          登入
        </Btn>

        <Divider />

        <button
          onClick={googleLogin}
          className="h-11.5 w-full overflow-hidden rounded-full border border-[#E7DDD3] bg-[#FFFEFC] p-0"
        >
          <span
            className="flex h-full w-full items-center justify-center gap-2 bg-[#FFFEFC] text-[#3C3631] transition-colors hover:bg-[#F8EFE6]"
            style={{ ...AUTH_TEXT, fontSize: '16px' }}
          >
            <GoogleIcon /> 使用 Google 登入
          </span>
        </button>

        <div
          className="rounded-2xl border border-[#F0DEC8] bg-[#F2DDB9] px-4 py-3 text-[16px] leading-normal text-[#7A6F67]"
          style={AUTH_TEXT}
        >
          登入後即可查看您的會員專屬優惠與訂單資料。
        </div>

        <p
          className="text-center text-[16px] leading-[1.35] text-[#7C726B]"
          style={AUTH_TEXT}
        >
          還沒有帳號？{' '}
          <Link
            href="/auth/register"
            className="link font-semibold text-[#E77721] link-hover"
            style={AUTH_TEXT}
          >
            立即註冊
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
