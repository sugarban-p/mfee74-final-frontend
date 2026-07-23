'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';
import { LuChevronRight } from 'react-icons/lu';
interface MenuItem {
  id: number;
  title: string;
  href: string;
}

interface MegaMenuCardProps {
  id: number;
  image: string;
  imageAlt: string;
  title: string;
  href?: string;
  items: MenuItem[];
}

export default function MegaMenuCard({
  id,
  image,
  imageAlt,
  title,
  href,
  items,
}: MegaMenuCardProps) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof Element) || !target.closest('a')) return;

    const popover = event.currentTarget.closest('[popover]') as
      (HTMLElement & { hidePopover?: () => void }) | null;
    popover?.hidePopover?.();
  };

  return (
    <div className="card w-75 gap-4 p-5" data-id={id} onClick={handleClick}>
      {href ? (
        <>
          <Link href={href} className="card-image relative">
            <Image
              src={image}
              alt={imageAlt}
              width={512}
              height={256}
              className="rounded-xl"
            />
            <h2 className="absolute bottom-3 left-1.5 text-xl font-bold text-text-button">
              {title}
            </h2>
          </Link>
        </>
      ) : (
        <>
          <div className="card-image relative">
            <Image
              src={image}
              alt={imageAlt}
              width={512}
              height={256}
              className="rounded-xl"
            />{' '}
            <h2 className="absolute bottom-3 left-1.5 text-xl font-bold text-text-button">
              {title}
            </h2>
          </div>
        </>
      )}

      <div className="card-body p-0">
        <ul>
          {items.map((item) => (
            <li
              className="rounded-lg hover:bg-button-secondary-hover"
              key={item.id}
            >
              <Link
                href={item.href}
                className="flex items-center gap-2 text-text-primary"
              >
                <LuChevronRight className="size-5" />
                <h3 className="card-title">{item.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
