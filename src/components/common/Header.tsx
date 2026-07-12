'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  LuHeart,
  LuPackage,
  LuShoppingCart,
  LuTrash2,
  LuUser,
} from 'react-icons/lu';

import MegaMenuCard from '@/src/components/header/MegaMenuCard';
import { ProductQuantitySelector } from '@/src/components/product/ProductQuantitySelector';

const cartItem = {
  name: '慢烘鮮食蔬肉糧',
  variant: '雞肉',
  price: 'NT$229',
  unitPrice: 229,
  image: '/images/product/蔬肉糧產品圖_01-510x510.jpg',
};

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);
  const cartTotal = `NT$${(cartItem.unitPrice * cartQuantity).toLocaleString()}`;

  return (
    <>
      <header className="sticky top-0 z-20 h-20 bg-card-primary/95">
        <div className="navbar mx-auto flex h-full max-w-[1620px] items-center justify-between px-5 md:px-16">
          <Link href="/" className="navbar-start">
            <Image
              src={'/images/logo/mofu-logo-final.svg'}
              alt=""
              width={135}
              height={64}
              className="object-contain"
            />
          </Link>
          <div className="navbar-center gap-1">
            <div className="megamenu gap-1" id="my-megamenu-4" popover="auto">
              <span className="megamenu-active"></span>
              <button
                className="typo-body rounded-lg text-text-primary hover:bg-button-secondary-hover [&:has(+_[popover]:popover-open)]:bg-button-secondary-hover [&:has(+_[popover]:popover-open)]:rounded-b-none"
                popoverTarget="products"
              >
                所有產品
              </button>
              <div
                id="products"
                className="w-auto rounded-xl rounded-tl-none bg-card-primary border-border border-2 mt-0 "
                popover="auto"
              >
                <div className="items-start">
                  <ul className="menu-horizontal flex">
                    <li>
                      <MegaMenuCard
                        image="/cat-category.png"
                        imageAlt="貓咪專區"
                        title="貓咪專區"
                        href={`/product/cat?title=${encodeURIComponent('貓咪專區')}`}
                        items={[
                          { title: '主食', href: '/' },
                          { title: '零食/點心', href: '/' },
                          { title: '牽引用品', href: '/' },
                          { title: '保健品', href: '/' },
                          { title: '生活用品', href: '/' },
                        ]}
                      />
                    </li>
                    <li>
                      <MegaMenuCard
                        image="/dog-category.png"
                        imageAlt="狗勾專區"
                        title="狗勾專區"
                        href={`/product/dog?title=${encodeURIComponent('狗勾專區')}`}
                        items={[
                          { title: '主食', href: '/' },
                          { title: '零食/點心', href: '/' },
                          { title: '牽引用品', href: '/' },
                          { title: '保健品', href: '/' },
                          { title: '生活用品', href: '/' },
                        ]}
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <button
                className="typo-body rounded-lg text-text-primary hover:bg-button-secondary-hover [&:has(+_[popover]:popover-open)]:bg-button-secondary-hover [&:has(+_[popover]:popover-open)]:rounded-b-none"
                popoverTarget="events"
              >
                最新活動
              </button>
              <div
                id="events"
                className="w-auto rounded-xl rounded-tl-none bg-card-primary border-border border-2 mt-0 "
                popover="auto"
              >
                <MegaMenuCard
                  image="/events.png"
                  imageAlt="最新活動"
                  title="最新活動"
                  href="/"
                  items={[
                    { title: '夏季新品', href: '/' },
                    { title: '換季商品精選', href: '/' },
                    { title: '首購85折優惠', href: '/' },
                    { title: '會員限定禮盒', href: '/' },
                  ]}
                />
              </div>
            </div>
            <ul className="menu menu-horizontal p-0 gap-1">
              <li className="rounded-lg hover:bg-button-secondary-hover">
                <Link
                  href={'/'}
                  className="py-0 px-4 text-text-primary hover:bg-transparent"
                >
                  <div className="typo-body h-10 py-[5.5px]">AI 導購</div>
                </Link>
              </li>
              <li className="rounded-lg hover:bg-button-secondary-hover">
                <Link
                  href={'/'}
                  className="py-0 px-4 text-text-primary hover:bg-transparent"
                >
                  <div className="typo-body h-10 py-[5.5px]">聯繫我們</div>
                </Link>
              </li>
            </ul>
          </div>
          <div className="navbar-end relative gap-4">
            <Link
              href={'/member/favorites'}
              className="p-1 text-text-secondary align-middle border-none hover:bg-button-secondary-hover btn btn-circle btn-ghost hover:shadow-none"
            >
              <LuHeart className="size-6" />
            </Link>
            <button
              type="button"
              aria-label="切換購物車窗格"
              aria-expanded={isCartOpen}
              aria-controls="cart-panel"
              className="p-1 text-text-secondary align-middle border-none hover:bg-button-secondary-hover btn btn-circle btn-ghost hover:shadow-none"
              onClick={() => setIsCartOpen((prev) => !prev)}
            >
              <LuShoppingCart className="size-6" />
            </button>
            {isCartOpen && (
              <section
                id="cart-panel"
                className="absolute top-12 right-0 w-[470px] max-w-[calc(100vw-40px)] rounded-2xl border border-secondary bg-white p-3 shadow-xl"
                aria-label="購物車窗格"
              >
                <span className="absolute -top-[10px] right-[61px] size-5 rotate-45 border-t border-l border-secondary bg-white" />

                <div className="flex max-h-[349px] flex-col overflow-y-auto rounded-xl bg-white">
                  <div className="flex items-center gap-2 border-b border-card-secondary px-2 py-3 text-text-primary">
                    <LuPackage className="size-5 text-primary" />
                    <h2 className="typo-body-medium">購物車</h2>
                  </div>

                  <article className="flex justify-between gap-4 border-b border-card-secondary px-2 py-5">
                    <div className="flex gap-1">
                      <Image
                        src={cartItem.image}
                        alt={cartItem.name}
                        width={56}
                        height={56}
                        className="size-14 rounded-xl bg-card-secondary object-cover"
                      />
                      <div className="min-w-0">
                        <h3 className="typo-tab truncate text-text-primary">
                          {cartItem.name}
                        </h3>
                        <p className="mt-1 text-sm text-text-secondary">
                          {cartItem.variant}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center gap-1 min-w-0">
                      <ProductQuantitySelector
                        usage="Header"
                        quantity={cartQuantity}
                        onChange={setCartQuantity}
                      />
                      <button
                        type="button"
                        aria-label="移除商品"
                        className="size-8 flex justify-center items-center shrink-0 rounded-lg text-secondary hover:bg-button-secondary-hover"
                      >
                        <LuTrash2 className="size-4" />
                      </button>
                    </div>
                  </article>
                </div>

                <button
                  type="button"
                  className="next-button typo-tab mt-4 flex w-1/2 items-center justify-center py-3"
                  onClick={() => setIsCartOpen(false)}
                >
                  直接結帳
                </button>
              </section>
            )}
            <Link
              href={'/member/dashboard'}
              className="p-1 text-text-secondary align-middle border-none hover:bg-button-secondary-hover btn btn-circle btn-ghost hover:shadow-none"
            >
              <LuUser className="size-6" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
