'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PetProfileForm } from '@/src/components/pets/PetProfileForm';
import { getPetById, getPetOptions } from '@/src/services/pets-api';
import type { PetDetail, PetFormOptions } from '@/src/types/pet';

export default function PetProfileDetailPage() {
  const { petId } = useParams<{ petId: string }>();
  const numericPetId = Number(petId);
  const [pet, setPet] = useState<PetDetail | null>(null);
  const [options, setOptions] = useState<PetFormOptions | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!Number.isInteger(numericPetId) || numericPetId <= 0) {
      setErrorMessage('寵物編號格式不正確');
      return;
    }

    Promise.all([getPetById(numericPetId), getPetOptions()])
      .then(([petData, optionData]) => {
        setPet(petData);
        setOptions(optionData);
      })
      .catch((error: unknown) => {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '目前無法取得毛孩資料，請稍後再試'
        );
      });
  }, [numericPetId]);

  if (errorMessage) {
    return (
      <p className="typo-card-body text-red-700" role="alert">
        {errorMessage}
      </p>
    );
  }

  if (!pet || !options) {
    return <p className="typo-card-body text-text-secondary">讀取中...</p>;
  }

  return <PetProfileForm mode="view" pet={pet} options={options} />;
}
