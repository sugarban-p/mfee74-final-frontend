import { notFound } from 'next/navigation';
import { PetProfileForm } from '@/src/components/pets/PetProfileForm';
import { getPetById, getPetOptions } from '@/src/services/pets-api';

interface PetProfileDetailPageProps {
  /**
   * 動態路由：
   * /member/pets/profiles/1
   *
   * 會得到 params.petId = "1"。
   */
  params: Promise<{
    petId: string;
  }>;
}

/**
 * 寵物詳情頁。
 *
 * Server Component 會先向後端取得寵物資料，
 * 再將資料傳入 PetProfileForm。
 */
export default async function PetProfileDetailPage({
  params,
}: PetProfileDetailPageProps) {
  const { petId } = await params;
  const numericPetId = Number(petId);

  /**
   * 避免 /profiles/abc 或負數 id 被送到後端。
   */
  if (!Number.isInteger(numericPetId) || numericPetId <= 0) {
    notFound();
  }

  try {
    // 兩支互不相依的 GET API 同時執行，避免一支完成後才跑另一支。
    const [pet, options] = await Promise.all([
      getPetById(numericPetId),
      getPetOptions(),
    ]);

    return <PetProfileForm mode="view" pet={pet} options={options} />;
  } catch {
    /**
     * 寵物不存在、已被軟刪除或不屬於目前會員時，
     * 顯示 Next.js Not Found。
     */
    notFound();
  }
}
