import Link from 'next/link';

import {
  LuArrowDownUp,
  LuHeart,
  LuSearch,
  LuSendHorizontal,
} from 'react-icons/lu';

const categories = [
  { category: '所有商品', count: 55, slug: 'all-products' },
  { category: '主食', count: 22, slug: 'main-food' },
  { category: '零食/點心', count: 10, slug: 'treat' },
  { category: '牽引用品', count: 8, slug: 'leash' },
  { category: '保健品', count: 14, slug: 'supplements' },
  { category: '生活用品', count: 1, slug: 'supplies' },
];

const tags = [
  { tag: '幼齡', slug: 'juvenile' },
  { tag: '毛髮養護', slug: 'coat-care' },
  { tag: '室內', slug: 'indoor' },
  { tag: '室外', slug: 'outdoor' },
  { tag: '低敏', slug: 'hypoallergenic' },
  { tag: '無穀', slug: 'grain-free' },
];

const products = Array.from({ length: 16 }, (_, index) => ({
  id: index + 1,
  image: index === 0 ? '/蔬肉糧產品圖_01-510x510.jpg' : '',
  tags: index === 0 ? ['幼齡', '低敏'] : [],
  name: index === 0 ? '慢烘鮮食蔬肉糧' : '商品名稱',
  description: index === 0 ? '最接近鮮食的天然慢烘糧!' : '簡短標語敘述',
  price: index === 0 ? 'NT$229' : 'NT$9999',
}));

interface ProductCardProps {
  product: (typeof products)[number];
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="w-full overflow-hidden rounded-lg bg-card-primary">
      <div
        className={[
          'h-[149px] w-full bg-button-disabled',
          product.image ? 'bg-cover bg-center' : '',
        ].join(' ')}
        style={
          product.image
            ? { backgroundImage: `url(${product.image})` }
            : undefined
        }
      />

      <div className="flex flex-col gap-1 p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-[18px] gap-1 overflow-hidden">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="shrink-0 rounded-full bg-card-secondary px-2 text-xs leading-[18px] text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            aria-label="加入收藏"
            className="flex size-6 items-center justify-center text-secondary"
          >
            <LuHeart className="size-4" />
          </button>
        </div>

        <h2 className="typo-card-title truncate text-[#3d4451]">
          {product.name}
        </h2>
        <p className="typo-card-body truncate text-[#3d4451]">
          {product.description}
        </p>
        <p className="typo-card-body text-[#3d4451]">{product.price}</p>

        <button
          type="button"
          className="mt-1 rounded-full bg-primary px-3 py-2 text-center text-base leading-[22.75px] text-white"
        >
          加入購物車
        </button>
      </div>
    </article>
  );
}

interface PetTypePageProps {
  searchParams?: Promise<{
    category?: string;
    tags?: string;
  }>;
}

export default async function PetTypePage({ searchParams }: PetTypePageProps) {
  const params = await searchParams;
  const selectedCategory = params?.category ?? categories[0].slug;
  const selectedTags = params?.tags?.split(',').filter(Boolean) ?? [];
  const selectedTagSet = new Set(selectedTags);
  const selectedCategoryName =
    categories.find(({ slug }) => slug === selectedCategory)?.category ??
    categories[0].category;
  const createCategoryHref = (category: string) => {
    const nextParams = new URLSearchParams({ category });

    if (selectedTags.length) nextParams.set('tags', selectedTags.join(','));

    return `?${nextParams.toString()}`;
  };
  const createTagHref = (tag: string) => {
    const nextTags = selectedTagSet.has(tag)
      ? selectedTags.filter((selectedTag) => selectedTag !== tag)
      : [...selectedTags, tag];
    const nextParams = new URLSearchParams({ category: selectedCategory });

    if (nextTags.length) nextParams.set('tags', nextTags.join(','));

    return `?${nextParams.toString()}`;
  };

  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-24">
      <aside className="w-full shrink-0 lg:w-[250px]">
        <form className="flex flex-col gap-12">
          <label
            htmlFor="keyword"
            className="flex h-8 items-center gap-2 rounded border border-secondary bg-transparent px-2 text-xs text-secondary"
          >
            <LuSearch className="size-4 shrink-0" />
            <input
              id="keyword"
              name="keyword"
              inputMode="search"
              className="min-w-0 grow bg-transparent text-text-primary outline-none placeholder:text-text-secondary"
              placeholder="想尋找什麼商品呢?"
            />
            <LuSendHorizontal className="size-4 shrink-0" />
          </label>

          <section className="flex flex-col gap-3">
            <h4 className="typo-tab text-text-primary">商品類別</h4>
            <div className="flex flex-col gap-2">
              {categories.map(({ category, count, slug }) => {
                const active = selectedCategory === slug;

                return (
                  <Link
                    key={slug}
                    href={createCategoryHref(slug)}
                    role="button"
                    className={[
                      'typo-tab flex items-center justify-between rounded-lg px-3 py-2 font-bold transition-all',
                      active
                        ? 'bg-primary text-white'
                        : 'border border-secondary text-text-primary hover:bg-base-200 hover:text-base-content focus:bg-base-200 focus:text-base-content',
                    ].join(' ')}
                  >
                    <span>{category}</span>
                    <span>{count}</span>
                  </Link>
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
                  <Link
                    key={slug}
                    href={createTagHref(slug)}
                    role="button"
                    aria-pressed={active}
                    className={[
                      'typo-tab rounded-lg px-3 py-2 font-bold transition-all',
                      active
                        ? 'bg-primary text-text-button'
                        : 'border border-secondary text-text-primary hover:bg-base-200 hover:text-base-content',
                    ].join(' ')}
                  >
                    {tag}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col gap-3 border-t border-secondary py-4">
            <h4 className="typo-body-medium text-text-primary">價格區間</h4>
            {['最低金額', '最高金額'].map((label) => (
              <label
                key={label}
                className="typo-tab flex flex-col gap-1 text-[#3d4451]"
              >
                {label}
                <input
                  type="text"
                  inputMode="numeric"
                  className="typo-card-body rounded border border-secondary bg-transparent px-4 py-[9px] text-[#3d4451] outline-none placeholder:text-[#3d4451]"
                  placeholder="輸入數字"
                />
              </label>
            ))}
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
              <Link href="/product/dog?category=all-products">狗勾專區</Link>
            </li>
            <li className="text-text-primary">{selectedCategoryName}</li>
          </ul>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-wrap items-end gap-2.5">
            <h2 className="typo-h2 text-text-primary">所有商品</h2>
            <p className="typo-body text-text-secondary">
              (共55項，顯示第01~16項)
            </p>
          </div>

          <label className="typo-tab flex items-center gap-2 text-text-primary">
            <LuArrowDownUp className="size-4" />
            排序方式:
            <select className="h-8 rounded border border-secondary bg-transparent px-3 text-text-primary outline-none">
              <option>熱銷</option>
              <option>最新</option>
              <option>價格(低到高)</option>
              <option>價格(高到低)</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[repeat(4,258.5px)]">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <nav
          aria-label="Pagination"
          className="typo-body-medium flex items-center justify-center gap-8"
        >
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              type="button"
              className={page === 1 ? 'text-text-primary' : 'text-primary'}
            >
              {page}
            </button>
          ))}
        </nav>
      </section>
    </div>
  );
}
