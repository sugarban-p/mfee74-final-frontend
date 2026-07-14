import Link from 'next/link';
import { LuCirclePlus, LuChevronRight } from 'react-icons/lu';
import { Btn, JP } from '@/src/components/ui';

export default function PetsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/member/dashboard"
            className="btn btn-ghost btn-sm btn-square text-text-primary/60"
          >
            <LuChevronRight size={18} className="rotate-180" />
          </Link>
          <h1 className="text-xl font-bold text-text-primary" style={JP}>
            我的寵物
          </h1>
        </div>
        <Btn sm>
          <LuCirclePlus size={13} />
          新增寵物
        </Btn>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center mb-5 text-3xl">
          🐾
        </div>
        <h2 className="typo-card-title text-text-primary mb-2" style={JP}>
          尚未建立寵物資料
        </h2>
        <p className="typo-card-body text-text-primary/60 max-w-xs mb-6">
          建立您的寵物資料，PetFull 將為您推薦最適合的商品與服務。
        </p>
        <Btn>
          <LuCirclePlus size={14} />
          新增第一隻寵物
        </Btn>
      </div>
    </div>
  );
}
