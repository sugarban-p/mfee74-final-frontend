import Link from 'next/link';
import { LuCircleAlert } from 'react-icons/lu';

export default function CheckoutErrorPage() {
  return (
    <section className="mx-auto flex w-full max-w-[1520px] justify-center bg-[#faf8f5] px-4 py-16 md:px-10">
      <div className="w-full max-w-[420px] rounded-2xl border border-[rgba(26,22,18,0.12)] bg-white px-8 py-9 text-center shadow-[0_8px_28px_rgba(45,31,14,0.04)]">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-danger">
          <LuCircleAlert className="size-8 text-red-500" />
        </div>

        <h1 className="typo-h3 mb-3 text-text-primary">付款發生問題</h1>

        <p className="typo-card-body mb-6 text-text-secondary">
          金流連線暫時沒有完成。若訂單仍在待付款，可以回到訂單列表重新付款。
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/member/orders" className="next-button typo-tab">
            查看訂單
          </Link>

          <Link href="/" className="back-button typo-tab">
            回到首頁
          </Link>
        </div>
      </div>
    </section>
  );
}
