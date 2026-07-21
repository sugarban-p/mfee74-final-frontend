'use client';

import { useEffect, useState } from 'react';
import { PetProfileForm } from '@/src/components/pets/PetProfileForm';
import { getPetOptions } from '@/src/services/pets-api';
import type { PetFormOptions } from '@/src/types/pet';

export default function NewPetProfilePage() {
  const [options, setOptions] = useState<PetFormOptions | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // 表單選項也需要登入，因此由瀏覽器帶 Cookie 呼叫私人 API。
  useEffect(() => {
    getPetOptions()
      .then(setOptions)
      .catch((error: unknown) => {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '目前無法取得毛孩表單選項，請稍後再試'
        );
      });
  }, []);

  if (errorMessage) {
    return (
      <p className="typo-card-body text-red-700" role="alert">
        {errorMessage}
      </p>
    );
  }

  if (!options) {
    return <p className="typo-card-body text-text-secondary">讀取中...</p>;
  }

  return <PetProfileForm mode="create" options={options} />;
}
