import Image from 'next/image';
import Link from 'next/link';
import { LuChevronRight } from 'react-icons/lu';
interface MenuItem {
  title: string;
  href: string;
}

interface MegaMenuCardProps {
  image: string;
  imageAlt: string;
  title: string;
  href: string;
  items: MenuItem[];
}

export default function MegaMenuCard({
  image,
  imageAlt,
  title,
  href,
  items,
}: MegaMenuCardProps) {
  return (
    <div className="card w-75 gap-4 bg-base-300 p-5">
      <Link href={href} className="card-image relative">
        <Image
          src={image}
          alt={imageAlt}
          width={512}
          height={256}
          className="rounded-xl"
        />

        <h2 className="absolute bottom-3 left-1.5 text-xl font-bold">
          {title}
        </h2>
      </Link>

      <div className="card-body p-0">
        <ul>
          {items.map((item) => (
            <li key={item.title}>
              <Link href={item.href} className="flex">
                <LuChevronRight className="w-5" />
                <h3 className="card-title">{item.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
