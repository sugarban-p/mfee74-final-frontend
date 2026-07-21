'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AlertDialog } from 'radix-ui';
import { LuTriangleAlert, LuTrash2 } from 'react-icons/lu';
import { deletePet } from '@/src/services/pets-api';

interface PetDeleteDialogProps {
  petId: number;
  petName: string;
}

/**
 * 編輯寵物頁專用的刪除確認視窗。
 * AlertDialog 會處理焦點鎖定、鍵盤操作與無障礙語意，外觀仍由 Tailwind 控制。
 */
export function PetDeleteDialog({ petId, petName }: PetDeleteDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * 使用 DELETE method 呼叫後端的軟刪除 API。
   * 後端只會更新 is_deleted 與 deleted_at，不會真的移除資料列。
   */
  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await deletePet(petId);

      toast.success(`${petName}已從毛孩檔案中刪除`);

      // 刪除成功後回到列表；列表頁會重新向 API 取得最新資料。
      router.push('/member/pets/profiles');
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '刪除毛孩失敗，請稍後再試';

      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog.Root>
      {/* Trigger 只負責開啟警示視窗，不會直接刪除資料。 */}
      <AlertDialog.Trigger asChild>
        <button
          type="button"
          className="typo-body-medium flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          <LuTrash2 className="h-5 w-5" aria-hidden="true" />
          刪除此寵物
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        {/* Overlay 遮住背景，讓使用者專注在不可逆的操作上。 */}
        <AlertDialog.Overlay className="fixed inset-0 z-[100] bg-black/45" />

        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-[101] w-[calc(100%-2rem)] max-w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-white p-6 shadow-xl sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-danger text-red-600">
              <LuTriangleAlert className="h-6 w-6" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <AlertDialog.Title className="typo-card-title text-text-primary">
                確定要刪除{petName}嗎？
              </AlertDialog.Title>

              <AlertDialog.Description className="typo-card-body mt-3 text-text-secondary">
                刪除後，這隻毛孩將不會出現在毛孩檔案與 AI 導購選擇中。
              </AlertDialog.Description>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {/* Cancel 會關閉視窗，不會呼叫刪除 API。 */}
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                disabled={isDeleting}
                className="back-button typo-tab min-h-11 w-full sm:w-auto sm:min-w-24"
              >
                取消
              </button>
            </AlertDialog.Cancel>

            {/* 只有 Action 才會真正呼叫 DELETE API。 */}
            <AlertDialog.Action asChild>
              <button
                type="button"
                disabled={isDeleting}
                onClick={(event) => {
                  // 等 API 成功後再導頁；失敗時保留 Dialog 讓使用者看見錯誤。
                  event.preventDefault();
                  void handleDelete();
                }}
                className="typo-tab min-h-11 w-full rounded-full bg-red-600 px-5 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-button-disabled disabled:text-text-button-disabled sm:w-auto sm:min-w-28"
              >
                {isDeleting ? '刪除中...' : '確認刪除'}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
