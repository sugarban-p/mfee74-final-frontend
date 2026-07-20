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

const cartItem = {
  name: '慢烘鮮食蔬肉糧',
  variant: '雞肉',
  price: 'NT$229',
  image: '/images/product/蔬肉糧產品圖_01-510x510.jpg',
};

interface ProfileResponse {
  avatar?: string | null;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isRemovingCartItem, setIsRemovingCartItem] = useState(false);
  const [hasCartItem, setHasCartItem] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [memberAvatar, setMemberAvatar] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const cartPanelRef = useRef<HTMLElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);

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
    if (!isCartOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        cartPanelRef.current?.contains(target) ||
        cartButtonRef.current?.contains(target)
      ) {
        return;
      }

      setIsCartOpen(false);
      setIsRemovingCartItem(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isCartOpen]);

  const handleConfirmRemoveCartItem = () => {
    setHasCartItem(false);
    setIsRemovingCartItem(false);
    toast.success(`${cartItem.name} ${cartItem.variant} 已從購物車移除`);
  };

  useEffect(() => {
    refreshAuthState();
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
              src={'/images/logo/mofu-logo-final.svg'}
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
                所有產品
              </button>
              <div
                id="products"
                className="mt-0 w-auto rounded-xl rounded-tl-none border-2 border-border bg-card-primary"
                popover="auto"
              >
                <div className="items-start">
                  <ul className="menu-horizontal flex">
                    <li>
                      <MegaMenuCard
                        image="/cat-category.png"
                        imageAlt="貓咪專區"
                        title="貓咪專區"
                        href={`/product/cat?title=${encodeURIComponent('貓咪專區')}`}
                        items={[
                          { title: '主食', href: '/' },
                          { title: '零食/點心', href: '/' },
                          { title: '牽引用品', href: '/' },
                          { title: '保健品', href: '/' },
                          { title: '生活用品', href: '/' },
                        ]}
                      />
                    </li>
                    <li>
                      <MegaMenuCard
                        image="/dog-category.png"
                        imageAlt="狗勾專區"
                        title="狗勾專區"
                        href={`/product/dog?title=${encodeURIComponent('狗勾專區')}`}
                        items={[
                          { title: '主食', href: '/' },
                          { title: '零食/點心', href: '/' },
                          { title: '牽引用品', href: '/' },
                          { title: '保健品', href: '/' },
                          { title: '生活用品', href: '/' },
                        ]}
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <button
                className="typo-body rounded-lg text-text-primary hover:bg-button-secondary-hover [&:has(+_[popover]:popover-open)]:rounded-b-none [&:has(+_[popover]:popover-open)]:bg-button-secondary-hover"
                popoverTarget="events"
              >
                最新活動
              </button>
              <div
                id="events"
                className="mt-0 w-auto rounded-xl rounded-tl-none border-2 border-border bg-card-primary"
                popover="auto"
              >
                <MegaMenuCard
                  image="/events.png"
                  imageAlt="最新活動"
                  title="最新活動"
                  items={[
                    { title: '夏季新品', href: '/event' },
                    { title: '換季商品精選', href: '/event' },
                    { title: '首購85折優惠', href: '/event' },
                    { title: '會員限定禮盒', href: '/event' },
                  ]}
                />
              </div>
            </div>
            <ul className="menu menu-horizontal gap-1 p-0">
              <li className="rounded-lg hover:bg-button-secondary-hover">
                <Link
                  href={'/'}
                  className="px-4 py-0 text-text-primary hover:bg-transparent"
                >
                  <div className="typo-body h-10 py-[5.5px]">AI 導購</div>
                </Link>
              </li>
              <li className="rounded-lg hover:bg-button-secondary-hover">
                <Link
                  href={'/'}
                  className="px-4 py-0 text-text-primary hover:bg-transparent"
                >
                  <div className="typo-body h-10 py-[5.5px]">聯繫我們</div>
                </Link>
              </li>
            </ul>
          </div>
          <div className="relative navbar-end gap-4">
            <Link
              href={'/member/favorites'}
              className="btn btn-circle border-none btn-ghost p-1 align-middle text-text-secondary hover:bg-button-secondary-hover hover:shadow-none"
            >
              <LuHeart className="size-6" />
            </Link>
            <div className="relative flex items-center">
              <button
                ref={cartButtonRef}
                type="button"
                aria-label="切換購物車窗格"
                aria-expanded={isCartOpen}
                aria-controls="cart-panel"
                className="btn btn-circle border-none btn-ghost p-1 align-middle text-text-secondary hover:bg-button-secondary-hover hover:shadow-none"
                onClick={() => {
                  setIsCartOpen((prev) => !prev);
                  setIsRemovingCartItem(false);
                }}
              >
                <LuShoppingCart className="size-6" />
              </button>
              {isCartOpen && (
                <section
                  ref={cartPanelRef}
                  id="cart-panel"
                  className="absolute top-[calc(100%+8px)] left-1/2 z-20 w-[470px] max-w-[calc(100vw-40px)] -translate-x-1/2 rounded-2xl border border-secondary bg-white p-3 shadow-xl"
                  aria-label="購物車窗格"
                >
                  <span className="absolute -top-[10px] left-1/2 size-5 -translate-x-1/2 rotate-45 border-t border-l border-secondary bg-white" />

                  <div className="flex max-h-[349px] flex-col overflow-y-auto rounded-xl bg-white">
                    <div className="flex items-center gap-2 border-b border-card-secondary px-2 py-3 text-text-primary">
                      <LuPackage className="size-5 text-primary" />
                      <h2 className="typo-body-medium">購物車</h2>
                    </div>

                    {hasCartItem && (
                      <article
                        className={[
                          'flex justify-between gap-4 border-b border-card-secondary px-2 py-5',
                          isRemovingCartItem ? 'bg-warning' : '',
                        ].join(' ')}
                      >
                        <div className="flex gap-1">
                          <Image
                            src={cartItem.image}
                            alt={cartItem.name}
                            width={56}
                            height={56}
                            className="size-14 rounded-xl bg-card-secondary object-cover"
                          />
                          <div className="min-w-0">
                            <h3 className="typo-tab truncate text-text-primary">
                              {cartItem.name}
                            </h3>
                            <p className="mt-1 text-sm text-text-secondary">
                              {cartItem.variant}
                            </p>
                          </div>
                        </div>
                        <div className="flex min-w-0 items-center justify-between gap-1">
                          {isRemovingCartItem ? (
                            <div className="flex items-center gap-3">
                              <p className="typo-tab whitespace-nowrap text-text-primary">
                                確定要移除商品嗎?
                              </p>
                              <button
                                type="button"
                                aria-label="確認移除商品"
                                className="grid size-8 place-items-center rounded-lg text-green-600 hover:bg-white/70"
                                onClick={handleConfirmRemoveCartItem}
                              >
                                <LuCheck className="size-5" />
                              </button>
                              <button
                                type="button"
                                aria-label="取消移除商品"
                                className="grid size-8 place-items-center rounded-lg text-red-600 hover:bg-white/70"
                                onClick={() => setIsRemovingCartItem(false)}
                              >
                                <LuX className="size-5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <ProductQuantitySelector
                                usage="Header"
                                quantity={cartQuantity}
                                onChange={setCartQuantity}
                              />
                              <button
                                type="button"
                                aria-label="移除商品"
                                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-secondary hover:bg-button-secondary-hover"
                                onClick={() => setIsRemovingCartItem(true)}
                              >
                                <LuTrash2 className="size-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </article>
                    )}
                  </div>

                  <Link
                    href="/cart"
                    type="button"
                    className="next-button typo-tab mt-4 flex w-1/2 items-center justify-center py-3"
                    onClick={() => setIsCartOpen(false)}
                  >
                    查看完整購物車
                  </Link>
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
