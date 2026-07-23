'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  LuCheck,
  LuHeart,
  LuLogOut,
  LuPackage,
  LuShoppingCart,
  LuTrash2,
  LuUser,
  LuX,
} from 'react-icons/lu';

import MegaMenuCard from '@/src/components/header/MegaMenuCard';
import { ProductQuantitySelector } from '@/src/components/product/ProductQuantitySelector';
import {
  getProductMegaMenuImage,
  PRODUCT_MEGA_MENU_FALLBACK,
  type ProductMegaMenuCard,
  type ProductMegaMenuResponse,
} from '@/src/services/product-mega-menu';

interface CartItem {
  cart_id: number;
  item_id: number;
  quantity: number;
  item_name: string;
  prod_name: string;
  price: number;
  avatar: string;
}

interface CartResponse {
  success: boolean;
  cartItems: CartItem[];
}

interface ProfileResponse {
  avatar?: string | null;
}

const toPublicImagePath = (path?: string) => {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;

  return `/${path.replace(/^\/+/, '')}`;
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartLoginRequired, setIsCartLoginRequired] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [removingCartItemId, setRemovingCartItemId] = useState<number | null>(
    null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [memberAvatar, setMemberAvatar] = useState<string | null>(null);
  const [productMegaMenuCards, setProductMegaMenuCards] = useState<
    ProductMegaMenuCard[]
  >(PRODUCT_MEGA_MENU_FALLBACK);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const cartPanelRef = useRef<HTMLElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const updateCartTimeoutsRef = useRef<
    Map<number, ReturnType<typeof setTimeout>>
  >(new Map());

  const refreshAuthState = useCallback(async () => {
    try {
      const res = await fetch('/api/user/profile', {
        credentials: 'include',
        cache: 'no-store',
      });

      if (!res.ok) {
        setIsAuthenticated(false);
        setMemberAvatar(null);
        return;
      }

      const payload: unknown = await res.json();
      const profile =
        payload && typeof payload === 'object'
          ? (payload as ProfileResponse)
          : null;

      setIsAuthenticated(true);
      setMemberAvatar(
        typeof profile?.avatar === 'string' && profile.avatar.length > 0
          ? profile.avatar
          : null
      );
    } catch {
      setIsAuthenticated(false);
      setMemberAvatar(null);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isCartOpen) return;

    const controller = new AbortController();

    void fetch('/api/products/getCart', { signal: controller.signal })
      .then((response) => {
        if (response.status === 401) {
          setCartItems([]);
          setIsCartLoginRequired(true);
          return null;
        }

        if (!response.ok) throw new Error();

        setIsCartLoginRequired(false);
        return response.json();
      })
      .then((data: CartResponse | null) => {
        if (!data) return;
        if (!data.success) throw new Error();

        setCartItems(data.cartItems);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        toast.error('購物車資料載入失敗');
      });

    return () => controller.abort();
  }, [isCartOpen]);

  useEffect(() => {
    if (!isCartOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) return;

      if (
        cartPanelRef.current?.contains(target) ||
        cartButtonRef.current?.contains(target)
      ) {
        return;
      }

      setIsCartOpen(false);
      setRemovingCartItemId(null);
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isCartOpen]);

  useEffect(() => {
    return () => {
      updateCartTimeoutsRef.current.forEach((timeoutId) =>
        clearTimeout(timeoutId)
      );
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void fetch('/api/products/mega-menu', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error();

        return response.json() as Promise<ProductMegaMenuResponse>;
      })
      .then((data) => {
        if (!data.success || data.cards.length === 0) throw new Error();

        setProductMegaMenuCards(data.cards);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setProductMegaMenuCards(PRODUCT_MEGA_MENU_FALLBACK);
      });

    return () => controller.abort();
  }, []);

  const handleCartQuantityChange = (itemId: number, quantity: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.item_id === itemId ? { ...item, quantity } : item
      )
    );

    const prevTimeout = updateCartTimeoutsRef.current.get(itemId);
    if (prevTimeout) clearTimeout(prevTimeout);

    const timeoutId = setTimeout(() => {
      void fetch(`/api/products/updateCart/${itemId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qty: quantity }),
      })
        .then((response) => {
          if (!response.ok) toast.error('購物車數量更新失敗');
        })
        .catch(() => {
          toast.error('購物車數量更新失敗');
        })
        .finally(() => {
          updateCartTimeoutsRef.current.delete(itemId);
        });
    }, 500);

    updateCartTimeoutsRef.current.set(itemId, timeoutId);
  };

  const handleConfirmRemoveCartItem = async (cartItem: CartItem) => {
    const prevTimeout = updateCartTimeoutsRef.current.get(cartItem.item_id);
    if (prevTimeout) clearTimeout(prevTimeout);
    updateCartTimeoutsRef.current.delete(cartItem.item_id);

    try {
      const response = await fetch(
        `/api/products/updateCart/${cartItem.item_id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error();

      setCartItems((items) =>
        items.filter((item) => item.item_id !== cartItem.item_id)
      );
      setRemovingCartItemId(null);
      toast.success(
        `${cartItem.prod_name} ${cartItem.item_name} 已從購物車移除`
      );
    } catch {
      toast.error('移除購物車商品失敗，請稍後再試');
    }
  };

  useEffect(() => {
    void (async () => {
      await refreshAuthState();
    })();
  }, [pathname, refreshAuthState]);

  useEffect(() => {
    const handleAuthStateChanged = () => {
      refreshAuthState();
    };

    window.addEventListener('auth-state-changed', handleAuthStateChanged);

    return () => {
      window.removeEventListener('auth-state-changed', handleAuthStateChanged);
    };
  }, [refreshAuthState]);

  const handleMemberClick = () => {
    if (isAuthLoading) {
      return;
    }

    if (isAuthenticated) {
      router.push('/member/dashboard');
      return;
    }

    router.push('/auth/login');
  };

  const handleLogout = async () => {
    if (isAuthLoading || isLoggingOut) {
      return;
    }

    if (!isAuthenticated) {
      return;
    }

    setIsLoggingOut(true);

    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        toast.error('登出失敗，請稍後再試。');
        return;
      }

      setIsAuthenticated(false);
      setMemberAvatar(null);
      window.dispatchEvent(new Event('auth-state-changed'));
      toast.success('已登出');
      router.push('/auth/login');
    } catch {
      toast.error('網路錯誤，請稍後再試。');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 h-20 bg-card-primary/95">
        <div className="navbar mx-auto flex h-full max-w-[1620px] items-center justify-between px-5 md:px-16">
          <Link href="/" className="navbar-start">
            <Image
              src="/images/logo/mofu-logo-final.svg"
              alt=""
              width={135}
              height={64}
              className="object-contain"
            />
          </Link>
          <div className="navbar-center gap-1">
            <div className="megamenu gap-1" id="my-megamenu-4" popover="auto">
              <span className="megamenu-active"></span>
              <button
                className="typo-body rounded-lg text-text-primary hover:bg-button-secondary-hover [&:has(+_[popover]:popover-open)]:rounded-b-none [&:has(+_[popover]:popover-open)]:bg-button-secondary-hover"
                popoverTarget="products"
              >
                所有商品
              </button>
              <div
                id="products"
                className="mt-0 w-auto rounded-xl rounded-tl-none border-2 border-border bg-card-primary"
                popover="auto"
              >
                <div className="items-start">
                  <ul className="menu-horizontal flex">
                    {productMegaMenuCards.map((card) => (
                      <li key={card.id}>
                        <MegaMenuCard
                          id={card.id}
                          image={getProductMegaMenuImage(card.petType)}
                          imageAlt={card.imageAlt}
                          title={card.title}
                          href={card.href}
                          items={card.items}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                className="typo-body rounded-lg text-text-primary hover:bg-button-secondary-hover [&:has(+_[popover]:popover-open)]:rounded-b-none [&:has(+_[popover]:popover-open)]:bg-button-secondary-hover"
                popoverTarget="events"
              >
                所有活動
              </button>
              <div
                id="events"
                className="mt-0 w-auto rounded-xl rounded-tl-none border-2 border-border bg-card-primary"
                popover="auto"
              >
                <MegaMenuCard
                  id={0}
                  image="/events.png"
                  imageAlt="所有活動"
                  title="所有活動"
                  items={[
                    { id: 1, title: '會員優惠', href: '/event' },
                    { id: 2, title: '新品活動', href: '/event' },
                    { id: 3, title: '購物滿額折扣', href: '/event' },
                    { id: 4, title: '寵物講座', href: '/event' },
                  ]}
                />
              </div>
            </div>
            <ul className="menu menu-horizontal gap-1 p-0">
              <li className="rounded-lg hover:bg-button-secondary-hover">
                <Link
                  href="/"
                  className="px-4 py-0 text-text-primary hover:bg-transparent"
                >
                  <div className="typo-body h-10 py-[5.5px]">AI 顧問</div>
                </Link>
              </li>
              <li className="rounded-lg hover:bg-button-secondary-hover">
                <Link
                  href="/"
                  className="px-4 py-0 text-text-primary hover:bg-transparent"
                >
                  <div className="typo-body h-10 py-[5.5px]">寵物百科</div>
                </Link>
              </li>
            </ul>
          </div>
          <div className="relative navbar-end gap-4">
            <Link
              href="/member/favorites"
              className="btn btn-circle border-none btn-ghost p-1 align-middle text-text-secondary hover:bg-button-secondary-hover hover:shadow-none"
            >
              <LuHeart className="size-6" />
            </Link>
            <div className="relative">
              <button
                ref={cartButtonRef}
                type="button"
                aria-label="開啟購物車"
                aria-expanded={isCartOpen}
                aria-controls="cart-panel"
                className="btn btn-circle border-none btn-ghost p-1 align-middle text-text-secondary hover:bg-button-secondary-hover hover:shadow-none"
                onClick={() => {
                  setIsCartOpen((prev) => !prev);
                  setRemovingCartItemId(null);
                }}
              >
                <LuShoppingCart className="size-6" />
              </button>
              {isCartOpen && (
                <section
                  ref={cartPanelRef}
                  id="cart-panel"
                  className="absolute top-12 -right-13 w-117.5 max-w-[calc(100vw-40px)] rounded-2xl border border-secondary bg-white p-3 shadow-xl"
                  aria-label="購物車"
                >
                  <span className="absolute -top-2.5 right-15.25 size-5 rotate-45 border-t border-l border-secondary bg-white" />

                  <div className="flex max-h-87.25 flex-col overflow-y-auto rounded-xl bg-white">
                    <div className="flex items-center gap-2 border-b border-card-secondary px-2 py-3 text-text-primary">
                      <LuPackage className="size-5 text-primary" />
                      <h2 className="typo-body-medium">購物車</h2>
                    </div>

                    {isCartLoginRequired ? (
                      <p className="typo-tab px-2 py-5 text-text-secondary">
                        請先登入
                      </p>
                    ) : cartItems.length === 0 ? (
                      <p className="typo-tab px-2 py-5 text-text-secondary">
                        購物車目前沒有商品
                      </p>
                    ) : (
                      cartItems.map((cartItem) => {
                        const isRemoving =
                          removingCartItemId === cartItem.item_id;

                        return (
                          <article
                            key={cartItem.cart_id}
                            className={[
                              'flex justify-between gap-4 border-b border-card-secondary px-2 py-5',
                              isRemoving ? 'bg-warning' : '',
                            ].join(' ')}
                          >
                            <div className="flex min-w-0 gap-1">
                              {cartItem.avatar ? (
                                <Image
                                  src={toPublicImagePath(cartItem.avatar)}
                                  alt={cartItem.prod_name}
                                  width={56}
                                  height={56}
                                  className="size-14 rounded-xl bg-card-secondary object-cover"
                                />
                              ) : (
                                <div className="size-14 rounded-xl bg-card-secondary" />
                              )}
                              <div className="min-w-0">
                                <h3 className="typo-tab truncate text-text-primary">
                                  {cartItem.prod_name}
                                </h3>
                                <p className="mt-1 text-sm text-text-secondary">
                                  {cartItem.item_name}
                                </p>
                              </div>
                            </div>
                            <div className="flex min-w-0 items-center justify-between gap-1">
                              {isRemoving ? (
                                <div className="flex items-center gap-3">
                                  <p className="typo-tab whitespace-nowrap text-text-primary">
                                    確定要移除商品嗎?
                                  </p>
                                  <button
                                    type="button"
                                    aria-label="確認移除商品"
                                    className="grid size-8 place-items-center rounded-lg text-green-600 hover:bg-white/70"
                                    onClick={() =>
                                      void handleConfirmRemoveCartItem(cartItem)
                                    }
                                  >
                                    <LuCheck className="size-5" />
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="取消移除商品"
                                    className="grid size-8 place-items-center rounded-lg text-red-600 hover:bg-white/70"
                                    onClick={() => setRemovingCartItemId(null)}
                                  >
                                    <LuX className="size-5" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <ProductQuantitySelector
                                    usage="Header"
                                    quantity={cartItem.quantity}
                                    onChange={(quantity) =>
                                      handleCartQuantityChange(
                                        cartItem.item_id,
                                        quantity
                                      )
                                    }
                                  />
                                  <button
                                    type="button"
                                    aria-label="移除商品"
                                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-secondary hover:bg-button-secondary-hover"
                                    onClick={() =>
                                      setRemovingCartItemId(cartItem.item_id)
                                    }
                                  >
                                    <LuTrash2 className="size-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>

                  {!isCartLoginRequired && (
                    <Link
                      href="/cart"
                      type="button"
                      className="next-button typo-tab mt-4 flex w-1/2 items-center justify-center py-3"
                      onClick={() => setIsCartOpen(false)}
                    >
                      查看完整購物車
                    </Link>
                  )}
                </section>
              )}
            </div>

            <button
              type="button"
              aria-label={isAuthenticated ? '前往會員中心' : '前往登入'}
              onClick={handleMemberClick}
              disabled={isAuthLoading}
              className="btn btn-circle border-none btn-ghost p-1 align-middle text-text-secondary hover:bg-button-secondary-hover hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAuthenticated && memberAvatar ? (
                <img
                  src={memberAvatar}
                  alt="會員頭像"
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <LuUser className="size-6" />
              )}
            </button>

            {isAuthenticated && (
              <button
                type="button"
                aria-label="登出"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="btn btn-circle border-none btn-ghost p-1 align-middle text-text-secondary hover:bg-button-secondary-hover hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LuLogOut className="size-6" />
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
