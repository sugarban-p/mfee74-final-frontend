import Link from 'next/link';
import { LuPackage, LuChevronRight } from 'react-icons/lu';
import { JP } from '@/src/components/ui';

// Server Component — fetches orders from DB via API
export default function OrdersPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/member/dashboard"
          className="btn btn-ghost btn-sm btn-square text-base-content/60"
        >
          <LuChevronRight size={18} className="rotate-180" />
        </Link>
        <h1 className="text-xl font-bold text-base-content" style={JP}>
          訂單管理
        </h1>
      </div>

      {/* Filter tabs */}
      <div className="tabs tabs-box bg-base-200 w-fit">
        {['全部', '待付款', '已完成', '已取消'].map((label) => (
          <button
            key={label}
            className={`tab tab-sm rounded-lg ${label === '全部' ? 'tab-active' : 'text-base-content/60'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Empty state placeholder */}
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center mb-5">
          <LuPackage size={28} className="text-primary" />
        </div>
        <h2 className="typo-card-title text-base-content mb-2" style={JP}>
          尚無訂單紀錄
        </h2>
        <p className="typo-card-body text-base-content/60 max-w-xs">
          您的訂單將顯示在此。前往商城選購，享受會員專屬優惠！
        </p>
      </div>
    </div>
  );
}
