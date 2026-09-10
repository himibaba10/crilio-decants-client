import { Loader2 } from 'lucide-react';

export default function CartLoading() {
  return (
    <div
      role='status'
      aria-live='polite'
      className='animate-page-enter flex flex-1 flex-col items-center justify-center gap-3 bg-[#fafafa] px-4 py-24'
    >
      <Loader2 className='size-7 animate-spin text-gold' aria-hidden />
      <p className='text-sm font-medium tracking-wide text-navy'>
        Loading cart…
      </p>
    </div>
  );
}
