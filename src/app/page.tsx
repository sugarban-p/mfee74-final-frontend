'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  LuArrowRight,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuMinus,
  LuPlus,
  LuQuote,
  LuSparkles,
  LuStar,
} from 'react-icons/lu';

/**
 * 首頁活動輪播資料。
 *
 * 每筆資料對應一個活動詳情頁，輪播按鈕會讀取各自的 href。
 */
const heroSlides = [
  {
    eyebrow: 'MOFU 滿額免運',
    title: '滿 $1500 免運，補貨更輕鬆',
    description: '毛孩日常好物一次補齊，單筆訂單滿 $1500 即享免運優惠。',
    image: '/images/activity/滿額1500免運.png',
    imagePosition: 'center',
    href: '/activity/free-shipping-1500',
  },
  {
    eyebrow: 'MOFU 新品企劃',
    title: '新品嚐鮮季，發現毛孩新日常',
    description: '精選值得關注的新好物，用限時優惠輕鬆嚐鮮。',
    image: '/images/activity/新品嚐鮮季.png',
    imagePosition: 'center',
    href: '/activity/new-arrival-season',
  },
  {
    eyebrow: 'MOFU 毛孩好物節',
    title: '滿 $1000 現折 $100',
    description: '日常該買的趁現在一次補齊，滿額即享直接折扣。',
    image: '/images/activity/滿千折百.png',
    imagePosition: 'center',
    href: '/activity/pet-festival-1000-off-100',
  },
  {
    eyebrow: 'MOFU 新會員限定',
    title: '會員首購 9 折，金額沒有上限',
    description: '給新毛友的第一份禮物，首次購物用更輕鬆的價格補齊所需。',
    image: '/images/activity/會員首購9折.png',
    imagePosition: 'center',
    href: '/activity/new-member-first-order-10off',
  },
];

const testimonials = [
  {
    name: 'Nini 媽媽',
    pet: '英國短毛貓家長',
    quote:
      '原本很擔心挑不到適合的主食，商品分類很清楚，現在幫 Nini 補貨輕鬆多了。',
    image: '/cat-category.png',
  },
  {
    name: '豆豆爸爸',
    pet: '柴犬家長',
    quote:
      '從主食到日常用品都能一次找到，推薦資訊也很容易理解，選購時更有方向。',
    image: '/shibainu.jpeg',
  },
  {
    name: '奇奇姐姐',
    pet: '吉娃娃家長',
    quote:
      '先建立毛孩資料，再用 AI 顧問整理適合的商品，對第一次養寵物的我很友善。',
    image: '/chi.png',
  },
];

const faqs = [
  // 第一題：直接提供客服聯繫資訊。
  {
    question: '如何聯繫 MOFU 客服？',
    answer:
      '客服電話：0800-123-456，服務時間為週一至週五 09:00–18:00；電子郵件：support@mofu.com，我們會在收到來信後盡快回覆。',
  },
  // 第二題：說明登入後可以使用的客服中心。
  {
    question: '客服中心可以協助處理哪些問題？',
    answer: '登入會員後可以前往客服中心，詢問商品、付款、訂單配送等問題。',
  },
  {
    question: '第一次購買，該怎麼選擇適合毛孩的商品？',
    answer:
      '可以先從貓咪或狗狗專區依商品分類瀏覽；登入會員並建立毛孩資料後，也能使用 AI 顧問依物種、健康情況與過敏食材整理選購方向。',
  },
  {
    question: '毛孩有特定食材過敏，選購時要注意什麼？',
    answer:
      '請先查看商品規格與成分資訊。若已建立毛孩檔案，AI 導購的快速選購區也會標示需要留意的過敏食材；實際餵食仍建議依獸醫師意見評估。',
  },
  {
    question: '訂單成立後，大約多久會出貨？',
    answer:
      '一般訂單會於付款確認後依序處理。訂單確認後 1 到 3 個工作日內出貨，使用黑貓宅急便或新竹物流配送。',
  },
  {
    question: 'AI 顧問會直接替我決定要買哪一項商品嗎？',
    answer:
      '不會。AI 顧問會依毛孩資料與商品資訊提供選購參考，最後仍由會員自行閱讀商品內容並決定是否購買。',
  },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  /**
   * 每 6 秒切換下一張活動。
   * 使用者手動切換後，effect 會重新計時。
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [activeSlide]);

  const showPreviousSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const showNextSlide = () => {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  };

  return (
    /**
     * AppShell 的一般頁面內容寬度是 1520px。
     * 首頁需要滿版，因此用 100dvw 延伸到動態視窗寬度，
     * overflow-x-clip 避免輪播與動畫裝飾產生水平捲軸，
     * -my-16 則抵消 AppShell 為一般頁面保留的上下間距。
     */
    <div className="home-page relative left-1/2 -my-16 max-w-[100dvw] -translate-x-1/2 overflow-x-clip bg-background">
      {/*
       * 首頁專用的緩慢漂浮效果。
       * 裝飾只做小幅位移與旋轉，並尊重使用者的減少動態設定。
       */}
      <style jsx global>{`
        @keyframes home-float {
          0%,
          100% {
            transform: translateY(0) rotate(var(--home-rotate, 0deg));
          }
          50% {
            transform: translateY(-14px)
              rotate(calc(var(--home-rotate, 0deg) + 3deg));
          }
        }

        @keyframes home-drift {
          0%,
          100% {
            transform: translateX(0) rotate(var(--home-rotate, 0deg));
          }
          50% {
            transform: translateX(16px)
              rotate(calc(var(--home-rotate, 0deg) - 2deg));
          }
        }

        .home-float {
          animation: home-float 7s ease-in-out infinite;
        }

        .home-drift {
          animation: home-drift 9s ease-in-out infinite;
        }

        /*
         * globals.css 的字級是桌機版設計規格。
         * 只在首頁手機版縮小大型標題，避免改動其他組員的頁面。
         */
        @media (max-width: 767px) {
          .home-page .typo-display {
            font-size: 42px;
            line-height: 1.2;
          }

          .home-page .typo-h2 {
            font-size: 34px;
            line-height: 1.25;
          }

          .home-page .typo-h3 {
            font-size: 24px;
            line-height: 1.35;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-float,
          .home-drift {
            animation: none;
          }
        }
      `}</style>

      {/* 1. Hero Section：品牌主視覺與活動快訊 */}
      <section
        className="relative w-full overflow-hidden bg-card-secondary"
        aria-labelledby="home-hero-title"
      >
        {/* 有機背景圖形只建立層次，不影響主內容的整齊排列。 */}
        <div
          className="home-float pointer-events-none absolute top-[9%] right-[5%] h-52 w-64 rounded-[58%_42%_36%_64%/44%_61%_39%_56%] bg-background/60 sm:h-72 sm:w-96 lg:h-[460px] lg:w-[600px]"
          aria-hidden="true"
        />
        <div
          className="home-drift pointer-events-none absolute top-[17%] right-[30%] hidden h-32 w-24 rounded-[38%_62%_55%_45%/52%_40%_60%_48%] border border-primary/25 sm:block"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto grid min-h-[620px] w-full max-w-[1720px] grid-cols-1 items-center gap-8 px-5 pt-16 pb-10 sm:min-h-[680px] sm:px-8 md:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] md:gap-10 md:pt-20 md:pb-12 lg:min-h-[720px] lg:px-12 xl:gap-16 2xl:min-h-[760px] 2xl:px-16">
          {/* 首屏由可讀 HTML 建立品牌主張與 SEO 主標題。 */}
          <div className="relative z-20 max-w-[720px] text-center md:text-left">
            <div className="mb-5 flex items-center justify-center gap-4 md:justify-start">
              <span className="h-px w-12 bg-primary" aria-hidden="true" />
              <p className="typo-tab text-primary">MOFU PET LIFE</p>
            </div>

            <h1 id="home-hero-title" className="typo-display text-text-primary">
              MOFU陪主人，
              <br />
              把毛孩們照顧得更好
            </h1>

            <p className="typo-body mx-auto mt-6 max-w-[620px] text-text-secondary md:mx-0 md:mt-8">
              從安心選品、日常照護到個人化導購，陪您更清楚地找到毛孩所需。
            </p>
          </div>

          {/* 貓狗角色取代活動海報，讓首屏先建立 MOFU 的品牌記憶。 */}
          <div className="relative mx-auto h-[340px] w-full max-w-[700px] self-end sm:h-[420px] md:h-[560px] lg:h-[640px] lg:max-w-[900px]">
            <div
              className="absolute right-[1%] bottom-[3%] h-[88%] w-[92%] rounded-[58%_42%_48%_52%/46%_60%_40%_54%] border border-primary/20 bg-background/70"
              aria-hidden="true"
            />

            <Image
              src="/petdog.png"
              alt=""
              width={2000}
              height={2000}
              aria-hidden="true"
              className="home-drift absolute bottom-0 -left-[3%] z-10 h-auto w-[57%] drop-shadow-md sm:w-[59%]"
            />

            <Image
              src="/petcat.png"
              alt=""
              width={2000}
              height={2000}
              aria-hidden="true"
              className="home-float absolute -right-[3%] bottom-0 z-20 h-auto w-[62%] drop-shadow-md sm:w-[64%]"
            />

            <p className="typo-tab absolute top-[12%] right-[5%] z-30 rotate-6 text-primary sm:right-[10%]">
              GOOD DAYS, TOGETHER.
            </p>
          </div>
        </div>

        {/* 四個活動保留在首屏底部，以快訊形式自動輪播。 */}
        <div className="relative z-30 mx-auto w-full max-w-[1520px] px-5 pb-28 sm:px-8 lg:px-10">
          <div className="grid min-h-[196px] grid-cols-[160px_1fr] items-center gap-4 border-y border-primary/25 py-5 sm:min-h-[236px] sm:grid-cols-[260px_1fr_auto] sm:gap-6 lg:min-h-[280px] lg:grid-cols-[380px_minmax(0,1fr)_auto] lg:gap-8 xl:min-h-[320px] xl:grid-cols-[460px_minmax(0,1fr)_auto]">
            <div className="relative aspect-[16/9] overflow-hidden bg-background">
              {heroSlides.map((slide, index) => (
                <Image
                  key={slide.image}
                  src={slide.image}
                  alt=""
                  fill
                  // 四張活動圖會自動輪播，預先載入可避免切換時短暫模糊。
                  loading="eager"
                  // 活動 Banner 含有大量文字，提高最佳化後的輸出品質。
                  quality={90}
                  // 對應外層在不同斷點設定的 160、260、380、460px 欄寬。
                  sizes="(max-width: 639px) 160px, (max-width: 1023px) 260px, (max-width: 1279px) 380px, 460px"
                  aria-hidden="true"
                  className={`object-cover transition-opacity duration-500 ${
                    index === activeSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>

            <div className="grid min-w-0">
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.title}
                  className={`col-start-1 row-start-1 min-w-0 transition-opacity duration-500 ${
                    index === activeSlide
                      ? 'opacity-100'
                      : 'pointer-events-none opacity-0'
                  }`}
                  aria-hidden={index !== activeSlide}
                >
                  <div className="flex items-center gap-3">
                    <p className="typo-tab text-primary">最新活動</p>
                    <span className="typo-tab text-text-secondary">
                      {String(index + 1).padStart(2, '0')} /{' '}
                      {String(heroSlides.length).padStart(2, '0')}
                    </span>
                  </div>

                  <Link
                    href={slide.href}
                    className="typo-card-title mt-2 line-clamp-1 text-text-primary transition hover:text-primary"
                  >
                    {slide.title}
                  </Link>
                  <p className="typo-card-body mt-1 line-clamp-1 hidden text-text-secondary lg:block">
                    {slide.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="col-span-2 flex items-center justify-end gap-3 sm:col-span-1">
              <button
                type="button"
                aria-label="上一個活動"
                onClick={showPreviousSlide}
                className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-primary/30 bg-background text-text-secondary transition hover:bg-primary hover:text-white"
              >
                <LuChevronLeft className="size-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                aria-label="下一個活動"
                onClick={showNextSlide}
                className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-primary/30 bg-background text-text-secondary transition hover:bg-primary hover:text-white"
              >
                <LuChevronRight className="size-5" aria-hidden="true" />
              </button>

              <Link
                href={heroSlides[activeSlide].href}
                className="hover:bg-primary-hover hidden min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-white transition md:inline-flex"
              >
                查看活動
                <LuArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* 平滑曲線取代僵硬的水平分隔線。 */}
        <div className="pointer-events-none absolute -bottom-px left-0 z-10 w-full leading-[0]">
          <svg
            viewBox="0 0 1440 72"
            preserveAspectRatio="none"
            className="h-12 w-full md:h-[72px]"
            aria-hidden="true"
          >
            <path
              d="M0 52C220 8 470 82 730 42C1000 0 1220 70 1440 30V72H0V52Z"
              fill="var(--background)"
            />
          </svg>
        </div>
      </section>

      {/* 2. 貓咪與狗狗商品入口 */}
      <section className="relative mx-auto w-full max-w-[1520px] px-5 pt-16 pb-20 sm:px-8 md:pt-24 md:pb-32 lg:px-10">
        {/* 有機剪紙只出現在留白處，不改變商品圖片的規則排列。 */}
        <div
          aria-hidden="true"
          className="home-float pointer-events-none absolute top-14 left-1 hidden h-24 w-20 rounded-[60%_40%_48%_52%/42%_56%_44%_58%] bg-card-secondary/70 sm:block"
          style={{ '--home-rotate': '-9deg' } as React.CSSProperties}
        />
        <div
          aria-hidden="true"
          className="home-drift pointer-events-none absolute right-2 bottom-16 hidden h-20 w-28 rounded-[36%_64%_58%_42%/54%_38%_62%_46%] border border-primary/25 sm:block"
          style={{ '--home-rotate': '7deg' } as React.CSSProperties}
        />

        <div className="relative z-10 mb-10 grid grid-cols-1 gap-5 md:mb-14 md:grid-cols-[110px_1fr] md:items-end md:gap-8 lg:grid-cols-[180px_1fr_520px]">
          <span
            className="font-serif text-[72px] leading-[0.78] font-bold text-primary/10 md:text-[88px] lg:text-[112px]"
            aria-hidden="true"
          >
            02
          </span>

          <div>
            <p className="typo-tab text-primary">SHOP BY PET</p>
            <h2 className="typo-h2 mt-3 text-text-primary">為牠挑選日常所需</h2>
          </div>

          <p className="typo-body text-text-secondary md:col-start-2 lg:col-start-auto">
            從物種開始探索，快速找到主食、零食、保健與生活用品。
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
          {[
            {
              title: '貓咪全系列',
              description: '主食、點心、保健與生活用品',
              image: '/cat-category.png',
              href: '/product/cat?category=all-products',
            },
            {
              title: '狗勾全系列',
              description: '從每日飲食到外出生活所需',
              image: '/dog-category.png',
              href: '/product/dog?category=all-products',
            },
          ].map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative h-[320px] overflow-hidden rounded-lg bg-card-primary sm:h-[380px] lg:h-[440px]"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.75)] sm:p-8">
                <div>
                  <h3 className="typo-h3 text-white">{category.title}</h3>
                  <p className="typo-card-body mt-2 text-white/80">
                    {category.description}
                  </p>
                </div>

                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white sm:size-11">
                  <LuArrowRight className="size-5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 首頁區塊以柔和波形銜接，避免大色塊之間出現僵硬直線。 */}
      <div className="w-full bg-background leading-[0]">
        <svg
          viewBox="0 0 1440 88"
          preserveAspectRatio="none"
          className="h-14 w-full md:h-[88px]"
          aria-hidden="true"
        >
          <path
            d="M0 48C210 94 430 2 710 46C970 88 1210 14 1440 54V88H0V48Z"
            fill="var(--text-primary)"
          />
        </svg>
      </div>

      {/* 3. 毛孩家長怎麼說 */}
      <section className="relative -mt-px w-full overflow-hidden bg-text-primary pt-10 pb-20 text-white md:pt-16 md:pb-28">
        {/* 圖形跨在色塊邊緣附近，柔化區塊轉場但不影響卡片對齊。 */}
        <div
          aria-hidden="true"
          className="home-float pointer-events-none absolute top-6 left-[6%] hidden h-20 w-16 rounded-[42%_58%_64%_36%/56%_40%_60%_44%] bg-primary/30 sm:block"
          style={{ '--home-rotate': '12deg' } as React.CSSProperties}
        />
        <div
          aria-hidden="true"
          className="home-drift pointer-events-none absolute right-8 bottom-8 hidden h-16 w-40 rounded-[22%_78%_36%_64%/48%_32%_68%_52%] bg-card-secondary/10 sm:block"
          style={{ '--home-rotate': '-5deg' } as React.CSSProperties}
        />
        <div
          aria-hidden="true"
          className="home-float pointer-events-none absolute top-20 right-[6%] hidden h-16 w-12 rounded-[38%_62%_55%_45%/52%_40%_60%_48%] border border-primary/35 sm:block"
          style={{ '--home-rotate': '18deg' } as React.CSSProperties}
        />

        <div className="relative z-10 mx-auto w-full max-w-[1520px] px-5 sm:px-8 lg:px-10">
          <div className="mb-10 grid grid-cols-1 gap-5 md:mb-14 md:grid-cols-[110px_1fr] md:items-end md:gap-8 lg:grid-cols-[180px_1fr_480px]">
            <span
              className="font-serif text-[72px] leading-[0.78] font-bold text-white/5 md:text-[88px] lg:text-[112px]"
              aria-hidden="true"
            >
              03
            </span>

            <div>
              <p className="typo-tab text-primary">MOFU FAMILY</p>
              <h2 className="typo-h2 mt-3 text-white">毛孩家長怎麼說</h2>
            </div>

            <p className="typo-body text-card-secondary md:col-start-2 lg:col-start-auto">
              每一次安心選購，都是家長陪伴毛孩生活的小小日常。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="flex min-h-[280px] flex-col rounded-lg border border-white/15 bg-white/5 p-6 transition-transform duration-300 hover:-translate-y-1 lg:min-h-[310px] lg:p-8"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex gap-1 text-primary"
                    aria-label="五星評價"
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <LuStar
                        key={index}
                        className="size-4 fill-current"
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <LuQuote
                    className="size-8 text-white/20"
                    aria-hidden="true"
                  />
                </div>

                <p className="typo-body mt-7 flex-1 text-white/85">
                  「{testimonial.quote}」
                </p>

                <div className="mt-7 flex items-center gap-3 border-t border-white/15 pt-5">
                  <div className="relative size-12 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.image}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <p className="typo-card-title text-white">
                      {testimonial.name}
                    </p>
                    <p className="typo-tab mt-1 text-card-secondary">
                      {testimonial.pet}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full bg-text-primary leading-[0]">
        <svg
          viewBox="0 0 1440 84"
          preserveAspectRatio="none"
          className="h-14 w-full md:h-[84px]"
          aria-hidden="true"
        >
          <path
            d="M0 26C250 82 480 8 760 48C1030 86 1230 20 1440 44V84H0V26Z"
            fill="var(--info)"
          />
        </svg>
      </div>

      {/* 4. AI 顧問 */}
      <section className="relative -mt-px w-full overflow-hidden bg-info">
        <div
          aria-hidden="true"
          className="home-float pointer-events-none absolute top-14 left-[47%] hidden h-20 w-24 rounded-[60%_40%_34%_66%/46%_58%_42%_54%] bg-primary/15 sm:block"
          style={{ '--home-rotate': '-8deg' } as React.CSSProperties}
        />
        <div
          aria-hidden="true"
          className="home-drift pointer-events-none absolute right-6 bottom-16 hidden h-12 w-32 rounded-[28%_72%_46%_54%/58%_36%_64%_42%] bg-card-secondary/70 sm:block"
          style={{ '--home-rotate': '9deg' } as React.CSSProperties}
        />
        <div
          aria-hidden="true"
          className="home-float pointer-events-none absolute bottom-12 left-[5%] hidden h-20 w-16 rounded-[55%_45%_36%_64%/42%_58%_42%_58%] border border-primary/20 sm:block"
          style={{ '--home-rotate': '-14deg' } as React.CSSProperties}
        />

        <div className="relative z-10 mx-auto w-full max-w-[1520px] px-5 py-16 sm:px-8 md:py-24 lg:px-10">
          <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-border bg-card-primary lg:min-h-[600px] lg:grid-cols-2">
            {/* 左側使用大面積毛孩照片，讓 AI 功能先保有生活感。 */}
            <div className="relative min-h-[300px] overflow-hidden sm:min-h-[400px] lg:min-h-[600px]">
              <Image
                src="/cat.jpg"
                alt="貓咪等待 MOFU AI 顧問整理合適的商品方向"
                fill
                loading="eager"
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover object-[center_20%] lg:object-center"
              />
            </div>

            {/* 右側保留目前已完成的 AI 導購功能內容。 */}
            <div className="flex items-center px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14">
              <div className="max-w-[600px]">
                <div className="mb-5 md:mb-7">
                  <span
                    className="font-serif text-[72px] leading-[0.78] font-bold text-primary/10 md:text-[88px] lg:text-[112px]"
                    aria-hidden="true"
                  >
                    04
                  </span>
                </div>

                <h2 className="typo-h2 text-text-primary">
                  讓毛孩資料，成為更清楚的選購方向
                </h2>

                <p className="typo-body mt-6 text-text-secondary">
                  建立毛孩檔案後，AI 顧問會參考物種、健康情況與過敏食材，
                  從商品資料中整理最多三項選購建議，並說明推薦原因。
                </p>

                <ul className="mt-9 space-y-4">
                  {[
                    '參考毛孩的健康與過敏資料',
                    '依照本次需求整理合適商品',
                    '提供最多三項推薦與原因',
                  ].map((item) => (
                    <li
                      key={item}
                      className="typo-body-medium flex items-center gap-4 text-text-primary"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-card-secondary text-primary">
                        <LuCheck className="size-4" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/member/pets/ai"
                  className="next-button typo-tab mt-10 inline-flex items-center gap-2 px-6 py-3"
                >
                  <LuSparkles className="size-4" aria-hidden="true" />
                  開始 AI 導購
                </Link>

                <p className="typo-card-body mt-5 text-text-secondary">
                  AI 僅提供商品選購參考，不取代獸醫師的專業判斷。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full bg-info leading-[0]">
        <svg
          viewBox="0 0 1440 82"
          preserveAspectRatio="none"
          className="h-14 w-full md:h-[82px]"
          aria-hidden="true"
        >
          <path
            d="M0 42C260 4 500 82 760 38C1010 0 1230 74 1440 34V82H0V42Z"
            fill="var(--background)"
          />
        </svg>
      </div>

      {/* 5. 常見問題 Accordion */}
      <section className="relative mx-auto w-full max-w-[1280px] px-5 pt-14 pb-20 sm:px-8 md:pt-20 md:pb-28 lg:px-10">
        <div
          aria-hidden="true"
          className="home-float pointer-events-none absolute top-12 right-2 hidden h-24 w-16 rounded-[44%_56%_68%_32%/58%_38%_62%_42%] bg-card-secondary/70 sm:block"
          style={{ '--home-rotate': '8deg' } as React.CSSProperties}
        />
        <div
          aria-hidden="true"
          className="home-drift pointer-events-none absolute bottom-10 left-2 hidden h-12 w-28 rounded-[28%_72%_38%_62%/62%_34%_66%_38%] bg-info/70 sm:block"
          style={{ '--home-rotate': '-6deg' } as React.CSSProperties}
        />

        <div className="relative z-10 mb-10 grid grid-cols-1 gap-5 md:mb-14 md:grid-cols-[110px_1fr] md:items-end md:gap-8 lg:grid-cols-[180px_1fr]">
          <span
            className="font-serif text-[72px] leading-[0.78] font-bold text-primary/10 md:text-[88px] lg:text-[112px]"
            aria-hidden="true"
          >
            05
          </span>

          <div>
            <p className="typo-tab text-primary">FAQ</p>
            <h2 className="typo-h2 mt-3 text-text-primary">常見問題</h2>
            <p className="typo-body mt-4 text-text-secondary">
              關於商品、配送與 AI 導購，你可能會想先知道這些。
            </p>
          </div>
        </div>

        <div className="relative z-10 border-t border-border">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            const answerId = `home-faq-answer-${index}`;

            return (
              <div
                key={faq.question}
                // 只有第一題設定 contact 錨點。
                id={index === 0 ? 'contact' : undefined}
                // 避免固定 Header 遮住第一題。
                className="scroll-mt-24 border-b border-border"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 py-6 text-left sm:gap-8"
                >
                  <span className="grid flex-1 grid-cols-[40px_1fr] items-center gap-2 sm:grid-cols-[64px_1fr] sm:gap-4">
                    <span className="typo-card-title text-primary/45">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="typo-body-medium text-text-primary">
                      {faq.question}
                    </span>
                  </span>

                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full transition ${
                      isOpen
                        ? 'bg-primary text-white'
                        : 'bg-card-secondary text-text-secondary'
                    }`}
                  >
                    {isOpen ? (
                      <LuMinus className="size-4" aria-hidden="true" />
                    ) : (
                      <LuPlus className="size-4" aria-hidden="true" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={answerId}
                    className="ml-12 max-w-[940px] pr-12 pb-7 sm:ml-20 sm:pr-0"
                  >
                    <p className="typo-card-body text-text-secondary">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="relative z-10 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <p className="typo-card-body text-text-secondary">還沒有找到答案？</p>
          <Link href="/member/support" className="next-button typo-tab">
            前往客服中心
          </Link>
        </div>
      </section>
    </div>
  );
}
