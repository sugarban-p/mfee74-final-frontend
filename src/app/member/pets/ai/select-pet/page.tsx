import Link from 'next/link';
import { LuCirclePlus } from 'react-icons/lu';
import { PetProfileCard } from '@/src/components/pets/PetProfileCard';
import { mockPets } from '@/src/mockdata/mock-pets';

export default function SelectPetForAiPage() {
  return (
    <section className="w-full">
      {/* 返回：回到 AI 導購介紹頁 */}
      <Link href="/member/pets/ai" className="back-button typo-tab inline-flex">
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
      </section>
    </section>
  );
}
