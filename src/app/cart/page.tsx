'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
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
  brand: string;
  name: string;
  spec: string;
  price: number;
  qty: number;
  image: string;
}

const initialItems: CartItem[] = [
  {
    id: 1,
    brand: 'Royal Canin',
    name: '皇家室內成貓專用飼料',
    spec: '2kg',
    price: 890,
    qty: 2,
    image: '/cat-category.png',
  },
  {
    id: 2,
    brand: 'FORZA10',
    name: 'FORZA10 無穀鮭魚貓罐頭',
    spec: '85g x 6罐',
    price: 480,
    qty: 1,
    image: '/events.png',
  },
  {
    id: 3,
    brand: 'NEKOZUKI',
    name: '麻繩貓抓板柱形款',
    spec: '米白色 / 大',
    price: 320,
    qty: 1,
    image: '/dog-category.png',
  },
];

const cartGridClass = 'md:grid-cols-[minmax(0,1fr)_96px_132px_112px_40px]';

const coupons = [
  { code: 'PET10', label: 'PET10 — 享九折優惠' },
  { code: 'SAVE200', label: 'SAVE200 — 折抵 NT$200' },
  { code: 'FREESHIP', label: 'FREESHIP — 免運費' },
];

const formatPrice = (price: number) => `NT$${price.toLocaleString('zh-TW')}`;

export default function CartPage() {
  const [items, setItems] = useState(initialItems);
  const [couponCode, setCouponCode] = useState('');

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const totalQty = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (couponCode === 'PET10') return Math.round(subtotal * 0.1);
    if (couponCode === 'SAVE200') return Math.min(200, subtotal);
    return 0;
  }, [couponCode, subtotal]);

  const total = Math.max(0, subtotal - discount);

  const updateQty = (id: number, diff: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + diff) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[1340px] bg-[#faf8f5] px-4 py-8 md:px-10">
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
            href="/products"
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
    <section className="mx-auto w-full max-w-[1340px] bg-[#faf8f5] px-4 py-8 md:px-10">
      <header className="mb-8 flex items-end gap-3">
        <h1 className="typo-h3 text-text-primary">購物車</h1>
        <p className="typo-card-body text-text-secondary">
          （{totalQty} 件商品）
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div
            className={`mb-3 hidden gap-4 px-5 typo-tab text-text-secondary md:grid ${cartGridClass}`}
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
            href="/products"
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
                className="h-12 w-full appearance-none rounded-xl border border-[rgba(26,22,18,0.12)] bg-card-secondary px-4 pr-10 typo-card-body text-text-primary outline-none focus:border-primary"
                onChange={(event) => setCouponCode(event.target.value)}
              >
                <option value="">請選擇優惠券</option>
                {coupons.map((coupon) => (
                  <option key={coupon.code} value={coupon.code}>
                    {coupon.label}
                  </option>
                ))}
              </select>
              <LuChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
            </div>
          </section>

          <section className="rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white p-6">
            <h2 className="typo-card-title mb-5 flex items-center gap-2 text-text-primary">
              <LuClipboardList className="size-4 text-primary" />
              訂單摘要
            </h2>

            <div className="space-y-3 typo-card-body">
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
                <span className="font-medium text-green-600">免運費</span>
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
