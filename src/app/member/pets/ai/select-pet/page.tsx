import Link from 'next/link';
import { LuPlus } from 'react-icons/lu';
import { PetProfileCard } from '@/src/components/pets/PetProfileCard';
import { mockPets } from '@/src/mockdata/mock-pets';

export default function SelectPetForAiPage() {
  return (
    <section className="w-full">
      {/* 返回：回到 AI 導購介紹頁 */}
      <Link
        href="/member/pets/ai"
        className="back-button typo-tab inline-flex"
      >
        ← 返回
      </Link>

      {/* 頁面標題 */}
      <section className="mt-8">
        <h1 className="typo-h2 text-text-primary">選擇要購物的毛孩</h1>

        <p className="typo-body mt-3 text-text-secondary">
          選擇後，AI 會根據牠的狀況提供個人化推薦。
        </p>
      </section>

      {/* 毛孩卡片列表 */}
      <section className="mt-10 flex flex-wrap gap-8">
        {mockPets.map((pet) => (
          <PetProfileCard
            key={pet.id}
            pet={pet}
            actionHref={`/member/pets/ai/chat?petId=${pet.id}`}
            actionText="選擇這隻毛孩"
          />
        ))}

        {/* 新增毛孩入口：直接導向既有的新增寵物頁面 */}
        <Link
          href="/member/pets/profiles/new"
          className="flex w-[260px] flex-col items-center justify-center rounded-2xl border border-border bg-white p-6 text-center transition hover:border-primary"
        >
          <div className="flex h-[140px] w-full items-center justify-center rounded-xl bg-card-secondary text-text-primary">
            <LuPlus className="h-8 w-8" aria-hidden="true" />
          </div>

          <span className="next-button typo-tab mt-8 inline-flex items-center gap-2">
            <LuPlus className="h-4 w-4" aria-hidden="true" />
            新增毛孩
          </span>
        </Link>
      </section>
    </section>
  );
}
