import Link from 'next/link';
import { LuHeart, LuChevronRight } from 'react-icons/lu';
import { JP } from '@/src/components/ui';

export default function FavoritesPage() {
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
          收藏清單
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-5">
          <LuHeart size={28} className="text-rose-500" />
        </div>
        <h2 className="typo-card-title text-base-content mb-2" style={JP}>
          收藏清單為空
        </h2>
        <p className="typo-card-body text-base-content/60 max-w-xs">
          瀏覽商城並點擊愛心圖示，即可將商品加入收藏清單。
        </p>
      </div>
    </div>
  );
}
