'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { FindUsDialog } from '@/components/layout/find-us-dialog';

type FindUsContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openFindUs: () => void;
};

const FindUsContext = createContext<FindUsContextValue | null>(null);

export function FindUsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openFindUs = useCallback(() => setOpen(true), []);
  const value = useMemo(
    () => ({ open, setOpen, openFindUs }),
    [open, openFindUs],
  );

  return (
    <FindUsContext.Provider value={value}>
      {children}
      <FindUsDialog open={open} onOpenChange={setOpen} />
    </FindUsContext.Provider>
  );
}

export function useFindUs() {
  const ctx = useContext(FindUsContext);
  if (!ctx) {
    throw new Error('useFindUs must be used within FindUsProvider');
  }
  return ctx;
}
