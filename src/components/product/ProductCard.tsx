'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { RiHeartFill, RiHeartLine } from 'react-icons/ri';

interface ProductCardProps {
  product: {
    image: string;
    tags: string[];
    name: string;
    description: string;
    price: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
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
    <article className="w-full overflow-hidden rounded-lg bg-card-primary">
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
      />

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
              'flex size-6 items-center justify-center',
              isFavorite ? 'text-primary' : 'text-secondary',
            ].join(' ')}
            onClick={handleFavoriteClick}
          >
            {isFavorite ? (
              <RiHeartFill className="size-full" />
            ) : (
              <RiHeartLine className="size-full" />
            )}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="typo-card-title truncate">{product.name}</h2>
          <p className="typo-card-body truncate">{product.description}</p>
        </div>
        <p className="typo-card-body">{product.price}</p>
        <button type="button" className="next-button typo-tab">
          加入購物車
        </button>
      </div>
    </article>
  );
}
