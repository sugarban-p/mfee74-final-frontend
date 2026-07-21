'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LuArrowLeft, LuCirclePlus } from 'react-icons/lu';
import { PetProfileCard } from '@/src/components/pets/PetProfileCard';
import { getPets } from '@/src/services/pets-api';
import type { PetListItem } from '@/src/types/pet';

export default function PetProfilesPage() {
  const [pets, setPets] = useState<PetListItem[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 由瀏覽器呼叫同源 API，讓登入 Cookie 與會員功能使用相同流程。
  useEffect(() => {
    getPets()
      .then(setPets)
      .catch((error: unknown) => {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '目前無法取得毛孩資料，請稍後再試'
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    /**
     * 這頁被 src/app/member/layout.tsx 包住，
     * 所以只需要吃滿 sidebar 右側內容。
     */
    <section className="w-full">
      {/* 頁面標題 */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <Link
            href="/member/pets"
            className="back-button typo-tab inline-flex items-center gap-2"
          >
            <LuArrowLeft className="h-4 w-4" aria-hidden="true" />
            返回
          </Link>

          <h1 className="typo-h2 mt-6 text-text-primary">毛孩檔案管理</h1>

          <p className="typo-body mt-4 text-text-secondary">
            管理所有毛孩的健康資料與飲食偏好
          </p>
        </div>
      </div>

      {/* API 失敗訊息 */}
      {errorMessage && (
        <div
          role="alert"
          className="typo-card-body mt-10 rounded-lg border border-red-200 bg-danger px-5 py-4 text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {isLoading && (
        <p className="typo-card-body mt-10 text-text-secondary">讀取中...</p>
      )}

      {/* API 成功但會員沒有寵物 */}
      {!isLoading && !errorMessage && pets.length === 0 && (
        <div className="mt-10 rounded-lg border border-border bg-card-primary px-6 py-8 text-center">
          <p className="typo-card-title text-text-primary">
            目前還沒有毛孩檔案
          </p>

          <p className="typo-card-body mt-2 text-text-secondary">
            建立第一份毛孩資料，開始使用個人化 AI 導購。
          </p>
        </div>
      )}

      {/* 真實 API 寵物列表 */}
      <div className="mt-16 flex flex-wrap gap-8">
        {!isLoading &&
          !errorMessage &&
          pets.map((pet) => <PetProfileCard key={pet.id} pet={pet} />)}

        {/**
         * 新增毛孩卡片固定保留。
         * 即使目前沒有寵物，會員仍可以從這裡建立資料。
         */}
        <Link
          href="/member/pets/profiles/new"
          className="flex w-[260px] flex-col rounded-2xl bg-white p-4 text-center shadow-sm transition hover:-translate-y-1"
        >
          <div className="flex h-[140px] w-full items-center justify-center rounded-xl bg-card-secondary text-primary">
            <LuCirclePlus className="h-8 w-8" aria-hidden="true" />
          </div>

          <div className="mt-4 flex flex-1 flex-col items-center justify-center">
            <h3 className="typo-card-title text-text-primary">新增毛孩</h3>
          </div>

          <span className="next-button typo-tab mt-5 inline-block w-full">
            開始建立
          </span>
        </Link>
      </div>
    </section>
  );
}
