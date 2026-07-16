'use client';

import { useId } from 'react';
import { LuMinus, LuPlus } from 'react-icons/lu';

interface ProductQuantitySelectorProps {
  usage?: string;
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
}

export function ProductQuantitySelector({
  usage,
  quantity,
  onChange,
  min = 1,
}: ProductQuantitySelectorProps) {
  const labelId = useId();

  return (
    <div className="flex items-center gap-3">
      <span
        id={labelId}
        className={[
          usage === 'Header' ? 'hidden' : 'typo-body-medium',
          'text-text-primary',
        ].join(' ')}
      >
        數量
      </span>
      <div className="flex h-7 w-[120px] items-center justify-between px-2">
        <button
          className="flex size-7 cursor-pointer items-center justify-center rounded-lg border border-secondary bg-white text-secondary disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          aria-label="減少數量"
          disabled={quantity === min}
          onClick={() => onChange(Math.max(min, quantity - 1))}
        >
          <LuMinus className={usage === 'Header' ? 'size-3' : 'size-3.5'} />
        </button>
        <div
          aria-live="polite"
          aria-labelledby={labelId}
          className="typo-tab flex flex-1 items-center justify-center text-text-primary"
        >
          {quantity}
        </div>
        <button
          className="flex size-7 cursor-pointer items-center justify-center rounded-lg border border-secondary bg-white text-secondary"
          type="button"
          aria-label="增加數量"
          onClick={() => onChange(quantity + 1)}
        >
          <LuPlus className={usage === 'Header' ? 'size-3' : 'size-3.5'} />
        </button>
      </div>
    </div>
  );
}
