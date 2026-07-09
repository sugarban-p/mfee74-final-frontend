"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthShell, FieldInput, Btn, ErrorBox, Stepper } from "@/src/components/ui";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!email) {
      setError("請輸入電子郵件。");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "FORGOT_PASSWORD" }),
      });
      // Always redirect (don't leak email existence)
      router.push(
        `/auth/forgot-password/verify-otp?email=${encodeURIComponent(email)}`,
      );
    } catch {
      setError("網路錯誤，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="忘記密碼" subtitle="請依步驟重新設定您的密碼">
      <div className="rounded-t-2xl bg-base-200 px-6 py-5">
        <p className="text-sm text-base-content/60">
          輸入電子郵件以開始重設流程
        </p>
      </div>

      <div className="px-6 py-6 space-y-4">
        <Stepper step={1} labels={["輸入信箱", "驗證身份", "設定新密碼"]} />

        <p className="text-sm text-base-content/60">
          請輸入您的電子郵件，我們將發送驗證碼。
        </p>

        <FieldInput
          label="電子郵件"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="example@email.com"
          autoComplete="email"
          left={<Mail size={15} />}
        />

        {error && <ErrorBox message={error} />}

        <Btn onClick={submit} loading={loading} full disabled={!email}>
          發送驗證碼
        </Btn>

        <Link
          href="/auth/login"
          className="flex items-center gap-1 text-xs text-base-content/60 hover:text-base-content mx-auto w-fit transition-colors"
        >
          <ArrowLeft size={12} />
          返回登入
        </Link>
      </div>
    </AuthShell>
  );
}
