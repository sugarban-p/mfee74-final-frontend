'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LuCirclePlus, LuPawPrint } from 'react-icons/lu';
import { PetProfileCard } from '@/src/components/pets/PetProfileCard';
import { getPets } from '@/src/services/pets-api';
import type { PetListItem } from '@/src/types/pet';

/**
 * guidedFeatures：
 * 說明目前「引導式 AI 導購」實際提供的四種需求。
 * 這些內容只負責介紹功能，不會在此頁直接呼叫 AI API。
 */
const guidedFeatures = [
  {
    title: '依健康狀況篩選',
    description: '參考毛孩的健康情況與過敏食材，排除不適合的品項。',
  },
  {
    title: '尋找日常主食',
    description: '從符合毛孩物種與需求的商品中推薦日常主食。',
  },
  {
    title: '零食與營養補充',
    description: '依照毛孩資料尋找適合的零食與營養補充選項。',
  },
  {
    title: '保健與生活照護',
    description: '推薦保健品、生活用品與日常照護商品。',
  },
];

export default function PetAiPage() {
  const [pets, setPets] = useState<PetListItem[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 讀取目前會員的毛孩，選擇後將 pet.id 帶到 AI 導購聊天室。
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
    <section className="w-full">
      {/* 返回：回到寵物 dashboard */}
      <Link href="/member/pets" className="back-button typo-tab inline-flex">
        ← 返回
      </Link>

      {/* Hero：AI 導購入口說明 */}
      <section className="mx-auto mt-6 max-w-[760px] text-center">
        <h1 className="typo-h2 text-text-primary">
          讓 AI 為您的毛孩
          <br />
          找到最適合的商品
        </h1>
      </section>

      {/* 功能說明：清楚呈現目前採用的是引導式導購，不是自由對話 */}
      <section className="mx-auto mt-12 max-w-[980px]">
        <h2 className="typo-h3 text-center text-text-primary">
          選擇毛孩後，再從四種需求中選擇一項開始導購。
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {guidedFeatures.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-3 rounded-lg border border-border bg-white px-5 py-4"
            >
              <LuPawPrint
                className="mt-1 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />

              <div>
                <h3 className="typo-card-title text-text-primary">
                  {feature.title}
                </h3>

                <p className="typo-card-body mt-1 text-text-secondary">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="typo-card-body mt-4 text-center text-text-secondary">
          沒有符合的需求也沒關係，進入導購後可直接前往客服中心。
        </p>
      </section>

      {/* 毛孩選擇：將原本獨立的選擇頁整合到功能介紹下方。 */}
      <section className="mx-auto mt-12 max-w-[980px]">
        <h2 className="typo-h3 text-text-primary">選擇要購物的毛孩</h2>

        <p className="typo-body mt-3 text-text-secondary">
          選擇後，AI 會根據牠的狀況提供個人化推薦。
        </p>

        <div className="mt-6 flex flex-wrap gap-8">
          {errorMessage ? (
            <p className="typo-card-body text-red-700" role="alert">
              {errorMessage}
            </p>
          ) : isLoading ? (
            <p className="typo-card-body text-text-secondary">讀取中...</p>
          ) : (
            pets.map((pet) => (
              <PetProfileCard
                key={pet.id}
                pet={pet}
                actionHref={'/member/pets/ai/chat?petId=' + pet.id}
                actionText="選擇這隻毛孩"
              />
            ))
          )}

          {/* 沒有毛孩或想新增資料時，沿用既有新增寵物流程。 */}
          <Link
            href="/member/pets/profiles/new"
            className="flex w-[260px] cursor-pointer flex-col rounded-2xl bg-white p-4 text-center shadow-sm transition hover:-translate-y-1"
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
    </section>
  );
}
