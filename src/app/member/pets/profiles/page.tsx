import Link from 'next/link';
import { LuArrowLeft, LuCirclePlus } from 'react-icons/lu';
import { PetProfileCard } from '@/src/components/pets/PetProfileCard';
import { mockPets } from '@/src/mockdata/mock-pets';

export default function PetProfilesPage() {
  return (
    /**
     * 這頁一樣被 src/app/member/layout.tsx 包住，
     * 所以只需要 w-full，讓它吃滿 sidebar 右側內容。
     */
    <section className="w-full">
      {/* Page Header：返回、頁面標題、主要新增按鈕 */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          {/**
           * 返回：
           * 回到 /member/pets Dashboard。
           * 使用 Link 而不是 button，是因為這是頁面導覽。
           */}
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

        <Link
          href="/member/pets/profiles/new"
          className="next-button typo-tab inline-flex items-center gap-2"
        >
          <LuCirclePlus className="h-4 w-4" aria-hidden="true" />
          新增毛孩
        </Link>
      </div>

      {/* Card List：顯示目前所有毛孩檔案 */}
      <div className="mt-16 flex flex-wrap gap-8">
        {mockPets.map((pet) => (
          <PetProfileCard key={pet.id} pet={pet} />
        ))}

        {/**
         * 新增毛孩卡片：
         * 這是一個視覺入口，跟右上角的新增按鈕做同一件事。
         * 讓使用者在看完現有毛孩後，也可以直接新增。
         */}
        <Link
          href="/member/pets/profiles/new"
          className="flex w-[260px] flex-col items-center justify-center rounded-2xl border border-border bg-card-primary p-4 text-center transition hover:border-primary"
        >
          <div className="flex h-[140px] w-full items-center justify-center rounded-xl bg-card-secondary text-primary">
            <LuCirclePlus className="h-8 w-8" aria-hidden="true" />
          </div>

          <span className="next-button typo-tab mt-8 inline-flex items-center gap-2">
            <LuCirclePlus className="h-4 w-4" aria-hidden="true" />
            新增毛孩
          </span>
        </Link>
      </div>
    </section>
  );
}
