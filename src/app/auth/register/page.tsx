'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import {
  AuthShell,
  FieldInput,
  PasswordInput,
  PwBar,
  Btn,
  GoogleIcon,
  Divider,
  ErrorBox,
} from '@/src/components/ui';

const AUTH_TEXT: React.CSSProperties = {
  fontFamily: "'Noto Sans TC', 'Noto Sans JP', 'DM Sans', sans-serif",
  fontWeight: 500,
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const upd = (k: keyof typeof form) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = '請輸入電子郵件。';
    if (!form.password || form.password.length < 8)
      e.password = '密碼至少需要 8 個字元。';
    if (form.password !== form.confirm) e.confirm = '兩次輸入的密碼不一致。';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(
          data.message ??
            (res.status === 409
              ? '此電子郵件已被註冊。'
              : '註冊失敗，請再試一次。')
        );
        return;
      }
      router.push(
        `/auth/register/verify-email?email=${encodeURIComponent(form.email)}`
      );
    } catch {
      setApiError('網路錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="新會員註冊" subtitle="建立帳號，享受會員專屬優惠">
      <div className="bg-[#FFFEFC] px-6 pt-5 pb-2">
        <p
          className="text-[16px] leading-[1.5] text-[#9A9088]"
          style={AUTH_TEXT}
        >
          開始建立帳號，即可使用會員專屬功能
        </p>
      </div>

      <div className="space-y-4 px-6 pb-6">
        <FieldInput
          label="電子郵件"
          type="email"
          value={form.email}
          onChange={upd('email')}
          placeholder="example@email.com"
          autoComplete="email"
          left={<Mail size={15} />}
          error={errors.email}
        />

        <div>
          <PasswordInput
            label="密碼"
            value={form.password}
            onChange={upd('password')}
            placeholder="至少 8 個字元"
            autoComplete="new-password"
            error={errors.password}
          />
          <PwBar password={form.password} />
        </div>

        <PasswordInput
          label="確認密碼"
          value={form.confirm}
          onChange={upd('confirm')}
          placeholder="請再次輸入密碼"
          autoComplete="new-password"
          error={errors.confirm}
        />

        <div
          className="space-y-2 rounded-xl border border-[#E3D8CC] bg-[#ECE7E1] p-4 text-[16px] leading-[1.5] text-[#786E67]"
          style={AUTH_TEXT}
        >
          <p className="font-medium text-[#3C3631]" style={AUTH_TEXT}>
            密碼強度建議：
          </p>
          <div
            className="grid grid-cols-2 gap-x-4 gap-y-1 text-[16px] leading-[1.35]"
            style={AUTH_TEXT}
          >
            <span className="text-[#8A7F77]" style={AUTH_TEXT}>
              <span className="text-[#E77721]">v</span> 長度 12 字元以上
            </span>
            <span className="text-[#8A7F77]" style={AUTH_TEXT}>
              <span className="text-[#E77721]">v</span> 包含大寫字母
            </span>
            <span className="text-[#8A7F77]" style={AUTH_TEXT}>
              <span className="text-[#E77721]">v</span> 包含數字
            </span>
            <span className="text-[#8A7F77]" style={AUTH_TEXT}>
              <span className="text-[#E77721]">v</span> 包含特殊符號
            </span>
          </div>
        </div>

        {apiError && <ErrorBox message={apiError} />}

        <Btn onClick={submit} loading={loading} full>
          建立帳號
        </Btn>

        <p
          className="text-center text-[16px] leading-[1.35] text-[#7C726B]"
          style={AUTH_TEXT}
        >
          已有帳號？{' '}
          <Link
            href="/auth/login"
            className="link font-semibold text-[#E77721] link-hover"
            style={AUTH_TEXT}
          >
            前往登入
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
