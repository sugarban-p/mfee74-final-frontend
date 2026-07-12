'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

const PRODUCTS_PER_PAGE = 16;

const categories = [
  { category: '所有商品', count: 55, slug: 'all-products' },
  { category: '主食', count: 22, slug: 'main-food' },
  { category: '零食/點心', count: 10, slug: 'treat' },
  { category: '牽引用品', count: 8, slug: 'leash' },
  { category: '保健品', count: 14, slug: 'supplements' },
  { category: '生活用品', count: 1, slug: 'supplies' },
];

const tags = [
  { tag: '幼齡(0~1歲)', slug: 'kitten' },
  { tag: '孕貓', slug: 'pregnant-cat' },
  { tag: '室內', slug: 'indoor' },
  { tag: '室外', slug: 'outdoor' },
  { tag: '低敏', slug: 'hypo-allergenic' },
  { tag: '無穀', slug: 'grain-free' },
];

const productCount = Math.max(...categories.map(({ count }) => count));
const products = Array.from({ length: productCount }, (_, index) => ({
  id: index + 1,
  image: index === 0 ? '/蔬肉糧產品圖_01-510x510.jpg' : '',
  tags: index === 0 ? ['幼齡(0~1歲)', '低敏'] : [],
  name: index === 0 ? '慢烘鮮食蔬肉糧' : '商品名稱',
  description: index === 0 ? '最接近鮮食的天然慢烘糧!' : '簡短標語敘述',
  price: index === 0 ? 'NT$229' : 'NT$9999',
  slug: index === 0 ? 'slow-roast-mixed-food' : 'prod_x',
}));

interface ProductSearchParams {
  category?: string;
  tags?: string;
  keywords?: string;
  'min-value'?: string;
  'max-value'?: string;
  page?: string;
  sort?: string;
  title?: string;
}

type PriceParam = 'min-value' | 'max-value';

interface PetTypePageProps {
  searchParams?: Promise<ProductSearchParams>;
}

export default function PetTypePage({ searchParams }: PetTypePageProps) {
  const router = useRouter();
  const [params, setParams] = useState<ProductSearchParams>({});
  const [keywordInput, setKeywordInput] = useState('');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');

  useEffect(() => {
    let ignore = false;

    if (!searchParams) return;

    void searchParams.then((nextParams) => {
      if (!ignore) {
        setParams(nextParams);
        setKeywordInput(nextParams.keywords ?? '');
        setMinPriceInput(nextParams['min-value'] ?? '');
        setMaxPriceInput(nextParams['max-value'] ?? '');
      }
    });

    return () => {
      ignore = true;
    };
  }, [searchParams]);

  const selectedCategory = params?.category ?? categories[0].slug;
  const selectedTags = params?.tags?.split(',').filter(Boolean) ?? [];
  const keywords = params?.keywords ?? '';
  const minPrice = params?.['min-value'] ?? '';
  const maxPrice = params?.['max-value'] ?? '';
  const searchDisabled = keywordInput.trim() === '';
  const selectedSort = params?.sort ?? '';
  const breadcrumbTitle = params?.title ?? '狗勾專區';
  const selectedTagSet = new Set(selectedTags);
  const currentCategory =
    categories.find(({ slug }) => slug === selectedCategory) ?? categories[0];
  const selectedCategoryName = currentCategory.category;
  const pageCount = Math.max(
    1,
    Math.ceil(currentCategory.count / PRODUCTS_PER_PAGE)
  );
  const pageFromParams = Number(params?.page);
  const currentPage = Number.isInteger(pageFromParams)
    ? Math.min(Math.max(pageFromParams, 1), pageCount)
    : 1;
  const displayStart = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const displayEnd = Math.min(
    currentPage * PRODUCTS_PER_PAGE,
    currentCategory.count
  );
  const displayedProducts = products.slice(displayStart - 1, displayEnd);
  const createHref = ({
    category = selectedCategory,
    tagSlugs = selectedTags,
    nextKeywords = keywords,
    minPriceValue = minPrice,
    maxPriceValue = maxPrice,
    sort = selectedSort,
    page,
  }: {
    category?: string;
    tagSlugs?: string[];
    nextKeywords?: string;
    minPriceValue?: string;
    maxPriceValue?: string;
    sort?: string;
    page?: number;
  }) => {
    const nextParams = new URLSearchParams({ category });

    if (tagSlugs.length) nextParams.set('tags', tagSlugs.join(','));
    if (nextKeywords) nextParams.set('keywords', nextKeywords);
    if (minPriceValue) nextParams.set('min-value', minPriceValue);
    if (maxPriceValue) nextParams.set('max-value', maxPriceValue);
    if (sort) nextParams.set('sort', sort);
    if (page) nextParams.set('page', String(page));
    if (params?.title) nextParams.set('title', params.title);

    return `?${nextParams.toString()}`;
  };
  const pushHref = (href: string) => {
    setParams(
      Object.fromEntries(
        new URLSearchParams(href.slice(1))
      ) as ProductSearchParams
    );
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
    const nextKeywords = String(formData.get('keywords') ?? '').trim();

    setKeywordInput(nextKeywords);
    pushHref(createHref({ nextKeywords }));
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
              name="keywords"
              inputMode="search"
              className="min-w-0 grow bg-transparent typo-card-body text-text-primary outline-none placeholder:text-text-secondary"
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
                  <span className="flex px-4 h-8 items-center gap-2 rounded border border-secondary bg-transparent text-[#3d4451]">
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
              (共{currentCategory.count}項，顯示第
              {String(displayStart).padStart(2, '0')}~
              {String(displayEnd).padStart(2, '0')}項)
            </p>
          </div>

          <label className="typo-tab flex items-center gap-2 text-text-primary">
            <LuArrowDownWideNarrow className="size-4" />
            排序方式:
            <select
              value={selectedSort}
              onChange={handleSortChange}
              className="cursor-pointer h-8 rounded border border-secondary bg-transparent px-3 text-text-primary outline-none"
            >
              <option value="">熱銷</option>
              <option value="latest">最新</option>
              <option value="price-asc">價格(低到高)</option>
              <option value="price-desc">價格(高到低)</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

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
