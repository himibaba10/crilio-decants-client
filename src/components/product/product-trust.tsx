import {
  Gift,
  Headphones,
  ShieldCheck,
  Truck,
} from 'lucide-react';

const TRUST_ITEMS = [
  {
    title: 'Free delivery',
    description: 'On orders over ৳2000',
    icon: Truck,
  },
  {
    title: 'Cash on delivery',
    description: 'Pay when you receive',
    icon: ShieldCheck,
  },
  {
    title: 'Gift ready',
    description: 'Neat decant packaging',
    icon: Gift,
  },
  {
    title: 'Quick support',
    description: 'Help during shop hours',
    icon: Headphones,
  },
] as const;

export function ProductTrust() {
  return (
    <aside className='space-y-4 rounded-2xl border border-border/70 bg-white p-4 shadow-soft'>
      {TRUST_ITEMS.map((item) => (
        <div key={item.title} className='flex gap-3'>
          <div className='inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-navy'>
            <item.icon className='size-4' />
          </div>
          <div>
            <p className='text-sm font-medium text-navy'>{item.title}</p>
            <p className='text-xs text-ink/55'>{item.description}</p>
          </div>
        </div>
      ))}
    </aside>
  );
}
