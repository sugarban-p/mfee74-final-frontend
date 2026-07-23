'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { LuShoppingCart } from 'react-icons/lu';
import { RiHeartFill, RiHeartLine } from 'react-icons/ri';

import { ProductQuantitySelector } from '@/src/components/product/ProductQuantitySelector';

export interface QuickShoppingItem {
  id: number;
  item_name: string;
  stock?: number;
}

export interface QuickShoppingProduct {
  id: number;
  name: string;
  price: string;
  category?: string;
  categorySlug?: string;
  image?: string;
  tags?: string[];
  isFavorite?: boolean;
  items?: QuickShoppingItem[];
}

interface ApiProductIntro {
  slogan?: string;
  content?: string;
  remark?: string;
}

interface ApiProductTag {
  tag_ch: string;
}

interface ApiProductAvatar {
  src: string;
  thumbnail?: string;
}

interface ApiProductImage {
  src: string;
}

interface ApiProduct {
  id: number;
  prod_name: string;
  price: number;
  category?: {
    tag_ch?: string;
    tag_slug?: string;
  } | null;
  tags?: ApiProductTag[];
  intro?: ApiProductIntro;
  isFavorite?: boolean;
}

export interface ProductDetailResponse {
  product?: ApiProduct;
  items?: QuickShoppingItem[];
  avatars?: ApiProductAvatar[];
  images?: ApiProductImage[];
  intros?: ApiProductIntro;
}

interface QuickShoppingCartItem {
  item_id: number;
  quantity: number;
}

interface QuickShoppingCartResponse {
  success: boolean;
  cartItems: QuickShoppingCartItem[];
}

export interface QuickShoppingDetail {
  product: QuickShoppingProduct;
  gallery: string[];
  descriptionImages: string[];
  features: {
    text: string;
    className: string;
  }[];
}

interface FetchedQuickShoppingDetail {
  petTypeId: number;
  productId: number;
  detail: QuickShoppingDetail;
}

interface LoadingErrorState {
  petTypeId: number;
  productId: number;
  message: string;
}

interface QuickShoppingSectionProps {
  product?: QuickShoppingProduct;
  petTypeId?: number;
  productId?: number;
  detail?: QuickShoppingDetail | null;
  description?: string;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

const labels = {
  addCart: '加入購物車',
  addCartError: '加入購物車失敗，請稍後再試',
  addedCart: '已加入購物車',
  addFavorite: '加入收藏',
  addedFavorite: '已加入收藏',
  favoriteError: '更新收藏失敗，請稍後再試',
  features: '商品特色',
  loading: '商品資料載入中...',
  loadError: '商品資料載入失敗',
  noItems: '目前沒有可選規格',
  removeFavorite: '取消收藏',
  removedFavorite: '已取消收藏',
  selectImage: '查看商品圖片',
  selectItem: '請先選擇商品規格',
  spec: '商品規格',
  subtotal: '小計',
} as const;

const emptyItems: QuickShoppingItem[] = [];

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

const getProductFeatures = (intros?: ApiProductIntro) => {
  return [
    { text: intros?.slogan, className: 'typo-body-medium' },
    { text: intros?.content, className: 'typo-body' },
    { text: intros?.remark, className: 'typo-tab' },
  ]
    .map((feature) => ({ ...feature, text: feature.text?.trim() }))
    .filter((feature): feature is { text: string; className: string } =>
      Boolean(feature.text)
    );
};

export const mapProductDetail = (
  data: ProductDetailResponse
): QuickShoppingDetail => {
  const productData = data.product;
  const avatars = data.avatars ?? [];
  const gallery = avatars
    .map((avatar) => toPublicImagePath(avatar.src))
    .filter(Boolean);
  const descriptionImages = (data.images ?? [])
    .map((image) => toPublicImagePath(image.src))
    .filter(Boolean);

  return {
    product: {
      id: productData?.id ?? 0,
      name: productData?.prod_name ?? '',
      price: `NT$${Number(productData?.price ?? 0).toLocaleString('zh-TW')}`,
      category: productData?.category?.tag_ch,
      categorySlug: productData?.category?.tag_slug,
      image: gallery[0],
      tags: productData?.tags?.map((tag) => tag.tag_ch) ?? [],
      isFavorite: productData?.isFavorite,
      items: data.items ?? [],
    },
    gallery,
    descriptionImages,
    features: getProductFeatures(data.intros ?? productData?.intro),
  };
};

export function QuickShoppingSection({
  product,
  petTypeId,
  productId,
  detail,
  description,
  onFavoriteChange,
}: QuickShoppingSectionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const addCartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fetchedDetail, setFetchedDetail] =
    useState<FetchedQuickShoppingDetail | null>(null);
  const [loadingErrorState, setLoadingErrorState] =
    useState<LoadingErrorState | null>(null);
  const [favoriteOverride, setFavoriteOverride] = useState<{
    productId: number;
    isFavorite: boolean;
  } | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [checkedItemId, setCheckedItemId] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingCart, setIsAddingCart] = useState(false);

  const fallbackDetail = useMemo<QuickShoppingDetail | null>(() => {
    if (!product) return null;

    return {
      product,
      gallery: product.image ? [product.image] : [],
      descriptionImages: [],
      features: description
        ? [{ text: description, className: 'typo-body' }]
        : [],
    };
  }, [description, product]);
  const currentFetchedDetail =
    detail ??
    (fetchedDetail &&
    fetchedDetail.petTypeId === petTypeId &&
    fetchedDetail.productId === productId
      ? fetchedDetail.detail
      : null);
  const loadingError =
    loadingErrorState &&
    loadingErrorState.petTypeId === petTypeId &&
    loadingErrorState.productId === productId
      ? loadingErrorState.message
      : '';
  const productDetail =
    currentFetchedDetail ?? (!petTypeId || !productId ? fallbackDetail : null);
  const currentProduct = productDetail?.product;
  const isFavorite =
    currentProduct &&
    favoriteOverride &&
    favoriteOverride.productId === currentProduct.id
      ? favoriteOverride.isFavorite
      : (currentProduct?.isFavorite ?? false);
  const items = currentProduct?.items ?? emptyItems;
  const selectedItem =
    items.find((item) => item.id === checkedItemId) ?? items[0];
  const unitPrice = Number(currentProduct?.price.replace(/\D/g, '') ?? 0);
  const subtotal = `NT$${(unitPrice * quantity).toLocaleString()}`;
  const tags = currentProduct?.tags ?? [];
  const productGallery = productDetail?.gallery ?? [];
  const selectedImage = productGallery[selectedImageIndex];
  const canAddCart = Boolean(selectedItem);

  useEffect(() => {
    if (detail || !petTypeId || !productId) {
      return;
    }

    const controller = new AbortController();

    void fetch(
      `/api/products/${encodeURIComponent(String(petTypeId))}/${encodeURIComponent(String(productId))}/buy`,
      {
        signal: controller.signal,
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error(labels.loadError);

        return response.json();
      })
      .then((data: ProductDetailResponse) => {
        if (!data.product) {
          throw new Error(labels.loadError);
        }

        const nextDetail = mapProductDetail(data);

        setFetchedDetail({ petTypeId, productId, detail: nextDetail });
        setLoadingErrorState(null);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setLoadingErrorState({
          petTypeId,
          productId,
          message: error instanceof Error ? error.message : labels.loadError,
        });
      });

    return () => controller.abort();
  }, [detail, petTypeId, productId]);

  useEffect(() => {
    return () => {
      if (addCartTimeoutRef.current) clearTimeout(addCartTimeoutRef.current);
    };
  }, []);

  const handleFavoriteClick = async () => {
    if (!currentProduct) return;

    const nextIsFavorite = !isFavorite;

    setFavoriteOverride({
      productId: currentProduct.id,
      isFavorite: nextIsFavorite,
    });
    onFavoriteChange?.(nextIsFavorite);

    try {
      const response = await fetch(
        `/api/products/updateFavorite/${currentProduct.id}`,
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
        `${currentProduct.name} ${
          nextIsFavorite ? labels.addedFavorite : labels.removedFavorite
        }`,
        toastStyle
      );
    } catch {
      setFavoriteOverride({
        productId: currentProduct.id,
        isFavorite,
      });
      onFavoriteChange?.(isFavorite);
      toast.error(labels.favoriteError);
    }
  };

  const handleAddCartClick = () => {
    if (!currentProduct) return;

    if (!selectedItem) {
      toast.error(labels.selectItem);
      return;
    }

    if (addCartTimeoutRef.current) clearTimeout(addCartTimeoutRef.current);
    setIsAddingCart(true);

    addCartTimeoutRef.current = setTimeout(() => {
      void (async () => {
        try {
          const cartResponse = await fetch('/api/products/getCart');

          if (cartResponse.status === 401) {
            router.push(`/auth/login?next=${encodeURIComponent(pathname)}`);
            return;
          }

          if (!cartResponse.ok) throw new Error();

          const cartData: QuickShoppingCartResponse = await cartResponse.json();

          if (!cartData.success) throw new Error();

          const currentCartQuantity =
            cartData.cartItems.find(
              (cartItem) => cartItem.item_id === selectedItem.id
            )?.quantity ?? 0;

          const response = await fetch(
            `/api/products/updateCart/${selectedItem.id}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ qty: currentCartQuantity + quantity }),
            }
          );

          if (response.status === 401) {
            router.push(`/auth/login?next=${encodeURIComponent(pathname)}`);
            return;
          }

          if (!response.ok) throw new Error();

          toast.success(
            `${currentProduct.name} ${selectedItem.item_name} ${labels.addedCart}`,
            toastStyle
          );
        } catch {
          toast.error(labels.addCartError);
        } finally {
          setIsAddingCart(false);
        }
      })();
    }, 500);
  };

  if (!productDetail || !currentProduct) {
    return (
      <section className="grid justify-center gap-16.5 lg:grid-cols-[510px_505px]">
        <p
          className={[
            'typo-body',
            loadingError ? 'text-error' : 'text-text-secondary',
          ].join(' ')}
          role={loadingError ? 'alert' : undefined}
        >
          {loadingError || labels.loading}
        </p>
      </section>
    );
  }

  return (
    <section className="grid justify-center gap-16.5 lg:grid-cols-[510px_505px]">
      <div className="flex flex-col gap-8">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-card-primary">
          {selectedImage && (
            <Image
              src={selectedImage}
              alt={currentProduct.name}
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
                aria-label={`${labels.selectImage} ${index + 1}`}
                aria-pressed={selectedImageIndex === index}
                onClick={() => setSelectedImageIndex(index)}
                className={[
                  'relative size-32 shrink-0 overflow-hidden rounded-lg border-2 bg-card-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary',
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
        {loadingError && (
          <p className="typo-body text-error" role="alert">
            {loadingError}
          </p>
        )}

        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="typo-h3 text-text-primary">
              {currentProduct.name}
              <span className="typo-body-medium ml-2 text-text-secondary">
                {currentProduct.price}
              </span>
            </h1>
            {tags.length > 0 && (
              <div className="mt-1 flex gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-card-secondary px-3 text-xs leading-4.5 text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            aria-pressed={isFavorite}
            aria-label={isFavorite ? labels.removeFavorite : labels.addFavorite}
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
                {labels.addedFavorite}
              </>
            ) : (
              <>
                <RiHeartLine className="size-5 group-hover:hidden" />
                <RiHeartFill className="hidden size-5 text-primary group-hover:block" />
                {labels.addFavorite}
              </>
            )}
          </button>
        </div>

        <section className="border-t border-secondary pt-5">
          <h2 className="typo-body-medium mb-4 text-text-primary">
            {labels.features}
          </h2>
          <div className="typo-tab rounded-lg border border-primary bg-button-secondary-hover p-5 text-text-primary">
            <div className="space-y-2">
              {productDetail.features.map((feature, index) => (
                <p
                  key={`${index}-${feature.text}`}
                  className={`${feature.className} whitespace-pre-line`}
                >
                  {feature.text}
                </p>
              ))}
            </div>
          </div>
        </section>

        <form className="flex flex-col gap-5 border-t border-secondary pt-5">
          <fieldset>
            <legend className="typo-body-medium mb-3 text-text-primary">
              {labels.spec}
            </legend>
            <div className="flex flex-wrap gap-4">
              {items.map((item) => (
                <label
                  key={item.id}
                  className="typo-tab cursor-pointer rounded-lg border border-secondary bg-white px-4 py-2 text-text-primary has-checked:bg-card-secondary"
                >
                  <input
                    type="radio"
                    name="item"
                    value={item.id}
                    checked={selectedItem?.id === item.id}
                    onChange={() => setCheckedItemId(item.id)}
                    className="sr-only"
                  />
                  {item.item_name}
                </label>
              ))}
              {!items.length && (
                <p className="typo-tab text-text-secondary">{labels.noItems}</p>
              )}
            </div>
          </fieldset>

          <ProductQuantitySelector quantity={quantity} onChange={setQuantity} />

          <div className="flex items-center justify-between border-t border-secondary pt-5">
            <p className="typo-body-medium text-text-secondary">
              {labels.subtotal}: {subtotal}
            </p>
            <button
              type="button"
              disabled={!canAddCart || isAddingCart}
              className="next-button typo-tab flex w-50 items-center justify-center gap-2 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleAddCartClick}
            >
              <LuShoppingCart className="size-4" />
              {labels.addCart}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
