import type { ReactNode } from 'react';
import Link from 'next/link';

export function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className='mb-4 text-[11px] tracking-[0.22em] text-gold uppercase'>
        {title}
      </p>
      <ul className='space-y-2.5 text-sm text-white/70'>{children}</ul>
    </div>
  );
}

export function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <li>
      <Link href={href} className='transition-colors hover:text-white'>
        {children}
      </Link>
    </li>
  );
}
