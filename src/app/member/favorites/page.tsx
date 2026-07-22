'use client';

import { useEffect, useState } from 'react';

import { ProductCard } from '@/src/components/product/ProductCard';

interface ApiFavoriteProduct {
  id: number;
  favorite_id?: number;
  favorited_at?: string;
  prod_name: string;
  price: number;
  slug: string;
  total_stock?: number;
  avatar?: ApiAvatar | null;
  tags?: ApiTag[];
  intro?: ApiIntro;
  petType?: ApiPetType | null;
}

interface FavoriteResponse {
  success: boolean;
  favorites: ApiFavoriteProduct[];
}

interface ApiTag {
  id: number;
  tag_ch: string;
  tag_slug?: string;
}

interface ApiAvatar {
  src?: string;
  thumbnail?: string;
}

interface ApiIntro {
  slogan?: string;
}

interface ApiPetType {
  id?: number;
  tag_slug?: string;
  tag_page?: string;
}

interface FavoriteProduct {
  id: number;
  avatar?: ApiAvatar | null;
  tags?: ApiTag[];
  name: string;
  intro?: ApiIntro;
  price: string;
  slug: string;
  petType?: ApiPetType | null;
  isFavorite: boolean;
  soldOut: boolean;
}

const labels = {
  empty: '目前沒有收藏商品',
  loadError: '收藏清單載入失敗',
  loading: '收藏清單載入中...',
  title: '收藏清單',
} as const;

const mapFavoriteProducts = (
  products: ApiFavoriteProduct[]
): FavoriteProduct[] => {
  return products.map((product) => ({
    id: product.id,
    avatar: product.avatar ?? null,
    tags: product.tags,
    name: product.prod_name,
    intro: product.intro,
    price: `NT$${Number(product.price).toLocaleString('zh-TW')}`,
    slug: product.slug,
    petType: product.petType,
    isFavorite: true,
    soldOut: Number(product.total_stock ?? 0) <= 0,
  }));
};

export default function MemberFavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState('');

  const handleFavoriteChange = (productId: number, isFavorite: boolean) => {
    if (isFavorite) return;

    setFavoriteProducts((products) =>
      products.filter((product) => product.id !== productId)
    );
  };

  useEffect(() => {
    const controller = new AbortController();

    void fetch('/api/products/getFavorite', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(labels.loadError);

        return response.json();
      })
      .then((data: FavoriteResponse) => {
        if (!data.success) throw new Error(labels.loadError);

        setFavoriteProducts(mapFavoriteProducts(data.favorites));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setFavoriteProducts([]);
        setLoadingError(
          error instanceof Error ? error.message : labels.loadError
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="flex flex-col gap-5 lg:-mt-12 lg:-mb-16">
      <h1 className="text-xl font-bold text-text-primary">{labels.title}</h1>

      {loadingError && (
        <p className="typo-body text-error" role="alert">
          {loadingError}
        </p>
      )}

      {isLoading && (
        <p className="typo-body text-text-secondary">{labels.loading}</p>
      )}

      {!isLoading && !loadingError && favoriteProducts.length === 0 && (
        <p className="typo-body text-text-secondary">{labels.empty}</p>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,260px))] gap-x-8 gap-y-6">
        {favoriteProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onFavoriteChange={handleFavoriteChange}
          />
        ))}
      </div>
    </section>
  );
}
