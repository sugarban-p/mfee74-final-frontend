'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, ArrowLeft } from 'lucide-react';
import {
  AuthShell,
  FieldInput,
  Btn,
  ErrorBox,
  Stepper,
} from '@/src/components/ui';

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verify = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, type: 'FORGOT_PASSWORD' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? '驗證碼不正確，請再試一次。');
        return;
      }
      router.push(
        `/auth/forgot-password/reset-password?email=${encodeURIComponent(email)}&token=${data.resetToken}`
      );
    } catch {
      setError('網路錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="忘記密碼" subtitle="請確認您的身分以繼續">
      <div className="rounded-t-3xl bg-base-200 px-7 py-6">
        <p className="typo-card-body text-text-primary/60">
          輸入驗證碼以繼續重設密碼
        </p>
      </div>

      <div className="px-7 py-7 space-y-6">
        <Stepper step={2} labels={['輸入信箱', '驗證身份', '設定新密碼']} />

        <div className="bg-base-200 border border-base-300 p-6 text-text-primary rounded-3xl">
          <p className="typo-card-title text-text-primary mb-2">驗證碼已發送</p>
          <p className="typo-card-body leading-6">
            我們已將 6 位數驗證碼傳送到您的信箱：
            <span className="typo-card-title text-text-primary break-words">
              {email}
            </span>
          </p>
        </div>

        <div className="space-y-4">
          <FieldInput
            label="驗證碼"
            value={otp}
            onChange={setOtp}
            placeholder="000000"
            left={<Shield size={15} />}
          />

          {error && <ErrorBox message={error} />}

          <Btn
            onClick={verify}
            loading={loading}
            full
            disabled={otp.length < 6}
          >
            確認驗證碼
          </Btn>

          <div className="text-center typo-tab text-text-primary/60">
            如果未收到驗證碼，請稍候片刻或返回上一頁重新發送。
          </div>

          <Link
            href="/auth/forgot-password"
            className="flex items-center justify-center gap-1 typo-tab text-text-primary/60 hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={12} /> 返回上一步
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
