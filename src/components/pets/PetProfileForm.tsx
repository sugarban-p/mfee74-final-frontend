'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LuImagePlus, LuInfo, LuSparkles } from 'react-icons/lu';
import { PetDeleteDialog } from '@/src/components/pets/PetDeleteDialog';
import { createPet, updatePet, uploadPetAvatar } from '@/src/services/pets-api';
import type {
  PetDetail,
  PetFormOptions,
  PetFormPayload,
} from '@/src/types/pet';

type PetProfileFormMode = 'create' | 'view' | 'edit';

interface PetProfileFormProps {
  mode: PetProfileFormMode;

  /**
   * 詳情與編輯模式會收到 GET /api/pets/:petId 的真實資料；
   * 新增模式沒有既有寵物，因此 pet 可以不傳。
   */
  pet?: PetDetail;

  /**
   * GET /api/pets/options 回傳的六組表單選項。
   * 畫面顯示 option.label，送出表單時使用 option.id。
   */
  options: PetFormOptions;
}

const MAX_HEALTH_CONDITIONS = 4;
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_AVATAR_EXTENSIONS = ['jpg', 'jpeg', 'png'];

export function PetProfileForm({ mode, pet, options }: PetProfileFormProps) {
  const router = useRouter();
  const isViewMode = mode === 'view';

  /**
   * selectedAvatarFile 是準備送往後端的新檔案；
   * avatarPreviewUrl 則負責在送出表單前立即顯示預覽。
   */
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null
  );
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(
    pet?.avatarUrl ?? ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 健康情況：
   * 至少選 1 項，最多選 4 項。
   */
  const [selectedHealthConditionIds, setSelectedHealthConditionIds] = useState<
    number[]
  >(() => pet?.healthConditionOptionIds ?? []);

  /**
   * 過敏食材：
   * 至少選 1 項。
   */
  const [selectedAllergyIngredientIds, setSelectedAllergyIngredientIds] =
    useState<number[]>(() => pet?.allergyIngredientOptionIds ?? []);

  /**
   * checkbox 群組錯誤訊息。
   */
  const [healthConditionError, setHealthConditionError] = useState('');
  const [allergyIngredientError, setAllergyIngredientError] = useState('');

  const formTitle =
    mode === 'create' ? '新增毛孩' : mode === 'edit' ? '編輯毛孩' : '寵物詳情';

  const formDescription =
    mode === 'create'
      ? '填寫越完整，AI 商品推薦會越準確。'
      : '查看毛孩的基本資料、健康情況與照護偏好。';

  const inputClass =
    'mt-2 h-11 w-full rounded-full border border-border bg-white px-4 text-sm text-text-primary outline-none placeholder:text-text-secondary/50 disabled:bg-muted disabled:text-text-secondary';

  const selectClass =
    'mt-2 h-11 w-full rounded-full border border-border bg-white px-4 text-sm text-text-primary outline-none disabled:bg-muted disabled:text-text-secondary';

  /**
   * 健康情況 checkbox：
   * - 已選項目可以取消
   * - 未滿 4 項可以新增
   * - 滿 4 項後禁止新增其他項目
   */
  const handleHealthConditionChange = (optionId: number) => {
    setSelectedHealthConditionIds((currentIds) => {
      const isSelected = currentIds.includes(optionId);

      if (isSelected) {
        return currentIds.filter((id) => id !== optionId);
      }

      if (currentIds.length >= MAX_HEALTH_CONDITIONS) {
        return currentIds;
      }

      return [...currentIds, optionId];
    });

    setHealthConditionError('');
  };

  /**
   * 過敏食材 checkbox：
   * 可以自由新增或取消。
   */
  const handleAllergyIngredientChange = (optionId: number) => {
    setSelectedAllergyIngredientIds((currentIds) => {
      const isSelected = currentIds.includes(optionId);

      if (isSelected) {
        return currentIds.filter((id) => id !== optionId);
      }

      return [...currentIds, optionId];
    });

    setAllergyIngredientError('');
  };

  /**
   * 前端先檢查副檔名、MIME 與 5MB，讓使用者立即看到錯誤。
   * 後端仍會再次檢查真實檔案內容，避免只改檔名就繞過限制。
   */
  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    const hasAllowedType = ALLOWED_AVATAR_TYPES.includes(file.type);
    const hasAllowedExtension = ALLOWED_AVATAR_EXTENSIONS.includes(extension);

    if (!hasAllowedType || !hasAllowedExtension) {
      event.currentTarget.value = '';
      toast.error('只支援 JPG、JPEG、PNG 圖片');
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      event.currentTarget.value = '';
      toast.error('圖片大小不可超過 5MB');
      return;
    }

    setSelectedAvatarFile(file);

    // FileReader 產生本機預覽，不會在這一步上傳檔案。
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreviewUrl(String(reader.result ?? ''));
    };
    reader.readAsDataURL(file);
  };

  /**
   * 表單送出：
   * 原生 required 先處理 input / select，
   * checkbox 群組則自行檢查至少選 1 項。
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isViewMode) {
      return;
    }

    const hasHealthCondition = selectedHealthConditionIds.length > 0;
    const hasAllergyIngredient = selectedAllergyIngredientIds.length > 0;

    setHealthConditionError(
      hasHealthCondition ? '' : '請至少選擇 1 項健康情況'
    );

    setAllergyIngredientError(
      hasAllergyIngredient ? '' : '請至少選擇 1 項過敏食材'
    );

    if (!hasHealthCondition || !hasAllergyIngredient) {
      return;
    }

    /**
     * FormData 會根據每個 input、select、textarea 的 name，
     * 讀取使用者目前填寫的值。
     */
    const formData = new FormData(event.currentTarget);
    const breed = String(formData.get('breed') ?? '').trim();
    const specialNote = String(formData.get('specialNote') ?? '').trim();
    const activityLevelValue = String(
      formData.get('activityLevelOptionId') ?? ''
    );

    setIsSubmitting(true);

    try {
      /**
       * 有選新照片才呼叫上傳 API；
       * 編輯時沒有換照片，就保留資料庫原有 avatarUrl。
       */
      const avatarUrl = selectedAvatarFile
        ? await uploadPetAvatar(selectedAvatarFile)
        : (pet?.avatarUrl ?? null);

      /**
       * 將瀏覽器表單值整理成後端 POST、PUT 共用的資料格式。
       * select 與 checkbox 傳選項 id，而不是畫面上的中文文字。
       */
      const payload: PetFormPayload = {
        name: String(formData.get('name') ?? '').trim(),
        avatarUrl,
        speciesOptionId: Number(formData.get('speciesOptionId')),
        breed: breed || null,
        genderOptionId: Number(formData.get('genderOptionId')),
        neuteredOptionId: Number(formData.get('neuteredOptionId')),
        activityLevelOptionId: activityLevelValue
          ? Number(activityLevelValue)
          : null,
        birthday: String(formData.get('birthday') ?? ''),
        weight: Number(formData.get('weight')),
        specialNote: specialNote || null,
        healthConditionOptionIds: selectedHealthConditionIds,
        allergyIngredientOptionIds: selectedAllergyIngredientIds,
      };

      if (mode === 'create') {
        // 新增模式對應 POST /api/pets。
        await createPet(payload);
        toast.success('新增毛孩成功');
      } else {
        if (!pet) {
          throw new Error('缺少要編輯的寵物資料');
        }

        // 編輯模式對應 PUT /api/pets/:petId。
        await updatePet(pet.id, payload);
        toast.success('毛孩資料已更新');
      }

      // API 成功後返回列表，並要求 Next.js 重新取得最新資料。
      router.push('/member/pets/profiles');
      router.refresh();
    } catch (error) {
      // pets-api.ts 會把後端 message 轉成 Error，直接顯示給使用者。
      toast.error(
        error instanceof Error
          ? error.message
          : mode === 'create'
            ? '新增毛孩失敗，請稍後再試'
            : '更新毛孩資料失敗，請稍後再試'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasReachedHealthConditionLimit =
    selectedHealthConditionIds.length >= MAX_HEALTH_CONDITIONS;

  return (
    <section className="w-full">
      {/* 頁面標題與右上操作 */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="typo-h2 text-text-primary">{formTitle}</h1>

          <p className="typo-body mt-4 text-text-secondary">
            {formDescription}
          </p>
        </div>

        <div className="flex gap-3">
          {mode === 'view' ? (
            <button
              type="button"
              onClick={() =>
                router.push(`/member/pets/profiles/${pet?.id}/edit`)
              }
              className="next-button typo-tab"
            >
              編輯資料
            </button>
          ) : (
            <button
              type="submit"
              form="pet-profile-form"
              disabled={isSubmitting}
              className="next-button typo-tab disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? '處理中...'
                : mode === 'create'
                  ? '+ 建立寵物資料'
                  : '儲存變更'}
            </button>
          )}

          <button
            type="button"
            onClick={() => router.back()}
            className="back-button typo-tab"
          >
            取消
          </button>
        </div>
      </div>

      <div className="mt-8 grid justify-items-center gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:justify-items-stretch">
        {/* 左側圖片與 AI 提示 */}
        <aside className="w-full max-w-[420px] space-y-4 lg:max-w-none">
          <div className="rounded-2xl border border-border bg-card-primary p-5">
            <p className="typo-card-title mb-4 text-text-primary">毛孩照片</p>

            <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-card-secondary text-center text-text-secondary">
              {avatarPreviewUrl ? (
                <img
                  src={avatarPreviewUrl}
                  alt={pet?.name || '寵物照片預覽'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div>
                  <LuImagePlus
                    className="mx-auto mb-3 h-8 w-8 text-primary"
                    aria-hidden="true"
                  />

                  <p className="typo-tab">
                    {isViewMode ? '尚未上傳照片' : '點擊上傳照片'}
                  </p>

                  {!isViewMode && (
                    <p className="mt-1 text-xs">JPG、JPEG、PNG，最大 5MB</p>
                  )}
                </div>
              )}

              {/* 新增與編輯模式可點擊整個圖片區選擇照片。 */}
              {!isViewMode && (
                <label className="absolute inset-0 cursor-pointer">
                  <span className="sr-only">選擇寵物照片</span>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={handleAvatarChange}
                    className="sr-only"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-info p-5">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <LuSparkles className="h-4 w-4" aria-hidden="true" />

              <p className="typo-card-title">AI 導購小提示</p>
            </div>

            <p className="typo-card-body text-text-secondary">
              健康情況會對應到商品標籤，例如皮膚敏感會對應 skin-care 與
              hypoallergenic。
            </p>
          </div>
        </aside>

        {/* 右側主要表單 */}
        <form
          id="pet-profile-form"
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card-primary p-8"
        >
          {/* 基本資料 */}
          <div>
            <div className="mb-8 flex items-center gap-2">
              <LuInfo className="h-5 w-5 text-primary" aria-hidden="true" />

              <h2 className="typo-h3 text-text-primary">基本資料</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* 必填 */}
              <label>
                <span className="typo-tab text-text-primary">寵物名字 *</span>

                <input
                  name="name"
                  required
                  disabled={isViewMode}
                  defaultValue={pet?.name ?? ''}
                  placeholder="例：Momo、毛毛"
                  className={inputClass}
                />
              </label>

              {/* 必填 */}
              <label>
                <span className="typo-tab text-text-primary">物種 *</span>

                <select
                  name="speciesOptionId"
                  required
                  disabled={isViewMode}
                  defaultValue={pet?.speciesOptionId ?? ''}
                  className={selectClass}
                >
                  <option value="">請選擇</option>

                  {options.species.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* 非必填 */}
              <label>
                <span className="typo-tab text-text-primary">品種 / 類型</span>

                <input
                  name="breed"
                  disabled={isViewMode}
                  defaultValue={pet?.breed ?? ''}
                  placeholder="例：米克斯、英國短毛貓"
                  className={inputClass}
                />
              </label>

              {/* 必填 */}
              <label>
                <span className="typo-tab text-text-primary">性別 *</span>

                <select
                  name="genderOptionId"
                  required
                  disabled={isViewMode}
                  defaultValue={pet?.genderOptionId ?? ''}
                  className={selectClass}
                >
                  <option value="">請選擇</option>

                  {options.gender.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* 必填 */}
              <label>
                <span className="typo-tab text-text-primary">是否結紮 *</span>

                <select
                  name="neuteredOptionId"
                  required
                  disabled={isViewMode}
                  defaultValue={pet?.neuteredOptionId ?? ''}
                  className={selectClass}
                >
                  <option value="">請選擇</option>

                  {options.neutered.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* 必填 */}
              <label>
                <span className="typo-tab text-text-primary">生日 *</span>

                <input
                  name="birthday"
                  required
                  disabled={isViewMode}
                  type="date"
                  defaultValue={pet?.birthday ?? ''}
                  className={inputClass}
                />
              </label>

              {/* 必填 */}
              <label>
                <span className="typo-tab text-text-primary">體重 *</span>

                <input
                  name="weight"
                  required
                  disabled={isViewMode}
                  type="number"
                  min="0.01"
                  max="999.99"
                  step="0.01"
                  defaultValue={pet?.weight ?? ''}
                  placeholder="例：9.5"
                  className={inputClass}
                />
              </label>

              {/* 非必填 */}
              <label>
                <span className="typo-tab text-text-primary">活動量</span>

                <select
                  name="activityLevelOptionId"
                  disabled={isViewMode}
                  defaultValue={pet?.activityLevelOptionId ?? ''}
                  className={selectClass}
                >
                  <option value="">請選擇</option>

                  {options.activity_level.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* 健康與特殊需求 */}
          <div className="mt-12">
            <div className="mb-8 flex items-center gap-2">
              <LuInfo className="h-5 w-5 text-primary" aria-hidden="true" />

              <h2 className="typo-h3 text-text-primary">健康與特殊需求</h2>
            </div>

            {/* 健康情況：必填，最多 4 項 */}
            <fieldset disabled={isViewMode}>
              <legend className="typo-tab text-text-primary">健康情況 *</legend>

              <p className="mt-1 text-sm text-text-secondary">
                至少選 1 項，一次最多選 {MAX_HEALTH_CONDITIONS} 項
                {!isViewMode && (
                  <span className="ml-2">
                    （已選 {selectedHealthConditionIds.length} /{' '}
                    {MAX_HEALTH_CONDITIONS}）
                  </span>
                )}
              </p>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {options.health_condition.options.map((option) => {
                  const isSelected = selectedHealthConditionIds.includes(
                    option.id
                  );

                  const isDisabled =
                    !isSelected && hasReachedHealthConditionLimit;

                  return (
                    <label
                      key={option.code}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                        isDisabled
                          ? 'bg-muted cursor-not-allowed border-border text-text-secondary/50'
                          : 'cursor-pointer border-border bg-white text-text-secondary'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => handleHealthConditionChange(option.id)}
                      />

                      {option.label}
                    </label>
                  );
                })}
              </div>

              {healthConditionError && (
                <p role="alert" className="mt-2 text-sm text-red-500">
                  {healthConditionError}
                </p>
              )}
            </fieldset>

            {/* 過敏食材：必填 */}
            <fieldset disabled={isViewMode} className="mt-8">
              <legend className="typo-tab text-text-primary">過敏食材 *</legend>

              <p className="mt-1 text-sm text-text-secondary">
                請至少選擇 1 項
              </p>

              <div className="mt-3 grid gap-3 md:grid-cols-4">
                {options.allergy_ingredient.options.map((option) => {
                  const isSelected = selectedAllergyIngredientIds.includes(
                    option.id
                  );

                  return (
                    <label
                      key={option.id}
                      className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm text-text-secondary"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          handleAllergyIngredientChange(option.id)
                        }
                      />

                      {option.label}
                    </label>
                  );
                })}
              </div>

              {allergyIngredientError && (
                <p role="alert" className="mt-2 text-sm text-red-500">
                  {allergyIngredientError}
                </p>
              )}
            </fieldset>

            {/* 非必填 */}
            <label className="mt-8 block">
              <span className="typo-tab text-text-primary">備註</span>

              <textarea
                name="specialNote"
                disabled={isViewMode}
                defaultValue={pet?.specialNote ?? ''}
                placeholder="其他需要記錄的資訊..."
                className="disabled:bg-muted mt-2 min-h-[96px] w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-secondary/50 disabled:text-text-secondary"
              />
            </label>
          </div>

          {/* 刪除是編輯模式專用操作，新增與檢視頁都不會顯示。 */}
          {mode === 'edit' && pet && (
            <div className="mt-12 border-t border-border pt-8">
              <PetDeleteDialog petId={pet.id} petName={pet.name} />
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
