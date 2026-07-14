export const dynamic = 'force-dynamic';

import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full bg-[#FFFCF8] page-enter">
      <div className="mx-auto w-full max-w-[560px] px-4 md:px-6 py-7 lg:py-9">
        <div className="flex justify-center">{children}</div>
      </div>
    </div>
  );
}
