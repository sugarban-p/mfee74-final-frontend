'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  type KeyboardEvent,
  type SyntheticEvent,
  useEffect,
  useState,
} from 'react';

import {
  LuSearch,
  LuSendHorizontal,
  LuArrowDownWideNarrow,
} from 'react-icons/lu';

import { FilterButton } from '@/src/components/product/FilterButton';
import { ProductCard } from '@/src/components/product/ProductCard';
import {
  getProductCategoryId,
  getProductMegaMenuCard,
  PRODUCT_MEGA_MENU_FALLBACK,
  type ProductMegaMenuCard,
  type ProductMegaMenuResponse,
} from '@/src/services/product-mega-menu';

const ALL_PRODUCTS_CATEGORY = {
  category: '所有商品',
  count: 0,
  slug: 'all-products',
};

interface ProductSearchParams {
  category?: string;
  tags?: string;
  keywords?: string;
  search?: string;
  'min-value'?: string;
  'max-value'?: string;
  page?: string;
  sort?: string;
}

interface PetTypePageProps {
  searchParams?: Promise<ProductSearchParams>;
}

interface ApiCategory {
  id: number;
  tag_ch: string;
  tag_slug: string;
  catCount: number | string;
}

interface ApiTag {
  id: number;
  tag_ch: string;
}

interface ApiAvatar {
  src: string;
  thumbnail: string;
}

interface ApiImage {
  src: string;
}

interface ApiProduct {
  id: number;
  prod_name: string;
  price: number;
  slug: string;
  total_stock?: number;
  tags_id?: number[];
  intros?: {
    slogan?: string;
    content?: string;
  };
  avatars?: ApiAvatar[];
  images?: ApiImage[];
}

interface ProductListResponse {
  success: boolean;
  facets: {
    categories: ApiCategory[];
    tags: ApiTag[];
  };
  pagination: {
    currentPage: number;
    perPage: number;
    totalRows: number;
    totalPages: number;
  };
  products: ApiProduct[];
}

interface FavoriteResponse {
  success: boolean;
  favorites: {
    id: number;
  }[];
}

interface CardProduct {
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

type PriceParam = 'min-value' | 'max-value';

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

const toPublicImagePath = (path?: string) => {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;

  return `/${path.replace(/^\/+/, '')}`;
};

const getBreadcrumbTitle = (petType: string) => {
  return petType === 'cat' ? '貓咪專區' : '狗勾專區';
};

const paramsFromUrlSearchParams = (
  searchParams: URLSearchParams
): ProductSearchParams => {
  return {
    category: searchParams.get('category') ?? undefined,
    tags: searchParams.get('tags') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    'min-value': searchParams.get('min-value') ?? undefined,
    'max-value': searchParams.get('max-value') ?? undefined,
    page: searchParams.get('page') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
  };
};

const mapProducts = (
  products: ApiProduct[],
  tags: ApiTag[],
  petType: string,
  favoriteProductIds: Set<number>
) => {
  const tagMap = new Map(tags.map((tag) => [tag.id, tag.tag_ch]));

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
      petType,
      isFavorite: favoriteProductIds.has(product.id),
      soldOut: Number(product.total_stock ?? 0) <= 0,
    };
  });
};

export default function PetTypePage({ searchParams }: PetTypePageProps) {
  const router = useRouter();
  const routeParams = useParams<{ petType?: string }>();
  const petType = routeParams.petType ?? 'dog';
  const [params, setParams] = useState<ProductSearchParams>({});
  const [searchParamsReady, setSearchParamsReady] = useState(false);
  const [productData, setProductData] =
    useState<ProductListResponse>(emptyProductData);
  const [loadingError, setLoadingError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteProductIds, setFavoriteProductIds] = useState<Set<number>>(
    new Set()
  );
  const [productMegaMenuCards, setProductMegaMenuCards] = useState<
    ProductMegaMenuCard[]
  >(PRODUCT_MEGA_MENU_FALLBACK);
  const [keywordInput, setKeywordInput] = useState('');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');

  useEffect(() => {
    let ignore = false;

    if (!searchParams) {
      setSearchParamsReady(true);
      return;
    }

    void searchParams.then((nextParams) => {
      if (ignore) return;

      const nextSearch = nextParams.search ?? nextParams.keywords ?? '';
      setParams({ ...nextParams, search: nextSearch });
      setKeywordInput(nextSearch);
      setMinPriceInput(nextParams['min-value'] ?? '');
      setMaxPriceInput(nextParams['max-value'] ?? '');
      setSearchParamsReady(true);
    });

    return () => {
      ignore = true;
    };
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();

    void fetch('/api/products/mega-menu', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error();

        return response.json() as Promise<ProductMegaMenuResponse>;
      })
      .then((data) => {
        if (!data.success || data.cards.length === 0) throw new Error();

        setProductMegaMenuCards(data.cards);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setProductMegaMenuCards(PRODUCT_MEGA_MENU_FALLBACK);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!searchParamsReady) return;

    const controller = new AbortController();
    const nextParams = new URLSearchParams();
    const category = params.category ?? ALL_PRODUCTS_CATEGORY.slug;
    const productMenuCard = getProductMegaMenuCard(
      productMegaMenuCards,
      petType
    );
    const petTypeId = productMenuCard?.id ?? Number(petType);
    const categoryId =
      category === ALL_PRODUCTS_CATEGORY.slug
        ? 0
        : getProductCategoryId(productMenuCard, category);

    if (!Number.isInteger(petTypeId) || petTypeId <= 0) {
      setProductData(emptyProductData);
      setLoadingError('商品資料載入失敗');
      setIsLoading(false);
      return () => controller.abort();
    }

    if (categoryId) {
      nextParams.set('categoryId', String(categoryId));
    }
    if (params.tags) nextParams.set('tags', params.tags);
    if (params.search) nextParams.set('search', params.search);
    if (params['min-value']) nextParams.set('min-value', params['min-value']);
    if (params['max-value']) nextParams.set('max-value', params['max-value']);
    if (params.sort) nextParams.set('sort', params.sort);
    if (params.page) nextParams.set('page', params.page);

    const queryString = nextParams.toString();
    const url = `/api/products/${encodeURIComponent(String(petTypeId))}${queryString ? `?${queryString}` : ''}`;

    setIsLoading(true);
    setLoadingError('');

    void fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('商品資料載入失敗');
        }

        return response.json();
      })
      .then((nextProductData: ProductListResponse) => {
        setProductData(nextProductData);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setProductData(emptyProductData);
        setLoadingError(
          error instanceof Error ? error.message : '商品資料載入失敗'
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [params, petType, productMegaMenuCards, searchParamsReady]);

  useEffect(() => {
    const controller = new AbortController();

    void fetch('/api/products/getFavorite', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error();

        return response.json();
      })
      .then((data: FavoriteResponse) => {
        if (!data.success) throw new Error();

        setFavoriteProductIds(
          new Set(data.favorites.map((favorite) => favorite.id))
        );
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      });

    return () => controller.abort();
  }, []);

  const categoriesFromApi = productData.facets.categories.map((category) => ({
    category: category.tag_ch,
    count: Number(category.catCount),
    slug: category.tag_slug,
  }));
  const categories = [
    {
      ...ALL_PRODUCTS_CATEGORY,
      count: categoriesFromApi.reduce(
        (total, category) => total + category.count,
        0
      ),
    },
    ...categoriesFromApi,
  ];
  const tags = productData.facets.tags.map((tag) => ({
    tag: tag.tag_ch,
    slug: String(tag.id),
  }));
  const selectedCategory = params.category ?? categories[0].slug;
  const selectedTags = params.tags?.split(',').filter(Boolean) ?? [];
  const search = params.search ?? '';
  const minPrice = params['min-value'] ?? '';
  const maxPrice = params['max-value'] ?? '';
  const selectedSort = params.sort ?? '';
  const productMenuCard = getProductMegaMenuCard(productMegaMenuCards, petType);
  const breadcrumbTitle = productMenuCard?.title ?? getBreadcrumbTitle(petType);
  const selectedTagSet = new Set(selectedTags);
  const currentCategory =
    categories.find(({ slug }) => slug === selectedCategory) ?? categories[0];
  const selectedCategoryName = currentCategory.category;
  const pageCount = Math.max(1, productData.pagination.totalPages);
  const currentPage = Math.min(
    Math.max(productData.pagination.currentPage, 1),
    pageCount
  );
  const totalRows = productData.pagination.totalRows;
  const displayStart =
    totalRows > 0 ? (currentPage - 1) * productData.pagination.perPage + 1 : 0;
  const displayEnd = Math.min(
    currentPage * productData.pagination.perPage,
    totalRows
  );
  const displayedProducts: CardProduct[] = mapProducts(
    productData.products,
    productData.facets.tags,
    petType,
    favoriteProductIds
  );
  const searchDisabled = keywordInput.trim() === search;
  const createHref = ({
    category = selectedCategory,
    tagSlugs = selectedTags,
    nextSearch = search,
    minPriceValue = minPrice,
    maxPriceValue = maxPrice,
    sort = selectedSort,
    page,
  }: {
    category?: string;
    tagSlugs?: string[];
    nextSearch?: string;
    minPriceValue?: string;
    maxPriceValue?: string;
    sort?: string;
    page?: number;
  }) => {
    const nextParams = new URLSearchParams({ category });

    if (tagSlugs.length) nextParams.set('tags', tagSlugs.join(','));
    if (nextSearch) nextParams.set('search', nextSearch);
    if (minPriceValue) nextParams.set('min-value', minPriceValue);
    if (maxPriceValue) nextParams.set('max-value', maxPriceValue);
    if (sort) nextParams.set('sort', sort);
    if (page) nextParams.set('page', String(page));

    return `?${nextParams.toString()}`;
  };
  const pushHref = (href: string) => {
    setParams(paramsFromUrlSearchParams(new URLSearchParams(href.slice(1))));
    router.push(href);
  };
  const createCategoryHref = (category: string) => {
    return createHref({ category });
  };
  const createTagHref = (tagSlug: string) => {
    const nextTags = selectedTagSet.has(tagSlug)
      ? selectedTags.filter((selectedTag) => selectedTag !== tagSlug)
      : [...selectedTags, tagSlug];

    return createHref({ tagSlugs: nextTags });
  };
  const handleSearchSubmit = (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextSearch = String(formData.get('search') ?? '').trim();

    setKeywordInput(nextSearch);
    pushHref(createHref({ nextSearch }));
  };
  const handleSortChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    pushHref(createHref({ sort: event.currentTarget.value }));
  };
  const handlePriceSubmit = (param: PriceParam, value: string) => {
    const nextValue = value.replace(/\D/g, '');

    if (!nextValue) return;

    if (param === 'min-value') {
      setMinPriceInput(nextValue);
      pushHref(createHref({ minPriceValue: nextValue }));
      return;
    }

    setMaxPriceInput(nextValue);
    pushHref(createHref({ maxPriceValue: nextValue }));
  };
  const handlePriceKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    param: PriceParam,
    value: string
  ) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    handlePriceSubmit(param, value);
  };
  const priceFilters = [
    {
      label: '最低金額',
      param: 'min-value',
      value: minPriceInput,
      onChange: setMinPriceInput,
      ariaLabel: '套用最低金額',
    },
    {
      label: '最高金額',
      param: 'max-value',
      value: maxPriceInput,
      onChange: setMaxPriceInput,
      ariaLabel: '套用最高金額',
    },
  ] satisfies {
    label: string;
    param: PriceParam;
    value: string;
    onChange: (value: string) => void;
    ariaLabel: string;
  }[];

  return (
    <div className="flex flex-row items-start gap-24">
      <aside className="w-[250px] shrink-0">
        <form className="flex flex-col gap-12" onSubmit={handleSearchSubmit}>
          <input type="hidden" name="category" value={selectedCategory} />
          {selectedTags.length > 0 && (
            <input type="hidden" name="tags" value={selectedTags.join(',')} />
          )}
          <label
            htmlFor="keyword"
            className="flex h-8 items-center gap-2 rounded border border-secondary bg-transparent px-2 text-xs text-secondary"
          >
            <LuSearch className="size-4 shrink-0" />
            <input
              id="keyword"
              name="search"
              inputMode="search"
              className="typo-card-body min-w-0 grow bg-transparent text-text-primary outline-none placeholder:text-text-secondary"
              placeholder="想尋找什麼商品呢?"
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.currentTarget.value)}
            />
            <button
              type="submit"
              aria-label="搜尋商品"
              disabled={searchDisabled}
              className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LuSendHorizontal className="size-4 shrink-0" />
            </button>
          </label>

          <section className="flex flex-col gap-3">
            <h4 className="typo-tab text-text-primary">商品類別</h4>
            <div className="flex flex-col gap-2">
              {categories.map(({ category, count, slug }) => {
                const active = selectedCategory === slug;

                return (
                  <FilterButton
                    key={slug}
                    href={createCategoryHref(slug)}
                    active={active}
                    className="flex items-center justify-between"
                  >
                    <span>{category}</span>
                    <span>{count}</span>
                  </FilterButton>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col gap-3 border-t border-secondary py-4">
            <h4 className="typo-body-medium text-text-primary">
              商品標籤
              <span className="typo-tab"> (可複選)</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {tags.map(({ tag, slug }) => {
                const active = selectedTagSet.has(slug);

                return (
                  <FilterButton
                    key={slug}
                    href={createTagHref(slug)}
                    active={active}
                    aria-pressed={active}
                  >
                    {tag}
                  </FilterButton>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col gap-3 border-t border-secondary py-4">
            <h4 className="typo-body-medium text-text-primary">價格區間</h4>
            {priceFilters.map(
              ({ label, param, value, onChange, ariaLabel }) => (
                <label
                  key={label}
                  className="typo-tab flex flex-col gap-1 text-[#3d4451]"
                >
                  {label}
                  <span className="flex h-8 items-center gap-2 rounded border border-secondary bg-transparent px-4 text-[#3d4451]">
                    <input
                      type="text"
                      name={param}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="typo-card-body min-w-0 grow bg-transparent outline-none placeholder:text-[#3d4451]"
                      placeholder="輸入數字"
                      value={value}
                      onChange={(event) =>
                        onChange(event.currentTarget.value.replace(/\D/g, ''))
                      }
                      onKeyDown={(event) =>
                        handlePriceKeyDown(event, param, value)
                      }
                    />
                    <button
                      type="button"
                      aria-label={ariaLabel}
                      disabled={value === ''}
                      className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => handlePriceSubmit(param, value)}
                    >
                      <LuSendHorizontal className="size-4 shrink-0" />
                    </button>
                  </span>
                </label>
              )
            )}
          </section>
        </form>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col gap-12">
        <div
          aria-label="Breadcrumb"
          className="typo-body-medium breadcrumbs text-sm"
        >
          <ul className="typo-body-medium text-primary">
            <li>
              <Link href="/">首頁</Link>
            </li>
            <li>
              <Link href={createHref({ category: categories[0].slug })}>
                {breadcrumbTitle}
              </Link>
            </li>
            <li className="text-text-primary">{selectedCategoryName}</li>
          </ul>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-wrap items-end gap-2.5">
            <h2 className="typo-h2 text-text-primary">
              {selectedCategoryName}
            </h2>
            <p className="typo-body text-text-secondary">
              (共{totalRows}項，顯示第{String(displayStart).padStart(2, '0')}~
              {String(displayEnd).padStart(2, '0')}項)
            </p>
          </div>

          <label className="typo-tab flex items-center gap-2 text-text-primary">
            <LuArrowDownWideNarrow className="size-4" />
            排序方式:
            <select
              value={selectedSort}
              onChange={handleSortChange}
              className="h-8 cursor-pointer rounded border border-secondary bg-transparent px-3 text-text-primary outline-none"
            >
              <option value="">熱銷</option>
              <option value="latest">最新</option>
              <option value="price_asc">價格(低到高)</option>
              <option value="price_desc">價格(高到低)</option>
            </select>
          </label>
        </div>

        {loadingError && (
          <p className="typo-body text-error" role="alert">
            {loadingError}
          </p>
        )}

        <div className="grid grid-cols-4 gap-8">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {!isLoading && !loadingError && displayedProducts.length === 0 && (
          <p className="typo-body text-text-secondary">
            目前沒有符合條件的商品
          </p>
        )}

        <nav
          aria-label="Pagination"
          className="typo-body-medium flex items-center justify-center gap-8"
        >
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (page) => (
              <Link
                key={page}
                href={createHref({ page })}
                className={
                  page === currentPage ? 'text-text-primary' : 'text-primary'
                }
              >
                {page}
              </Link>
            )
          )}
        </nav>
      </section>
    </div>
  );
}
