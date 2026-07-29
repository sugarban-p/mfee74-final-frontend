'use client';

import { useEffect } from 'react';

export default function CheckoutPaymentPendingPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderNo = params.get('orderNo') ?? '';
    const payUrl = params.get('pay') ?? '';
    const failUrl = orderNo
      ? `/checkout/fail?orderNo=${orderNo}`
      : '/checkout/fail';

    if (!payUrl) {
      window.location.replace(failUrl);
      return;
    }

    window.history.replaceState(null, '', failUrl);
    window.location.href = payUrl;
  }, []);

  return (
    <section className="mx-auto flex w-full max-w-[1520px] justify-center px-4 py-16 md:px-10">
      <div className="w-full max-w-[520px] rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white p-8 text-center">
        <p className="typo-body-medium text-text-secondary">
          正在前往付款頁...
        </p>
      </div>
    </section>
  );
}
