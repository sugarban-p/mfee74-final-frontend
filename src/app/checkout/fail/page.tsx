'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LuCircleAlert, LuRotateCcw } from 'react-icons/lu';

interface PendingOrder {
  id: string;
  paymentMethod: 'credit' | 'linepay';
  title: string;
  total: number;
}

const pendingPaymentKey = 'mofu-pending-payment';

const getPaymentHref = (order: PendingOrder) => {
  const provider = order.paymentMethod === 'linepay' ? 'linepay' : 'ecpay';
  const params = new URLSearchParams({
    amount: String(order.total),
    items: order.title,
    orderNo: order.id,
  });

  return `/api/orders/payments/${provider}?${params.toString()}`;
};

export default function CheckoutFailPage() {
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const orderNo = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('orderNo') ?? '';
  }, []);

  useEffect(() => {
    sessionStorage.removeItem(pendingPaymentKey);

    if (!orderNo) return;

    fetch(`/api/orders/list/${orderNo}`, { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        if (!data?.order) return;

        setOrder({
          id: data.order.id,
          paymentMethod: data.order.paymentMethod ?? 'credit',
          title: data.order.items?.map((item: { name: string }) => item.name).join(',') || 'MOFU 商品',
          total: Number(data.order.total) || 0,
        });
      })
      .catch(() => setOrder(null));
  }, [orderNo]);

  return (
    <section className="mx-auto flex w-full max-w-[1520px] justify-center px-4 py-16 md:px-10">
      <div className="w-full max-w-[460px] rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white px-8 py-9 text-center shadow-[0_8px_28px_rgba(45,31,14,0.04)]">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-danger">
          <LuCircleAlert className="size-8 text-red-500" />
        </div>

        <h1 className="typo-h3 mb-3 text-text-primary">付款未完成</h1>

        <p className="typo-card-body mb-6 text-text-secondary">
          這筆訂單已建立，但尚未完成付款。你可以查看訂單，或再次前往付款頁完成付款。
        </p>

        <div className="grid gap-3">
          {order && (
            <a
              href={getPaymentHref(order)}
              className="next-button typo-tab inline-flex items-center justify-center gap-2"
            >
              重新付款
              <LuRotateCcw className="size-4" />
            </a>
          )}

          <Link
            href={orderNo ? `/member/orders/${orderNo}` : '/member/orders'}
            className="back-button typo-tab"
          >
            查看訂單
          </Link>

          <Link href="/member/orders" className="back-button typo-tab">
            返回訂單列表
          </Link>
        </div>
      </div>
    </section>
  );
}
