'use client';

import { useEffect, useState } from 'react';

import { ProductCard } from '@/src/components/product/ProductCard';

interface ApiFavoriteProduct {
  id: number;
  prod_name: string;
  price: number;
  pet_tag_id_fk: number;
  slug: string;
  total_stock?: number;
  tags_id?: number[];
  intros?: {
    slogan?: string;
    content?: string;
  };
  avatars?: {
    src: string;
    thumbnail?: string;
  }[];
  images?: {
    src: string;
  }[];
}

interface FavoriteResponse {
  success: boolean;
  favorites: ApiFavoriteProduct[];
}

interface ApiTag {
  id: number;
  tag_ch: string;
}

interface ProductListResponse {
  success: boolean;
  facets: {
    tags: ApiTag[];
  };
}

interface FavoriteProduct {
  id: number;
  avatar?: {
    src?: string;
    thumbnail?: string;
  } | null;
  tags?: ApiTag[];
  name: string;
  intro?: {
    slogan?: string;
  };
  price: string;
  slug: string;
  petType: {
    id: number;
    tag_slug: string;
  };
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
  products: ApiFavoriteProduct[],
  tagMap: Map<number, ApiTag>
): FavoriteProduct[] => {
  return products.map((product) => ({
    id: product.id,
    avatar: product.avatars?.[0] ?? null,
    tags: (product.tags_id ?? [])
      .map((tagId) => tagMap.get(tagId))
      .filter((tag): tag is ApiTag => Boolean(tag)),
    name: product.prod_name,
    intro: product.intros,
    price: `NT$${Number(product.price).toLocaleString('zh-TW')}`,
    slug: product.slug,
    petType: {
      id: product.pet_tag_id_fk,
      tag_slug: String(product.pet_tag_id_fk),
    },
    isFavorite: true,
    soldOut: Number(product.total_stock ?? 0) <= 0,
  }));
};

const getTagMap = async (
  petTypeIds: number[],
  signal: AbortSignal
): Promise<Map<number, ApiTag>> => {
  const responses = await Promise.all(
    petTypeIds.map((petTypeId) =>
      fetch(`/api/products/${petTypeId}`, { signal }).then((response) => {
        if (!response.ok) throw new Error(labels.loadError);

        return response.json() as Promise<ProductListResponse>;
      })
    )
  );

  return new Map(
    responses.flatMap((response) =>
      response.success
        ? response.facets.tags.map((tag) => [tag.id, tag] as const)
        : []
    )
  );
};

export default function MemberFavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    void fetch('/api/products/getFavorite', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(labels.loadError);

        return response.json();
      })
      .then((data: FavoriteResponse) => {
        if (!data.success) throw new Error(labels.loadError);

        const petTypeIds = [
          ...new Set(data.favorites.map((product) => product.pet_tag_id_fk)),
        ];

        return getTagMap(petTypeIds, controller.signal).then((tagMap) => {
          setFavoriteProducts(mapFavoriteProducts(data.favorites, tagMap));
        });
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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
