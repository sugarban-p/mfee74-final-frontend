'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
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
    avatar?: {
      src?: string;
      thumbnail?: string;
    } | null;
    tags?: {
      id: number;
      tag_ch: string;
      tag_slug?: string;
    }[];
    name: string;
    intro?: {
      slogan?: string;
    };
    price: string;
    slug?: string;
    petType?: {
      id?: number;
      tag_slug?: string;
      tag_page?: string;
    } | null;
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

const toPublicImagePath = (path?: string) => {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;

  return `/${path.replace(/^\/+/, '')}`;
};

export function ProductCard({ product }: ProductCardProps) {
  const [favoriteOverride, setFavoriteOverride] = useState<{
    productId?: number;
    isFavorite: boolean;
  } | null>(null);
  const [isQuickShoppingOpen, setIsQuickShoppingOpen] = useState(false);
  const params = useParams<{ petType?: string }>();
  const petTypeId = product.petType?.id;
  const petTypeSlug = product.petType?.tag_slug ?? params.petType;
  const isFavorite =
    favoriteOverride && favoriteOverride.productId === product.id
      ? favoriteOverride.isFavorite
      : (product.isFavorite ?? false);
  const productSlug = product.slug ?? '';
  const avatar = toPublicImagePath(
    product.avatar?.thumbnail || product.avatar?.src
  );
  const tags = product.tags?.map((tag) => tag.tag_ch) ?? [];
  const description = product.intro?.slogan ?? '';
  const productHref =
    petTypeSlug && productSlug ? `/product/${petTypeSlug}/${productSlug}` : '#';
  const quickShoppingProduct: QuickShoppingProduct | undefined = product.id
    ? {
        id: product.id,
        name: product.name,
        price: product.price,
        image: avatar,
        tags,
        isFavorite,
        items: [],
      }
    : undefined;

  const handleFavoriteClick = async () => {
    const nextIsFavorite = !isFavorite;

    if (!product.id) {
      toast.error(labels.missingProduct);
      return;
    }

    setFavoriteOverride({ productId: product.id, isFavorite: nextIsFavorite });

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
      setFavoriteOverride({ productId: product.id, isFavorite });
      toast.error(labels.favoriteError);
    }
  };

  return (
    <>
      <article className="w-[250px] overflow-hidden rounded-lg border border-secondary/50 bg-card-primary transition hover:-translate-y-0.5 hover:scale-[1.02] hover:border-primary">
        <div
          className={[
            'h-[150px] w-full bg-button-disabled',
            avatar ? 'bg-cover bg-center' : '',
          ].join(' ')}
          style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}
        />

        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={productHref}
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
            <p className="typo-card-body truncate">{description}</p>
            <div className="flex h-[18px] gap-1 overflow-hidden">
              {tags.map((tag) => (
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
            disabled={product.soldOut || !petTypeId || !product.id}
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
              petTypeId={petTypeId}
              productId={product.id}
              onFavoriteChange={(nextIsFavorite) =>
                setFavoriteOverride({
                  productId: product.id,
                  isFavorite: nextIsFavorite,
                })
              }
            />
          </div>
        </div>
      )}
    </>
  );
}
