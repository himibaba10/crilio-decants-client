'use client';

import { Mail, Phone, X } from 'lucide-react';
import { Dialog } from 'radix-ui';
import type { ReactNode } from 'react';

import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';

type FindUsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FindUsDialog({ open, onOpenChange }: FindUsDialogProps) {
  const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, '')}`;
  const mailHref = `mailto:${siteConfig.email}`;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-210 bg-navy/70 backdrop-blur-sm',
            'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
          )}
        />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-220 w-[min(100%-1.5rem,28rem)] -translate-x-1/2 -translate-y-1/2',
            'rounded-3xl border border-white/10 bg-linear-to-b from-[#12263f] to-[#0a1d37] p-6 text-white shadow-soft-lg sm:p-7',
            'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          )}
        >
          <Dialog.Close
            aria-label='Close'
            className='absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-gold hover:text-gold'
          >
            <X className='size-4' />
          </Dialog.Close>

          <div className='pr-8'>
            <span className='inline-flex rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-gold uppercase'>
              Crilio
            </span>
            <Dialog.Title className='mt-4 text-3xl font-semibold tracking-tight text-white'>
              Find Us
            </Dialog.Title>
            <Dialog.Description className='mt-2 text-sm leading-relaxed text-white/65'>
              We are always here to help you choose the perfect fragrance.
            </Dialog.Description>
          </div>

          <ul className='mt-6 space-y-3'>
            <ContactRow
              icon={<Phone className='size-4' aria-hidden />}
              label='Call us'
              href={phoneHref}
              value={siteConfig.phone}
            />
            <ContactRow
              icon={<Mail className='size-4' aria-hidden />}
              label='Email'
              href={mailHref}
              value={siteConfig.email}
            />
          </ul>

          <div className='mt-7'>
            <p className='text-[10px] font-semibold tracking-[0.2em] text-white/45 uppercase'>
              Follow Crilio
            </p>
            <div className='mt-3 flex flex-wrap gap-2'>
              <SocialChip
                href={siteConfig.social.facebook}
                label='Facebook'
                icon={<FacebookIcon />}
              />
              <SocialChip
                href={siteConfig.social.instagram}
                label='Instagram'
                icon={<InstagramIcon />}
              />
              <SocialChip
                href={siteConfig.social.youtube}
                label='YouTube'
                icon={<YouTubeIcon />}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className='inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold text-navy'>
        {icon}
      </span>
      <span className='min-w-0'>
        <span className='block text-[10px] font-semibold tracking-[0.18em] text-white/45 uppercase'>
          {label}
        </span>
        <span className='mt-0.5 block text-sm leading-relaxed text-white'>
          {value}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <li>
        <a
          href={href}
          className='flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 transition-colors hover:border-gold/40 hover:bg-white/8'
        >
          {inner}
        </a>
      </li>
    );
  }

  return (
    <li className='flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3'>
      {inner}
    </li>
  );
}

function SocialChip({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noreferrer'
      className='inline-flex items-center gap-2 rounded-full border border-gold/50 px-3.5 py-2 text-xs font-medium text-gold transition-colors hover:bg-gold/10'
    >
      {icon}
      {label}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox='0 0 24 24' className='size-3.5 fill-current' aria-hidden>
      <path d='M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.2l.8-3H14V9z' />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox='0 0 24 24' className='size-3.5 fill-current' aria-hidden>
      <path d='M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm6.2-.9a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1zM12 9.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5z' />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox='0 0 24 24' className='size-3.5 fill-current' aria-hidden>
      <path d='M23 12.2s0-3.4-.4-5a2.9 2.9 0 0 0-2-2C18.8 4.7 12 4.7 12 4.7s-6.8 0-8.6.5a2.9 2.9 0 0 0-2 2c-.4 1.6-.4 5-.4 5s0 3.4.4 5a2.9 2.9 0 0 0 2 2c1.8.5 8.6.5 8.6.5s6.8 0 8.6-.5a2.9 2.9 0 0 0 2-2c.4-1.6.4-5 .4-5zM9.8 15.5v-6l6.2 3-6.2 3z' />
    </svg>
  );
}
