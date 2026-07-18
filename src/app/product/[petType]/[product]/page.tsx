'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { LuChevronRight } from 'react-icons/lu';

import { ProductCard } from '@/src/components/product/ProductCard';
import { QuickShoppingSection } from '@/src/components/product/QuickShoppingSection';

const product = {
  name: '慢烘鮮食蔬肉糧',
  price: 'NT$229',
  isFavorite: true,
  image: '/images/product/蔬肉糧產品圖_01-510x510.jpg',
};

const gallery = [
  product.image,
  '/images/product/蔬肉糧產品圖_02-510x510.jpg',
  '/images/product/Vegetablemeat_SP3-510x510.jpg',
  '/images/product/Vegetablemeat_SP4-1-510x510.jpg',
];

const descriptionImages = [
  {
    src: '/images/product/Vegetablemeat_M01.jpg',
    alt: '慢烘鮮食蔬肉糧商品說明 1',
    width: 1620,
    height: 2148,
  },
  {
    src: '/images/product/Vegetablemeat_M02.jpg',
    alt: '慢烘鮮食蔬肉糧商品說明 2',
    width: 1620,
    height: 1965,
  },
  {
    src: '/images/product/Vegetablemeat_M03.jpg',
    alt: '慢烘鮮食蔬肉糧商品說明 3',
    width: 1620,
    height: 2066,
  },
  {
    src: '/images/product/Vegetablemeat_M04.jpg',
    alt: '慢烘鮮食蔬肉糧商品說明 4',
    width: 1620,
    height: 1710,
  },
  {
    src: '/images/product/Vegetablemeat_M05.jpg',
    alt: '慢烘鮮食蔬肉糧商品說明 5',
    width: 1621,
    height: 1709,
  },
  {
    src: '/images/product/Vegetablemeat_M06-1-1.jpg',
    alt: '慢烘鮮食蔬肉糧商品說明 6',
    width: 1081,
    height: 1115,
  },
  {
    src: '/images/product/Vegetablemeat_M07.jpg',
    alt: '慢烘鮮食蔬肉糧商品說明 7',
    width: 1620,
    height: 1392,
  },
  {
    src: '/images/product/Vegetablemeat_M08.jpg',
    alt: '慢烘鮮食蔬肉糧商品說明 8',
    width: 1620,
    height: 1999,
  },
  {
    src: '/images/product/Vegetablemeat_M10-1.jpg',
    alt: '慢烘鮮食蔬肉糧商品說明 9',
    width: 1297,
    height: 1130,
  },
];

const recommendationProducts = Array.from({ length: 4 }, (_, index) => ({
  image: '',
  tags: ['標籤 1', '標籤 2'],
  name: '商品名稱',
  description: '簡短標語敘述',
  price: 'NT$9999',
  isFavorite: true,
  id: index,
  slug: 'prod_x',
}));

export default function ProductPage() {
  const [showAllDescriptions, setShowAllDescriptions] = useState(false);

  return (
    <div className="flex flex-col gap-12">
      <nav
        aria-label="Breadcrumb"
        className="typo-body-medium breadcrumbs text-sm"
      >
        <ul className="text-primary">
          <li>
            <Link href="/">首頁</Link>
          </li>
          <li>
            <Link href="/product/dog">狗勾專區</Link>
          </li>
          <li>
            <Link href="/product/dog?category=all-products">所有商品</Link>
          </li>
          <li className="text-text-primary">{product.name}</li>
        </ul>
      </nav>

      <QuickShoppingSection product={product} gallery={gallery} />

      <section id="product-description" className="flex flex-col gap-5">
        <h2 className="typo-body-medium border-b-2 border-secondary pb-2 text-text-primary">
          商品說明
        </h2>
        <div
          className={[
            'relative overflow-hidden',
            showAllDescriptions ? '' : 'max-h-[844px]',
          ].join(' ')}
        >
          {descriptionImages.map(({ src, alt, width, height }) => (
            <Image
              key={src}
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="1520px"
              className="h-auto w-full"
            />
          ))}
          <button
            type="button"
            className={`group absolute inset-x-0 bottom-0 flex h-24 cursor-pointer items-center justify-center gap-2 bg-linear-to-t from-black/85 to-transparent pt-7 transition-transform hover:scale-[1.05] ${showAllDescriptions ? 'pb-7' : 'pt-7'}`}
            onClick={() => setShowAllDescriptions((prev) => !prev)}
          >
            <span className="typo-tab text-text-button group-hover:underline">
              {showAllDescriptions ? '收合內容' : '展開全部'}
            </span>
            <LuChevronRight
              className={`size-6 text-text-button ${showAllDescriptions ? '-rotate-90' : 'rotate-90'}`}
            />
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="typo-body-medium border-b-2 border-secondary pb-2 text-text-primary">
          類似商品
        </h2>
        <div className="flex gap-8">
          {recommendationProducts.map((recommendedProduct) => (
            <ProductCard
              key={recommendedProduct.id}
              product={recommendedProduct}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
