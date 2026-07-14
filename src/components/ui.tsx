'use client';
import React from 'react';
import { AlertCircle, Eye, EyeOff, Check, CheckCircle } from 'lucide-react';
import * as Label from '@radix-ui/react-label';

export const JP: React.CSSProperties = {
  fontFamily: "'Noto Sans TC', 'Noto Sans JP', 'DM Sans', sans-serif",
};

const AUTH_SANS_TC_MEDIUM: React.CSSProperties = {
  fontFamily: "'Noto Sans TC', 'Noto Sans JP', 'DM Sans', sans-serif",
  fontWeight: 500,
};

const AUTH_SERIF_TC_TITLE: React.CSSProperties = {
  fontFamily: "'Noto Serif TC', serif",
  fontWeight: 700,
};

// ── Brand ──────────────────────────────────────────────────────────────────

export function PetLogo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`${size === 'sm' ? 'w-7 h-7 text-sm' : 'w-9 h-9 text-base'} bg-primary rounded-xl flex items-center justify-center text-white shadow-[0_8px_18px_-10px_rgba(232,121,58,0.7)]`}
      >
        🐾
      </div>
      <span
        className={`font-bold ${size === 'sm' ? 'text-base' : 'text-lg'} text-base-content tracking-tight`}
        style={JP}
      >
        PetFull
      </span>
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ── Form ───────────────────────────────────────────────────────────────────

export function FieldInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  left,
  right,
  name,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  error?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  name?: string;
  autoComplete?: string;
}) {
  const wrapperTone = error
    ? 'border-[#E77D7D] focus-within:border-[#D95F5F] focus-within:ring-[#F6D2D2]'
    : 'border-[#E6DDD4] focus-within:border-[#F0822F] focus-within:ring-[#FCE5D2]';

  return (
    <div className="w-full space-y-2.5">
      <Label.Root
        className="block text-[16px] leading-[1.25] text-[#3C3631]"
        style={AUTH_SERIF_TC_TITLE}
      >
        {label}
      </Label.Root>
      <div
        className={`field-input-wrapper flex h-[46px] w-full items-center gap-3 rounded-xl border bg-[#F3EFEB] px-4 transition-all duration-200 focus-within:ring-2 ${wrapperTone}`}
      >
        {left && (
          <span className="field-input-slot text-[#8D847D] shrink-0">
            {left}
          </span>
        )}
        <input
          type={type}
          value={value}
          name={name}
          autoComplete={autoComplete}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="field-input h-full w-full border-0 bg-transparent p-0 text-[14px] leading-[1.35] text-[#2F2A26] placeholder:text-[#AFA59D] focus:outline-none focus:ring-0"
          style={AUTH_SANS_TC_MEDIUM}
        />
        {right && (
          <span className="field-input-slot text-[#8D847D] shrink-0">
            {right}
          </span>
        )}
      </div>
      {error && (
        <p className="text-[14px] leading-[1.35] text-[#D95F5F] flex items-center gap-1.5">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Password strength bar ──────────────────────────────────────────────────

export function passwordStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1)
    return {
      label: '太弱',
      color: 'bg-red-400',
      cls: 'text-red-500',
      w: 'w-1/4',
    };
  if (s <= 3)
    return {
      label: '普通',
      color: 'bg-yellow-400',
      cls: 'text-yellow-500',
      w: 'w-2/4',
    };
  return {
    label: '強勁',
    color: 'bg-green-500',
    cls: 'text-green-600',
    w: 'w-full',
  };
}

export function PwBar({ password }: { password: string }) {
  if (!password) return null;
  const s = passwordStrength(password);
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-1.5 bg-base-200 rounded-lg overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${s.color} ${s.w}`}
        />
      </div>
      <span className={`text-xs font-medium ${s.cls}`}>{s.label}</span>
    </div>
  );
}

// ── Button ─────────────────────────────────────────────────────────────────

type BtnVariant = 'primary' | 'outline' | 'ghost' | 'danger';

export function Btn({
  children,
  onClick,
  variant = 'primary',
  disabled,
  loading,
  full,
  sm,
  type = 'button',
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
  loading?: boolean;
  full?: boolean;
  sm?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}) {
  const base = `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${sm ? 'h-[40px] px-4 text-[14px]' : 'h-[46px] px-5 text-[16px] leading-none'} ${full ? 'w-full' : ''}`;
  const variants: Record<BtnVariant, string> = {
    primary:
      'border border-transparent !bg-[#E97C37] !text-white hover:!bg-[#DF6F2A] hover:!text-white focus-visible:ring-[#F6C6A0]',
    outline:
      'border border-[#E7DDD3] bg-[#FFFEFC] text-[#3C3631] hover:bg-[#F8EFE6] focus-visible:ring-[#F2DED0]',
    ghost:
      'text-[#6A615A] hover:bg-[#F5ECE3] hover:text-[#3C3631] focus-visible:ring-[#F2DED0]',
    danger:
      'bg-[#DB5E5E] text-white hover:bg-[#C94E4E] focus-visible:ring-[#F1C6C6]',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = '#DF6F2A';
          e.currentTarget.style.color = '#FFFFFF';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = '#E97C37';
          e.currentTarget.style.color = '#FFFFFF';
        }
      }}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className ?? ''}`}
      style={
        variant === 'primary'
          ? {
              backgroundColor: '#E97C37',
              color: '#FFFFFF',
              borderColor: 'transparent',
              ...AUTH_SANS_TC_MEDIUM,
            }
          : AUTH_SANS_TC_MEDIUM
      }
    >
      {loading && <span className="loading loading-spinner loading-xs" />}
      {children}
    </button>
  );
}

// ── Feedback ───────────────────────────────────────────────────────────────

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="alert alert-error rounded-xl text-sm">
      <AlertCircle size={16} className="shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function SuccessBox({ message }: { message: string }) {
  return (
    <div className="alert alert-success rounded-xl text-sm">
      <CheckCircle size={16} className="shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function Divider({ label = '或' }: { label?: string }) {
  return (
    <div className="text-center">
      <span
        className="inline-block text-[16px] leading-none text-[#A0968E]"
        style={AUTH_SANS_TC_MEDIUM}
      >
        {label}
      </span>
    </div>
  );
}

// ── OTP stepper ────────────────────────────────────────────────────────────

export function Stepper({ step, labels }: { step: number; labels: string[] }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-7">
      {labels.map((label, i) => {
        const s = i + 1;
        return (
          <div key={s} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold transition-all ${step > s ? 'bg-green-500 text-white' : step === s ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content/50'}`}
              >
                {step > s ? <Check size={14} /> : s}
              </div>
              <span
                className={`text-[14px] leading-none whitespace-nowrap ${step === s ? 'text-primary font-medium' : 'text-base-content/50'}`}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div
                className={`w-14 h-0.5 mb-5 transition-all ${step > s ? 'bg-green-500' : 'bg-base-200'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Auth shell ─────────────────────────────────────────────────────────────

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="w-full max-w-[456px] page-enter">
      <div className="card w-full bg-[#FFFEFC] border border-[#F0B28D] rounded-3xl overflow-hidden shadow-[0_12px_28px_-16px_rgba(66,52,41,0.28)]">
        <div
          className="text-center px-7 py-5 text-white"
          style={{ backgroundColor: '#E97C37' }}
        >
          <h1
            className="text-[20px] leading-none"
            style={{ ...AUTH_SERIF_TC_TITLE, color: '#FFFFFF' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-[16px] leading-[1.4] mt-2 text-[#FFE4CF]"
              style={AUTH_SANS_TC_MEDIUM}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div className="card-body p-0">{children}</div>
      </div>
    </div>
  );
}

// ── Password field with toggle ─────────────────────────────────────────────

export function PasswordInput({
  label,
  value,
  onChange,
  error,
  placeholder = '請輸入密碼',
  name,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  name?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = React.useState(false);
  return (
    <FieldInput
      key={show ? 'password-visible' : 'password-hidden'}
      label={label}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      name={name}
      autoComplete={autoComplete}
      left={
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      }
      right={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? '隱藏密碼' : '顯示密碼'}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#8D847D] hover:bg-[#EDE6DE] hover:text-[#3D3732] transition-colors"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      }
    />
  );
}
