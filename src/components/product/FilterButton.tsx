import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

interface FilterButtonProps {
  href: ComponentProps<typeof Link>['href'];
  active: boolean;
  children: ReactNode;
  className?: string;
  'aria-pressed'?: boolean;
}

const baseClassName =
  'typo-tab rounded-lg px-3 py-2 font-bold transition-all focus:outline-none';
const activeClassName =
  'bg-primary text-text-button hover:bg-primary hover:text-text-button focus:bg-primary focus:text-text-button';
const inactiveClassName =
  'border border-secondary bg-transparent text-text-primary hover:bg-button-secondary-hover hover:text-text-primary';

export function FilterButton({
  href,
  active,
  children,
  className,
  'aria-pressed': ariaPressed,
}: FilterButtonProps) {
  return (
    <Link
      href={href}
      role="button"
      aria-pressed={ariaPressed}
      className={[
        baseClassName,
        active ? activeClassName : inactiveClassName,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Link>
  );
}
