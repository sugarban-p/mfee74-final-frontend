/**
 * PetItem：
 * 舊版 mock data 與目前畫面元件使用的型別。
 *
 * 前後端尚未全部串接完成前先保留，
 * 等所有頁面不再使用 mockPets 後才移除。
 */
export interface PetItem {
  id: number;
  name: string;
  avatarUrl: string;
  species: string;
  breed: string;
  gender: string;
  neutered: string;
  birthday: string;
  age: string;
  weight: string;
  activityLevel: string;
  healthConditions: string[];
  allergyIngredients: string[];
  specialNote: string;
}

/**
 * PetOption：
 * 後端 pet_attr_details 的前端資料格式。
 *
 * id：
 * POST、PUT 時要傳回後端的選項編號。
 *
 * label：
 * 顯示給使用者看的中文文字。
 *
 * code：
 * 程式與 AI 推薦使用的穩定代碼。
 */
export interface PetOption {
  id: number;
  label: string;
  code: string;
}

/**
 * PetOptionGroup：
 * 一個表單選項群組。
 *
 * 例如：
 * species 是 single；
 * health_condition 是 multiple。
 */
export interface PetOptionGroup {
  name: string;
  selectionType: 'single' | 'multiple';
  isRequired: boolean;
  options: PetOption[];
}

/**
 * PetFormOptions：
 * GET /api/pets/options 回傳的六個表單選項群組。
 */
export interface PetFormOptions {
  species: PetOptionGroup;
  gender: PetOptionGroup;
  neutered: PetOptionGroup;
  activity_level: PetOptionGroup;
  health_condition: PetOptionGroup;
  allergy_ingredient: PetOptionGroup;
}

/**
 * PetListItem：
 * GET /api/pets 列表中的單隻寵物。
 *
 * nullable 欄位使用 string | null，
 * 因為 MySQL 中這些欄位允許 NULL。
 */
export interface PetListItem {
  id: number;
  name: string;
  avatarUrl: string | null;
  species: string;
  breed: string | null;
  gender: string | null;
  neutered: string | null;
  activityLevel: string | null;
  birthday: string | null;

  /**
   * MySQL DECIMAL 經過 mysql2 後通常會回傳字串，
   * 例如 DECIMAL(5,2) 的 4.80 會是 "4.80"。
   */
  weight: string | null;

  specialNote: string | null;
}

/**
 * PetDetail：
 * GET /api/pets/:petId 回傳的完整寵物資料。
 *
 * 除了顯示文字，也包含編輯表單需要的 option id。
 */
export interface PetDetail extends PetListItem {
  speciesOptionId: number;
  genderOptionId: number | null;
  neuteredOptionId: number | null;
  activityLevelOptionId: number | null;

  /**
   * 詳情頁可以使用 label 顯示中文，
   * 未來 AI 推薦可以使用 code。
   */
  healthConditions: PetOption[];
  allergyIngredients: PetOption[];

  /**
   * 編輯頁 checkbox 用這兩個 id 陣列決定預設勾選項目。
   */
  healthConditionOptionIds: number[];
  allergyIngredientOptionIds: number[];
}

/**
 * PetFormPayload：
 * 新增與編輯表單送給後端的 request body。
 *
 * POST /api/pets
 * PUT /api/pets/:petId
 * 都使用相同格式。
 */
export interface PetFormPayload {
  name: string;
  avatarUrl: string | null;
  speciesOptionId: number;
  breed: string | null;
  genderOptionId: number;
  neuteredOptionId: number;
  activityLevelOptionId: number | null;
  birthday: string;
  weight: number;
  specialNote: string | null;
  healthConditionOptionIds: number[];
  allergyIngredientOptionIds: number[];
}

/**
 * GET /api/pets 的 response。
 */
export interface PetListResponse {
  success: boolean;
  rows: PetListItem[];
  message?: string;
}

/**
 * GET /api/pets/:petId 的 response。
 */
export interface PetDetailResponse {
  success: boolean;
  row: PetDetail | null;
  message?: string;
}

/**
 * GET /api/pets/options 的 response。
 */
export interface PetOptionsResponse {
  success: boolean;
  rows: PetFormOptions;
  message?: string;
}

/**
 * POST、PUT、DELETE 成功時共同使用的 row 格式。
 */
export interface PetMutationRow {
  id: number;
}

/**
 * POST、PUT、DELETE 的 response。
 */
export interface PetMutationResponse {
  success: boolean;
  message: string;
  row?: PetMutationRow;
}