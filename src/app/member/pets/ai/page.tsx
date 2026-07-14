import Link from 'next/link';
import { LuSparkles, LuPawPrint } from 'react-icons/lu';

/**
 * aiQuestions：
 * 這裡先放靜態問題範例。
 * 之後如果真的串 AI，可以把點擊問題後帶進聊天室當作預設 prompt。
 */
const aiQuestions = [
  '推薦適合我們家寵物的飼料?',
  '我家毛孩皮膚敏感適合什麼？',
  '有沒有適合挑食毛孩的商品？',
  '想找關節保健相關商品',
  '幫我避開過敏食材',
  '依照年齡推薦日常照護商品',
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

      {/* 問題範例：讓使用者知道 AI 可以問什麼 */}
      <section className="mx-auto mt-20 max-w-[980px]">
        <h2 className="typo-h3 text-center text-text-primary">
          可以問AI什麼？
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {aiQuestions.map((question) => (
            <div
              key={question}
              className="typo-card-body flex items-center gap-2 rounded-2xl border border-border bg-white px-5 py-4 text-text-primary"
            >
              <p>
                <LuPawPrint />
              </p>
              <p>{question}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
