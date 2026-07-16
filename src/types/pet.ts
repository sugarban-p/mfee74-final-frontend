/**
 * PetItem：
 * 前台目前會用到的寵物資料型別。
 *
 * 這份型別是依照目前 DB 規劃整理出來的前台版本。
 * 之後後端 API 回傳資料時，也可以慢慢對齊這個格式。
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
