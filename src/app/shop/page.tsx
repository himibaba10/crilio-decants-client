import type { Metadata } from 'next';

import { ShopView } from '@/components/shop/shop-view';
import { getShopPageData } from '@/lib/shop/get-shop-data';
import { parseShopParams } from '@/lib/shop/params';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Shop',
  description: `Browse perfume decants from ${siteConfig.name}.`,
};

export default async function ShopPage({
  searchParams,
}: PageProps<'/shop'>) {
  const raw = await searchParams;
  const params = parseShopParams(raw);
  const data = await getShopPageData(params);

  return (
    <main className='flex-1 bg-[#fafafa]'>
      <ShopView params={params} data={data} />
    </main>
  );
}
