import { API_SERVER } from '@/src/config/api-path';
import type {
  PetDetail,
  PetDetailResponse,
  PetAvatarUploadResponse,
  PetFormOptions,
  PetFormPayload,
  PetListItem,
  PetListResponse,
  PetMutationResponse,
  PetOptionsResponse,
} from '@/src/types/pet';

/**
 * 所有寵物 API response 都有的共同欄位。
 */
interface PetApiResponseBase {
  success: boolean;
  message?: string;
}

/**
 * 寵物 API 共用 fetch。
 *
 * T 代表每一支 API 預期取得的 response 型別。
 */
async function requestPetApi<T extends PetApiResponseBase>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_SERVER}${path}`, {
    // 每次取得最新資料，不使用 Next.js 舊快取。
    cache: 'no-store',

    // 未來 Session 登入完成後，請求需要攜帶 Cookie。
    credentials: 'include',

    ...options,
  });

  /**
   * 如果後端意外回傳非 JSON，
   * 使用 null 避免 response.json() 產生解析錯誤。
   */
  const data = (await response.json().catch(() => null)) as T | null;

  /**
   * response.ok 判斷 HTTP 200～299；
   * data.success 是後端自行定義的執行結果。
   */
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || `寵物 API 請求失敗（${response.status}）`);
  }

  return data;
}

/**
 * 取得目前會員的寵物列表。
 *
 * GET /api/pets
 */
export async function getPets(): Promise<PetListItem[]> {
  const data = await requestPetApi<PetListResponse>('/api/pets');

  return data.rows;
}

/**
 * 取得單一寵物詳情。
 *
 * GET /api/pets/:petId
 */
export async function getPetById(petId: number): Promise<PetDetail> {
  const data = await requestPetApi<PetDetailResponse>(`/api/pets/${petId}`);

  if (!data.row) {
    throw new Error('找不到寵物資料');
  }

  return data.row;
}

/**
 * 取得物種、性別、健康情況等表單選項。
 *
 * GET /api/pets/options
 */
export async function getPetOptions(): Promise<PetFormOptions> {
  const data = await requestPetApi<PetOptionsResponse>('/api/pets/options');

  return data.rows;
}

/**
 * 上傳寵物照片。
 *
 * FormData 會自動產生 multipart/form-data boundary，
 * 因此這裡不可手動設定 Content-Type。
 */
export async function uploadPetAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('avatar', file);

  const data = await requestPetApi<PetAvatarUploadResponse>(
    '/api/pets/upload-avatar',
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!data.row?.avatarUrl) {
    throw new Error('後端未回傳照片網址');
  }

  return data.row.avatarUrl;
}

/**
 * 新增寵物。
 *
 * POST /api/pets
 */
export async function createPet(
  payload: PetFormPayload
): Promise<PetMutationResponse> {
  return requestPetApi<PetMutationResponse>('/api/pets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

/**
 * 更新寵物完整資料。
 *
 * PUT /api/pets/:petId
 */
export async function updatePet(
  petId: number,
  payload: PetFormPayload
): Promise<PetMutationResponse> {
  return requestPetApi<PetMutationResponse>(`/api/pets/${petId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

/**
 * 軟刪除寵物。
 *
 * DELETE /api/pets/:petId
 */
export async function deletePet(petId: number): Promise<PetMutationResponse> {
  return requestPetApi<PetMutationResponse>(`/api/pets/${petId}`, {
    method: 'DELETE',
  });
}
