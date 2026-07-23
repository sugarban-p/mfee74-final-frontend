/**
 * AI 導購目前支援的需求代碼。
 *
 * 這些值必須和後端
 * mfee74-final-backend/services/pet-recommendation.js
 * 的 GUIDED_NEEDS 保持一致。
 */
export type PetAiNeedCode = 'health_based' | 'main_food' | 'treat' | 'care';

/**
 * 推薦理由的產生來源。
 *
 * azure：
 * Azure 成功產生推薦理由。
 *
 * fallback：
 * Azure 失敗，後端改用備用理由。
 *
 * rules：
 * 後端沒有找到候選商品，因此沒有呼叫 Azure。
 */
export type PetAiRecommendationSource = 'azure' | 'fallback' | 'rules';

/**
 * AI API 回傳的健康情況或過敏食材。
 */
export interface PetAiOption {
  groupCode: 'health_condition' | 'allergy_ingredient';
  optionId: number;
  label: string;
  code: string;
}

/**
 * AI 導購使用的寵物摘要資料。
 *
 * 這個格式來自：
 * POST /api/pet-ai/recommendations
 */
export interface PetAiPet {
  id: number;
  name: string;

  /**
   * 後端儲存的寵物照片路徑。
   * 沒有上傳照片時會是 null。
   */
  avatarUrl: string | null;

  speciesCode: string;
  speciesLabel: string;
  breed: string | null;
  birthday: string | null;
  weight: string | null;
  activityLevelCode: string | null;
  activityLevelLabel: string | null;
  healthConditions: PetAiOption[];
  allergyIngredients: PetAiOption[];
}

/**
 * 使用者這次選擇的導購需求。
 */
export interface PetAiGuidedNeed {
  code: PetAiNeedCode;
  label: string;
}

/**
 * 商品中通過過敏食材與庫存檢查的品項。
 *
 * 後續如果快速購物需要指定 SKU，
 * 可以使用這份 safeItems。
 */
export interface PetAiSafeItem {
  itemId: number;
  sku: string;
  name: string;
  stock: number;
}

/**
 * 後端完成篩選後，回傳給聊天室的推薦商品。
 */
export interface PetAiRecommendedProduct {
  productId: number;
  name: string;
  price: number;
  slug: string;
  petType: string;
  categorySlug: string;
  categoryLabel: string;
  image: string;
  slogan: string;
  description: string;
  tags: string[];
  matchedHealthConditions: string[];
  matchScore: number;
  safeItems: PetAiSafeItem[];

  /**
   * Azure 或後端 fallback 產生的推薦理由。
   */
  reason: string;
}

/**
 * AI API 成功回傳的 row。
 */
export interface PetAiRecommendationRow {
  pet: PetAiPet;
  guidedNeed: PetAiGuidedNeed;
  recommendationSource: PetAiRecommendationSource;
  products: PetAiRecommendedProduct[];
}

/**
 * POST /api/pet-ai/recommendations 的完整 response。
 */
export interface PetAiRecommendationResponse {
  success: boolean;
  row: PetAiRecommendationRow;
  message?: string;
}

/**
 * 呼叫推薦 API 時送給後端的 request body。
 */
export interface PetAiRecommendationPayload {
  petId: number;
  needCode: PetAiNeedCode;
}
