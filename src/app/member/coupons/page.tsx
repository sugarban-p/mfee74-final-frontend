import Link from 'next/link';
import { LuTicketPercent, LuChevronRight } from 'react-icons/lu';
import { JP } from '@/src/components/ui';

export default function CouponsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/member/dashboard"
          className="btn btn-ghost btn-sm btn-square text-text-primary/60"
        >
          <LuChevronRight size={18} className="rotate-180" />
        </Link>
        <h1 className="text-xl font-bold text-text-primary" style={JP}>
          優惠券
        </h1>
      </div>

      <div className="tabs tabs-box bg-base-200 w-fit">
        {['可使用', '已使用', '已過期'].map((label) => (
          <button
            key={label}
            className={`tab tab-sm rounded-lg ${label === '可使用' ? 'tab-active' : 'text-text-primary/60'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-5">
          <LuTicketPercent size={28} className="text-purple-500" />
        </div>
        <h2 className="typo-card-title text-text-primary mb-2" style={JP}>
          目前無可用優惠券
        </h2>
        <p className="typo-card-body text-text-primary/60 max-w-xs">
          參加活動或達成消費門檻，即可獲得專屬優惠券。
        </p>
      </div>
    </div>
  );
}
