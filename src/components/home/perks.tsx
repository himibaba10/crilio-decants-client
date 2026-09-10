import { PackageCheck, Truck, Wallet } from 'lucide-react';

import { PerkCard } from '@/components/home/perk-card';
import { siteConfig } from '@/lib/site';

const icons = [PackageCheck, Truck, Wallet] as const;

export function Perks() {
  return (
    <section className='border-y border-border bg-white'>
      <div className='mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8'>
        {siteConfig.perks.map((perk, index) => (
          <PerkCard
            key={perk.title}
            title={perk.title}
            description={perk.description}
            icon={icons[index] ?? PackageCheck}
          />
        ))}
      </div>
    </section>
  );
}
