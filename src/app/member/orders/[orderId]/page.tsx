'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  LuChevronLeft,
  LuMail,
  LuMapPin,
  LuPackage,
  LuPhone,
  LuReceipt,
  LuTruck,
} from 'react-icons/lu';

interface OrderDetail {
  id: string;
  statusText: string;
  paymentText: string;
  createdAt: string;
  payment: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  receiver: {
    name: string;
    phone: string;
    email: string;
    address: string;
    trackingNo: string | null;
  };
  items: Array<{
    brand: string;
    name: string;
    spec: string;
    price: number;
    qty: number;
    image: string;
  }>;
  timeline: Array<{
    label: string;
    note: string;
    done: boolean;
  }>;
}

const formatPrice = (price: number) => `NT$${price.toLocaleString('zh-TW')}`;
const pendingPaymentKey = 'mofu-pending-payment';

export default function MemberOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params.orderId) return;

    if (sessionStorage.getItem(pendingPaymentKey) === params.orderId) {
      sessionStorage.removeItem(pendingPaymentKey);
    }

    fetch(`/api/orders/list/${params.orderId}`, { credentials: 'include' })
      .then((response) => {
        if (response.status === 401) {
          router.push(
            `/auth/login?next=/member/orders/${encodeURIComponent(params.orderId)}`
          );
          return null;
        }

        return response.json();
      })
      .then((data) => setOrder(data?.order ?? null))
      .catch(() => setOrder(null))
      .finally(() => setIsLoading(false));
  }, [params.orderId, router]);

  const items = order?.items ?? [];
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  if (isLoading) {
    return (
      <section className="w-full">
        <div className="rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white px-6 py-16 text-center">
          <p className="typo-body-medium text-text-secondary">
            訂單明細載入中...
          </p>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="w-full">
        <div className="rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white px-6 py-16 text-center">
          <p className="typo-body-medium mb-6 text-text-primary">
            找不到這筆訂單
          </p>
          <Link
            href="/member/orders"
            className="back-button typo-tab inline-flex items-center justify-center gap-2"
          >
            <LuChevronLeft className="size-4" />
            返回訂單列表
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="mb-6">
        <Link
          href="/member/orders"
          className="back-button typo-tab mb-4 inline-flex items-center justify-center gap-2"
        >
          <LuChevronLeft className="size-4" />
          返回訂單列表
        </Link>

        <h1 className="typo-h3 text-text-primary">訂單明細</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white p-6">
            <h2 className="typo-card-title mb-5 flex items-center gap-2 text-text-primary">
              <LuPackage className="size-4 text-primary" />
              商品明細
            </h2>

            <div className="typo-tab mb-3 hidden grid-cols-[1fr_90px_70px_100px] gap-4 text-text-secondary md:grid">
              <span>商品</span>
              <span className="text-right">單價</span>
              <span className="text-center">數量</span>
              <span className="text-right">小計</span>
            </div>

            <div className="divide-y divide-[rgba(26,22,18,0.08)]">
              {items.map((item) => (
                <article
                  key={item.name}
                  className="grid gap-4 py-4 md:grid-cols-[1fr_90px_70px_100px] md:items-center"
                >
                  <div className="flex min-w-0 gap-4">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-card-primary">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="typo-card-body text-text-secondary">
                        {item.brand}
                      </p>
                      <h3 className="typo-card-title truncate text-text-primary">
                        {item.name}
                      </h3>
                      <p className="typo-card-body text-text-secondary">
                        {item.spec}
                      </p>
                    </div>
                  </div>

                  <p className="typo-card-body flex w-full justify-between gap-3 text-text-secondary md:block md:text-right">
                    <span className="md:hidden">單價</span>
                    <span>{formatPrice(item.price)}</span>
                  </p>
                  <p className="typo-card-body flex w-full justify-between gap-3 text-text-secondary md:block md:text-center">
                    <span className="md:hidden">數量</span>
                    <span>{item.qty}</span>
                  </p>
                  <p className="typo-card-body flex w-full justify-between gap-3 md:block md:text-right">
                    <span className="text-text-secondary md:hidden">
                      小計
                    </span>
                    <span className="typo-card-title text-primary">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </p>
                </article>
              ))}
            </div>

            <div className="typo-card-body mt-4 space-y-3 border-t border-[rgba(26,22,18,0.08)] pt-5">
              <div className="flex justify-between text-text-secondary">
                <span>商品小計</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>運費</span>
                <span>
                  {order.shippingFee
                    ? formatPrice(order.shippingFee)
                    : '免運費'}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>優惠折扣</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[rgba(26,22,18,0.08)] pt-4">
                <span className="typo-h4 text-text-primary">訂單總金額</span>
                <span className="typo-body-medium text-primary">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white p-6">
            <h2 className="typo-card-title mb-5 flex items-center gap-2 text-text-primary">
              <LuTruck className="size-4 text-primary" />
              訂單進度
            </h2>

            <div className="space-y-5 border-l-2 border-card-secondary pl-5">
              {order.timeline.map((step) => (
                <div key={step.label} className="relative">
                  <span
                    className={`absolute top-1 -left-[29px] size-3 rounded-full ${
                      step.done ? 'bg-primary' : 'bg-button-disabled'
                    }`}
                  />
                  <p
                    className={`typo-card-title ${
                      step.done ? 'text-text-primary' : 'text-text-secondary'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="typo-card-body text-text-secondary">
                    {step.note}
                  </p>
                </div>
              ))}
            </div>

            <p className="typo-card-body mt-6 border-t border-[rgba(26,22,18,0.08)] pt-4 text-text-primary">
              物流追蹤號：
              <span className="font-bold">
                {order.receiver.trackingNo ?? '尚未建立'}
              </span>
            </p>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white p-6">
            <h2 className="typo-card-title mb-5 flex items-center gap-2 text-text-primary">
              <LuReceipt className="size-4 text-primary" />
              訂單資訊
            </h2>

            <dl className="typo-card-body space-y-3">
              <div className="flex justify-between gap-4">
                <dt className="text-text-secondary">訂單編號</dt>
                <dd className="min-w-0 truncate text-right text-sm text-text-primary sm:text-base">
                  {order.id}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-secondary">成立時間</dt>
                <dd className="text-right text-text-primary">
                  {order.createdAt}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-secondary">訂單狀態</dt>
                <dd className="text-right text-primary">{order.statusText}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-secondary">付款狀態</dt>
                <dd className="text-right text-primary">{order.paymentText}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-secondary">付款方式</dt>
                <dd className="text-right text-text-primary">
                  {order.payment}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white p-6">
            <h2 className="typo-card-title mb-5 flex items-center gap-2 text-text-primary">
              <LuMapPin className="size-4 text-primary" />
              收件資訊
            </h2>

            <div className="typo-card-body space-y-3 text-text-secondary">
              <p className="font-bold text-text-primary">
                {order.receiver.name}
              </p>
              <p className="flex items-center gap-2">
                <LuPhone className="size-4" />
                {order.receiver.phone}
              </p>
              <p className="flex items-center gap-2">
                <LuMail className="size-4" />
                {order.receiver.email}
              </p>
              <p className="flex items-start gap-2">
                <LuMapPin className="mt-1 size-4 shrink-0" />
                {order.receiver.address}
              </p>
            </div>
          </section>

        </aside>
      </div>
    </section>
  );
}
