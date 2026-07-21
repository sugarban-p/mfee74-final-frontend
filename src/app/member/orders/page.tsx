'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  LuChevronRight,
  LuClock,
  LuPackage,
  LuRotateCcw,
} from 'react-icons/lu';

const filters = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待付款' },
  { key: 'processing', label: '處理中' },
  { key: 'shipped', label: '已出貨' },
  { key: 'completed', label: '已完成' },
  { key: 'canceled', label: '已取消' },
] as const;

type FilterKey = (typeof filters)[number]['key'];

const statusStyle = {
  pending: 'bg-info text-[#4f8aa8]',
  processing: 'bg-info text-[#4f8aa8]',
  shipped: 'bg-info text-[#4f8aa8]',
  completed: 'bg-success text-[#5f9d63]',
  paid: 'bg-success text-[#5f9d63]',
  failed: 'bg-danger text-[#d85a5a]',
  canceled: 'bg-button-disabled text-text-button-disabled',
  refunded: 'bg-button-disabled text-text-button-disabled',
};

interface OrderItem {
  id: string;
  status: keyof typeof statusStyle;
  statusText: string;
  paymentStatus: keyof typeof statusStyle;
  paymentText: string;
  createdAt: string;
  title: string;
  payment: string;
  total: number;
  images: string[];
}

const formatPrice = (price: number) => `NT$${price.toLocaleString('zh-TW')}`;

export default function MemberOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders/list', { credentials: 'include' })
      .then((response) => {
        if (response.status === 401) {
          router.push('/auth/login?next=/member/orders');
          return null;
        }

        return response.json();
      })
      .then((data) => setOrders(data?.orders ?? []))
      .finally(() => setIsLoading(false));
  }, [router]);

  const visibleOrders = useMemo(() => {
    if (activeFilter === 'all') return orders;
    return orders.filter((order) => order.status === activeFilter);
  }, [activeFilter]);

  const countByFilter = (key: FilterKey) => {
    if (key === 'all') return orders.length;
    return orders.filter((order) => order.status === key).length;
  };

  return (
    <section className="w-full">
      <h1 className="typo-h3 mb-6 text-text-primary">我的訂單</h1>

      {isLoading && (
        <div className="rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white px-6 py-16 text-center">
          <p className="typo-body-medium text-text-secondary">
            訂單資料載入中...
          </p>
        </div>
      )}

      {!isLoading && (
        <div className="mb-6 flex flex-wrap gap-3">
          {filters.map((filter) => {
            const active = activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                className={`typo-tab rounded-full px-5 py-2 transition ${
                  active
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-secondary hover:bg-card-primary'
                }`}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
                <span
                  className={`ml-2 rounded-full px-2 ${
                    active ? 'bg-white/20 text-white' : 'bg-card-secondary'
                  }`}
                >
                  {countByFilter(filter.key)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {!isLoading && (
        <div className="space-y-4">
          {visibleOrders.map((order) => (
            <article
              key={order.id}
              className="overflow-hidden rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white"
            >
              <header className="flex flex-col gap-3 border-b border-[rgba(26,22,18,0.08)] px-5 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="typo-tab font-bold text-text-primary">
                    {order.id}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyle[order.status as keyof typeof statusStyle]
                    }`}
                  >
                    {order.statusText}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyle[
                        order.paymentStatus as keyof typeof statusStyle
                      ]
                    }`}
                  >
                    {order.paymentText}
                  </span>
                </div>

                <time className="typo-card-body flex items-center gap-1 text-text-secondary">
                  <LuClock className="size-4" />
                  {order.createdAt}
                </time>
              </header>

              <div className="grid gap-5 px-5 py-6 md:grid-cols-[1fr_140px] md:items-center">
                <div className="flex min-w-0 gap-4">
                  <div className="flex shrink-0 gap-2">
                    {order.images.map((image) => (
                      <div
                        key={`${order.id}${image}`}
                        className="relative size-12 overflow-hidden rounded-xl bg-card-primary"
                      >
                        <Image
                          src={image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="min-w-0">
                    <h2 className="typo-card-title truncate text-text-primary">
                      {order.title}
                    </h2>
                    <p className="typo-card-body text-text-secondary">
                      {order.payment}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 md:justify-end">
                  <div className="text-right">
                    <p className="typo-card-body text-text-secondary">
                      訂單金額
                    </p>
                    <p className="typo-card-title text-primary">
                      {formatPrice(order.total)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2">
                    <Link
                      href={`/member/orders/${order.id}`}
                      className="next-button typo-tab inline-flex items-center justify-center gap-2 px-5"
                    >
                      查看明細
                      <LuChevronRight className="size-4" />
                    </Link>

                    <button
                      type="button"
                      className="back-button typo-tab inline-flex items-center justify-center gap-2 px-5"
                    >
                      再買一次
                      <LuRotateCcw className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!isLoading && visibleOrders.length === 0 && (
        <div className="rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white px-6 py-16 text-center">
          <LuPackage className="mx-auto mb-4 size-12 text-text-secondary" />
          <p className="typo-body-medium text-text-primary">
            目前沒有符合條件的訂單
          </p>
        </div>
      )}
    </section>
  );
}
