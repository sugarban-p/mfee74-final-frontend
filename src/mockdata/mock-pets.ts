import type { PetItem } from '@/src/types/pet';

/**
 * mockPets：
 * 目前先用假資料做畫面。
 *
 * 等後端 API 完成後，頁面就不會直接用這個檔案，
 * 而是會從 /api/pets 取得會員自己的寵物資料。
 */
export const mockPets: PetItem[] = [
  {
    id: 1,
    name: '毛毛',
    avatarUrl: '/chi.png',
    species: '狗狗',
    breed: '小型犬',
    gender: '男生',
    neutered: '已結紮',
    birthday: '2019-03-12',
    age: '6 歲 4 個月',
    weight: '9.5 kg',
    activityLevel: '中',
    healthConditions: ['皮膚敏感', '挑食'],
    allergyIngredients: ['雞肉'],
    specialNote: '容易緊張，換飼料時需要慢慢轉換。',
  },
  {
    id: 2,
    name: '妮妮',
    avatarUrl: '/cat-category.png',
    species: '貓咪',
    breed: '米克斯',
    gender: '女生',
    neutered: '未結紮',
    birthday: '2022-05-08',
    age: '3 歲 2 個月',
    weight: '4.8 kg',
    activityLevel: '低',
    healthConditions: ['毛球困擾'],
    allergyIngredients: [],
    specialNote: '換季時毛球狀況比較明顯。',
  },
];
