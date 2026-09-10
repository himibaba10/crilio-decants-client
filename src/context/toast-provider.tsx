'use client';

import { Check, X } from 'lucide-react';
import Link from 'next/link';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

type ToastInput = {
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  durationMs?: number;
};

type ToastRecord = ToastInput & {
  id: string;
  leaving?: boolean;
};

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, leaving: true } : toast,
      ),
    );
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      const timer = timers.current.get(id);
      if (timer) {
        window.clearTimeout(timer);
        timers.current.delete(id);
      }
    }, 280);
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev.slice(-2), { ...input, id }]);
      const duration = input.durationMs ?? 3200;
      const timer = window.setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live='polite'
        className='pointer-events-none fixed inset-x-0 bottom-6 z-100 flex flex-col items-center gap-2 px-4'
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-border/80 bg-white px-4 py-3 text-navy shadow-soft-lg transition-all duration-300 ease-out',
              item.leaving
                ? 'translate-y-3 opacity-0'
                : 'animate-toast-in translate-y-0 opacity-100',
            )}
          >
            <span className='mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-gold/20 text-navy'>
              <Check className='size-3.5' aria-hidden />
            </span>
            <div className='min-w-0 flex-1'>
              <p className='text-sm font-medium'>{item.title}</p>
              {item.description ? (
                <p className='mt-0.5 text-xs text-ink/60'>{item.description}</p>
              ) : null}
              {item.href ? (
                <Link
                  href={item.href}
                  className='mt-1 inline-block text-xs font-semibold tracking-wide text-navy underline underline-offset-2'
                >
                  {item.hrefLabel ?? 'View'}
                </Link>
              ) : null}
            </div>
            <button
              type='button'
              aria-label='Dismiss'
              onClick={() => dismiss(item.id)}
              className='inline-flex size-7 shrink-0 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-muted hover:text-navy'
            >
              <X className='size-3.5' />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
