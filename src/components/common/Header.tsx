'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  LuHeart,
  LuLogOut,
  LuMenu,
  LuPackage,
  LuShoppingCart,
  LuTrash2,
  LuUser,
  LuPlus,
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
import { takePendingCartAction } from '@/src/services/pending-cart-action';

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

const ACTIVITY_MENU_ITEMS = [
  {
    id: 1,
    title: '滿額 $1500 免運',
    href: '/activity/free-shipping-1500',
  },
  {
    id: 2,
    title: '新品嚐鮮季',
    href: '/activity/new-arrival-season',
  },
  {
    id: 3,
    title: '滿千折百',
    href: '/activity/pet-festival-1000-off-100',
  },
  {
    id: 4,
    title: '會員首購 9 折',
    href: '/activity/new-member-first-order-10off',
  },
];

const toPublicImagePath = (path?: string) => {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;

  return `/${path.replace(/^\/+/, '')}`;
};

const mobileSubmenuLinkClassName = (isActive: boolean) =>
  isActive
    ? 'block rounded-lg bg-primary px-4 py-1 text-text-button'
    : 'block rounded-lg px-4 py-1 text-text-primary active:bg-button-secondary-hover [@media(hover:hover)]:hover:bg-button-secondary-hover';

interface MobileProductSubmenuLinksProps {
  card: ProductMegaMenuCard;
  pathname: string;
  onNavigate: () => void;
}

function MobileProductSubmenuLinks({
  card,
  pathname,
  onNavigate,
}: MobileProductSubmenuLinksProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') ?? 'all-products';
  const isActiveProductLink = (href: string) => {
    const url = new URL(href, 'http://localhost');

    return (
      pathname === url.pathname &&
      (url.searchParams.get('category') ?? 'all-products') === activeCategory
    );
  };

  return (
    <>
      <li>
        <Link
          href={card.href}
          className={mobileSubmenuLinkClassName(isActiveProductLink(card.href))}
          onClick={onNavigate}
        >
          所有商品
        </Link>
      </li>
      {card.items.map((item) => (
        <li key={item.id}>
          <Link
            href={item.href}
            className={mobileSubmenuLinkClassName(
              isActiveProductLink(item.href)
            )}
            onClick={onNavigate}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </>
  );
}

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileProductCardId, setOpenMobileProductCardId] = useState<
    number | null
  >(null);
  const [isMobileActivityMenuOpen, setIsMobileActivityMenuOpen] =
    useState(false);
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

  const replayPendingCartAction = useCallback(async () => {
    const pendingAction = takePendingCartAction();

    if (!pendingAction) return;

    try {
      const cartResponse = await fetch('/api/products/getCart');

      if (!cartResponse.ok) throw new Error();

      const cartData: CartResponse = await cartResponse.json();

      if (!cartData.success) throw new Error();

      const currentCartQuantity =
        cartData.cartItems.find(
          (cartItem) => cartItem.item_id === pendingAction.itemId
        )?.quantity ?? 0;

      const response = await fetch(
        `/api/products/updateCart/${pendingAction.itemId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            qty: currentCartQuantity + pendingAction.quantity,
          }),
        }
      );

      if (!response.ok) throw new Error();

      toast.success(
        `${pendingAction.productName} ${pendingAction.itemName} 已加入購物車`
      );
    } catch {
      toast.error('加入購物車失敗，請稍後再試');
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
    const updateCartTimeouts = updateCartTimeoutsRef.current;

    return () => {
      updateCartTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
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

  useEffect(() => {
    if (!isAuthenticated) return;

    void replayPendingCartAction();
  }, [isAuthenticated, replayPendingCartAction]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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

  const activeProductCardId =
    productMegaMenuCards.find((card) => pathname === card.href)?.id ?? null;

  return (
    <>
      <header className="sticky top-0 z-20 h-20 bg-card-primary/95">
        <div className="navbar mx-auto flex h-full max-w-[1620px] items-center justify-between px-5 md:px-16">
          <div className="navbar-start flex items-center gap-2">
            <button
              type="button"
              aria-label="開啟主選單"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-panel"
              className="btn btn-circle border-none btn-ghost p-1 text-text-secondary hover:bg-button-secondary-hover hover:shadow-none lg:hidden"
              onClick={() => {
                setIsMobileMenuOpen(true);
                setIsCartOpen(false);
                setOpenMobileProductCardId(activeProductCardId);
                setIsMobileActivityMenuOpen(pathname.startsWith('/activity/'));
              }}
            >
              <LuMenu className="size-6" />
            </button>
            <div
              className={[
                'fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 lg:hidden',
                isMobileMenuOpen
                  ? 'opacity-100'
                  : 'pointer-events-none opacity-0',
              ].join(' ')}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <aside
              id="mobile-nav-panel"
              className={[
                'fixed top-0 left-0 z-50 h-dvh w-80 max-w-[85vw] overflow-y-auto border-r border-border bg-card-primary p-4 shadow-xl transition-transform duration-200 lg:hidden',
                isMobileMenuOpen
                  ? 'translate-x-0'
                  : 'pointer-events-none -translate-x-full',
              ].join(' ')}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="typo-h3 text-text-primary">主選單</div>
                <button
                  type="button"
                  aria-label="關閉主選單"
                  className="btn btn-circle border-none btn-ghost p-1 text-text-secondary hover:bg-button-secondary-hover hover:shadow-none"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LuX className="size-6" />
                </button>
              </div>
              <ul className="space-y-1">
                {productMegaMenuCards.map((card) => (
                  <li key={card.id}>
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-secondary/10 px-3 py-3 font-bold text-text-primary select-none"
                      aria-expanded={openMobileProductCardId === card.id}
                      onClick={() => {
                        setIsMobileActivityMenuOpen(false);
                        setOpenMobileProductCardId((currentId) =>
                          currentId === card.id ? null : card.id
                        );
                      }}
                    >
                      <span>{card.title}</span>
                      <LuPlus
                        className={[
                          'size-5 transition-transform',
                          openMobileProductCardId === card.id
                            ? 'rotate-45'
                            : '',
                        ].join(' ')}
                      />
                    </button>
                    {openMobileProductCardId === card.id && (
                      <ul className="mt-1 pl-3">
                        <Suspense fallback={null}>
                          <MobileProductSubmenuLinks
                            card={card}
                            pathname={pathname}
                            onNavigate={() => setIsMobileMenuOpen(false)}
                          />
                        </Suspense>
                      </ul>
                    )}
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-secondary/10 px-3 py-3 font-bold text-text-primary select-none"
                    aria-expanded={isMobileActivityMenuOpen}
                    onClick={() => {
                      setOpenMobileProductCardId(null);
                      setIsMobileActivityMenuOpen((isOpen) => !isOpen);
                    }}
                  >
                    <span>所有活動</span>
                    <LuPlus
                      className={[
                        'size-5 transition-transform',
                        isMobileActivityMenuOpen ? 'rotate-45' : '',
                      ].join(' ')}
                    />
                  </button>
                  {isMobileActivityMenuOpen && (
                    <ul className="mt-1 pl-3">
                      {ACTIVITY_MENU_ITEMS.map((item) => (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            className={mobileSubmenuLinkClassName(
                              pathname === item.href
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                <li>
                  <Link
                    href="/member/pets/ai"
                    className="block rounded-lg bg-secondary/10 px-3 py-3 font-bold text-text-primary active:bg-button-secondary-hover [@media(hover:hover)]:hover:bg-button-secondary-hover"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    AI 顧問
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#contact"
                    className="block rounded-lg bg-secondary/10 px-3 py-3 font-bold text-text-primary active:bg-button-secondary-hover [@media(hover:hover)]:hover:bg-button-secondary-hover"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    聯繫我們
                  </Link>
                </li>
              </ul>
            </aside>
            <Link href="/">
              <Image
                src="/images/logo/mofu-logo-final.svg"
                alt=""
                width={135}
                height={64}
                className="h-12 w-auto object-contain lg:h-16"
              />
            </Link>
          </div>
          <div className="navbar-center hidden gap-1 lg:flex">
            <div className="megamenu gap-1" id="my-megamenu-4" popover="auto">
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
                  items={ACTIVITY_MENU_ITEMS}
                />
              </div>
            </div>
            <ul className="menu menu-horizontal gap-1 p-0">
              <li className="rounded-lg hover:bg-button-secondary-hover">
                <Link
                  href="/member/pets/ai"
                  className="px-4 py-0 text-text-primary hover:bg-transparent"
                >
                  <div className="typo-body h-10 py-[5.5px]">AI 顧問</div>
                </Link>
              </li>
              <li className="rounded-lg hover:bg-button-secondary-hover">
                <Link
                  href="/#contact"
                  className="px-4 py-0 text-text-primary hover:bg-transparent"
                >
                  <div className="typo-body h-10 py-[5.5px]">聯繫我們</div>
                </Link>
              </li>
            </ul>
          </div>
          <div className="relative navbar-end gap-2 md:gap-4">
            <Link
              href="/member/favorites"
              className="btn btn-circle border-none btn-ghost p-1 align-middle text-text-secondary hover:bg-button-secondary-hover hover:shadow-none"
            >
              <LuHeart className="size-5 sm:size-6" />
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
                <LuShoppingCart className="size-5 sm:size-6" />
              </button>
              {isCartOpen && (
                <section
                  ref={cartPanelRef}
                  id="cart-panel"
                  className="fixed inset-x-5 top-20 z-30 flex max-h-[calc(100dvh-6rem)] w-auto flex-col rounded-2xl border border-secondary bg-white p-3 shadow-xl sm:absolute sm:top-12 sm:-right-30 sm:left-auto sm:w-[470px] sm:max-w-[calc(100vw-40px)]"
                  aria-label="購物車"
                >
                  <span className="absolute -top-[10px] right-32 hidden size-5 rotate-45 border-t border-l border-secondary bg-white sm:block" />

                  <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-xl bg-white">
                    <div className="flex items-center gap-2 border-b border-card-secondary px-2 pb-3 text-text-primary">
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
                              'flex justify-between border-b border-card-secondary px-2 py-5',
                              isRemoving ? 'bg-warning' : '',
                            ].join(' ')}
                          >
                            <div className="flex w-[60%] min-w-50 gap-2.5">
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
                              <div className="flex min-w-0 flex-col justify-center">
                                <h3 className="typo-tab truncate text-text-primary">
                                  {cartItem.prod_name}
                                </h3>
                                <p className="text-sm text-text-secondary">
                                  {cartItem.item_name}
                                </p>
                              </div>
                            </div>
                            {isRemoving ? (
                              <div className="flex max-w-[35%] min-w-35 flex-col items-center gap-3">
                                <p className="typo-tab whitespace-nowrap text-text-primary">
                                  確定要移除商品嗎?
                                </p>
                                <div className="flex w-full justify-around">
                                  <button
                                    type="button"
                                    aria-label="確認移除商品"
                                    className="cursor-pointer place-items-center rounded-lg text-green-600 hover:bg-white/70"
                                    onClick={() =>
                                      void handleConfirmRemoveCartItem(cartItem)
                                    }
                                  >
                                    確認
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="取消移除商品"
                                    className="cursor-pointer place-items-center rounded-lg text-red-600 hover:bg-white/70"
                                    onClick={() => setRemovingCartItemId(null)}
                                  >
                                    取消
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex max-w-[35%] min-w-35 items-center justify-end">
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
                                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-secondary hover:bg-button-secondary-hover"
                                  onClick={() =>
                                    setRemovingCartItemId(cartItem.item_id)
                                  }
                                >
                                  <LuTrash2 className="size-4" />
                                </button>
                              </div>
                            )}
                          </article>
                        );
                      })
                    )}
                  </div>

                  {!isCartLoginRequired && (
                    <div className="flex justify-end p-3 pb-0">
                      <Link
                        href="/cart"
                        type="button"
                        className="next-button typo-tab flex w-1/2 items-center justify-center py-3"
                        onClick={() => setIsCartOpen(false)}
                      >
                        查看完整購物車
                      </Link>
                    </div>
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
                <LuUser className="size-5 sm:size-6" />
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
                <LuLogOut className="size-5 sm:size-6" />
              </button>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            id="mobile-main-menu"
            className="border-t border-border bg-card-primary px-4 py-3 lg:hidden"
          >
            <nav className="grid gap-2" aria-label="主導覽">
              <Link
                href="/product"
                className="rounded-xl px-4 py-2.5 text-text-primary hover:bg-button-secondary-hover"
              >
                所有商品
              </Link>
              <Link
                href="/event"
                className="rounded-xl px-4 py-2.5 text-text-primary hover:bg-button-secondary-hover"
              >
                所有活動
              </Link>
              <Link
                href="/support/chat"
                className="rounded-xl px-4 py-2.5 text-text-primary hover:bg-button-secondary-hover"
              >
                AI 顧問
              </Link>
              <Link
                href="/member/dashboard"
                className="rounded-xl px-4 py-2.5 text-text-primary hover:bg-button-secondary-hover"
              >
                會員中心
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
