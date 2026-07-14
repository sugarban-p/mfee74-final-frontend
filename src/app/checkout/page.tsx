'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaRegCreditCard, FaRegIdCard } from 'react-icons/fa6';
import {
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuInfo,
  LuMapPin,
  LuPackage,
} from 'react-icons/lu';

const orderItems = [
  {
    brand: 'Royal Canin',
    name: '皇家室內成貓專用飼料',
    spec: '2kg',
    price: 890,
    qty: 2,
    image: '/cat-category.png',
  },
  {
    brand: 'FORZA10',
    name: 'FORZA10 無穀鮭魚貓罐頭',
    spec: '85g x 6罐',
    price: 480,
    qty: 1,
    image: '/events.png',
  },
  {
    brand: 'NEKOZUKI',
    name: '麻繩貓抓板柱形款',
    spec: '米白色 / 大',
    price: 320,
    qty: 1,
    image: '/dog-category.png',
  },
];

const subtotal = orderItems.reduce(
  (sum, item) => sum + item.price * item.qty,
  0
);
const total = subtotal;

const steps = ['確認訂購內容', '填寫收件資訊', '選擇付款方式'];

const orderGridClass = 'md:grid-cols-[minmax(0,1fr)_100px_80px_100px]';

const formatPrice = (price: number) => `NT$${price.toLocaleString('zh-TW')}`;

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const goNext = () => {
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const goBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
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
                  className={`flex size-8 items-center justify-center rounded-full typo-tab ${
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
              className={`mb-4 hidden gap-4 typo-tab text-text-secondary md:grid ${orderGridClass}`}
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

            <div className="mt-4 space-y-3 border-t border-[rgba(26,22,18,0.08)] pt-5 typo-card-body">
              <div className="flex justify-between text-text-secondary">
                <span>商品小計</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
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
                  className="h-11 w-full rounded-xl border border-[rgba(26,22,18,0.12)] bg-card-primary px-4 typo-card-body text-text-primary outline-none focus:border-primary"
                  defaultValue="林小美"
                />
              </label>

              <label className="block">
                <span className="typo-card-body mb-2 block text-text-secondary">
                  聯絡手機
                </span>
                <input
                  className="h-11 w-full rounded-xl border border-[rgba(26,22,18,0.12)] bg-card-primary px-4 typo-card-body text-text-primary outline-none focus:border-primary"
                  defaultValue="0912-345-678"
                />
              </label>

              <label className="block md:col-span-1">
                <span className="typo-card-body mb-2 block text-text-secondary">
                  電子信箱
                </span>
                <input
                  className="h-11 w-full rounded-xl border border-[rgba(26,22,18,0.12)] bg-card-primary px-4 typo-card-body text-text-primary outline-none focus:border-primary"
                  defaultValue="mei@petfull.tw"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="typo-card-body mb-2 block text-text-secondary">
                  收件地址
                </span>
                <input
                  className="h-11 w-full rounded-xl border border-[rgba(26,22,18,0.12)] bg-card-primary px-4 typo-card-body text-text-primary outline-none focus:border-primary"
                  defaultValue="台北市信義區信義路五段 7 號 10 樓"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="typo-card-body mb-2 block text-text-secondary">
                  備註（選填）
                </span>
                <input
                  className="h-12 w-full rounded-xl border border-[rgba(26,22,18,0.12)] bg-card-primary px-4 typo-card-body text-text-primary outline-none placeholder:text-text-secondary focus:border-primary"
                  placeholder="如：請放門口、指定配送時段"
                />
              </label>
            </div>

            <label className="mt-6 flex items-start gap-3 border-t border-[rgba(26,22,18,0.08)] pt-5">
              <input type="checkbox" className="checkbox checkbox-sm mt-1" />
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
              <label className="flex items-start justify-between gap-4 rounded-2xl border border-primary bg-card-primary p-5">
                <span className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
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
                <input
                  type="radio"
                  name="payment"
                  defaultChecked
                  className="radio radio-sm checked:bg-primary"
                />
              </label>

              <label className="flex items-start justify-between gap-4 rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white p-5 text-text-secondary">
                <span className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-card-secondary">
                    <FaRegIdCard className="size-5" />
                  </span>
                  <span>
                    <span className="typo-card-title block text-text-primary">
                      銀行匯款（ATM）
                    </span>
                    <span className="typo-card-body block">
                      玉山 / 台新 / 國泰等各大銀行
                    </span>
                    <span className="typo-card-body mt-2 block">
                      送出後將顯示匯款帳號資訊
                    </span>
                  </span>
                </span>
                <input type="radio" name="payment" className="radio radio-sm" />
              </label>
            </div>

            <div className="typo-card-body mt-6 flex items-center gap-2 rounded-xl bg-card-secondary px-4 py-3 text-text-secondary">
              <LuInfo className="size-4 shrink-0" />
              本站採用綠界金流（ECPay）處理付款。點擊「確認付款」後將前往付款頁面完成付款。
            </div>

            <Link
              href="/checkout/success"
              className="next-button typo-tab mt-6 flex w-full items-center justify-center gap-2"
            >
              <LuCheck className="size-4" />
              確認付款，送出訂單
            </Link>
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
