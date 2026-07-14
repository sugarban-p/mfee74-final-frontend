import { notFound } from 'next/navigation';
import { PetProfileForm } from '@/src/components/pets/PetProfileForm';
import { mockPets } from '@/src/mockdata/mock-pets';

interface PetProfileDetailPageProps {
  /**
   * Next.js 動態路由參數。
   *
   * 這個頁面的資料夾是 [petId]，
   * 所以網址 /member/pets/profiles/1
   * 會拿到 params.petId = '1'。
   */
  params: Promise<{
    petId: string;
  }>;
}

export default async function PetProfileDetailPage({
  params,
}: PetProfileDetailPageProps) {
  /**
   * Next 16 裡 params 是 Promise，
   * 所以要先 await 取出 petId。
   */
  const { petId } = await params;

  /**
   * 目前先從 mockPets 找資料。
   * 之後串 API 時，這裡會改成 fetch /api/pets/:petId。
   */
  const pet = mockPets.find((item) => item.id === Number(petId));

  /**
   * 如果網址裡的 petId 找不到資料，
   * 就顯示 Next.js 的 not found 頁。
   */
  if (!pet) {
    notFound();
  }

  /**
   * mode="view"：
   * 代表這頁是詳情頁，表單欄位會 disabled，不能編輯。
   */
  return <PetProfileForm mode="view" pet={pet} />;
}