'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { LuChevronRight, LuHeart, LuShoppingCart } from 'react-icons/lu';

import { ProductCard } from '@/src/components/product/ProductCard';
import { ProductQuantitySelector } from '@/src/components/product/ProductQuantitySelector';

const product = {
  name: '慢烘鮮食蔬肉糧',
  price: 'NT$229',
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

const flavors = ['雞肉', '牛肉', '鴨肉', '魚肉'];

const recommendationProducts = Array.from({ length: 4 }, (_, index) => ({
  image: '',
  tags: ['標籤 1', '標籤 2'],
  name: '商品名稱',
  description: '簡短標語敘述',
  price: 'NT$9999',
  id: index,
  slug: 'prod_x',
}));

export default function ProductPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllDescriptions, setShowAllDescriptions] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const unitPrice = Number(product.price.replace(/\D/g, ''));
  const subtotal = `NT$${(unitPrice * quantity).toLocaleString()}`;

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

      <section className="grid justify-center gap-[66px] lg:grid-cols-[510px_505px]">
        <div className="flex flex-col gap-8">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-card-primary">
            <Image
              src={gallery[selectedImageIndex]}
              alt={product.name}
              fill
              priority
              sizes="510px"
              className="object-cover"
            />
          </div>

          <div className="flex gap-8 overflow-x-auto pb-2">
            {gallery.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`查看商品圖片 ${index + 1}`}
                aria-pressed={selectedImageIndex === index}
                onClick={() => setSelectedImageIndex(index)}
                className={[
                  'relative size-[128px] shrink-0 overflow-hidden rounded-lg border-2 bg-card-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary',
                  selectedImageIndex === index
                    ? 'border-text-primary'
                    : 'border-transparent',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <section className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="typo-h3 text-text-primary">
                {product.name}
                <span className="typo-body-medium ml-2 text-text-secondary">
                  {product.price}
                </span>
              </h1>
              <div className="mt-1 flex gap-1">
                {['標籤 1', '標籤 2'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-card-secondary px-3 text-xs leading-[18px] text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="cursor-pointer hover:scale-[1.02] hover:bg-button-secondary-hover typo-tab flex h-10 items-center gap-2 rounded-lg border border-secondary bg-white px-3 text-text-primary"
            >
              <LuHeart className="size-5" />
              加入收藏
            </button>
          </div>

          <section className="border-t border-secondary pt-5">
            <h2 className="typo-body-medium mb-4 text-text-primary">
              商品簡介
            </h2>
            <div className="typo-tab rounded-lg border border-primary bg-button-secondary-hover p-5 text-text-primary">
              <p className="mb-3">最接近鮮食的天然慢烘糧！</p>
              <ul className="flex list-disc flex-col gap-1 pl-5">
                <li>慢烘原肉糧+凍乾蔬肉粒，肉菜機能一次滿足！</li>
                <li>85%新鮮原肉+12%蔬果食材+3%機能保健</li>
                <li>無人工添加物，開袋就是食材天然鮮香</li>
              </ul>
              <Link
                href="#product-description"
                className="mt-4 inline-flex items-center text-primary"
              >
                前往「狗狗鮮肉主食餐包」
                <LuChevronRight className="size-4" />
              </Link>
            </div>
            <p className="typo-tab mt-4 whitespace-pre-line text-text-secondary">
              ※ 原肉糧與蔬肉粒顏色因未添加人工色素，易受季節食材及製程批次影響，
              深淺請以實物為準
              {'\n'}※ 一磅(lb)約等於454克
            </p>
          </section>

          <form className="flex flex-col gap-5 border-t border-secondary pt-5">
            <fieldset>
              <legend className="typo-body-medium mb-3 text-text-primary">
                選擇品項
              </legend>
              <div className="flex gap-4">
                {flavors.map((flavor, index) => (
                  <label
                    key={flavor}
                    className="typo-tab cursor-pointer rounded-lg border border-secondary bg-white px-4 py-2 text-text-primary has-checked:bg-card-secondary"
                  >
                    <input
                      type="radio"
                      name="flavor"
                      value={flavor}
                      defaultChecked={index === 0}
                      className="sr-only"
                    />
                    {flavor}
                  </label>
                ))}
              </div>
            </fieldset>

            <ProductQuantitySelector
              quantity={quantity}
              onChange={setQuantity}
            />

            <div className="flex items-center justify-between border-t border-secondary pt-5">
              <p className="typo-body-medium text-text-secondary">
                小計：{subtotal}
              </p>
              <button
                type="button"
                className="next-button typo-tab flex w-[200px] items-center justify-center gap-2 py-2"
              >
                <LuShoppingCart className="size-4" />
                加入購物車
              </button>
            </div>
          </form>
        </section>
      </section>

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
            className={`group absolute inset-x-0 bottom-0 flex gap-2 h-24 justify-center items-center bg-linear-to-t from-black/85 to-transparent pt-7 cursor-pointer transition-transform hover:scale-[1.05] ${showAllDescriptions ? 'pb-7' : 'pt-7'}`}
            onClick={() => setShowAllDescriptions((prev) => !prev)}
          >
            <span className="typo-tab text-text-button group-hover:underline">
              {showAllDescriptions ? '收合內容' : '展開全部'}
            </span>
            <LuChevronRight
              className={`text-text-button size-6 ${showAllDescriptions ? '-rotate-90' : 'rotate-90'}`}
            />
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="typo-body-medium border-b-2 border-secondary pb-2 text-text-primary">
          類似商品
        </h2>
        <div className="grid justify-center gap-8 md:grid-cols-2 xl:grid-cols-4">
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
