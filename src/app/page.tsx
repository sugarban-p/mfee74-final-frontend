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
      '一般訂單會於付款確認後依序處理。實際出貨與配送時間會依訂單內容、物流狀況及收件地區而有所不同。',
  },
  {
    question: 'AI 顧問會直接替我決定要買哪一項商品嗎？',
    answer:
      '不會。AI 顧問會依毛孩資料與商品資訊提供選購參考，最後仍由會員自行閱讀商品內容並決定是否購買。',
  },
  {
    question: '還有其他商品或訂單問題，該去哪裡詢問？',
    answer:
      '登入會員後可前往客服中心提出問題；若目前沒有登入，也可以先瀏覽常見問題與網站上的配送、付款說明。',
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
     * 首頁需要滿版，因此用 w-screen 延伸到視窗寬度，
     * -my-16 則抵消 AppShell 為一般頁面保留的上下間距。
     */
    <div className="home-page relative left-1/2 -my-16 w-screen -translate-x-1/2 overflow-hidden bg-background">
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

        @keyframes home-hero-breathe {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.06);
          }
        }

        /*
         * 暫用貓咪會定時從 Hero 波浪後方探頭。
         * 未來換成正式角色圖片時，可以沿用同一個動畫容器。
         */
        @keyframes home-pet-peek {
          0%,
          14%,
          100% {
            transform: translateY(58px) rotate(-4deg);
          }
          26%,
          68% {
            transform: translateY(0) rotate(0deg);
          }
          38% {
            transform: translateY(-5px) rotate(4deg);
          }
          48% {
            transform: translateY(0) rotate(-2deg);
          }
          78% {
            transform: translateY(12px) rotate(3deg);
          }
        }

        .home-float {
          animation: home-float 7s ease-in-out infinite;
        }

        .home-drift {
          animation: home-drift 9s ease-in-out infinite;
        }

        .home-hero-breathe {
          animation: home-hero-breathe 12s ease-out forwards;
        }

        .home-pet-peek {
          animation: home-pet-peek 8s ease-in-out infinite;
          transform-origin: bottom center;
        }

        /* 狗狗稍微晚一點探頭，兩隻角色一起出現在 Hero 右側。 */
        .home-pet-peek-dog {
          animation: home-pet-peek 8s ease-in-out -0.35s infinite;
          transform-origin: bottom center;
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
          .home-drift,
          .home-hero-breathe,
          .home-pet-peek,
          .home-pet-peek-dog {
            animation: none;
          }
        }
      `}</style>

      {/* 1. Hero Section：四張活動輪播 */}
      <section
        className="relative h-[620px] w-full overflow-hidden md:h-[680px]"
        aria-label="MOFU 最新活動"
      >
        {heroSlides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeSlide
                ? 'opacity-100'
                : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={index !== activeSlide}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover ${
                index === activeSlide ? 'home-hero-breathe' : ''
              }`}
              style={{ objectPosition: slide.imagePosition }}
            />

            {/* 單色遮罩讓文字在不同照片上都清楚，不另外新增色碼。 */}
            <div className="absolute inset-0 bg-text-primary/55" />

            <div className="relative mx-auto flex h-full w-full max-w-[1520px] items-end px-5 pb-28 sm:px-8 md:px-12 lg:px-16">
              <div className="max-w-[780px] text-white">
                <div className="mb-5 flex items-center gap-4">
                  <span className="h-px w-12 bg-white/60" aria-hidden="true" />
                  <p className="typo-tab text-card-secondary">
                    {slide.eyebrow}
                  </p>
                </div>

                <h1 className="typo-display text-white">
                  {index === 0 ? 'MOFU 毛孩生活提案' : slide.title}
                </h1>

                {index === 0 && (
                  <p className="typo-h3 mt-3 text-white">{slide.title}</p>
                )}

                <p className="typo-body mt-4 max-w-[590px] text-white/85 md:mt-6">
                  {slide.description}
                </p>

                <Link
                  href={slide.href}
                  className="next-button typo-tab mt-6 inline-flex items-center gap-2 px-6 py-3 md:mt-8"
                >
                  查看活動
                  <LuArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* 左右切換按鈕 */}
        <div className="absolute right-5 bottom-14 z-20 flex items-center gap-2 sm:right-8 sm:gap-3 lg:right-16 lg:bottom-16">
          <button
            type="button"
            aria-label="上一個活動"
            onClick={showPreviousSlide}
            className="flex size-10 items-center justify-center rounded-full border border-white/40 bg-text-primary/30 text-white transition hover:bg-primary sm:size-11"
          >
            <LuChevronLeft className="size-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="下一個活動"
            onClick={showNextSlide}
            className="flex size-10 items-center justify-center rounded-full border border-white/40 bg-text-primary/30 text-white transition hover:bg-primary sm:size-11"
          >
            <LuChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* 輪播進度 */}
        <div className="absolute bottom-14 left-5 z-20 flex gap-2 sm:left-1/2 sm:-translate-x-1/2 lg:bottom-16">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`切換到第 ${index + 1} 個活動`}
              aria-current={index === activeSlide}
              onClick={() => setActiveSlide(index)}
              className={`h-1.5 transition-all ${
                index === activeSlide ? 'w-10 bg-primary' : 'w-5 bg-white/60'
              }`}
            />
          ))}
        </div>

        {/*
         * 首頁暫用角色：從區塊交界的波浪後方探頭。
         * aria-hidden 代表它只是裝飾，不會干擾螢幕閱讀器。
         */}
        <div
          aria-hidden="true"
          className="home-pet-peek pointer-events-none absolute right-[24%] bottom-1 z-20 sm:right-[18%] lg:right-[14%]"
        >
          <Image
            src="/petcat.png"
            alt=""
            width={2000}
            height={2000}
            className="h-auto w-28 drop-shadow-sm sm:w-32 lg:w-40"
          />
        </div>

        <div
          aria-hidden="true"
          className="home-pet-peek-dog pointer-events-none absolute right-[46%] bottom-1 z-20 sm:right-[31%] lg:right-[21%]"
        >
          <Image
            src="/petdog.png"
            alt=""
            width={2000}
            height={2000}
            className="h-auto w-28 drop-shadow-sm sm:w-32 lg:w-40"
          />
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
              title: '狗狗全系列',
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

              <div className="absolute inset-0 bg-text-primary/30 transition group-hover:bg-text-primary/40" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white sm:p-8">
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
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover object-[center_20%] lg:object-center"
              />
            </div>

            {/* 右側保留目前已完成的 AI 導購功能內容。 */}
            <div className="flex items-center px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14">
              <div className="max-w-[600px]">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ai-link/20 bg-ai-link/10 px-5 py-2 text-ai-link md:mb-7">
                  <LuSparkles className="size-4" aria-hidden="true" />
                  <span className="typo-tab">AI POWERED</span>
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
              <div key={faq.question} className="border-b border-border">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left sm:gap-8"
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
          <Link href="/support" className="next-button typo-tab">
            前往客服中心
          </Link>
        </div>
      </section>
    </div>
  );
}
