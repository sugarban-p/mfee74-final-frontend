"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Clock } from "lucide-react";
import { AuthShell, Btn, JP } from "@/src/components/ui";

export default function LockStatusPage() {
  const [minutes, setMinutes] = useState(30);

  useEffect(() => {
    const timer = setInterval(
      () => setMinutes((m) => Math.max(0, m - 1)),
      60_000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <AuthShell title="帳號暫時鎖定" subtitle="為保護您的帳號安全">
      <div className="text-center space-y-6 py-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <Shield size={28} className="text-red-500" />
        </div>

        <div>
          <p className="font-semibold text-base-content" style={JP}>
            帳號已暫時鎖定
          </p>
          <p className="text-sm text-base-content/60 mt-2">
            因連續登入失敗次數過多，帳號已暫時鎖定。
          </p>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-center gap-3">
          <Clock size={20} className="text-red-500 shrink-0" />
          <div className="text-left">
            <p className="text-sm font-semibold text-red-600">
              請於 {minutes} 分鐘後再試
            </p>
            <p className="text-xs text-red-400 mt-0.5">
              鎖定解除後即可重新登入
            </p>
          </div>
        </div>

        <div className="text-xs text-base-content/60 bg-base-200 border border-base-300 rounded-xl p-3 text-left space-y-1">
          <p className="font-medium text-base-content">常見原因：</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>連續 5 次輸入錯誤密碼</li>
            <li>帳號遭異常操作偵測</li>
          </ul>
          <p className="mt-2">
            如非本人操作，建議立即透過「忘記密碼」重設密碼。
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/auth/forgot-password">
            <Btn full variant="outline">
              重設密碼
            </Btn>
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center gap-1 text-xs text-base-content/60 hover:text-base-content justify-center transition-colors"
          >
            <ArrowLeft size={12} />
            返回登入
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
