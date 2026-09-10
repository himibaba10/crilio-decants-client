import { BrandLogo } from '@/components/layout/brand-logo';
import { HeaderActions } from '@/components/layout/header-actions';
import { HeaderNav } from '@/components/layout/header-nav';
import { cn } from '@/lib/utils';

type SiteHeaderProps = {
  cartCount?: number;
  className?: string;
};

export function SiteHeader({ cartCount = 0, className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-gold/40 bg-navy text-white',
        className,
      )}
    >
      <div className='mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:h-[5.5rem] sm:px-6 lg:px-8'>
        <HeaderNav />
        <BrandLogo size='header' />
        <HeaderActions cartCount={cartCount} />
      </div>
    </header>
  );
}
