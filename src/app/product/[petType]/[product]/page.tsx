'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  product: '商品',
  recommendedDescription: '精選商品',
  recommendedProduct: '推薦商品',
  recommendedTag: '推薦',
} as const;

const loadingText = '商品資料載入中...';
const loadErrorText = '商品資料載入失敗';

const recommendationProducts = Array.from({ length: 4 }, () => ({
  avatar: '',
  tags: [labels.recommendedTag],
  name: labels.recommendedProduct,
  description: labels.recommendedDescription,
  price: 'NT$999',
  isFavorite: false,
  slug: 'prod_x',
}));

export default function ProductPage() {
  const params = useParams<{ petType?: string; product?: string }>();
  const petType = params.petType ?? '';
  const productSlug = params.product ?? '';

  return (
    <ProductPageContent
      key={`${petType}:${productSlug}`}
      petType={petType}
      productSlug={productSlug}
    />
  );
}

interface ProductPageContentProps {
  petType: string;
  productSlug: string;
}

interface ResolvedProductIds {
  petTypeId: number;
  productId: number;
}

interface ProductResolveResponse {
  success: boolean;
  petTypeId?: number;
  productId?: number;
  message?: string;
}

function ProductPageContent({ petType, productSlug }: ProductPageContentProps) {
  const [resolvedProductIds, setResolvedProductIds] =
    useState<ResolvedProductIds | null>(null);
  const [loadingError, setLoadingError] = useState('');
  const [showAllDescriptions, setShowAllDescriptions] = useState(false);
  const [productDetail, setProductDetail] =
    useState<QuickShoppingDetail | null>(null);

  useEffect(() => {
    if (!petType || !productSlug) return;

    const controller = new AbortController();

    void fetch(
      `/api/products/resolve/${encodeURIComponent(petType)}/${encodeURIComponent(productSlug)}`,
      { signal: controller.signal }
    )
      .then((response) => {
        if (!response.ok) throw new Error(loadErrorText);

        return response.json() as Promise<ProductResolveResponse>;
      })
      .then((data) => {
        if (
          !data.success ||
          !Number.isInteger(data.petTypeId) ||
          !Number.isInteger(data.productId) ||
          !data.petTypeId ||
          !data.productId
        ) {
          throw new Error(data.message || loadErrorText);
        }

        const nextResolvedProductIds = {
          petTypeId: data.petTypeId,
          productId: data.productId,
        };

        setResolvedProductIds(nextResolvedProductIds);

        return fetch(
          `/api/products/${encodeURIComponent(String(nextResolvedProductIds.petTypeId))}/${encodeURIComponent(String(nextResolvedProductIds.productId))}/detail`,
          { signal: controller.signal }
        );
      })
      .then((response) => {
        if (!response.ok) throw new Error(loadErrorText);

        return response.json() as Promise<ProductDetailResponse>;
      })
      .then((data) => {
        if (!data.product) {
          throw new Error(loadErrorText);
        }

        setProductDetail(mapProductDetail(data));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setLoadingError(error instanceof Error ? error.message : loadErrorText);
      });

    return () => controller.abort();
  }, [petType, productSlug]);

  const productName = productDetail?.product.name || labels.product;
  const categoryName = productDetail?.product.category || labels.category;
  const categorySlug = productDetail?.product.categorySlug;
  const categoryHref = categorySlug
    ? `/product/${petType}?category=${encodeURIComponent(categorySlug)}`
    : `/product/${petType}`;
  const descriptionImages = productDetail?.descriptionImages ?? [];
  const productResolveError =
    petType && productSlug ? loadingError : loadErrorText;

  return (
    <div className="flex flex-col gap-12">
      <nav
        aria-label="Breadcrumb"
        className="typo-body-medium breadcrumbs text-sm"
      >
        <ul className="text-primary">
          <li>
            <Link href="/">{labels.breadcrumbHome}</Link>
          </li>
          <li>
            <Link href={categoryHref}>{categoryName}</Link>
          </li>
          <li className="text-text-primary">{productName}</li>
        </ul>
      </nav>

      {productResolveError && (
        <p className="typo-body text-error" role="alert">
          {productResolveError}
        </p>
      )}

      {!productResolveError && (!resolvedProductIds || !productDetail) && (
        <p className="typo-body text-text-secondary">{loadingText}</p>
      )}

      {resolvedProductIds && productDetail && (
        <QuickShoppingSection
          petTypeId={resolvedProductIds.petTypeId}
          productId={resolvedProductIds.productId}
          detail={productDetail}
        />
      )}

      {descriptionImages.length > 0 && (
        <section id="product-description" className="flex flex-col gap-5">
          <h2 className="typo-body-medium border-b-2 border-secondary pb-2 text-text-primary">
            {labels.description}
          </h2>
          <div
            className={[
              'relative overflow-hidden',
              showAllDescriptions ? '' : 'max-h-[844px]',
            ].join(' ')}
          >
            {descriptionImages.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt={`${productName} ${labels.description} ${index + 1}`}
                width={1520}
                height={1520}
                sizes="1520px"
                className="h-auto w-full"
              />
            ))}
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
          </div>
        </section>
      )}

      <section className="flex flex-col gap-6">
        <h2 className="typo-body-medium border-b-2 border-secondary pb-2 text-text-primary">
          {labels.recommendedProduct}
        </h2>
        <div className="flex gap-8">
          {recommendationProducts.map((recommendedProduct, index) => (
            <ProductCard
              key={index}
              product={{
                avatar: null,
                tags: [
                  {
                    id: index,
                    tag_ch: recommendedProduct.tags[0] ?? labels.recommendedTag,
                  },
                ],
                name: recommendedProduct.name,
                intro: { slogan: recommendedProduct.description },
                price: recommendedProduct.price,
                slug: recommendedProduct.slug,
                petType: petType ? { tag_slug: petType } : null,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
