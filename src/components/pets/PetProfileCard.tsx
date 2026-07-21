import Link from 'next/link';
import { LuCalendar, LuWeight } from 'react-icons/lu';
import type { PetItem, PetListItem } from '@/src/types/pet';

interface PetProfileCardProps {
  /**
   * 暫時同時接受：
   * PetItem：舊 mock data
   * PetListItem：真實後端 API
   *
   * 等所有頁面不再使用 mockPets 後，
   * 就可以只保留 PetListItem。
   */
  pet: PetItem | PetListItem;

  /**
   * 卡片底部按鈕要前往哪裡。
   * 沒有傳入時，預設前往寵物詳情頁。
   */
  actionHref?: string;

  /**
   * 卡片底部按鈕文字。
   */
  actionText?: string;
}

/**
 * 後端目前只回傳 birthday，不會直接回傳 age。
 * 因此前端依生日計算年齡。
 */
function formatPetAge(birthday: string | null): string {
  if (!birthday) {
    return '生日未填';
  }

  const birthDate = new Date(`${birthday}T00:00:00`);
  const today = new Date();

  if (Number.isNaN(birthDate.getTime())) {
    return '生日格式錯誤';
  }

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  /**
   * 如果今天的日期還沒到出生日期，
   * 代表目前這個月尚未滿，要少算一個月。
   */
  if (today.getDate() < birthDate.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years <= 0) {
    return `${Math.max(months, 0)} 個月`;
  }

  return `${years} 歲 ${months} 個月`;
}

/**
 * 將後端的 DECIMAL 字串轉成畫面文字。
 *
 * 後端可能回傳 "4.80"；
 * 畫面顯示成 "4.8 kg"。
 */
function formatPetWeight(weight: string | null): string {
  if (!weight) {
    return '體重未填';
  }

  // 舊 mock data 已經包含 kg，不需要重複加入。
  if (weight.toLowerCase().includes('kg')) {
    return weight;
  }

  const numericWeight = Number(weight);

  if (!Number.isFinite(numericWeight)) {
    return weight;
  }

  return `${numericWeight} kg`;
}

export function PetProfileCard({
  pet,
  actionHref = `/member/pets/profiles/${pet.id}`,
  actionText = '查看詳情',
}: PetProfileCardProps) {
  /**
   * 舊 mock data 有 age；
   * 真實 API 沒有 age，所以改由 birthday 計算。
   */
  const age =
    'age' in pet && pet.age ? pet.age : formatPetAge(pet.birthday);

  const weight = formatPetWeight(pet.weight);
  const avatarUrl = pet.avatarUrl || '/mofu.svg';

  return (
    <article className="w-[260px] rounded-2xl bg-white p-4 shadow-sm">
      <div className="h-[140px] w-full overflow-hidden rounded-xl bg-card-secondary">
        <img
          src={avatarUrl}
          alt={pet.name}
          className={`h-full w-full ${
            pet.avatarUrl ? 'object-cover' : 'object-contain p-6'
          }`}
        />
      </div>

      <div className="mt-4 text-center">
        <h3 className="typo-card-title text-text-primary">{pet.name}</h3>

        <p className="typo-tab mt-1 text-text-secondary">
          {pet.species}
          {pet.breed ? `・${pet.breed}` : ''}
        </p>

        {/* 年齡與體重 */}
        <div className="mt-3 flex items-center justify-center gap-4 text-sm text-text-secondary">
          <span className="flex items-center gap-1">
            <LuCalendar className="h-4 w-4" aria-hidden="true" />
            {age}
          </span>

          <span className="flex items-center gap-1">
            <LuWeight className="h-4 w-4" aria-hidden="true" />
            {weight}
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