import type {
  PetAiRecommendationPayload,
  PetAiRecommendationResponse,
  PetAiRecommendationRow,
} from '@/src/types/pet-ai';

/**
 * 寵物 AI API 的共同 response 欄位。
 */
interface PetAiApiResponseBase {
  success: boolean;
  message?: string;
}

/**
 * 寵物 AI API 共用 fetch。
 *
 * T 是 TypeScript 泛型，代表這次 API 預期回傳的資料格式。
 */
async function requestPetAiApi<T extends PetAiApiResponseBase>(
  path: string,
  options?: RequestInit
): Promise<T> {
  /**
   * path 使用 /api 開頭，不直接寫 localhost:3001。
   *
   * Next.js 會依照 next.config.ts 的 rewrite，
   * 將請求轉送到 Express 後端。
   */
  const response = await fetch(path, {
    // 私人資料每次都向後端重新取得，不使用舊快取。
    cache: 'no-store',

    /**
     * 自動攜帶登入 Cookie。
     *
     * 後端 requireAuth 會透過 Cookie
     * 判斷目前是哪一位會員。
     */
    credentials: 'include',

    ...options,
  });

  /**
   * 正常情況後端會回傳 JSON。
   *
   * 如果伺服器意外回傳 HTML 或空內容，
   * catch 會改成 null，避免 response.json() 直接中斷程式。
   */
  const data = (await response.json().catch(() => null)) as T | null;

  /**
   * 401 代表登入狀態失效。
   *
   * 導回登入頁，避免使用者停留在需要會員權限的 AI 頁面。
   */
  if (response.status === 401) {
    window.location.assign('/auth/login');
    throw new Error('請先登入會員');
  }

  /**
   * response.ok：
   * HTTP status 是否為 200～299。
   *
   * data.success：
   * 後端這次工作是否成功。
   */
  if (!response.ok || !data?.success) {
    throw new Error(
      data?.message || `寵物 AI API 請求失敗（${response.status}）`
    );
  }

  return data;
}

/**
 * 取得一隻寵物的 AI 商品推薦。
 *
 * 對應後端：
 * POST /api/pet-ai/recommendations
 *
 * payload 範例：
 * {
 *   petId: 1,
 *   needCode: 'health_based'
 * }
 */
export async function getPetAiRecommendations(
  payload: PetAiRecommendationPayload
): Promise<PetAiRecommendationRow> {
  const data = await requestPetAiApi<PetAiRecommendationResponse>(
    '/api/pet-ai/recommendations',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      // 將 JavaScript object 轉成後端能讀取的 JSON。
      body: JSON.stringify(payload),
    }
  );

  if (!data.row) {
    throw new Error('後端未回傳 AI 推薦資料');
  }

  return data.row;
}
