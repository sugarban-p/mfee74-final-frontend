'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FaLine, FaRegCreditCard } from 'react-icons/fa6';
import {
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuInfo,
  LuMapPin,
  LuPackage,
} from 'react-icons/lu';

interface CheckoutItem {
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
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minAmount: number;
}

interface ShippingInfo {
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  receiverAddress: string;
  remark: string;
}

const steps = ['確認訂購內容', '填寫收件資訊', '選擇付款方式'];

const orderGridClass = 'md:grid-cols-[minmax(0,1fr)_100px_80px_100px]';

const formatPrice = (price: number) => `NT$${price.toLocaleString('zh-TW')}`;

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'linepay'>(
    'credit'
  );
  const [orderItems, setOrderItems] = useState<CheckoutItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    receiverName: '林小美',
    receiverPhone: '0912-345-678',
    receiverEmail: 'mei@petfull.tw',
    receiverAddress: '台北市信義區信義路五段 7 號 10 樓',
    remark: '',
  });

  const updateShippingInfo = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => {
    const loadCheckout = async () => {
      const [cartResponse, couponResponse] = await Promise.all([
        fetch('/api/orders/cart', { credentials: 'include' }),
        fetch('/api/orders/coupons', { credentials: 'include' }),
      ]);

      if (cartResponse.status === 401 || couponResponse.status === 401) {
        window.location.href = '/auth/login';
        return;
      }

      const cartData = await cartResponse.json();
      const couponData = await couponResponse.json();

      setOrderItems(cartData.items ?? []);
      setCoupons(couponData.coupons ?? []);
      setIsLoading(false);
    };

    loadCheckout().catch(() => {
      setError('結帳資料載入失敗，請稍後再試。');
      setIsLoading(false);
    });

    const savedCoupon = localStorage.getItem('mofu-cart-coupon');
    if (savedCoupon) setCouponCode(savedCoupon);
  }, []);

  const subtotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [orderItems]
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
  const total = Math.max(0, subtotal - discount);

  if (isLoading) {
    return (
      <section className="mx-auto flex w-full max-w-[1520px] justify-center bg-[#faf8f5] px-4 py-16 md:px-10">
        <div className="w-full max-w-[520px] rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white p-8 text-center">
          <p className="typo-body-medium text-text-secondary">
            結帳資料載入中...
          </p>
        </div>
      </section>
    );
  }

  if (orderItems.length === 0) {
    return (
      <section className="mx-auto flex w-full max-w-[1520px] justify-center bg-[#faf8f5] px-4 py-16 md:px-10">
        <div className="w-full max-w-[520px] rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white p-8 text-center">
          <h1 className="typo-h3 mb-3 text-text-primary">購物車目前是空的</h1>
          <p className="typo-card-body mb-6 text-text-secondary">
            請先回到購物車確認商品後再進行結帳。
          </p>
          <Link
            href="/cart"
            className="next-button typo-tab inline-flex items-center justify-center gap-2"
          >
            返回購物車
            <LuChevronRight className="size-4" />
          </Link>
        </div>
      </section>
    );
  }

  const goNext = () => {
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const goBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handlePayment = async () => {
    if (
      !shippingInfo.receiverName ||
      !shippingInfo.receiverPhone ||
      !shippingInfo.receiverAddress
    ) {
      setError('請填寫完整收件資訊。');
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const checkoutResponse = await fetch('/api/orders/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverName: shippingInfo.receiverName,
          receiverPhone: shippingInfo.receiverPhone,
          receiverAddress: shippingInfo.receiverAddress,
          shippingMethod: '宅配',
          paymentMethod,
          couponCode,
          invoiceType: '個人發票',
          remark: shippingInfo.remark,
        }),
      });

      if (checkoutResponse.status === 401) {
        window.location.href = '/auth/login';
        return;
      }

      const checkoutData = await checkoutResponse.json().catch(() => null);

      if (!checkoutResponse.ok || !checkoutData?.orderNo) {
        setError(checkoutData?.message ?? '建立訂單失敗，請稍後再試。');
        setIsSubmitting(false);
        return;
      }

      const items = orderItems.map((item) => item.name).join(',');
      const provider = paymentMethod === 'linepay' ? 'linepay' : 'ecpay';
      const params = new URLSearchParams({
        amount: String(checkoutData.total ?? total),
        items,
        orderNo: checkoutData.orderNo,
      });

      window.location.href = `/api/orders/payments/${provider}?${params.toString()}`;
    } catch {
      setError('建立訂單失敗，請稍後再試。');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-[1520px] bg-[#faf8f5] px-4 py-8 md:px-10">
      <ol className="mx-auto mb-10 flex max-w-[520px] items-center justify-center">
        {steps.map((step, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;

          return (
            <li
              key={step}
              className="flex min-w-0 flex-1 items-center last:flex-none"
            >
              <button
                type="button"
                className="flex shrink-0 items-center gap-2"
                onClick={() => setCurrentStep(index)}
              >
                <span
                  className={`typo-tab flex size-8 items-center justify-center rounded-full ${
                    isDone || isActive
                      ? 'bg-primary text-white'
                      : 'bg-card-secondary text-text-secondary'
                  }`}
                >
                  {isDone ? <LuCheck className="size-4" /> : index + 1}
                </span>
                <span
                  className={`typo-tab whitespace-nowrap ${
                    isDone || isActive
                      ? 'text-text-primary'
                      : 'text-text-secondary'
                  }`}
                >
                  {step}
                </span>
              </button>

              {index < steps.length - 1 && (
                <span
                  className={`mx-4 h-px flex-1 ${
                    index < currentStep ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>

      {currentStep === 0 && (
        <>
          <section className="mx-auto max-w-[1020px] rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white p-6">
            <h1 className="typo-card-title mb-6 flex items-center gap-2 text-text-primary">
              <LuPackage className="size-4 text-primary" />
              商品清單
            </h1>

            <div
              className={`typo-tab mb-4 hidden gap-4 text-text-secondary md:grid ${orderGridClass}`}
            >
              <span>商品</span>
              <span className="text-right">單價</span>
              <span className="text-center">數量</span>
              <span className="text-right">小計</span>
            </div>

            <div className="divide-y divide-[rgba(26,22,18,0.08)]">
              {orderItems.map((item) => (
                <article
                  key={`${item.name}${item.spec}`}
                  className={`grid gap-4 py-4 md:items-center ${orderGridClass}`}
                >
                  <div className="flex min-w-0 gap-4">
                    <div className="relative size-[56px] shrink-0 overflow-hidden rounded-xl bg-card-primary">
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
                  <p className="typo-card-title w-full text-center text-text-primary">
                    {item.qty}
                  </p>
                  <p className="typo-card-title w-full text-right text-primary">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </article>
              ))}
            </div>

            <div className="typo-card-body mt-4 space-y-3 border-t border-[rgba(26,22,18,0.08)] pt-5">
              <div className="flex justify-between text-text-secondary">
                <span>商品小計</span>
                <span>{formatPrice(subtotal)}</span>
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
              <div className="flex justify-between border-t border-[rgba(26,22,18,0.08)] pt-4">
                <span className="typo-h4 text-text-primary">應付總額</span>
                <span className="typo-body-medium text-primary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </section>

          <div className="mx-auto mt-6 flex max-w-[1020px] justify-between">
            <Link
              href="/cart"
              className="back-button typo-tab inline-flex items-center gap-2"
            >
              <LuChevronLeft className="size-4" />
              返回購物車
            </Link>

            <button
              type="button"
              className="next-button typo-tab inline-flex items-center gap-2"
              onClick={goNext}
            >
              下一步：填寫收件資料
              <LuChevronRight className="size-4" />
            </button>
          </div>
        </>
      )}

      {currentStep === 1 && (
        <>
          <section className="mx-auto max-w-[1020px] rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white p-6">
            <h1 className="typo-card-title mb-6 flex items-center gap-2 text-text-primary">
              <LuMapPin className="size-4 text-primary" />
              收件資訊
            </h1>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="typo-card-body mb-2 block text-text-secondary">
                  收件人姓名
                </span>
                <input
                  className="typo-card-body h-11 w-full rounded-xl border border-[rgba(26,22,18,0.12)] bg-card-primary px-4 text-text-primary outline-none focus:border-primary"
                  value={shippingInfo.receiverName}
                  onChange={(event) =>
                    updateShippingInfo('receiverName', event.target.value)
                  }
                />
              </label>

              <label className="block">
                <span className="typo-card-body mb-2 block text-text-secondary">
                  聯絡手機
                </span>
                <input
                  className="typo-card-body h-11 w-full rounded-xl border border-[rgba(26,22,18,0.12)] bg-card-primary px-4 text-text-primary outline-none focus:border-primary"
                  value={shippingInfo.receiverPhone}
                  onChange={(event) =>
                    updateShippingInfo('receiverPhone', event.target.value)
                  }
                />
              </label>

              <label className="block md:col-span-1">
                <span className="typo-card-body mb-2 block text-text-secondary">
                  電子信箱
                </span>
                <input
                  className="typo-card-body h-11 w-full rounded-xl border border-[rgba(26,22,18,0.12)] bg-card-primary px-4 text-text-primary outline-none focus:border-primary"
                  value={shippingInfo.receiverEmail}
                  onChange={(event) =>
                    updateShippingInfo('receiverEmail', event.target.value)
                  }
                />
              </label>

              <label className="block md:col-span-2">
                <span className="typo-card-body mb-2 block text-text-secondary">
                  收件地址
                </span>
                <input
                  className="typo-card-body h-11 w-full rounded-xl border border-[rgba(26,22,18,0.12)] bg-card-primary px-4 text-text-primary outline-none focus:border-primary"
                  value={shippingInfo.receiverAddress}
                  onChange={(event) =>
                    updateShippingInfo('receiverAddress', event.target.value)
                  }
                />
              </label>

              <label className="block md:col-span-2">
                <span className="typo-card-body mb-2 block text-text-secondary">
                  備註（選填）
                </span>
                <input
                  className="typo-card-body h-12 w-full rounded-xl border border-[rgba(26,22,18,0.12)] bg-card-primary px-4 text-text-primary outline-none placeholder:text-text-secondary focus:border-primary"
                  placeholder="如：請放門口、指定配送時段"
                  value={shippingInfo.remark}
                  onChange={(event) =>
                    updateShippingInfo('remark', event.target.value)
                  }
                />
              </label>
            </div>

            <label className="mt-6 flex items-start gap-3 border-t border-[rgba(26,22,18,0.08)] pt-5">
              <input type="checkbox" className="checkbox mt-1 checkbox-sm" />
              <span>
                <span className="typo-card-title block text-text-primary">
                  同時更新會員收件資訊
                </span>
                <span className="typo-card-body text-text-secondary">
                  將以上收件資料儲存為會員預設收件地址，下次結帳時自動帶入
                </span>
              </span>
            </label>
          </section>

          <div className="mx-auto mt-6 flex max-w-[1020px] justify-between">
            <button
              type="button"
              className="back-button typo-tab inline-flex items-center gap-2"
              onClick={goBack}
            >
              <LuChevronLeft className="size-4" />
              上一步
            </button>

            <button
              type="button"
              className="next-button typo-tab inline-flex items-center gap-2"
              onClick={goNext}
            >
              下一步：選擇付款方式
              <LuChevronRight className="size-4" />
            </button>
          </div>
        </>
      )}

      {currentStep === 2 && (
        <>
          <section className="mx-auto max-w-[1020px] rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white p-6">
            <h1 className="typo-card-title mb-6 flex items-center gap-2 text-text-primary">
              <FaRegCreditCard className="size-4 text-primary" />
              付款方式
            </h1>

            <div className="grid gap-4 md:grid-cols-2">
              <label
                className={`flex cursor-pointer items-start justify-between gap-4 rounded-2xl border p-5 ${
                  paymentMethod === 'credit'
                    ? 'border-primary bg-card-primary'
                    : 'border-[rgba(26,22,18,0.12)] bg-white text-text-secondary'
                }`}
              >
                <span className="flex gap-4">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                      paymentMethod === 'credit'
                        ? 'bg-primary text-white'
                        : 'bg-card-secondary'
                    }`}
                  >
                    <FaRegCreditCard className="size-5" />
                  </span>
                  <span>
                    <span className="typo-card-title block text-text-primary">
                      信用卡付款
                    </span>
                    <span className="typo-card-body block text-text-secondary">
                      Visa / Mastercard / JCB
                    </span>
                    <span className="typo-card-body mt-2 block text-primary">
                      送出後將轉至綠界信用卡付款頁面
                    </span>
                  </span>
                </span>
                <span className="relative mt-1 flex size-5 shrink-0 items-center justify-center">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'credit'}
                    onChange={() => setPaymentMethod('credit')}
                    className="sr-only"
                  />
                  <span
                    className={`flex size-5 items-center justify-center rounded-full border ${
                      paymentMethod === 'credit'
                        ? 'border-primary bg-primary'
                        : 'border-[rgba(26,22,18,0.12)] bg-white'
                    }`}
                  >
                    {paymentMethod === 'credit' && (
                      <span className="size-2.5 rounded-full bg-card-primary" />
                    )}
                  </span>
                </span>
              </label>

              <label
                className={`flex cursor-pointer items-start justify-between gap-4 rounded-2xl border p-5 ${
                  paymentMethod === 'linepay'
                    ? 'border-primary bg-card-primary'
                    : 'border-[rgba(26,22,18,0.12)] bg-white text-text-secondary'
                }`}
              >
                <span className="flex gap-4">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                      paymentMethod === 'linepay'
                        ? 'bg-primary text-white'
                        : 'bg-card-secondary'
                    }`}
                  >
                    <FaLine className="size-5" />
                  </span>
                  <span>
                    <span className="typo-card-title block text-text-primary">
                      LINE Pay 付款
                    </span>
                    <span className="typo-card-body block">LINE Pay</span>
                    <span className="typo-card-body mt-2 block">
                      送出後將轉至 LINE Pay 付款頁面
                    </span>
                  </span>
                </span>
                <span className="relative mt-1 flex size-5 shrink-0 items-center justify-center">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'linepay'}
                    onChange={() => setPaymentMethod('linepay')}
                    className="sr-only"
                  />
                  <span
                    className={`flex size-5 items-center justify-center rounded-full border ${
                      paymentMethod === 'linepay'
                        ? 'border-primary bg-primary'
                        : 'border-[rgba(26,22,18,0.12)] bg-white'
                    }`}
                  >
                    {paymentMethod === 'linepay' && (
                      <span className="size-2.5 rounded-full bg-card-primary" />
                    )}
                  </span>
                </span>
              </label>
            </div>

            <div className="typo-card-body mt-6 flex items-center gap-2 rounded-xl bg-card-secondary px-4 py-3 text-text-secondary">
              <LuInfo className="size-4 shrink-0" />
              本站支援信用卡與 LINE Pay
              付款。點擊「確認付款」後將前往付款頁面完成付款。
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={isSubmitting}
              className="next-button typo-tab mt-6 flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LuCheck className="size-4" />
              {isSubmitting ? '訂單建立中...' : '確認付款，送出訂單'}
            </button>

            {error && (
              <p className="typo-card-body mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-600">
                {error}
              </p>
            )}
          </section>

          <div className="mx-auto mt-6 flex max-w-[1020px] justify-start">
            <button
              type="button"
              className="back-button typo-tab inline-flex items-center gap-2"
              onClick={goBack}
            >
              <LuChevronLeft className="size-4" />
              上一步
            </button>
          </div>
        </>
      )}
    </section>
  );
}
