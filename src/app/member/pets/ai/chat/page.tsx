'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LuArrowLeft, LuCircleCheck, LuSparkles } from 'react-icons/lu';

import { ProductCard } from '@/src/components/product/ProductCard';
import { getPetAiRecommendations } from '@/src/services/pet-ai-api';
import type { PetAiNeedCode, PetAiRecommendationRow } from '@/src/types/pet-ai';

export const dynamic = 'force-dynamic';

/**
 * 引導式問題與後端 needCode 的對照。
 *
 * 這一版不是自由聊天，因此只提供後端支援的四種需求。
 */
const guidedQuestions: {
  needCode: PetAiNeedCode;
  label: string;
  description: string;
}[] = [
  {
    needCode: 'health_based',
    label: '依健康狀況推薦',
    description: '根據健康情況與過敏食材尋找合適商品',
  },
  {
    needCode: 'main_food',
    label: '尋找日常主食',
    description: '推薦適合日常食用的主食商品',
  },
  {
    needCode: 'treat',
    label: '零食與營養補充',
    description: '尋找零食與營養補充選項',
  },
  {
    needCode: 'care',
    label: '保健與生活照護',
    description: '推薦保健品與生活照護用品',
  },
];

/**
 * 根據生日計算目前年齡。
 *
 * 後端回傳的是生日，不會直接儲存寵物年齡。
 */
function formatPetAge(birthday: string | null): string {
  if (!birthday) return '生日未填';

  const birthDate = new Date(birthday);

  if (Number.isNaN(birthDate.getTime())) {
    return '生日格式異常';
  }

  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (today.getDate() < birthDate.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return years > 0 ? `${years} 歲 ${months} 個月` : `${months} 個月`;
}

/** 將 MySQL DECIMAL 字串整理成畫面使用的 kg。 */
function formatPetWeight(weight: string | null): string {
  return weight ? `${Number(weight)} kg` : '體重未填';
}

/**
 * public 裡面的本機圖片需要以 / 開頭。
 *
 * 完整的 http 或 https 圖片網址則直接保留。
 */
function toPublicImagePath(path: string | null): string {
  if (!path) return '';

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return `/${path.replace(/^\/+/, '')}`;
}

export default function PetAiChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 從網址 ?petId=1 取得目前選擇的寵物 ID。
  const petId = Number(searchParams.get('petId'));

  // 儲存後端回傳的寵物、需求及推薦商品。
  const [recommendation, setRecommendation] =
    useState<PetAiRecommendationRow | null>(null);

  // 紀錄目前選中的引導式需求。
  const [selectedNeed, setSelectedNeed] =
    useState<PetAiNeedCode>('health_based');

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 呼叫真正的 AI 推薦 API。
   *
   * 後端會依序完成：
   * 寵物資料查詢 → 商品規則篩選 → Azure 推薦理由。
   */
  const loadRecommendations = useCallback(
    async (needCode: PetAiNeedCode) => {
      if (!Number.isInteger(petId) || petId <= 0) {
        return;
      }

      setSelectedNeed(needCode);
      setErrorMessage('');
      setIsLoading(true);

      try {
        const row = await getPetAiRecommendations({
          petId,
          needCode,
        });

        setRecommendation(row);
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : '目前無法取得 AI 推薦'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [petId]
  );

  /**
   * 第一次進入聊天室時：
   * 1. 檢查 petId
   * 2. 預設執行依健康狀況推薦
   */
  useEffect(() => {
    if (!Number.isInteger(petId) || petId <= 0) {
      router.replace('/member/pets/ai/select-pet');
      return;
    }

    void loadRecommendations('health_based');
  }, [loadRecommendations, petId, router]);

  /**
   * 第一次 API 還沒完成時，尚未取得寵物資料，
   * 先顯示整頁載入或錯誤狀態。
   */
  if (!recommendation) {
    return (
      <section className="w-full">
        <Link
          href="/member/pets/ai/select-pet"
          className="back-button typo-tab inline-flex items-center gap-2"
        >
          <LuArrowLeft className="size-4" aria-hidden="true" />
          返回
        </Link>

        <div className="mt-10 rounded-lg border border-border bg-card-primary p-10 text-center">
          {errorMessage ? (
            <>
              <p className="typo-card-body text-red-700" role="alert">
                {errorMessage}
              </p>

              <button
                type="button"
                className="next-button typo-tab mt-5"
                onClick={() => void loadRecommendations(selectedNeed)}
              >
                重新嘗試
              </button>
            </>
          ) : (
            <p className="typo-card-body text-text-secondary">
              AI 正在分析毛孩資料...
            </p>
          )}
        </div>
      </section>
    );
  }

  const pet = recommendation.pet;

  // 後端已經排除 code 為 none 的選項。
  const healthLabels = pet.healthConditions.map((condition) => condition.label);

  const allergyLabels = pet.allergyIngredients.map(
    (ingredient) => ingredient.label
  );

  return (
    <section className="grid w-full gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* 左側：目前正在替哪一隻毛孩導購 */}
      <aside className="w-full max-w-[280px] justify-self-center lg:max-w-none">
        <Link
          href="/member/pets/ai/select-pet"
          className="back-button typo-tab inline-flex items-center gap-2"
        >
          <LuArrowLeft className="size-4" aria-hidden="true" />
          返回
        </Link>

        <p className="typo-card-body mt-8 text-text-secondary">正在為誰導購</p>

        {/* 毛孩摘要卡 */}
        <div className="mt-4 rounded-lg border border-border bg-card-primary p-4">
          <img
            src={toPublicImagePath(pet.avatarUrl) || '/mofu.svg'}
            alt={pet.name}
            className={`aspect-[4/3] w-full rounded-lg ${
              pet.avatarUrl ? 'object-cover' : 'object-contain p-6'
            }`}
          />

          <div className="mt-4 text-center">
            <h2 className="typo-card-title text-text-primary">{pet.name}</h2>

            <p className="typo-tab mt-1 text-text-secondary">
              {pet.speciesLabel}・{pet.breed || '品種未填'}
            </p>

            <p className="typo-tab mt-3 text-text-secondary">
              {formatPetAge(pet.birthday)}・{formatPetWeight(pet.weight)}
            </p>

            <p className="typo-tab mt-1 text-text-secondary">
              過敏：
              {allergyLabels.length > 0 ? allergyLabels.join('、') : '無註記'}
            </p>
          </div>
        </div>

        {/* AI 已讀取寵物健康資料的提示 */}
        <div className="mt-4 rounded-lg border border-success bg-success p-4">
          <div className="flex items-start gap-2">
            <LuCircleCheck
              className="mt-1 size-5 shrink-0 text-green-700"
              aria-hidden="true"
            />

            <div>
              <h3 className="typo-card-title text-green-800">
                AI 已分析毛孩資料
              </h3>

              <p className="typo-card-body mt-2 text-green-700">
                {healthLabels.length > 0
                  ? `健康需求：${healthLabels.join('、')}`
                  : '目前沒有特殊健康註記'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* 右側：引導式問題選單與推薦結果 */}
      <section className="min-w-0 rounded-lg border border-border bg-card-primary p-5 md:p-6">
        <header>
          <p className="typo-tab text-primary">MOFU AI 導購</p>

          <h1 className="typo-h3 mt-2 text-text-primary">
            想為 {pet.name} 找什麼？
          </h1>

          <p className="typo-card-body mt-2 text-text-secondary">
            選擇一項需求，AI 會重新分析並提供最多三項推薦。
          </p>
        </header>

        {/* 四個按鈕直接對應後端允許的 needCode */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {guidedQuestions.map((question) => {
            const isSelected = selectedNeed === question.needCode;

            return (
              <button
                key={question.needCode}
                type="button"
                aria-pressed={isSelected}
                disabled={isLoading}
                className={`rounded-lg border p-4 text-left transition disabled:cursor-wait disabled:opacity-60 ${
                  isSelected
                    ? 'border-primary bg-card-secondary'
                    : 'border-border bg-white hover:border-primary'
                }`}
                onClick={() => void loadRecommendations(question.needCode)}
              >
                <span className="flex items-center gap-2">
                  <LuSparkles
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />

                  <span className="typo-card-title text-text-primary">
                    {question.label}
                  </span>
                </span>

                <span className="typo-tab mt-2 block text-text-secondary">
                  {question.description}
                </span>
              </button>
            );
          })}
        </div>

        {/*
         * 這個選項不呼叫 AI API。
         * 當四種引導需求都不符合時，直接帶使用者前往客服中心。
         */}
        <Link
          href="/member/support"
          className="typo-card-body mt-3 flex w-full items-center justify-center rounded-lg border border-border bg-white p-4 text-text-secondary transition hover:border-primary hover:text-primary"
        >
          以上都不是我想找的，聯絡客服
        </Link>

        {/* AI 回覆及商品推薦區 */}
        <div className="mt-8 border-t border-border pt-6">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-text-button">
              <LuSparkles className="size-5" aria-hidden="true" />
            </div>

            <div>
              <h2 className="typo-card-title text-text-primary">
                {recommendation.guidedNeed.label}
              </h2>

              <p className="typo-card-body mt-1 text-text-secondary">
                {isLoading
                  ? 'AI 正在重新分析，請稍候...'
                  : `以下是為 ${pet.name} 篩選出的商品。`}
              </p>
            </div>
          </div>

          {/* API 發生錯誤 */}
          {errorMessage && (
            <div className="mt-5 rounded-lg border border-red-300 bg-red-50 p-4">
              <p className="typo-card-body text-red-700" role="alert">
                {errorMessage}
              </p>

              <button
                type="button"
                className="next-button typo-tab mt-3"
                onClick={() => void loadRecommendations(selectedNeed)}
              >
                重新嘗試
              </button>
            </div>
          )}

          {/* 後端沒有找到精準商品 */}
          {!isLoading &&
            !errorMessage &&
            recommendation.products.length === 0 && (
              <div className="mt-5 rounded-lg border border-border bg-white p-6 text-center">
                <p className="typo-card-body text-text-primary">
                  目前沒有找到精準符合條件的商品。
                </p>

                <Link
                  href="/member/support"
                  className="link-button typo-tab mt-4 inline-flex"
                >
                  前往客服中心
                </Link>
              </div>
            )}

          {/* 推薦商品卡 */}
          {!errorMessage && recommendation.products.length > 0 && (
            <div className="mt-6 flex items-stretch gap-5 overflow-x-auto pb-3">
              {recommendation.products.map((product) => (
                <div
                  key={product.productId}
                  className="flex w-[250px] shrink-0 flex-col"
                >
                  <ProductCard
                    product={{
                      id: product.productId,
                      avatar: {
                        thumbnail: toPublicImagePath(product.image),
                      },
                      tags: product.tags.map((tag, index) => ({
                        id: index + 1,
                        tag_ch: tag,
                      })),
                      name: product.name,

                      // 商品卡顯示正式商品簡介。
                      intro: {
                        slogan: product.slogan || product.description,
                      },

                      price: `NT$${product.price.toLocaleString('zh-TW')}`,
                      slug: product.slug,
                      isFavorite: product.isFavorite,
                      petType: {
                        id: product.petTypeId,
                        tag_slug: product.petType,
                      },
                    }}
                    allergyWarning={{
                      petName: pet.name,
                      items: product.allergyRiskItems,
                    }}
                  />

                  {/*
                   * ProductCard 的 description 只有一行，
                   * 因此 AI 推薦理由另外完整顯示。
                   */}
                  <div className="mt-3 flex-1 rounded-lg border border-secondary/20 bg-card-secondary p-3">
                    <p className="typo-tab text-text-secondary">AI 推薦理由</p>

                    <p className="typo-card-body mt-1 text-text-primary">
                      {product.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
