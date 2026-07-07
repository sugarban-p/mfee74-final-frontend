/**
 * Footer.tsx
 *
 * 全站共用 Footer 元件。
 * 設計原則：
 * 1. footer 背景滿版，不寫死 1920px。
 * 2. 內容區用 max-w-[1620px]。
 * 3. 連結資料集中寫在 footerColumns，之後頁面路徑要改，只改這裡就好。
 * 4. 訂閱電子報目前規劃只做裝飾作用。
 */
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { LuFacebook, LuYoutube } from 'react-icons/lu';
import { FaInstagram, FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink extends FooterLink {
  Icon: IconType;
}

const footerColumns: FooterColumn[] = [
  {
    title: '商品分類',
    links: [
      { label: '全部商品', href: '/products' },
      { label: '貓咪專區', href: '/products/cats' },
      { label: '狗狗專區', href: '/products/dogs' },
      { label: '換季新品', href: '/products/new' },
    ],
  },
  {
    title: '顧客服務',
    links: [
      { label: 'AI 導購', href: '/ai-guide' },
      { label: '聯繫我們', href: '/contact' },
      { label: '常見問題', href: '/faq' },
      { label: '配送說明', href: '/shipping' },
    ],
  },
  {
    title: '關於MOFU',
    links: [
      { label: '品牌故事', href: '/about' },
      { label: '合作獸醫師', href: '/vets' },
      { label: '永續理念', href: '/sustainability' },
      { label: '媒體報導', href: '/press' },
    ],
  },
];

const socialLinks: SocialLink[] = [
  { label: 'Instagram', href: '#', Icon: FaInstagram },
  { label: 'Facebook', href: '#', Icon: LuFacebook },
  { label: 'Twitter', href: '#', Icon: FaXTwitter },
  { label: 'YouTube', href: '#', Icon: LuYoutube },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#2D1F01] text-[#C9A07A]">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-20 md:px-6">
        {/* 上半部：品牌區、連結欄位、電子報 */}
        {/*
          外層先分成 3 大區：
          1. 品牌介紹區
          2. 中間導覽群組
          3. 訂閱電子報區

          lg:grid-cols-[1.1fr_1.55fr_1.3fr]：
          - 1.1fr：品牌區，不要太寬，避免左側空白過多。
          - 1.55fr：中間導覽群組，裡面再分 3 欄。
          - 1.3fr：電子報區，保留足夠寬度給 input + button。

          gap-16：控制 3 大區之間的距離。
          中間 3 個連結欄位的距離，會在內層 grid 用 gap-10 控制。
        */}
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1.55fr_1.3fr]">
          {/* 品牌介紹區 */}
          <section>
            <Link href="/" className="mb-6 inline-block">
              <Image
                src="/images/logo/mofu-logo-final.svg"
                alt="MOFU"
                width={116}
                height={48}
<<<<<<< HEAD
                className="h-auto w-[140px]"
=======
                className="h-auto w-35"
>>>>>>> origin/main
              />
            </Link>

            <p className="max-w-[320px] text-sm leading-7">
              科學配方、用心守護，為貓咪與狗狗每個生命階段提供最好的日常照護。
            </p>

            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.Icon;

                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4A351B] text-[#C9A07A] transition hover:bg-[#E98943] hover:text-white"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* 中間三欄連結 */}
          {/*
            內層再把導覽群組切成 3 欄。

            grid-cols-3：商品分類、顧客服務、關於 MOFU 各一欄。
            gap-10：三欄彼此靠近一點，讓它們看起來像同一組導覽。
          */}
          <div className="grid grid-cols-3 gap-10">
            {footerColumns.map((column) => (
              <section key={column.title}>
                <h2 className="mb-7 text-base font-semibold text-[#E98943]">
                  {column.title}
                </h2>

                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm transition hover:text-[#E98943]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* 訂閱電子報區 */}
          <section>
            <h2 className="mb-7 text-base font-semibold text-[#E98943]">
              訂閱電子報
            </h2>

<<<<<<< HEAD
            <p className="mb-6 max-w-[360px] text-sm leading-7">
              新品上架、毛孩照護秘訣與專屬優惠資訊。
            </p>

            <form className="flex max-w-[360px] gap-2">
=======
            <p className="mb-6 max-w-90 text-sm leading-7">
              新品上架、毛孩照護秘訣與專屬優惠資訊。
            </p>

            <form className="flex max-w-90 gap-2">
>>>>>>> origin/main
              <input
                type="email"
                name="email"
                placeholder="輸入電子郵件"
                className="h-11 min-w-0 flex-1 rounded-full border border-[#5B4630] bg-[#44331F] px-5 text-sm text-[#C9A07A] outline-none placeholder:text-[#8D7054] focus:border-[#E98943]"
              />

              <button
                type="button"
                className="h-11 shrink-0 rounded-full bg-[#E98943] px-6 text-sm font-semibold text-white transition hover:bg-[#d87832]"
              >
                訂閱
              </button>
            </form>
          </section>
        </div>

        {/* 下方分隔線與 copyright */}
        <div className="mt-16 border-t border-[#4A351B] pt-8">
          <div className="flex flex-col gap-4 text-xs text-[#8D7054] md:flex-row md:items-center md:justify-between">
            <p>© 2026 MOFU毛撫台灣・版權所有</p>

            <div className="flex gap-6">
              <Link href="/privacy" className="transition hover:text-[#E98943]">
                隱私權政策
              </Link>

              <Link href="/terms" className="transition hover:text-[#E98943]">
                服務條款
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
