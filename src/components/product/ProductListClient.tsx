'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type KeyboardEvent, type SyntheticEvent, useState } from 'react';

import {
  LuSearch,
  LuSendHorizontal,
  LuArrowDownWideNarrow,
} from 'react-icons/lu';
import { RiCloseCircleLine, RiCloseCircleFill } from 'react-icons/ri';

import { FilterButton } from '@/src/components/product/FilterButton';
import { ProductCard } from '@/src/components/product/ProductCard';
import {
  getProductMegaMenuCard,
  type ProductMegaMenuCard,
} from '@/src/services/product-mega-menu';

const ALL_PRODUCTS_CATEGORY = {
  category: '所有商品',
  count: 0,
  slug: 'all-products',
};

export interface ProductSearchParams {
  category?: string;
  tags?: string;
  keywords?: string;
  search?: string;
  'min-value'?: string;
  'max-value'?: string;
  page?: string;
  sort?: string;
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

interface ApiProduct {
  id: number;
  prod_name: string;
  price: number;
  slug: string;
  total_stock?: number;
  tags?: ApiTag[];
  intro?: ApiIntro;
  avatar?: ApiAvatar | null;
  petType?: ApiPetType | null;
  isFavorite?: boolean;
}

export interface ProductListResponse {
  success: boolean;
  petTypeId?: number | string;
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

type PriceParam = 'min-value' | 'max-value';

const getBreadcrumbTitle = (petType: string) => {
  return petType === 'cat' ? '貓咪專區' : '狗勾專區';
};

const mapProducts = (products: ApiProduct[]) => {
  return products.map((product) => ({
    id: product.id,
    avatar: product.avatar,
    tags: product.tags,
    name: product.prod_name,
    intro: product.intro,
    price: `NT$${Number(product.price).toLocaleString('zh-TW')}`,
    slug: product.slug,
    petType: product.petType,
    isFavorite: product.isFavorite ?? false,
    soldOut: Number(product.total_stock ?? 0) <= 0,
  }));
};

interface ProductListClientProps {
  petType: string;
  params: ProductSearchParams;
  productData: ProductListResponse;
  productMegaMenuCards: ProductMegaMenuCard[];
  loadingError: string;
}

export function ProductListClient({
  petType,
  params,
  productData,
  productMegaMenuCards,
  loadingError,
}: ProductListClientProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [keywordInput, setKeywordInput] = useState(params.search ?? '');
  const [minPriceInput, setMinPriceInput] = useState(params['min-value'] ?? '');
  const [maxPriceInput, setMaxPriceInput] = useState(params['max-value'] ?? '');
  const productMenuCard = getProductMegaMenuCard(productMegaMenuCards, petType);
  const selectedCategoryParam = params.category ?? ALL_PRODUCTS_CATEGORY.slug;
  const effectiveLoadingError = loadingError;

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
  const selectedCategory = selectedCategoryParam;
  const selectedTags = params.tags?.split(',').filter(Boolean) ?? [];
  const search = params.search ?? '';
  const minPrice = params['min-value'] ?? '';
  const maxPrice = params['max-value'] ?? '';
  const selectedSort = params.sort ?? '';
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
  const displayedProducts: CardProduct[] = mapProducts(productData.products);
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
    setIsNavigating(true);
    router.push(href, { scroll: false });
  };
  const handleNavigate = () => {
    setIsNavigating(true);
  };
  const createCategoryHref = (category: string) => {
    return createHref({ category, tagSlugs: [] });
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
  const handleSearchClear = () => {
    setKeywordInput('');
    if (!search) return;

    pushHref(createHref({ nextSearch: '' }));
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
  const handlePriceClear = (param: PriceParam) => {
    if (param === 'min-value') {
      setMinPriceInput('');
      if (!minPrice) return;

      pushHref(createHref({ minPriceValue: '' }));
      return;
    }

    setMaxPriceInput('');
    if (!maxPrice) return;

    pushHref(createHref({ maxPriceValue: '' }));
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
    <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-24">
      <aside className="w-full lg:w-[250px] lg:shrink-0">
        <form
          className="flex w-full flex-col gap-6 lg:gap-12"
          onSubmit={handleSearchSubmit}
        >
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
            {keywordInput !== '' && (
              <button
                type="button"
                aria-label="清除搜尋"
                className="group cursor-pointer"
                onClick={handleSearchClear}
              >
                <RiCloseCircleLine className="size-4 shrink-0 group-hover:hidden" />
                <RiCloseCircleFill className="hidden size-4 shrink-0 group-hover:block" />
              </button>
            )}
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
                    scroll={false}
                    onNavigate={active ? undefined : handleNavigate}
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
                    scroll={false}
                    onNavigate={handleNavigate}
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
                    {value !== '' && (
                      <button
                        type="button"
                        aria-label={`清除${label}`}
                        className="group cursor-pointer"
                        onClick={() => handlePriceClear(param)}
                      >
                        <RiCloseCircleLine className="size-4 shrink-0 group-hover:hidden" />
                        <RiCloseCircleFill className="hidden size-4 shrink-0 group-hover:block" />
                      </button>
                    )}
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

      <section className="flex min-w-0 flex-col gap-12">
        <div
          aria-label="Breadcrumb"
          className="typo-body-medium breadcrumbs text-sm"
        >
          <ul className="typo-body-medium text-primary">
            <li>
              <Link href="/">首頁</Link>
            </li>
            <li>
              <Link
                href={createCategoryHref(categories[0].slug)}
                scroll={false}
                onNavigate={
                  selectedCategory === categories[0].slug
                    ? undefined
                    : handleNavigate
                }
              >
                {breadcrumbTitle}
              </Link>
            </li>
            <li className="text-text-primary">{selectedCategoryName}</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap items-end gap-2.5">
            <h2 className="typo-h2 text-text-primary">
              {selectedCategoryName}
            </h2>
            <p className="typo-body text-text-secondary">
              (共{totalRows}項，顯示第{String(displayStart).padStart(2, '0')}~
              {String(displayEnd).padStart(2, '0')}項)
            </p>
          </div>

          <label className="typo-tab flex flex-wrap items-center gap-2 text-text-primary">
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

        {effectiveLoadingError && (
          <p className="typo-body text-error" role="alert">
            {effectiveLoadingError}
          </p>
        )}

        <div className="min-h-40" aria-busy={isNavigating}>
          {isNavigating && (
            <div className="flex min-h-40 items-center justify-center">
              <span className="loading loading-md loading-spinner text-primary" />
            </div>
          )}
          <div
            className={
              isNavigating
                ? 'hidden'
                : 'grid grid-cols-2 gap-x-0 gap-y-6 sm:gap-8 xl:grid-cols-3 2xl:grid-cols-4'
            }
          >
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {!isNavigating &&
          !effectiveLoadingError &&
          displayedProducts.length === 0 && (
            <p className="typo-body text-text-secondary">
              目前沒有符合條件的商品
            </p>
          )}
        <nav
          aria-label="Pagination"
          className="typo-body-medium flex items-center justify-center gap-8"
        >
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (page) =>
              page === currentPage ? (
                <span
                  key={page}
                  aria-current="page"
                  className="text-text-primary"
                >
                  {page}
                </span>
              ) : (
                <Link
                  key={page}
                  href={createHref({ page })}
                  scroll={false}
                  onNavigate={handleNavigate}
                  className="text-primary"
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
