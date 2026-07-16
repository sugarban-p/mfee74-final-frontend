'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { LuShoppingCart } from 'react-icons/lu';
import { RiHeartFill, RiHeartLine } from 'react-icons/ri';

import { QuickShoppingSection } from '@/src/components/product/QuickShoppingSection';

interface ProductCardProps {
  product: {
    image: string;
    tags: string[];
    name: string;
    description: string;
    price: string;
    slug: string;
    gallery?: string[];
    petType?: string;
    isFavorite?: boolean;
    soldOut?: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(product.isFavorite ?? false);
  const [isQuickShoppingOpen, setIsQuickShoppingOpen] = useState(false);
  const params = useParams<{ petType?: string }>();
  const petType = product.petType ?? params.petType ?? 'dog';
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
  const RemoveFavoriteSuccess = (productName: string) =>
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

    RemoveFavoriteSuccess(product.name);
  };

  return (
    <>
      <article className="w-[250px] overflow-hidden rounded-lg border border-secondary/50 bg-card-primary transition hover:-translate-y-0.5 hover:scale-[1.02] hover:border-primary">
        <div
          className={[
            'h-[150px] w-full bg-button-disabled',
            product.image ? 'bg-cover bg-center' : '',
          ].join(' ')}
          style={
            product.image
              ? { backgroundImage: `url(${product.image})` }
              : undefined
          }
        ></div>

        <div className="flex flex-col gap-4 p-4">
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
              aria-pressed={isFavorite}
              aria-label={isFavorite ? '取消收藏' : '加入收藏'}
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
            <Link
              href={`/product/${petType}/${product.slug}`}
              className="cursor-pointer hover:underline"
            >
              <h2 className="typo-card-title truncate">{product.name}</h2>
            </Link>
            <p className="typo-card-body truncate">{product.description}</p>
          </div>
          <p className="typo-card-body">{product.price}</p>
          <button
            type="button"
            disabled={product.soldOut}
            className="next-button typo-tab flex items-center justify-center gap-2"
            onClick={() => setIsQuickShoppingOpen(true)}
          >
            {product.soldOut ? (
              '缺貨中'
            ) : (
              <>
                <LuShoppingCart className="size-4" />
                快速選購
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
            aria-label={`${product.name} 快速選購`}
            className="relative max-h-[calc(100vh-32px)] w-full max-w-[1160px] overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <QuickShoppingSection
              product={{ ...product, isFavorite }}
              gallery={
                product.gallery ?? (product.image ? [product.image] : [])
              }
            />
          </div>
        </div>
      )}
    </>
  );
}
