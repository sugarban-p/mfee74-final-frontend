export interface ProductMegaMenuItem {
  id: number;
  title: string;
  href: string;
}

export interface ProductMegaMenuCard {
  id: number;
  petType: string;
  imageAlt: string;
  title: string;
  href: string;
  items: ProductMegaMenuItem[];
}

export interface ProductMegaMenuResponse {
  success: boolean;
  cards: ProductMegaMenuCard[];
}

export const PRODUCT_MEGA_MENU_FALLBACK: ProductMegaMenuCard[] = [
  {
    id: 1,
    petType: 'cat',
    imageAlt: '貓咪專區',
    title: '貓咪專區',
    href: '/product/cat',
    items: [
      { id: 1, title: '主食', href: '/product/cat?category=main-food' },
      { id: 2, title: '零食/點心', href: '/product/cat?category=treat' },
      { id: 4, title: '保健品', href: '/product/cat?category=supplement' },
      { id: 5, title: '生活用品', href: '/product/cat?category=supplies' },
    ],
  },
  {
    id: 2,
    petType: 'dog',
    imageAlt: '狗勾專區',
    title: '狗勾專區',
    href: '/product/dog',
    items: [
      { id: 1, title: '主食', href: '/product/dog?category=main-food' },
      { id: 2, title: '零食/點心', href: '/product/dog?category=treat' },
      { id: 3, title: '牽引用品', href: '/product/dog?category=leash' },
      { id: 5, title: '生活用品', href: '/product/dog?category=supplies' },
    ],
  },
];

export const getProductMegaMenuImage = (petType: string) => {
  return petType === 'cat' ? '/cat-category.png' : '/dog-category.png';
};

export const getProductMegaMenuCard = (
  cards: ProductMegaMenuCard[],
  petType: string
) => {
  return cards.find((card) => card.petType === petType);
};

export const getProductCategoryId = (
  card: ProductMegaMenuCard | undefined,
  categorySlug: string
) => {
  if (!card) return 0;

  return (
    card.items.find(
      (item) =>
        new URL(item.href, 'http://localhost').searchParams.get('category') ===
        categorySlug
    )?.id ?? 0
  );
};
