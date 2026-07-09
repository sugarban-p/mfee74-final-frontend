import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LuArrowLeft, LuCircleCheck, LuSend, LuSparkles } from 'react-icons/lu';
import { ProductCard } from '@/src/components/product/ProductCard';
import { mockPets } from '@/src/mockdata/mock-pets';

/**
 * RecommendedProduct：
 * 目前先做「假商品資料」，資料格式要對齊組員的 ProductCard。
 *
 * 等組員的產品卡與產品 API 完成後，
 * 這裡只要把 recommendedProducts 換成 API 回傳資料即可。
 */
interface RecommendedProduct {
  image: string;
  tags: string[];
  name: string;
  description: string;
  price: string;
}

/**
 * PetAiChatPageProps：
 * 這頁的網址長這樣：
 * /member/pets/ai/chat?petId=1
 *
 * petId 不是動態路由資料夾，
 * 而是 query string，所以要從 searchParams 取得。
 */
interface PetAiChatPageProps {
  searchParams: Promise<{
    petId?: string;
  }>;
}

/**
 * quickQuestions：
 * 底部的快速問題。
 *
 * 現在只是畫面展示。
 * 之後如果要真的點擊後送出訊息，
 * 這一塊會需要拆成 client component。
 */
const quickQuestions = [
  '幫我推薦適合的飼料',
  '有沒有適合敏感腸胃的零食？',
  '想找體重控制商品',
  '關節保健商品推薦',
];

/**
 * recommendedProducts：
 * 暫時的推薦商品卡片資料。
 *
 * 之後這裡會被真正的產品資料取代。
 */
const recommendedProducts: RecommendedProduct[] = [
  {
    image: '',
    tags: ['低敏', '腸胃照護'],
    name: '低敏腸胃照護飼料',
    description: '適合腸胃敏感與需要溫和配方的毛孩。',
    price: 'NT$999',
  },
  {
    image: '',
    tags: ['皮膚', '毛髮保健'],
    name: '皮膚毛髮保健配方',
    description: '幫助維持皮膚健康與毛髮光澤。',
    price: 'NT$1,280',
  },
];

export default async function PetAiChatPage({
  searchParams,
}: PetAiChatPageProps) {
  /**
   * Next 16 裡 searchParams 是 Promise，
   * 所以要先 await 才能拿到 petId。
   */
  const { petId } = await searchParams;

  /**
   * petId 從網址來時會是 string，
   * mockPets 裡的 id 是 number，
   * 所以這裡用 Number(petId) 轉成數字再比對。
   */
  const pet = mockPets.find((item) => item.id === Number(petId));

  /**
   * 如果網址沒有 petId，或 petId 找不到對應毛孩，
   * 就顯示 Next.js 的 not found 頁。
   */
  if (!pet) {
    notFound();
  }

  return (
    <section className="grid w-full justify-items-center gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:justify-items-stretch">
      {/* 左側：目前正在幫哪一隻毛孩導購 */}
      <aside className="w-full max-w-[280px] lg:max-w-none">
        <Link
          href="/member/pets/ai/select-pet"
          className="back-button typo-tab inline-flex items-center gap-2"
        >
          <LuArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回
        </Link>

        <p className="typo-card-body mt-8 text-text-secondary">正在為誰導購</p>

        {/* 毛孩摘要卡 */}
        <div className="mt-4 rounded-2xl border border-border bg-card-primary p-4">
          <img
            src={pet.avatarUrl}
            alt={pet.name}
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />

          <div className="mt-4 text-center">
            <h2 className="typo-card-title text-text-primary">{pet.name}</h2>

            <p className="typo-tab mt-1 text-text-secondary">
              {pet.species}・{pet.breed}
            </p>

            <div className="typo-tab mt-3 space-y-1 text-text-secondary">
              <p>
                {pet.age} ・ {pet.weight}
              </p>

              <p>
                飲食：
                {pet.allergyIngredients.length > 0
                  ? `避開 ${pet.allergyIngredients.join('、')}`
                  : '無特殊過敏註記'}
              </p>
            </div>
          </div>
        </div>

        {/* AI 分析狀態提示 */}
        <div className="mt-4 rounded-2xl border border-success bg-success p-4">
          <div className="flex items-start gap-2">
            <LuCircleCheck
              className="mt-1 h-5 w-5 shrink-0 text-green-700"
              aria-hidden="true"
            />

            <div>
              <h3 className="typo-card-title text-green-800">
                AI 已分析毛孩資料
              </h3>

              <p className="typo-card-body mt-2 text-green-700">
                推薦會自動參考健康情況、過敏食材與基本資料。
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* 右側：聊天室主區塊 */}
      <section className="flex min-h-[680px] flex-col rounded-2xl border border-border bg-card-primary">
        {/* 訊息區 */}
        <div className="flex-1 space-y-5 p-6">
          {/* AI 第一段訊息 */}
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-text-button">
              <LuSparkles className="h-5 w-5" aria-hidden="true" />
            </div>

            <div>
              <div className="max-w-[620px] space-y-2 rounded-2xl border border-border bg-white px-5 py-4">
                <p className="typo-card-body text-text-primary">
                  嗨！我是 MOFU 的 AI 導購助理。
                </p>

                <p className="typo-card-body text-text-primary">
                  我已經了解{pet.name}的狀況了：
                  {pet.healthConditions.length > 0
                    ? `目前有 ${pet.healthConditions.join('、')} 的需求。`
                    : '目前沒有特殊健康註記。'}
                </p>

                <p className="typo-card-body text-text-primary">
                  請告訴我您想找什麼商品，或點擊下方快速問題開始。
                </p>
              </div>

              <p className="typo-tab mt-2 text-text-secondary">下午 08:45</p>
            </div>
          </div>

          {/* AI 推薦說明訊息 */}
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-text-button">
              <LuSparkles className="h-5 w-5" aria-hidden="true" />
            </div>

            <div>
              <div className="max-w-[560px] rounded-2xl border border-border bg-white px-5 py-4">
                <p className="typo-card-body text-text-primary">
                  找到幾款適合{pet.name}的商品，推薦原因會依照毛孩資料產生。
                </p>
              </div>

              <p className="typo-tab mt-2 text-text-secondary">下午 08:45</p>
            </div>
          </div>

          {/**
           * 推薦商品區：
           * 這裡改用組員提供的 ProductCard。
           *
           * 現在 recommendedProducts 還是假資料；
           * 之後 AI / 後端回傳推薦商品時，只要讓資料格式符合 ProductCard 需要的 product 物件即可。
           */}
          <div className="flex flex-wrap gap-5 pl-[52px]">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </div>

        {/* 底部輸入區 */}
        <div className="border-t border-border p-4">
          {/* 快速問題 */}
          <div className="mb-3 flex flex-wrap gap-2">
            {quickQuestions.map((question) => (
              <button
                key={question}
                type="button"
                className="typo-tab rounded-full border border-primary bg-white px-4 py-2 text-primary transition hover:bg-button-secondary-hover"
              >
                {question}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder={`詢問 AI 為 ${pet.name} 推薦商品...`}
              className="typo-card-body h-12 min-w-0 flex-1 rounded-full border border-border bg-white px-5 text-text-primary outline-none placeholder:text-text-secondary/60 focus:border-primary"
            />

            <button
              type="button"
              aria-label="送出訊息"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-button-disabled text-text-secondary transition hover:bg-primary hover:text-text-button"
            >
              <LuSend className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}
