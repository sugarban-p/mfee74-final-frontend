'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { LuShoppingCart } from 'react-icons/lu';
import { RiHeartFill, RiHeartLine } from 'react-icons/ri';

import {
  QuickShoppingSection,
  type QuickShoppingProduct,
} from '@/src/components/product/QuickShoppingSection';

interface ProductCardProps {
  product: {
    id?: number;
    avatar: string;
    tags: string[];
    name: string;
    description: string;
    price: string;
    slug?: string;
    gallery?: string[];
    petType?: string;
    isFavorite?: boolean;
    soldOut?: boolean;
  };
}

const labels = {
  addFavorite: '加入收藏',
  addedFavorite: '已加入收藏',
  dialogSuffix: '快速購物',
  favoriteError: '更新收藏失敗，請稍後再試',
  missingProduct: '缺少商品資料，無法更新收藏',
  quickShopping: '快速購物',
  removeFavorite: '取消收藏',
  removedFavorite: '已取消收藏',
  soldOut: '已售完',
} as const;

const toastStyle = {
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
};

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(product.isFavorite ?? false);
  const [isQuickShoppingOpen, setIsQuickShoppingOpen] = useState(false);
  const params = useParams<{ petType?: string }>();
  const petType = product.petType ?? params.petType ?? 'dog';
  const productSlug = product.slug ?? (product.id ? String(product.id) : '');
  const quickShoppingProduct = useMemo<QuickShoppingProduct | undefined>(() => {
    if (!product.id) return undefined;

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      avatar: product.avatar,
      tags: product.tags,
      isFavorite,
      items: [],
    };
  }, [
    isFavorite,
    product.id,
    product.avatar,
    product.name,
    product.price,
    product.tags,
  ]);

  useEffect(() => {
    setIsFavorite(product.isFavorite ?? false);
  }, [product.id, product.isFavorite]);

  const handleFavoriteClick = async () => {
    const nextIsFavorite = !isFavorite;

    if (!product.id) {
      toast.error(labels.missingProduct);
      return;
    }

    setIsFavorite(nextIsFavorite);

    try {
      const response = await fetch(
        `/api/products/updateFavorite/${product.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ favorite: nextIsFavorite }),
        }
      );

      if (!response.ok) throw new Error();

      toast.success(
        `${product.name} ${
          nextIsFavorite ? labels.addedFavorite : labels.removedFavorite
        }`,
        toastStyle
      );
    } catch {
      setIsFavorite(isFavorite);
      toast.error(labels.favoriteError);
    }
  };

  return (
    <>
      <article className="w-[250px] overflow-hidden rounded-lg border border-secondary/50 bg-card-primary transition hover:-translate-y-0.5 hover:scale-[1.02] hover:border-primary">
        <div
          className={[
            'h-[150px] w-full bg-button-disabled',
            product.avatar ? 'bg-cover bg-center' : '',
          ].join(' ')}
          style={
            product.avatar
              ? { backgroundImage: `url(${product.avatar})` }
              : undefined
          }
        />

        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={productSlug ? `/product/${petType}/${productSlug}` : '#'}
              className="w-[85%] cursor-pointer hover:underline"
            >
              <h2 className="typo-card-title truncate">{product.name}</h2>
            </Link>
            <button
              type="button"
              aria-pressed={isFavorite}
              aria-label={
                isFavorite ? labels.removeFavorite : labels.addFavorite
              }
              className={[
                'group flex size-6 cursor-pointer items-center justify-center',
                isFavorite
                  ? 'text-primary'
                  : 'text-secondary hover:text-primary',
              ].join(' ')}
              onClick={handleFavoriteClick}
            >
              {isFavorite ? (
                <RiHeartFill className="size-full" />
              ) : (
                <>
                  <RiHeartLine className="size-full group-hover:hidden" />
                  <RiHeartFill className="hidden size-full group-hover:block" />
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <p className="typo-card-body truncate">{product.description}</p>
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
          </div>

          <p className="typo-card-body">{product.price}</p>
          <button
            type="button"
            disabled={product.soldOut || !productSlug}
            className="next-button typo-tab flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setIsQuickShoppingOpen(true)}
          >
            {product.soldOut ? (
              labels.soldOut
            ) : (
              <>
                <LuShoppingCart className="size-4" />
                {labels.quickShopping}
              </>
            )}
          </button>
        </div>
      </article>

      {isQuickShoppingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsQuickShoppingOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} ${labels.dialogSuffix}`}
            className="relative max-h-[calc(100vh-32px)] w-full max-w-[1160px] overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <QuickShoppingSection
              product={quickShoppingProduct}
              petType={petType}
              productSlug={productSlug}
              gallery={product.gallery}
              onFavoriteChange={setIsFavorite}
            />
          </div>
        </div>
      )}
    </>
  );
}
