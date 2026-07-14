import { notFound } from 'next/navigation';
import { PetProfileForm } from '@/src/components/pets/PetProfileForm';
import { mockPets } from '@/src/mockdata/mock-pets';

interface EditPetProfilePageProps {
  /**
   * 這個頁面路徑是：
   * /member/pets/profiles/[petId]/edit
   *
   * 所以 petId 會從網址取得。
   */
  params: Promise<{
    petId: string;
  }>;
}

export default async function EditPetProfilePage({
  params,
}: EditPetProfilePageProps) {
  /**
   * 取得網址上的 petId。
   */
  const { petId } = await params;

  /**
   * 目前先從 mockPets 找對應寵物。
   * 之後會改成向後端 API 要單一寵物資料。
   */
  const pet = mockPets.find((item) => item.id === Number(petId));

  /**
   * 如果找不到這隻寵物，就顯示 not found。
   */
  if (!pet) {
    notFound();
  }

  /**
   * mode="edit"：
   * 代表這頁是編輯頁，表單欄位可以修改。
   */
  return <PetProfileForm mode="edit" pet={pet} />;
}
