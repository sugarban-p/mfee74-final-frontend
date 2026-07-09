'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  LuChevronLeft,
  LuMinus,
  LuPlus,
  LuReceiptText,
  LuTicket,
  LuTrash2,
} from 'react-icons/lu';

interface CartItem {
  id: number;
  brand: string;
  name: string;
  option: string;
  price: number;
  quantity: number;
  image: string;
  imageAlt: string;
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    brand: 'Royal Canin',
    name: '皇家室內成貓專用飼料',
    option: '2kg',
    price: 890,
    quantity: 2,
    image: '/cat-category.png',
    imageAlt: '皇家室內成貓專用飼料',
  },
  {
    id: 2,
    brand: 'FORZA10',
    name: 'FORZA10 無穀鮭魚貓罐頭',
    option: '85g x 6罐',
    price: 480,
    quantity: 1,
    image: '/events.png',
    imageAlt: 'FORZA10 無穀鮭魚貓罐頭',
  },
  {
    id: 3,
    brand: 'NEKOZUKI',
    name: '麻繩貓抓板柱形款',
    option: '米白色 / 大',
    price: 320,
    quantity: 1,
    image: '/dog-category.png',
    imageAlt: '麻繩貓抓板柱形款',
  },
];

const formatPrice = (price: number) => `NT$${price.toLocaleString('zh-TW')}`;

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const itemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const updateQuantity = (id: number, nextQuantity: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, nextQuantity) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <section className="mx-auto w-full max-w-[1120px] py-10 text-text-primary md:py-14">
      <div className="mb-8 flex items-end gap-3">
        <h1 className="typo-h3 text-text-primary">購物車</h1>
        <span className="pb-1 text-sm text-text-secondary">
          （{itemCount} 件商品）
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="mb-3 hidden grid-cols-[minmax(0,1fr)_110px_130px_110px_40px] px-5 text-sm font-medium text-text-secondary md:grid">
            <span>商品</span>
            <span className="text-center">單價</span>
            <span className="text-center">數量</span>
            <span className="text-right">小計</span>
            <span aria-hidden="true" />
          </div>

          <div className="space-y-3">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-lg border border-border bg-white p-4 shadow-[0_8px_28px_rgba(45,31,14,0.04)] md:grid-cols-[minmax(0,1fr)_110px_130px_110px_40px] md:items-center md:px-5"
              >
                <div className="flex min-w-0 gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-card-primary md:h-18 md:w-18">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-text-secondary">
                      {item.brand}
                    </p>
                    <h2 className="mt-1 text-base font-medium leading-6 text-text-primary">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      {item.option}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm md:block md:text-center">
                  <span className="text-text-secondary md:hidden">單價</span>
                  <span>{formatPrice(item.price)}</span>
                </div>

                <div className="flex items-center justify-between md:justify-center">
                  <span className="text-sm text-text-secondary md:hidden">
                    數量
                  </span>
                  <div className="flex h-8 items-center gap-3">
                    <button
                      type="button"
                      aria-label={`減少 ${item.name} 數量`}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-white text-text-secondary transition hover:border-primary hover:text-primary"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <LuMinus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span className="w-5 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`增加 ${item.name} 數量`}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-white text-text-secondary transition hover:border-primary hover:text-primary"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <LuPlus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm font-semibold text-primary md:block md:text-right">
                  <span className="text-text-secondary md:hidden">小計</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>

                <button
                  type="button"
                  aria-label={`移除 ${item.name}`}
                  className="justify-self-end text-text-secondary transition hover:text-primary"
                  onClick={() => removeItem(item.id)}
                >
                  <LuTrash2 className="h-5 w-5" aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>

          <Link
            href="/products"
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-full border border-border bg-white px-5 text-sm font-semibold text-text-primary transition hover:border-primary hover:text-primary"
          >
            <LuChevronLeft className="h-4 w-4" aria-hidden="true" />
            繼續購物
          </Link>
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-border bg-white p-5 shadow-[0_8px_28px_rgba(45,31,14,0.04)]">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
              <LuTicket className="h-4 w-4 text-primary" aria-hidden="true" />
              優惠券
            </h2>
            <select
              aria-label="選擇優惠券"
              className="h-10 w-full rounded-lg border border-border bg-muted px-4 text-sm text-text-secondary outline-none focus:border-primary"
              defaultValue=""
            >
              <option value="" disabled>
                選擇可用優惠券
              </option>
              <option value="new-member">新會員首購 95 折</option>
              <option value="free-shipping">滿額免運優惠</option>
            </select>
          </section>

          <section className="rounded-lg border border-border bg-white p-5 shadow-[0_8px_28px_rgba(45,31,14,0.04)]">
            <h2 className="mb-5 flex items-center gap-2 text-base font-semibold">
              <LuReceiptText
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />
              訂單摘要
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>商品小計</span>
                <span className="text-text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>運費</span>
                <span className="font-semibold text-emerald-600">免運費</span>
              </div>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">應付金額</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition hover:bg-button-primary-hover"
            >
              前往結帳
            </Link>
          </section>
        </aside>
      </div>
    </section>
  );
}
