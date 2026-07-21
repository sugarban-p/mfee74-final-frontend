import { notFound } from 'next/navigation';
import { PetProfileForm } from '@/src/components/pets/PetProfileForm';
import { getPetById, getPetOptions } from '@/src/services/pets-api';

interface EditPetProfilePageProps {
  /**
   * 動態路由：
   * /member/pets/profiles/1/edit
   *
   * 會得到 params.petId = "1"。
   */
  params: Promise<{
    petId: string;
  }>;
}

/**
 * 寵物編輯頁。
 *
 * 先取得資料庫中的寵物資料，
 * 再傳給可編輯的 PetProfileForm。
 */
export default async function EditPetProfilePage({
  params,
}: EditPetProfilePageProps) {
  const { petId } = await params;
  const numericPetId = Number(petId);

  if (!Number.isInteger(numericPetId) || numericPetId <= 0) {
    notFound();
  }

  try {
    const [pet, options] = await Promise.all([
      getPetById(numericPetId),
      getPetOptions(),
    ]);

    return <PetProfileForm mode="edit" pet={pet} options={options} />;
  } catch {
    notFound();
  }
}
