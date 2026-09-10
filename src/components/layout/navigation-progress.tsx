'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

import { cn } from '@/lib/utils';

type NavProgressContextValue = {
  start: () => void;
  isPending: boolean;
};

const NavProgressContext = createContext<NavProgressContextValue>({
  start: () => {},
  isPending: false,
});

export function useNavProgress() {
  return useContext(NavProgressContext);
}

function RouteChangeListener({ onRouteChange }: { onRouteChange: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const routeKeyRef = useRef(routeKey);

  useEffect(() => {
    if (routeKeyRef.current === routeKey) return;
    routeKeyRef.current = routeKey;
    onRouteChange();
  }, [routeKey, onRouteChange]);

  return null;
}

export function NavigationProgressProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [pending, setPending] = useState(false);
  const [barOn, setBarOn] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [barWide, setBarWide] = useState(false);
  const hideTimer = useRef<number | null>(null);
  const safetyTimer = useRef<number | null>(null);
  const overlayTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    if (safetyTimer.current) window.clearTimeout(safetyTimer.current);
    if (overlayTimer.current) window.clearTimeout(overlayTimer.current);
    hideTimer.current = null;
    safetyTimer.current = null;
    overlayTimer.current = null;
  };

  const finish = useCallback(() => {
    setPending(false);
    setShowOverlay(false);
    setBarWide(true);
    clearTimers();
    hideTimer.current = window.setTimeout(() => {
      setBarOn(false);
      setBarWide(false);
    }, 280);
  }, []);

  const start = useCallback(() => {
    clearTimers();
    setBarOn(true);
    setPending(true);
    setBarWide(false);
    setShowOverlay(false);
    // Kick width animation on next frame so the bar visibly grows.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setBarWide(true));
    });
    // Full-page loader if the route is still pending after a short delay.
    overlayTimer.current = window.setTimeout(() => setShowOverlay(true), 120);
    safetyTimer.current = window.setTimeout(() => finish(), 15000);
  }, [finish]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.('a');
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
      if (href.startsWith('tel:') || href.startsWith('javascript:')) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      start();
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [start]);

  return (
    <NavProgressContext.Provider value={{ start, isPending: pending }}>
      {children}

      <Suspense fallback={null}>
        <RouteChangeListener onRouteChange={finish} />
      </Suspense>

      {barOn ? (
        <div
          aria-hidden
          className='pointer-events-none fixed inset-x-0 top-0 z-[200] h-1 overflow-hidden'
        >
          <div
            className={cn(
              'h-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)] transition-[width] ease-out',
              pending && barWide && 'duration-[8s]',
              !pending && 'duration-200',
              barWide ? (pending ? 'w-[90%]' : 'w-full') : 'w-0',
            )}
          />
        </div>
      ) : null}

      {showOverlay ? (
        <div
          role='status'
          aria-live='polite'
          className='fixed inset-0 z-[190] flex items-center justify-center bg-[#fafafa]/70 backdrop-blur-[1px]'
        >
          <div className='flex items-center gap-3 rounded-full border border-border/80 bg-white px-5 py-3 shadow-soft-lg'>
            <Loader2 className='size-5 animate-spin text-gold' aria-hidden />
            <span className='text-sm font-medium text-navy'>Loading…</span>
          </div>
        </div>
      ) : null}
    </NavProgressContext.Provider>
  );
}
