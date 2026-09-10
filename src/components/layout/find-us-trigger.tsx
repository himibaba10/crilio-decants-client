'use client';

import type { ReactNode } from 'react';

import { useFindUs } from '@/context/find-us-provider';

export function FindUsTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { openFindUs } = useFindUs();

  return (
    <button type='button' onClick={openFindUs} className={className}>
      {children}
    </button>
  );
}
