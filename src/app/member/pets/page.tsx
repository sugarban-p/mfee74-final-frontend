'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { LuCat, LuCirclePlus, LuPawPrint, LuSparkles } from 'react-icons/lu';
import { PetProfileCard } from '@/src/components/pets/PetProfileCard';
import { getPets } from '@/src/services/pets-api';
import type { PetListItem } from '@/src/types/pet';

/**
 * FeatureItem：
 * Dashboard 上「功能入口卡片」的資料型別。
 *
 * icon: IconType：
 * 代表每張功能卡片都可以帶一個 react-icons 元件。
 */
interface FeatureItem {
  title: string;
  description: string;
  href: string;
  actionText: string;
  icon: IconType;
}

/**
 * petFeatures：
 * /member/pets Dashboard 的三個主要入口。
 *
 * 這裡只放功能入口的資料，
 * 真正的卡片畫面會在下面用 map 產生。
 */
const petFeatures: FeatureItem[] = [
  {
    title: '毛孩檔案管理',
    description: '查看與編輯毛孩基本資料、健康狀況與特殊註記。',
    href: '/member/pets/profiles',
    actionText: '前往管理',
    icon: LuCat,
  },
  {
    title: '新增毛孩',
    description: '建立毛孩檔案，讓 AI 導購能依照資料推薦商品。',
    href: '/member/pets/profiles/new',
    actionText: '開始建立',
    icon: LuCirclePlus,
  },
  {
    title: 'AI 導購',
    description: '依照毛孩年齡、健康需求等等，尋找合適商品。',
    href: '/member/pets/ai',
    actionText: '前往導購',
    icon: LuSparkles,
  },
];

export default function PetsPage() {
  const [pets, setPets] = useState<PetListItem[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 與會員 Dashboard 相同，由瀏覽器呼叫 API，登入 Cookie 會自動附上。
   */
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

  const petCount = pets.length;

  return (
    /**
     * 這個頁面已經被 src/app/member/layout.tsx 包住。
     * member/layout.tsx 會負責 sidebar 和會員頁面的外層寬度。
     * 所以這裡只要 w-full，吃滿 sidebar 右側內容區。
     */
    <section className="w-full">
      {/* Hero Section：會員一進來先看到寵物總覽與主要 CTA */}
      <div className="rounded-3xl bg-primary px-8 py-8 text-white md:px-10">
        <p className="typo-card-body mb-3 text-white/90">主人您好，歡迎回來</p>

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="typo-h2">
              {isLoading ? '正在讀取毛孩資料...' : `您有 ${petCount} 隻毛孩`}
            </h1>

            <p className="typo-body-medium mt-3 text-white">
              讓 AI 根據毛孩的狀況，為牠們找到適合的商品。
            </p>

            {/**
             * 按鈕放在文字區裡面，
             * 所以它會跟標題和描述一起靠左排列。
             */}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/member/pets/ai/select-pet"
                className="typo-tab rounded-full border border-white px-5 py-2 text-white transition hover:bg-white hover:text-primary"
              >
                開始 AI 導購
              </Link>

              <Link
                href="/member/pets/profiles"
                className="typo-tab rounded-full border border-white px-5 py-2 text-white transition hover:bg-white hover:text-primary"
              >
                管理毛孩
              </Link>
            </div>
          </div>

          {/**
           * 右側腳印 icon：
           * 目前先做視覺裝飾，不影響功能。
           */}
          <div className="hidden text-5xl text-text-primary/70 md:block">
            <LuPawPrint aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* 功能入口：三張卡片對應檔案管理、新增毛孩、AI 導購 */}
      <section className="mt-10">
        <h2 className="typo-h3 text-text-primary">功能入口</h2>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {petFeatures.map((feature) => {
            /**
             * React component 必須用大寫開頭。
             * 所以我們先把 feature.icon 取出來，命名成 Icon。
             */
            const Icon = feature.icon;

            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="border border-border bg-card-primary p-6 transition hover:-translate-y-1 hover:border-primary"
              >
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-card-secondary text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>

                <h3 className="typo-card-title text-text-primary">
                  {feature.title}
                </h3>

                <p className="typo-card-body mt-3 text-text-secondary">
                  {feature.description}
                </p>

                <span className="typo-tab mt-5 inline-block text-primary">
                  {feature.actionText} →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 我的毛孩：使用共用 PetProfileCard 顯示卡片 */}
      <section className="mt-10">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="typo-h3 text-text-primary">我的毛孩</h2>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/member/pets/profiles/new"
              className="next-button typo-tab inline-flex"
            >
              + 新增毛孩
            </Link>

            <Link
              href="/member/pets/profiles"
              className="back-button typo-tab inline-flex"
            >
              管理毛孩
            </Link>
          </div>
        </div>

        {/**
         * 這裡用 PetProfileCard，而不是直接把卡片 JSX 寫在頁面裡。
         *
         * 好處：
         * 1. Dashboard 和 profiles 頁可以共用同一張卡片。
         * 2. 之後要調整卡片樣式，只要改 PetProfileCard 一個檔案。
         */}
        <div className="flex flex-wrap gap-6 border border-border bg-white/40 p-6">
          {errorMessage ? (
            <p className="typo-card-body text-red-700" role="alert">
              {errorMessage}
            </p>
          ) : isLoading ? (
            <p className="typo-card-body text-text-secondary">讀取中...</p>
          ) : (
            pets.map((pet) => <PetProfileCard key={pet.id} pet={pet} />)
          )}
        </div>
      </section>
    </section>
  );
}
