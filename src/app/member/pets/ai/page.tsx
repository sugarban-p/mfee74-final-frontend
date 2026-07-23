import Link from 'next/link';
import { LuSparkles, LuPawPrint } from 'react-icons/lu';

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
  return (
    <section className="w-full">
      {/* 返回：回到寵物 dashboard */}
      <Link href="/member/pets" className="back-button typo-tab inline-flex">
        ← 返回
      </Link>

      {/* Hero：AI 導購入口說明 */}
      <section className="mx-auto mt-10 max-w-[760px] text-center">
        <h1 className="typo-h2 text-text-primary">
          讓 AI 為您的毛孩
          <br />
          找到最適合的商品
        </h1>

        <p className="typo-body mt-6 text-text-secondary">
          根據毛孩的品種、年齡、健康狀況、過敏資訊與飲食偏好， AI
          會為牠量身推薦適合的商品，並說明推薦原因。
        </p>

        <Link
          href="/member/pets/ai/select-pet"
          className="next-button typo-tab mt-8 inline-flex items-center gap-2"
        >
          <LuSparkles className="h-4 w-4" aria-hidden="true" />
          選擇毛孩，開始AI導購
        </Link>
      </section>

      {/* 功能說明：清楚呈現目前採用的是引導式導購，不是自由對話 */}
      <section className="mx-auto mt-20 max-w-[980px]">
        <h2 className="typo-h3 text-center text-text-primary">
          AI 導購可以怎麼幫您？
        </h2>

        <p className="typo-card-body mt-3 text-center text-text-secondary">
          選擇毛孩後，再從四種需求中選擇一項開始導購。
        </p>

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

        <p className="typo-card-body mt-6 text-center text-text-secondary">
          沒有符合的需求也沒關係，進入導購後可直接前往客服中心。
        </p>
      </section>
    </section>
  );
}
