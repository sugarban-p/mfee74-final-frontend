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
  avatar: string;
  tags: string[];
  name: string;
  description: string;
  price: string;
  slug: string;
  gallery: string[];
  petType: string;
  isFavorite: boolean;
  soldOut: boolean;
}

const labels = {
  empty: '目前沒有收藏商品',
  loadError: '收藏清單載入失敗',
  loading: '收藏清單載入中...',
  title: '收藏清單',
} as const;

const toPublicImagePath = (path?: string) => {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;

  return `/${path.replace(/^\/+/, '')}`;
};

const mapFavoriteProducts = (
  products: ApiFavoriteProduct[],
  tagMap: Map<number, string>
): FavoriteProduct[] => {
  return products.map((product) => {
    const avatarGallery =
      product.avatars?.map((avatar) => toPublicImagePath(avatar.src)) ?? [];
    const imageGallery =
      product.images?.map((image) => toPublicImagePath(image.src)) ?? [];
    const gallery = [...avatarGallery, ...imageGallery].filter(Boolean);

    return {
      id: product.id,
      avatar:
        toPublicImagePath(product.avatars?.[0]?.thumbnail) ||
        toPublicImagePath(product.avatars?.[0]?.src),
      tags: (product.tags_id ?? [])
        .map((tagId) => tagMap.get(tagId))
        .filter((tag): tag is string => Boolean(tag)),
      name: product.prod_name,
      description:
        product.intros?.slogan ?? product.intros?.content?.split('\n')[0] ?? '',
      price: `NT$${Number(product.price).toLocaleString('zh-TW')}`,
      slug: product.slug,
      gallery,
      petType: String(product.pet_tag_id_fk),
      isFavorite: true,
      soldOut: Number(product.total_stock ?? 0) <= 0,
    };
  });
};

const getTagMap = async (
  petTypeIds: number[],
  signal: AbortSignal
): Promise<Map<number, string>> => {
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
        ? response.facets.tags.map((tag) => [tag.id, tag.tag_ch] as const)
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

    setIsLoading(true);
    setLoadingError('');

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
