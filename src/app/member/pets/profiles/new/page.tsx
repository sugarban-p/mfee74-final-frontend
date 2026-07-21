import { PetProfileForm } from '@/src/components/pets/PetProfileForm';
import { getPetOptions } from '@/src/services/pets-api';

/**
 * 新增寵物頁。
 * Server Component 先向後端取得表單選項，再交給表單顯示。
 */
export default async function NewPetProfilePage() {
  const options = await getPetOptions();

  return <PetProfileForm mode="create" options={options} />;
}
