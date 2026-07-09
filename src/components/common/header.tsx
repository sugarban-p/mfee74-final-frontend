'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LuUser, LuHeart, LuShoppingCart } from 'react-icons/lu';
import MegaMenuCard from '@/src/components/header/megamenu-card';

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-20 h-20 bg-[#fdf8f3]/95 shadow-[0_2px_24px_rgba(45,31,14,0.08)]">
        <div className="navbar mx-auto flex h-full max-w-[1620px] items-center justify-between px-5 md:px-16">
          <div className="navbar-start">
            <Image
              src={'/mofu.svg'}
              alt=""
              width={135}
              height={64}
              className="object-contain"
            />
          </div>
          <div className="navbar-center">
            <div
              className="megamenu megamenu-full max-sm:megamenu-vertical"
              id="my-megamenu-4"
              popover="auto"
            >
              <span className="megamenu-active"></span>
              <button popoverTarget="products">所有產品</button>
              <div id="products" className="w-150 rounded-xl" popover="auto">
                <div className="items-start max-sm:flex-col">
                  <ul className="menu-vertical flex md:menu-horizontal">
                    <li>
                      <MegaMenuCard
                        image="/cat-category.png"
                        imageAlt="貓咪專區"
                        title="貓咪專區"
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
              <button popoverTarget="events">最新活動</button>
              <div id="events" className="w-75" popover="auto">
                <MegaMenuCard
                  image="/events.png"
                  imageAlt="最新活動"
                  title="最新活動"
                  items={[
                    { title: '夏季新品', href: '/' },
                    { title: '換季商品精選', href: '/' },
                    { title: '首購85折優惠', href: '/' },
                    { title: '會員限定禮盒', href: '/' },
                  ]}
                />
              </div>
            </div>
            <ul className="menu menu-horizontal p-0">
              <li>
                <Link href={'/'} className="btn btn-ghost">
                  AI 導購
                </Link>
              </li>
              <li>
                <Link href={'/'} className="btn btn-ghost">
                  聯繫我們
                </Link>
              </li>
            </ul>
          </div>
          <div className="navbar-end gap-4">
            <Link href={'/'} className="btn btn-circle size-8 btn-ghost">
              <LuHeart className="size-full" />
            </Link>
            <Link href={'/'} className="btn btn-circle size-8 btn-ghost">
              <LuShoppingCart className="size-full" />
            </Link>
            <Link href={'/'} className="btn btn-circle size-8 btn-ghost">
              <LuUser className="size-full" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
