'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LuCircleCheck } from 'react-icons/lu';

interface PaymentSummary {
  orderNo: string;
  method: string;
  paidAt: string;
  transactionNo: string;
  total: number;
}

const formatPrice = (price: number) => `NT$${price.toLocaleString('zh-TW')}`;

export default function CheckoutSuccessPage() {
  const [payment, setPayment] = useState<PaymentSummary | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderNo = params.get('orderNo');
    const transactionNo = params.get('transactionNo') ?? '付款平台已完成驗證';

    if (!orderNo) return;

    fetch(`/api/orders/list/${orderNo}`, { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        if (!data?.order) return;

        setPayment({
          orderNo: data.order.id,
          method: data.order.payment,
          paidAt: data.order.paidAt ?? data.order.createdAt,
          transactionNo,
          total: Number(data.order.total) || 0,
        });
      })
      .catch(() => {
        setPayment(null);
      });
  }, []);

  return (
    <section className="mx-auto flex w-full max-w-[1520px] justify-center bg-[#faf8f5] px-4 py-16 md:px-10">
      <div className="w-full max-w-[360px] rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white px-8 py-9 text-center shadow-[0_8px_28px_rgba(45,31,14,0.04)]">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-success">
          <LuCircleCheck className="size-8 text-green-500" />
        </div>

        <h1 className="typo-h3 mb-3 text-text-primary">付款成功！</h1>

        <p className="typo-card-body mb-6 text-text-secondary">
          已透過付款平台完成付款驗證
          <br />
          感謝您的購買，我們將盡快為您備貨出貨
        </p>

        <dl className="typo-card-body mb-5 space-y-3 rounded-2xl bg-card-secondary p-4 text-left">
          <div className="flex justify-between gap-4">
            <dt className="text-text-secondary">訂單編號</dt>
            <dd className="text-right font-bold text-text-primary">
              {payment?.orderNo ?? '讀取中'}
            </dd>
          </div>

          <div className="flex justify-between gap-4">
            <dt className="text-text-secondary">付款方式</dt>
            <dd className="text-right text-text-primary">
              {payment?.method ?? '讀取中'}
            </dd>
          </div>

          <div className="flex justify-between gap-4">
            <dt className="text-text-secondary">付款完成時間</dt>
            <dd className="text-right text-text-primary">
              {payment?.paidAt ?? '讀取中'}
            </dd>
          </div>

          <div className="flex justify-between gap-4">
            <dt className="text-text-secondary">交易編號</dt>
            <dd className="text-right text-text-primary">
              {payment?.transactionNo ?? '讀取中'}
            </dd>
          </div>

          <div className="flex justify-between gap-4 border-t border-[rgba(26,22,18,0.12)] pt-3">
            <dt className="typo-h4 text-text-primary">應付金額</dt>
            <dd className="typo-body-medium text-primary">
              {payment ? formatPrice(payment.total) : '讀取中'}
            </dd>
          </div>
        </dl>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/member/orders" className="back-button typo-tab">
            查看訂單
          </Link>

          <Link href="/" className="next-button typo-tab">
            回到首頁
          </Link>
        </div>
      </div>
    </section>
  );
}
