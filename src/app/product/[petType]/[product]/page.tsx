'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { LuChevronRight } from 'react-icons/lu';

import { ProductCard } from '@/src/components/product/ProductCard';
import { QuickShoppingSection } from '@/src/components/product/QuickShoppingSection';

interface ProductPageDetail {
  productName: string;
  descriptionImages: string[];
}

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

const emptyProductPageDetail: ProductPageDetail = {
  productName: '',
  descriptionImages: [],
};

const recommendationProducts = Array.from({ length: 4 }, () => ({
  image: '',
  tags: [labels.recommendedTag],
  name: labels.recommendedProduct,
  description: labels.recommendedDescription,
  price: 'NT$999',
  isFavorite: false,
  slug: 'prod_x',
}));

export default function ProductPage() {
  const params = useParams<{ petType?: string; product?: string }>();
  const petType = params.petType ?? 'dog';
  const productSlug = params.product ?? '';
  const [showAllDescriptions, setShowAllDescriptions] = useState(false);
  const [productPageDetail, setProductPageDetail] =
    useState<ProductPageDetail>(emptyProductPageDetail);

  useEffect(() => {
    setShowAllDescriptions(false);
    setProductPageDetail(emptyProductPageDetail);
  }, [petType, productSlug]);

  const handleProductDetailLoad = useCallback((detail: ProductPageDetail) => {
    setProductPageDetail(detail);
  }, []);

  const productName = productPageDetail.productName || labels.product;
  const descriptionImages = productPageDetail.descriptionImages;

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
            <Link href={`/product/${petType}`}>{labels.category}</Link>
          </li>
          <li className="text-text-primary">{productName}</li>
        </ul>
      </nav>

      <QuickShoppingSection
        petType={petType}
        productSlug={productSlug}
        onProductDetailLoad={handleProductDetailLoad}
      />

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
              product={{ ...recommendedProduct, petType }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
