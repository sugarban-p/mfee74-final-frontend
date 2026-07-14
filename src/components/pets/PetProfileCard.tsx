import Link from 'next/link';
import { LuCalendar, LuWeight } from 'react-icons/lu';
import type { PetItem } from '@/src/types/pet';

interface PetProfileCardProps {
  pet: PetItem;

  /**
   * actionHref：
   * 卡片底部按鈕要前往哪裡。
   * 如果沒有傳入，就預設前往寵物詳情頁。
   */
  actionHref?: string;

  /**
   * actionText：
   * 卡片底部按鈕文字。
   * 如果沒有傳入，就預設顯示「查看詳情」。
   */
  actionText?: string;
}

export function PetProfileCard({
  pet,
  actionHref = `/member/pets/profiles/${pet.id}`,
  actionText = '查看詳情',
}: PetProfileCardProps) {
  return (
    <article className="w-[260px] rounded-2xl bg-white p-4 shadow-sm">
      <img
        src={pet.avatarUrl}
        alt={pet.name}
        className="h-[140px] w-full rounded-xl object-cover"
      />

      <div className="mt-4 text-center">
        <h3 className="typo-card-title text-text-primary">{pet.name}</h3>

        <p className="typo-tab mt-1 text-text-secondary">
          {pet.species}・{pet.breed}
        </p>

        {/* 年齡與體重：用 icon 幫助使用者快速掃讀毛孩狀態 */}
        <div className="mt-3 flex items-center justify-center gap-4 text-sm text-text-secondary">
          <span className="flex items-center gap-1">
            <LuCalendar className="h-4 w-4" aria-hidden="true" />
            {pet.age}
          </span>

          <span className="flex items-center gap-1">
            <LuWeight className="h-4 w-4" aria-hidden="true" />
            {pet.weight}
          </span>
        </div>
      </div>

      <Link
        href={actionHref}
        className="link-button typo-tab mt-5 inline-block w-full"
      >
        {actionText}
      </Link>
    </article>
  );
}
