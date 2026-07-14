'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuUser, LuHeart, LuShoppingCart } from 'react-icons/lu';
import MegaMenuCard from '@/src/components/header/MegaMenuCard';

export default function Header() {
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
          <div className="navbar-end gap-4">
            <Link
              href={'/member/favorites'}
              className="p-1 text-text-secondary align-middle border-none hover:bg-button-secondary-hover btn btn-circle btn-ghost hover:shadow-none"
            >
              <LuHeart className="size-6" />
            </Link>
            <Link
              href={'/'}
              className="p-1 text-text-secondary align-middle border-none hover:bg-button-secondary-hover btn btn-circle btn-ghost hover:shadow-none"
            >
              <LuShoppingCart className="size-6" />
            </Link>
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
