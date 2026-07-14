'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LuImagePlus, LuInfo, LuSparkles } from 'react-icons/lu';
import type { PetItem } from '@/src/types/pet';

type PetProfileFormMode = 'create' | 'view' | 'edit';

interface PetProfileFormProps {
  mode: PetProfileFormMode;
  pet?: PetItem;
}

const speciesOptions = ['狗狗', '貓咪'];
const genderOptions = ['男生', '女生', '未知'];
const neuteredOptions = ['已結紮', '未結紮', '不確定'];
const activityLevelOptions = ['低', '中', '高'];

const MAX_HEALTH_CONDITIONS = 4;

const healthConditionOptions = [
  { label: '皮膚敏感', code: 'skin_sensitive' },
  { label: '腸胃敏感', code: 'sensitive_stomach' },
  { label: '容易掉毛', code: 'shedding' },
  { label: '毛球困擾', code: 'hairball' },
  { label: '體重控制', code: 'weight_control' },
  { label: '關節保健', code: 'joint_care' },
  { label: '牙齒保健', code: 'dental_care' },
  { label: '挑食', code: 'picky_eater' },
  { label: '泌尿道保健', code: 'urinary_care' },
  { label: '情緒緊張 / 壓力', code: 'stress_anxiety' },
  { label: '眼睛保健', code: 'eye_care' },
  { label: '無特殊狀況', code: 'none' },
];

const allergyIngredientOptions = [
  '雞肉',
  '牛肉',
  '魚肉',
  '羊肉',
  '穀物',
  '乳製品',
  '蛋',
  '無',
];

export function PetProfileForm({ mode, pet }: PetProfileFormProps) {
  const router = useRouter();
  const isViewMode = mode === 'view';

  /**
   * 健康情況：
   * 至少選 1 項，最多選 4 項。
   */
  const [selectedHealthConditions, setSelectedHealthConditions] = useState<
    string[]
  >(() => pet?.healthConditions ?? []);

  /**
   * 過敏食材：
   * 至少選 1 項。
   */
  const [selectedAllergyIngredients, setSelectedAllergyIngredients] = useState<
    string[]
  >(() => pet?.allergyIngredients ?? []);

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
  const handleHealthConditionChange = (condition: string) => {
    setSelectedHealthConditions((currentConditions) => {
      const isSelected = currentConditions.includes(condition);

      if (isSelected) {
        return currentConditions.filter((item) => item !== condition);
      }

      if (currentConditions.length >= MAX_HEALTH_CONDITIONS) {
        return currentConditions;
      }

      return [...currentConditions, condition];
    });

    setHealthConditionError('');
  };

  /**
   * 過敏食材 checkbox：
   * 可以自由新增或取消。
   */
  const handleAllergyIngredientChange = (ingredient: string) => {
    setSelectedAllergyIngredients((currentIngredients) => {
      const isSelected = currentIngredients.includes(ingredient);

      if (isSelected) {
        return currentIngredients.filter((item) => item !== ingredient);
      }

      return [...currentIngredients, ingredient];
    });

    setAllergyIngredientError('');
  };

  /**
   * 表單送出：
   * 原生 required 先處理 input / select，
   * checkbox 群組則自行檢查至少選 1 項。
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isViewMode) {
      return;
    }

    const hasHealthCondition = selectedHealthConditions.length > 0;
    const hasAllergyIngredient = selectedAllergyIngredients.length > 0;

    setHealthConditionError(
      hasHealthCondition ? '' : '請至少選擇 1 項健康情況'
    );

    setAllergyIngredientError(
      hasAllergyIngredient ? '' : '請至少選擇 1 項過敏食材'
    );

    if (!hasHealthCondition || !hasAllergyIngredient) {
      return;
    }

    try {
      /**
       * TODO：
       * 之後在這裡串接 API。
       *
       * 目前先做 demo：
       * 表單驗證通過後，直接顯示成功 toast。
       */
      toast.success(mode === 'create' ? '新增毛孩成功' : '毛孩資料已更新');

      /**
       * 新增或編輯成功後，導回毛孩檔案管理頁。
       * 之後串 API 時，這行要放在 API 成功之後。
       */
      router.push('/member/pets/profiles');
    } catch (error) {
      /**
       * TODO：
       * 之後串接 API 時，如果後端回傳失敗，
       * 就會進到 catch，並顯示失敗 toast。
       */
      toast.error(
        mode === 'create'
          ? '新增毛孩失敗，請稍後再試'
          : '更新毛孩資料失敗，請稍後再試'
      );
    }
  };

  const hasReachedHealthConditionLimit =
    selectedHealthConditions.length >= MAX_HEALTH_CONDITIONS;

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
              className="next-button typo-tab"
            >
              {mode === 'create' ? '+ 建立寵物資料' : '儲存變更'}
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

            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-card-secondary text-center text-text-secondary">
              {pet?.avatarUrl ? (
                <img
                  src={pet.avatarUrl}
                  alt={pet.name}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <div>
                  <LuImagePlus
                    className="mx-auto mb-3 h-8 w-8 text-primary"
                    aria-hidden="true"
                  />

                  <p className="typo-tab">點擊上傳照片</p>

                  <p className="mt-1 text-xs">JPG、PNG，最大 5MB</p>
                </div>
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
                  required
                  disabled={isViewMode}
                  defaultValue={pet?.species ?? ''}
                  className={selectClass}
                >
                  <option value="">請選擇</option>

                  {speciesOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              {/* 非必填 */}
              <label>
                <span className="typo-tab text-text-primary">品種 / 類型</span>

                <input
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
                  required
                  disabled={isViewMode}
                  defaultValue={pet?.gender ?? ''}
                  className={selectClass}
                >
                  <option value="">請選擇</option>

                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              {/* 必填 */}
              <label>
                <span className="typo-tab text-text-primary">是否結紮 *</span>

                <select
                  required
                  disabled={isViewMode}
                  defaultValue={pet?.neutered ?? ''}
                  className={selectClass}
                >
                  <option value="">請選擇</option>

                  {neuteredOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              {/* 必填 */}
              <label>
                <span className="typo-tab text-text-primary">生日 *</span>

                <input
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
                  required
                  disabled={isViewMode}
                  defaultValue={pet?.weight ?? ''}
                  placeholder="例：9.5 kg"
                  className={inputClass}
                />
              </label>

              {/* 非必填 */}
              <label>
                <span className="typo-tab text-text-primary">活動量</span>

                <select
                  disabled={isViewMode}
                  defaultValue={pet?.activityLevel ?? ''}
                  className={selectClass}
                >
                  <option value="">請選擇</option>

                  {activityLevelOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
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
                    （已選 {selectedHealthConditions.length} /{' '}
                    {MAX_HEALTH_CONDITIONS}）
                  </span>
                )}
              </p>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {healthConditionOptions.map((option) => {
                  const isSelected = selectedHealthConditions.includes(
                    option.label
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
                        onChange={() =>
                          handleHealthConditionChange(option.label)
                        }
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
                {allergyIngredientOptions.map((ingredient) => {
                  const isSelected =
                    selectedAllergyIngredients.includes(ingredient);

                  return (
                    <label
                      key={ingredient}
                      className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm text-text-secondary"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          handleAllergyIngredientChange(ingredient)
                        }
                      />

                      {ingredient}
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
                disabled={isViewMode}
                defaultValue={pet?.specialNote ?? ''}
                placeholder="其他需要記錄的資訊..."
                className="disabled:bg-muted mt-2 min-h-[96px] w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-secondary/50 disabled:text-text-secondary"
              />
            </label>
          </div>
        </form>
      </div>
    </section>
  );
}
