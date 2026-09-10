import {
  FooterBrand,
  FooterSocialLinks,
} from '@/components/layout/footer-brand';
import { FooterColumn, FooterLink } from '@/components/layout/footer-column';
import { FindUsTrigger } from '@/components/layout/find-us-trigger';
import { accountUrl } from '@/lib/catalog';
import { siteConfig } from '@/lib/site';

export function SiteFooter() {
  const year = new Date().getFullYear();
  const accountHref = accountUrl();

  return (
    <footer className='mt-auto bg-navy text-white'>
      <div className='mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8'>
        <FooterBrand />

        <FooterColumn title='Quick links'>
          <li>
            <FindUsTrigger className='transition-colors hover:text-white'>
              Find us
            </FindUsTrigger>
          </li>
          <FooterLink href='/shop'>Shop</FooterLink>
          <FooterLink href='/cart'>Cart</FooterLink>
        </FooterColumn>

        <FooterColumn title='Account'>
          <FooterLink href={accountHref}>My account</FooterLink>
          <FooterLink href={accountHref}>Orders</FooterLink>
          <FooterLink href='/shop'>Bestsellers</FooterLink>
        </FooterColumn>

        <FooterColumn title='Connect'>
          <FooterLink href={siteConfig.social.facebook}>Facebook</FooterLink>
          <FooterLink href={siteConfig.social.instagram}>Instagram</FooterLink>
          <FooterLink href={siteConfig.social.youtube}>YouTube</FooterLink>
          <FooterSocialLinks />
        </FooterColumn>
      </div>

      <div className='border-t border-white/10'>
        <div className='mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8'>
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className='tracking-[0.14em] text-gold/70 uppercase'>
            {siteConfig.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
