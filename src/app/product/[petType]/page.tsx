// Server Component: product list data is fetched before the client UI hydrates.
import { headers } from 'next/headers';

import {
  ProductListClient,
  type ProductListResponse,
  type ProductSearchParams,
} from '@/src/components/product/ProductListClient';
import {
  getProductCategoryId,
  getProductMegaMenuCard,
  PRODUCT_MEGA_MENU_FALLBACK,
  type ProductMegaMenuCard,
  type ProductMegaMenuResponse,
} from '@/src/services/product-mega-menu';

const ALL_PRODUCTS_CATEGORY_SLUG = 'all-products';
const backendApiOrigin =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const loadErrorText = '商品資料載入失敗';
const productCacheRevalidateSeconds = 300;

interface PetTypePageProps {
  params?: Promise<{
    petType?: string;
  }>;
  searchParams?: Promise<ProductSearchParams>;
}

const emptyProductData: ProductListResponse = {
  success: true,
  facets: {
    categories: [],
    tags: [],
  },
  pagination: {
    currentPage: 1,
    perPage: 16,
    totalRows: 0,
    totalPages: 1,
  },
  products: [],
};

const apiUrl = (path: string) => {
  return new URL(path, backendApiOrigin).toString();
};

const normalizeSearchParams = (params: ProductSearchParams) => {
  return {
    ...params,
    search: params.search ?? params.keywords ?? '',
  };
};

interface FavoriteIdsResponse {
  success: boolean;
  favorites?: number[];
}

const withFavoriteOverlay = (
  productData: ProductListResponse,
  favoriteIds: number[]
): ProductListResponse => {
  if (!favoriteIds.length) return productData;

  const favoriteIdSet = new Set(favoriteIds);

  return {
    ...productData,
    products: productData.products.map((product) => ({
      ...product,
      isFavorite: favoriteIdSet.has(product.id),
    })),
  };
};

const fetchFavoriteIds = async (productIds: number[], headers: HeadersInit) => {
  if (!productIds.length) return [];

  try {
    const response = await fetch(
      apiUrl(`/api/products/favorites?ids=${productIds.join(',')}`),
      {
        headers,
        cache: 'no-store',
      }
    );

    if (!response.ok) return [];

    const data = (await response.json()) as FavoriteIdsResponse;

    return data.success ? (data.favorites ?? []) : [];
  } catch {
    return [];
  }
};

const fetchMegaMenu = async () => {
  try {
    const response = await fetch(apiUrl('/api/products/mega-menu'), {
      next: { revalidate: productCacheRevalidateSeconds },
    });

    if (!response.ok) throw new Error();

    const data = (await response.json()) as ProductMegaMenuResponse;

    return data.success && data.cards.length > 0
      ? data.cards
      : PRODUCT_MEGA_MENU_FALLBACK;
  } catch {
    return PRODUCT_MEGA_MENU_FALLBACK;
  }
};

const fetchProductData = async (
  petType: string,
  params: ProductSearchParams,
  cards: ProductMegaMenuCard[]
) => {
  const productMenuCard = getProductMegaMenuCard(cards, petType);
  const petTypeId = productMenuCard?.id ?? Number(petType);

  if (!Number.isInteger(petTypeId) || petTypeId <= 0) {
    return { productData: emptyProductData, loadingError: loadErrorText };
  }

  try {
    const nextParams = new URLSearchParams();
    const selectedCategory = params.category ?? ALL_PRODUCTS_CATEGORY_SLUG;
    const categoryId =
      selectedCategory === ALL_PRODUCTS_CATEGORY_SLUG
        ? 0
        : getProductCategoryId(productMenuCard, selectedCategory);

    if (categoryId) nextParams.set('categoryId', String(categoryId));
    if (params.tags) nextParams.set('tags', params.tags);
    if (params.search) nextParams.set('search', params.search);
    if (params['min-value']) nextParams.set('min-value', params['min-value']);
    if (params['max-value']) nextParams.set('max-value', params['max-value']);
    if (params.sort) nextParams.set('sort', params.sort);
    if (params.page) nextParams.set('page', params.page);

    const queryString = nextParams.toString();
    const response = await fetch(
      apiUrl(
        `/api/products/${encodeURIComponent(String(petTypeId))}${
          queryString ? `?${queryString}` : ''
        }`
      ),
      {
        next: { revalidate: productCacheRevalidateSeconds },
      }
    );

    if (!response.ok) throw new Error();

    return {
      productData: (await response.json()) as ProductListResponse,
      loadingError: '',
    };
  } catch {
    return { productData: emptyProductData, loadingError: loadErrorText };
  }
};

export default async function PetTypePage({
  params,
  searchParams,
}: PetTypePageProps) {
  const routeParams = params ? await params : {};
  const requestHeaders = await headers();
  const cookie = requestHeaders.get('cookie');
  const forwardedHeaders: HeadersInit = cookie ? { cookie } : {};
  const petType = routeParams.petType ?? 'dog';
  const productParams = normalizeSearchParams(
    searchParams ? await searchParams : {}
  );
  const productMegaMenuCards = await fetchMegaMenu();
  const { productData, loadingError } = await fetchProductData(
    petType,
    productParams,
    productMegaMenuCards
  );
  const favoriteIds = cookie
    ? await fetchFavoriteIds(
        productData.products.map((product) => product.id),
        forwardedHeaders
      )
    : [];
  const productDataWithFavorites = withFavoriteOverlay(
    productData,
    favoriteIds
  );

  return (
    <ProductListClient
      key={`${petType}:${JSON.stringify(productParams)}`}
      petType={petType}
      params={productParams}
      productData={productDataWithFavorites}
      productMegaMenuCards={productMegaMenuCards}
      loadingError={loadingError}
    />
  );
}
