import type { LucideIcon } from 'lucide-react';

type PerkCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function PerkCard({ title, description, icon: Icon }: PerkCardProps) {
  return (
    <div className='flex items-center gap-4 rounded-2xl border border-border/60 bg-[#fafafa] px-4 py-4 text-left shadow-soft sm:justify-center sm:text-center lg:justify-start lg:text-left'>
      <Icon className='size-8 shrink-0 text-gold' aria-hidden />
      <div>
        <p className='font-medium text-navy'>{title}</p>
        <p className='text-sm text-ink/70'>{description}</p>
      </div>
    </div>
  );
}
