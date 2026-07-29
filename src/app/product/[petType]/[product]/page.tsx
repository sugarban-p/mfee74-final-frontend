'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LuChevronRight } from 'react-icons/lu';

import { ProductCard } from '@/src/components/product/ProductCard';
import {
  mapProductDetail,
  QuickShoppingSection,
  type ProductDetailResponse,
  type QuickShoppingDetail,
} from '@/src/components/product/QuickShoppingSection';

const labels = {
  breadcrumbHome: '首頁',
  category: '商品分類',
  collapseDescription: '收起介紹',
  description: '商品介紹',
  expandDescription: '展開介紹',
  allProducts: '所有商品',
  product: '商品',
  recommendedDescription: '精選商品',
  recommendedProduct: '推薦商品',
  noSimilarProduct: '尚無相似商品',
  recommendedTag: '推薦',
} as const;

const loadErrorText = '商品資料載入失敗';
const MIN_PRODUCT_DETAIL_LOADING_MS = 300;
const DESCRIPTION_PREVIEW_COUNT = 2;

export default function ProductPage() {
  const params = useParams<{ petType?: string; product?: string }>();
  const searchParams = useSearchParams();
  const petType = params.petType ?? '';
  const productSlug = params.product ?? '';
  const categoryParam = searchParams.get('category') ?? '';

  return (
    <ProductPageContent
      key={`${petType}:${productSlug}:${categoryParam}`}
      petType={petType}
      productSlug={productSlug}
      categoryParam={categoryParam}
    />
  );
}

interface ProductPageContentProps {
  petType: string;
  productSlug: string;
  categoryParam: string;
}

interface ResolvedProductIds {
  petTypeId: number;
  productId: number;
}

interface ProductDetailWithIdsResponse extends ProductDetailResponse {
  success?: boolean;
  petTypeId?: number | string;
  productId?: number | string;
  params?: {
    petTypeId?: number | string;
    productId?: number | string;
  };
  message?: string;
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

interface ApiRecommendedProduct {
  id: number;
  prod_name: string;
  price: number | string;
  slug?: string;
  total_stock?: number | string;
  tags?: ApiTag[];
  intro?: ApiIntro;
  avatar?: ApiAvatar | null;
  petType?: ApiPetType | null;
  isFavorite?: boolean;
}

interface RecommendationsResponse {
  success: boolean;
  recommendations?: ApiRecommendedProduct[];
  message?: string;
}

interface FavoriteIdsResponse {
  success: boolean;
  favorites?: number[];
}

interface CardProduct {
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

const mapRecommendedProducts = (
  products: ApiRecommendedProduct[]
): CardProduct[] => {
  return products.map((product) => ({
    id: product.id,
    avatar: product.avatar,
    tags: product.tags,
    name: product.prod_name,
    intro: product.intro,
    price: `NT$${Number(product.price).toLocaleString('zh-TW')}`,
    slug: product.slug ?? '',
    petType: product.petType,
    isFavorite: product.isFavorite ?? false,
    soldOut: Number(product.total_stock ?? 0) <= 0,
  }));
};

const fetchFavoriteIds = async (productIds: number[], signal: AbortSignal) => {
  if (!productIds.length) return [];

  try {
    const response = await fetch(
      `/api/products/favorites?ids=${productIds.join(',')}`,
      { signal }
    );

    if (!response.ok) return [];

    const data = (await response.json()) as FavoriteIdsResponse;

    return data.success ? (data.favorites ?? []) : [];
  } catch {
    return [];
  }
};

const toPositiveInteger = (value: number | string | undefined) => {
  const number = Number(value);

  return Number.isInteger(number) && number > 0 ? number : 0;
};

const getResolvedProductIds = (
  data: ProductDetailWithIdsResponse
): ResolvedProductIds | null => {
  const petTypeId = toPositiveInteger(data.petTypeId ?? data.params?.petTypeId);
  const productId = toPositiveInteger(
    data.productId ?? data.params?.productId ?? data.product?.id
  );

  if (!petTypeId || !productId) return null;

  return { petTypeId, productId };
};

function ProductPageContent({
  petType,
  productSlug,
  categoryParam,
}: ProductPageContentProps) {
  const [resolvedProductIds, setResolvedProductIds] =
    useState<ResolvedProductIds | null>(null);
  const [loadingError, setLoadingError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRecommendationsLoading, setIsRecommendationsLoading] =
    useState(true);
  const [showAllDescriptions, setShowAllDescriptions] = useState(false);
  const [productDetail, setProductDetail] =
    useState<QuickShoppingDetail | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<CardProduct[]>(
    []
  );

  useEffect(() => {
    if (!petType || !productSlug) return;

    const controller = new AbortController();
    let loadingStartedAt = 0;

    void Promise.resolve()
      .then(() => {
        if (!controller.signal.aborted) {
          loadingStartedAt = Date.now();
          setIsLoading(true);
        }

        return fetch(
          `/api/products/${encodeURIComponent(petType)}/${encodeURIComponent(productSlug)}/detail`,
          { signal: controller.signal }
        );
      })
      .then((response) => {
        if (!response.ok) throw new Error(loadErrorText);

        return response.json() as Promise<ProductDetailWithIdsResponse>;
      })
      .then(async (data) => {
        const nextResolvedProductIds = getResolvedProductIds(data);

        if (
          data.success === false ||
          !data.product ||
          !nextResolvedProductIds
        ) {
          throw new Error(data.message || loadErrorText);
        }

        const favoriteIds = await fetchFavoriteIds(
          [nextResolvedProductIds.productId],
          controller.signal
        );
        const nextProductDetail = mapProductDetail(data);

        if (controller.signal.aborted) return;

        setIsRecommendationsLoading(true);
        setRecommendedProducts([]);
        setResolvedProductIds(nextResolvedProductIds);
        setProductDetail({
          ...nextProductDetail,
          product: {
            ...nextProductDetail.product,
            isFavorite: favoriteIds.includes(nextResolvedProductIds.productId),
          },
        });
        setLoadingError('');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setLoadingError(error instanceof Error ? error.message : loadErrorText);
      })
      .finally(() => {
        const remainingLoadingMs = Math.max(
          MIN_PRODUCT_DETAIL_LOADING_MS - (Date.now() - loadingStartedAt),
          0
        );

        window.setTimeout(() => {
          if (!controller.signal.aborted) setIsLoading(false);
        }, remainingLoadingMs);
      });

    return () => controller.abort();
  }, [petType, productSlug]);

  useEffect(() => {
    if (!resolvedProductIds) return;

    const controller = new AbortController();
    const { petTypeId, productId } = resolvedProductIds;

    void fetch(
      `/api/products/${encodeURIComponent(String(petTypeId))}/${encodeURIComponent(String(productId))}/recommendations`,
      { signal: controller.signal }
    )
      .then((response) => {
        if (!response.ok) throw new Error(loadErrorText);

        return response.json() as Promise<RecommendationsResponse>;
      })
      .then(async (data) => {
        if (!data.success || !Array.isArray(data.recommendations)) {
          throw new Error(data.message || loadErrorText);
        }

        const nextRecommendedProducts = mapRecommendedProducts(
          data.recommendations
        );
        const favoriteIds = await fetchFavoriteIds(
          nextRecommendedProducts.map((product) => product.id),
          controller.signal
        );
        const favoriteIdSet = new Set(favoriteIds);

        if (controller.signal.aborted) return;

        setRecommendedProducts(
          nextRecommendedProducts.map((product) => ({
            ...product,
            isFavorite: favoriteIdSet.has(product.id),
          }))
        );
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setRecommendedProducts([]);
      })
      .finally(() => {
        window.setTimeout(() => {
          if (!controller.signal.aborted) setIsRecommendationsLoading(false);
        }, 0);
      });

    return () => controller.abort();
  }, [resolvedProductIds]);

  const fromAllProducts = categoryParam === 'all-products';
  const productName = productDetail?.product.name || labels.product;
  const petTypePageName =
    productDetail?.product.petType?.tag_page || labels.breadcrumbHome;
  const categoryName = fromAllProducts
    ? labels.allProducts
    : productDetail?.product.category || labels.category;
  const categorySlug = productDetail?.product.categorySlug;
  const categoryHref = fromAllProducts
    ? `/product/${petType}?category=all-products`
    : categorySlug
      ? `/product/${petType}?category=${encodeURIComponent(categorySlug)}`
      : `/product/${petType}`;
  const descriptionImages = productDetail?.descriptionImages ?? [];
  const visibleDescriptionImages = showAllDescriptions
    ? descriptionImages
    : descriptionImages.slice(0, DESCRIPTION_PREVIEW_COUNT);
  const canToggleDescriptions =
    descriptionImages.length > DESCRIPTION_PREVIEW_COUNT;
  const productResolveError =
    petType && productSlug ? loadingError : loadErrorText;
  const isPageLoading =
    !productResolveError && (isLoading || isRecommendationsLoading);
  const productContent =
    !isPageLoading && resolvedProductIds && productDetail
      ? { resolvedProductIds, productDetail }
      : null;
  const maxWidth = 1280;

  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-[1520px] px-3 py-0 2xl:px-0">
        <div
          className="flex w-full flex-col gap-4 justify-self-center lg:gap-12"
          style={{ maxWidth }}
        >
          <nav
            aria-label="Breadcrumb"
            className="typo-body-medium breadcrumbs min-w-0"
          >
            <ul className="min-w-0 text-primary">
              <li className="hidden shrink-0 sm:block">
                <Link href="/">{labels.breadcrumbHome}</Link>
              </li>
              <li className="shrink-0">
                <Link href={`/product/${petType}`}>{petTypePageName}</Link>
              </li>
              <li className="shrink-0">
                <Link href={categoryHref}>{categoryName}</Link>
              </li>
              <li className="min-w-0 flex-1 text-text-primary">
                <span className="block min-w-0 truncate">{productName}</span>
              </li>
            </ul>
          </nav>

          {productResolveError && (
            <p className="typo-body text-error" role="alert">
              {productResolveError}
            </p>
          )}

          {isPageLoading && (
            <div className="flex min-h-40 items-center justify-center">
              <span className="loading loading-md loading-spinner text-primary" />
            </div>
          )}

          {productContent && (
            <QuickShoppingSection
              petTypeId={productContent.resolvedProductIds.petTypeId}
              productId={productContent.resolvedProductIds.productId}
              detail={productContent.productDetail}
            />
          )}

          {productContent && descriptionImages.length > 0 && (
            <section
              id="product-description"
              className="mx-auto flex w-full flex-col gap-5"
            >
              <h2 className="typo-body-medium border-b-2 border-secondary pb-2 text-text-primary">
                {labels.description}
              </h2>
              <div
                className={[
                  'relative overflow-hidden',
                  showAllDescriptions ? '' : 'max-h-[300px] sm:max-h-[600px]',
                ].join(' ')}
              >
                {visibleDescriptionImages.map((src, index) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`${productName} ${labels.description} ${index + 1}`}
                    width={maxWidth}
                    height={maxWidth}
                    sizes={`${maxWidth}px`}
                    className="h-auto w-full"
                  />
                ))}
                {canToggleDescriptions && (
                  <button
                    type="button"
                    className={`group absolute inset-x-0 bottom-0 flex h-24 cursor-pointer items-center justify-center gap-2 bg-linear-to-t from-black/85 to-transparent pt-7 transition-transform hover:scale-[1.05] ${
                      showAllDescriptions ? 'pb-7' : 'pt-7'
                    }`}
                    onClick={() => setShowAllDescriptions((prev) => !prev)}
                  >
                    <span className="typo-tab text-text-button group-hover:underline">
                      {showAllDescriptions
                        ? labels.collapseDescription
                        : labels.expandDescription}
                    </span>
                    <LuChevronRight
                      className={`size-6 text-text-button ${showAllDescriptions ? '-rotate-90' : 'rotate-90'}`}
                    />
                  </button>
                )}
              </div>
            </section>
          )}

          {productContent && (
            <section className="mx-auto flex w-full flex-col gap-6">
              <h2 className="typo-body-medium border-b-2 border-secondary pb-2 text-text-primary">
                {labels.recommendedProduct}
              </h2>
              {recommendedProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 xl:grid-cols-4">
                  {recommendedProducts.map((recommendedProduct) => (
                    <ProductCard
                      key={recommendedProduct.id}
                      product={recommendedProduct}
                    />
                  ))}
                </div>
              ) : (
                <p className="typo-body py-8 text-center text-text-secondary">
                  {labels.noSimilarProduct}
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
