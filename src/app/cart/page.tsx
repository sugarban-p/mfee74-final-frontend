'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuClipboardList,
  LuMinus,
  LuPlus,
  LuShoppingCart,
  LuTicketPercent,
  LuTrash2,
} from 'react-icons/lu';

interface CartItem {
  id: number;
  skuId: number;
  brand: string;
  name: string;
  spec: string;
  price: number;
  qty: number;
  image: string;
}

interface Coupon {
  code: string;
  title: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minAmount: number;
}

const cartGridClass = 'md:grid-cols-[minmax(0,1fr)_96px_132px_112px_40px]';
const continueShoppingHref = `/product/cat?title=${encodeURIComponent('貓咪專區')}`;
const shippingFee = 60;

const formatPrice = (price: number) => `NT$${price.toLocaleString('zh-TW')}`;

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [hasLoadedSavedCoupon, setHasLoadedSavedCoupon] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      const [cartResponse, couponResponse] = await Promise.all([
        fetch('/api/orders/cart', { credentials: 'include' }),
        fetch('/api/orders/coupons', { credentials: 'include' }),
      ]);

      if (cartResponse.status === 401 || couponResponse.status === 401) {
        router.push('/auth/login?next=/cart');
        return;
      }

      const cartData = await cartResponse.json();
      const couponData = await couponResponse.json();

      setItems(cartData.items ?? []);
      setCoupons(couponData.coupons ?? []);
      setIsLoading(false);
    };

    loadCart().catch(() => setIsLoading(false));

    const savedCoupon = localStorage.getItem('mofu-cart-coupon');
    if (savedCoupon) setCouponCode(savedCoupon);
    setHasLoadedSavedCoupon(true);
  }, [router]);

  useEffect(() => {
    if (!hasLoadedSavedCoupon) return;
    if (couponCode) {
      localStorage.setItem('mofu-cart-coupon', couponCode);
      return;
    }

    localStorage.removeItem('mofu-cart-coupon');
  }, [couponCode, hasLoadedSavedCoupon]);

  useEffect(() => {
    if (isLoading) return;
    if (couponCode && !coupons.some((coupon) => coupon.code === couponCode)) {
      setCouponCode('');
      localStorage.removeItem('mofu-cart-coupon');
    }
  }, [couponCode, coupons, isLoading]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const totalQty = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const discount = useMemo(() => {
    const coupon = coupons.find((item) => item.code === couponCode);
    if (!coupon || subtotal < coupon.minAmount) return 0;
    if (coupon.discountType === 'percent') {
      return Math.round(subtotal * (1 - coupon.discountValue / 100));
    }
    if (coupon.code === 'FREESHIP') return 0;
    return Math.min(coupon.discountValue, subtotal);
  }, [couponCode, coupons, subtotal]);
  const selectedCoupon = coupons.find((item) => item.code === couponCode);
  const isCouponBelowMin =
    Boolean(selectedCoupon) && subtotal < Number(selectedCoupon?.minAmount);
  const couponMessage = selectedCoupon
    ? isCouponBelowMin
      ? `尚未達使用門檻，還差 ${formatPrice(
          Number(selectedCoupon.minAmount) - subtotal
        )}`
      : selectedCoupon.code === 'FREESHIP'
        ? '已套用免運券，目前訂單已免運。'
        : discount > 0
          ? `已套用 ${selectedCoupon.code}，折抵 ${formatPrice(discount)}`
          : '此優惠券目前沒有可折抵金額。'
    : '';

  const couponLabel = (coupon: Coupon) => {
    const minAmountLabel =
      coupon.minAmount > 0 ? `滿 ${formatPrice(coupon.minAmount)}` : '無低消';

    if (coupon.discountType === 'percent') {
      return `${coupon.title} — ${minAmountLabel}享 ${coupon.discountValue / 10} 折`;
    }
    if (coupon.discountValue === 0)
      return `${coupon.title} — ${minAmountLabel}`;
    return `${coupon.title} — ${minAmountLabel}折抵 ${formatPrice(coupon.discountValue)}`;
  };

  const updateQty = async (id: number, diff: number) => {
    const item = items.find((cartItem) => cartItem.id === id);
    if (!item) return;

    const quantity = Math.max(1, item.qty + diff);
    setItems((current) =>
      current.map((cartItem) =>
        cartItem.id === id ? { ...cartItem, qty: quantity } : cartItem
      )
    );

    await fetch(`/api/orders/cart/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
  };

  const removeItem = async (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
    await fetch(`/api/orders/cart/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  };

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-[1340px] px-4 py-8 md:px-10">
        <div className="rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white px-6 py-16 text-center">
          <p className="typo-body-medium text-text-secondary">
            購物車資料載入中...
          </p>
        </div>
      </section>
    );
  }
  const total = Math.max(0, subtotal + shippingFee - discount);

  if (items.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[1340px] px-4 py-8 md:px-10">
        <header className="mb-8 flex items-end gap-3">
          <h1 className="typo-h3 text-text-primary">購物車</h1>
          <p className="typo-card-body text-text-secondary">（0 件商品）</p>
        </header>

        <div className="flex min-h-[329px] flex-col items-center justify-center rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white px-6 py-20">
          <LuShoppingCart className="mb-4 size-16 text-text-secondary" />

          <p className="typo-body-medium mb-6 text-text-primary">
            購物車目前是空的
          </p>

          <Link
            href={continueShoppingHref}
            className="next-button typo-tab inline-flex items-center justify-center gap-2"
          >
            繼續購物
            <LuChevronRight className="size-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1340px] px-4 py-8 md:px-10">
      <header className="mb-8 flex items-end gap-3">
        <h1 className="typo-h3 text-text-primary">購物車</h1>
        <p className="typo-card-body text-text-secondary">
          （{totalQty} 件商品）
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div
            className={`typo-tab mb-3 hidden gap-4 px-5 text-text-secondary md:grid ${cartGridClass}`}
          >
            <span>商品</span>
            <span className="text-right">單價</span>
            <span className="text-center">數量</span>
            <span className="text-right">小計</span>
            <span />
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className={`grid gap-4 rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white p-5 md:items-center ${cartGridClass}`}
              >
                <div className="flex min-w-0 gap-4">
                  <div className="relative size-[72px] shrink-0 overflow-hidden rounded-xl bg-card-primary">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="typo-card-body text-text-secondary">
                      {item.brand}
                    </p>
                    <h2 className="typo-card-title truncate text-text-primary">
                      {item.name}
                    </h2>
                    <p className="typo-card-body text-text-secondary">
                      {item.spec}
                    </p>
                  </div>
                </div>

                <p className="typo-card-body w-full text-right text-text-secondary">
                  {formatPrice(item.price)}
                </p>

                <div className="flex w-full items-center justify-center gap-2">
                  <button
                    type="button"
                    aria-label="減少數量"
                    className="flex size-7 items-center justify-center rounded-lg border border-[rgba(26,22,18,0.12)] text-text-secondary"
                    onClick={() => updateQty(item.id, -1)}
                  >
                    <LuMinus className="size-3" />
                  </button>
                  <span className="typo-card-title w-8 text-center text-text-primary">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    aria-label="增加數量"
                    className="flex size-7 items-center justify-center rounded-lg border border-[rgba(26,22,18,0.12)] text-text-secondary"
                    onClick={() => updateQty(item.id, 1)}
                  >
                    <LuPlus className="size-3" />
                  </button>
                </div>

                <p className="typo-card-title w-full text-right text-primary">
                  {formatPrice(item.price * item.qty)}
                </p>

                <button
                  type="button"
                  aria-label="刪除商品"
                  className="flex size-8 items-center justify-center rounded-lg text-text-secondary hover:bg-card-primary"
                  onClick={() => removeItem(item.id)}
                >
                  <LuTrash2 className="size-4" />
                </button>
              </article>
            ))}
          </div>

          <Link
            href={continueShoppingHref}
            className="back-button typo-tab mt-4 inline-flex items-center gap-2"
          >
            <LuChevronLeft className="size-4" />
            繼續購物
          </Link>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white p-6">
            <h2 className="typo-card-title mb-5 flex items-center gap-2 text-text-primary">
              <LuTicketPercent className="size-4 text-primary" />
              優惠券
            </h2>

            <div className="relative">
              <select
                aria-label="選擇優惠券"
                value={couponCode}
                className="typo-card-body h-12 w-full appearance-none rounded-xl border border-[rgba(26,22,18,0.12)] bg-card-secondary px-4 pr-10 text-text-primary outline-none focus:border-primary"
                onChange={(event) => setCouponCode(event.target.value)}
              >
                <option value="">請選擇優惠券</option>
                {coupons.map((coupon) => (
                  <option key={coupon.code} value={coupon.code}>
                    {couponLabel(coupon)}
                  </option>
                ))}
              </select>
              <LuChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-text-secondary" />
            </div>
            {couponMessage && (
              <p
                className={`typo-card-body mt-3 ${
                  isCouponBelowMin ? 'text-red-500' : 'text-primary'
                }`}
              >
                {couponMessage}
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white p-6">
            <h2 className="typo-card-title mb-5 flex items-center gap-2 text-text-primary">
              <LuClipboardList className="size-4 text-primary" />
              訂單摘要
            </h2>

            <div className="typo-card-body space-y-3">
              <div className="flex justify-between text-text-secondary">
                <span>商品小計</span>
                <span className="text-text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>優惠折扣</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-text-secondary">
                <span>運費</span>
                <span className="text-text-primary">
                  {formatPrice(shippingFee)}
                </span>
              </div>

              <div className="border-t border-[rgba(26,22,18,0.12)] pt-4">
                <div className="flex items-end justify-between">
                  <span className="typo-h4 text-text-primary">應付金額</span>
                  <span className="typo-body-medium text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="next-button typo-tab mt-6 flex w-full items-center justify-center gap-2"
              onClick={() => {
                if (couponCode) {
                  localStorage.setItem('mofu-cart-coupon', couponCode);
                  return;
                }

                localStorage.removeItem('mofu-cart-coupon');
              }}
            >
              前往結帳
              <LuChevronRight className="size-4" />
            </Link>
          </section>
        </aside>
      </div>
    </section>
  );
}
