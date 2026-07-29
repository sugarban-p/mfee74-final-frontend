'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const PROTECTED_PREFIXES = ['/member', '/cart', '/checkout'];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export default function IdleLogoutGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHandlingTimeoutRef = useRef(false);

  useEffect(() => {
    if (!isProtectedPath(pathname)) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const handleIdleTimeout = async () => {
      if (isHandlingTimeoutRef.current) return;
      isHandlingTimeoutRef.current = true;

      try {
        const profileRes = await fetch('/api/user/profile', {
          credentials: 'include',
          cache: 'no-store',
        });

        if (!profileRes.ok) return;

        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });

        window.dispatchEvent(new Event('auth-state-changed'));
        toast('已因閒置 30 分鐘自動登出');
        router.push('/auth/login');
      } finally {
        isHandlingTimeoutRef.current = false;
      }
    };

    const resetIdleTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        void handleIdleTimeout();
      }, IDLE_TIMEOUT_MS);
    };

    const activityEvents: Array<keyof WindowEventMap> = [
      'pointerdown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
    ];

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resetIdleTimer();
      }
    };

    for (const eventName of activityEvents) {
      window.addEventListener(eventName, resetIdleTimer, { passive: true });
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    resetIdleTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      for (const eventName of activityEvents) {
        window.removeEventListener(eventName, resetIdleTimer);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname, router]);

  return null;
}
