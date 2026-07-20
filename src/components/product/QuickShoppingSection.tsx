'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { LuChevronRight, LuShoppingCart } from 'react-icons/lu';
import { RiHeartFill, RiHeartLine } from 'react-icons/ri';

import { ProductQuantitySelector } from '@/src/components/product/ProductQuantitySelector';

const flavors = ['雞肉', '牛肉', '鴨肉', '魚肉'];

interface QuickShoppingSectionProps {
  product: {
    name: string;
    price: string;
    image?: string;
    tags?: string[];
    isFavorite?: boolean;
  };
  gallery?: string[];
}

export function QuickShoppingSection({
  product,
  gallery,
}: QuickShoppingSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isFavorite, setIsFavorite] = useState(product.isFavorite ?? false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [checkedItem, setCheckedItem] = useState(flavors[0]);
  const [quantity, setQuantity] = useState(1);
  const unitPrice = Number(product.price.replace(/\D/g, ''));
  const subtotal = `NT$${(unitPrice * quantity).toLocaleString()}`;
  const tags = product.tags ?? ['標籤 1', '標籤 2'];
  const productGallery = gallery ?? (product.image ? [product.image] : []);
  const selectedImage = productGallery[selectedImageIndex];
  const addCartSuccess = (productName: string, itemName: string) =>
    toast.success(`${productName} ${itemName} 已加入購物車`, {
      style: {
        border: '1px solid var(--button-secondary-border)',
        padding: '16px',
        color: 'var(--text-primary)',
        backgroundColor: 'var(--success)',
      },
      iconTheme: {
        primary: 'var(--success)',
        secondary: 'green',
      },
    });
  const addFavoriteSuccess = (productName: string) =>
    toast.success(`${productName} 已加入收藏清單`, {
      style: {
        border: '1px solid var(--button-secondary-border)',
        padding: '16px',
        color: 'var(--text-primary)',
        backgroundColor: 'var(--success)',
      },
      iconTheme: {
        primary: 'var(--success)',
        secondary: 'green',
      },
    });
  const removeFavoriteSuccess = (productName: string) =>
    toast.success(`${productName} 已從收藏清單移除`, {
      style: {
        border: '1px solid var(--button-secondary-border)',
        padding: '16px',
        color: 'var(--text-primary)',
        backgroundColor: 'var(--success)',
      },
      iconTheme: {
        primary: 'var(--success)',
        secondary: 'green',
      },
    });
  const handleFavoriteClick = () => {
    const nextIsFavorite = !isFavorite;

    setIsFavorite(nextIsFavorite);
    if (nextIsFavorite) {
      addFavoriteSuccess(product.name);
      return;
    }

    removeFavoriteSuccess(product.name);
  };

  const handleAddToCart = async () => {
    const queryString = searchParams.toString();
    const nextPath = queryString ? `${pathname}?${queryString}` : pathname;

    try {
      const res = await fetch('/api/user/profile', {
        credentials: 'include',
        cache: 'no-store',
      });

      if (!res.ok) {
        router.push(`/auth/login?next=${encodeURIComponent(nextPath)}`);
        return;
      }

      addCartSuccess(product.name, checkedItem);
    } catch {
      toast.error('網路錯誤，請稍後再試。');
    }
  };

  return (
    <section className="grid justify-center gap-[66px] lg:grid-cols-[510px_505px]">
      <div className="flex flex-col gap-8">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-card-primary">
          {selectedImage && (
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              sizes="510px"
              className="object-cover"
            />
          )}
        </div>

        {productGallery.length > 1 && (
          <div className="flex gap-8 overflow-x-auto pb-2">
            {productGallery.map((src, index) => (
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
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="typo-h3 text-text-primary">
              {product.name}
              <span className="typo-body-medium ml-2 text-text-secondary">
                {product.price}
              </span>
            </h1>
            <div className="mt-1 flex gap-1">
              {tags.map((tag) => (
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
            aria-pressed={isFavorite}
            aria-label={isFavorite ? '取消收藏' : '加入收藏'}
            className={[
              'group typo-tab flex h-10 w-30 cursor-pointer items-center justify-center gap-2 rounded-lg border border-secondary px-3 text-text-primary hover:scale-[1.02] hover:bg-button-secondary-hover',
              isFavorite
                ? 'bg-card-secondary text-primary'
                : 'text-text-primary hover:bg-button-secondary-hover',
            ].join(' ')}
            onClick={handleFavoriteClick}
          >
            {isFavorite ? (
              <>
                <RiHeartFill className="size-5 text-primary" />
                已收藏
              </>
            ) : (
              <>
                <RiHeartLine className="size-5 group-hover:hidden" />
                <RiHeartFill className="hidden size-5 text-primary group-hover:block" />
                加入收藏
              </>
            )}
          </button>
        </div>

        <section className="border-t border-secondary pt-5">
          <h2 className="typo-body-medium mb-4 text-text-primary">商品簡介</h2>
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
              {flavors.map((flavor) => (
                <label
                  key={flavor}
                  className="typo-tab cursor-pointer rounded-lg border border-secondary bg-white px-4 py-2 text-text-primary has-checked:bg-card-secondary"
                >
                  <input
                    type="radio"
                    name="flavor"
                    value={flavor}
                    checked={checkedItem === flavor}
                    onChange={() => setCheckedItem(flavor)}
                    className="sr-only"
                  />
                  {flavor}
                </label>
              ))}
            </div>
          </fieldset>

          <ProductQuantitySelector quantity={quantity} onChange={setQuantity} />

          <div className="flex items-center justify-between border-t border-secondary pt-5">
            <p className="typo-body-medium text-text-secondary">
              小計：{subtotal}
            </p>
            <button
              type="button"
              className="next-button typo-tab flex w-[200px] items-center justify-center gap-2 py-2"
              onClick={handleAddToCart}
            >
              <LuShoppingCart className="size-4" />
              加入購物車
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
