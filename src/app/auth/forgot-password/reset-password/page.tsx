"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, CheckCircle } from "lucide-react";
import {
  AuthShell,
  PasswordInput,
  PwBar,
  Btn,
  ErrorBox,
  Stepper,
} from "@/src/components/ui";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const resetToken = searchParams.get("token") ?? "";

  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!pw || pw !== confirm) {
      setError("兩次輸入的密碼不一致。");
      return;
    }
    if (pw.length < 8) {
      setError("密碼至少需要 8 個字元。");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw, resetToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "密碼重設失敗，請重新操作。");
        return;
      }
      setDone(true);
    } catch {
      setError("網路錯誤，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthShell title="密碼重設完成" subtitle="請使用新密碼重新登入">
        <div className="rounded-t-2xl bg-base-200 px-6 py-5">
          <p className="text-sm text-base-content/60">您的密碼已成功更新</p>
        </div>

        <div className="px-6 py-6 text-center space-y-5">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={30} className="text-green-500" />
          </div>
          <p className="text-sm text-base-content/60">
            密碼已成功更新，請使用新密碼登入。
          </p>
          <Btn onClick={() => router.push("/auth/login")} full>
            前往登入
          </Btn>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="忘記密碼" subtitle="設定新密碼">
      <div className="rounded-t-2xl bg-base-200 px-6 py-5">
        <p className="text-sm text-base-content/60">輸入新密碼以完成重設</p>
      </div>

      <div className="px-6 py-6 space-y-4">
        <Stepper step={3} labels={["輸入信箱", "驗證身份", "設定新密碼"]} />

        <div>
          <PasswordInput
            label="新密碼"
            value={pw}
            onChange={setPw}
            placeholder="至少 8 個字元"
            autoComplete="new-password"
          />
          <PwBar password={pw} />
        </div>

        <PasswordInput
          label="確認新密碼"
          value={confirm}
          onChange={setConfirm}
          placeholder="請再次輸入新密碼"
          autoComplete="new-password"
        />

        {error && <ErrorBox message={error} />}

        <Btn
          onClick={submit}
          loading={loading}
          full
          disabled={!pw || pw !== confirm}
        >
          變更密碼
        </Btn>
      </div>
    </AuthShell>
  );
}
