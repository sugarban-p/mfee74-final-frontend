import { ProductCard } from '@/src/components/product/ProductCard';

interface FavoriteProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  tags: string[];
  slug: string;
  petType: string;
  isFavorite: boolean;
  soldOut?: boolean;
}

const favoriteProducts: FavoriteProduct[] = [
  {
    id: 1,
    name: '慢烘鮮食蔬肉糧',
    description: '最接近鮮食的天然慢烘糧!',
    price: 'NT$229',
    image: '/images/product/蔬肉糧產品圖_01-510x510.jpg',
    tags: ['標籤 1', '標籤 2'],
    slug: 'slow-roast-mixed-food',
    petType: 'dog',
    isFavorite: true,
    soldOut: true,
  },
  {
    id: 2,
    name: '商品名稱',
    description: '簡短標語敘述',
    price: 'NT$9999',
    image: '',
    tags: ['標籤 1', '標籤 2'],
    slug: 'prod_x',
    petType: 'dog',
    isFavorite: true,
  },
  {
    id: 3,
    name: '商品名稱',
    description: '簡短標語敘述',
    price: 'NT$9999',
    image: '',
    tags: ['標籤 1', '標籤 2'],
    slug: 'prod_x',
    petType: 'dog',
    isFavorite: true,
  },
  {
    id: 4,
    name: '商品名稱',
    description: '簡短標語敘述',
    price: 'NT$9999',
    image: '',
    tags: ['標籤 1', '標籤 2'],
    slug: 'prod_x',
    petType: 'dog',
    isFavorite: true,
  },
  {
    id: 5,
    name: '商品名稱',
    description: '簡短標語敘述',
    price: 'NT$9999',
    image: '',
    tags: ['標籤 1', '標籤 2'],
    slug: 'prod_x',
    petType: 'dog',
    isFavorite: true,
  },
  {
    id: 6,
    name: '呱呱寵物嘴套',
    description: '簡短標語敘述',
    price: 'NT$299',
    image: '/images/product/favorite-dog-toy.png',
    tags: ['標籤 1', '標籤 2'],
    slug: 'prod_x',
    petType: 'dog',
    isFavorite: true,
    soldOut: true,
  },
];

// Server Component: this page only renders static favorite-list UI.
export default function MemberFavoritesPage() {
  return (
    <section className="flex flex-col gap-5 lg:-mt-12 lg:-mb-16">
      <h1 className="text-xl font-bold text-text-primary">收藏清單</h1>

      <div className="flex hidden items-center gap-3" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected="true"
          className="typo-tab inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-text-button"
        >
          全部
          <span className="grid size-6 place-items-center rounded-full bg-white/20 text-sm">
            5
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected="false"
          className="typo-tab inline-flex h-9 items-center gap-2 rounded-full border border-border bg-white px-4 text-text-secondary"
        >
          缺貨中
          <span className="grid size-6 place-items-center rounded-full bg-card-secondary text-sm">
            2
          </span>
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,260px))] gap-x-8 gap-y-6">
        {favoriteProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
