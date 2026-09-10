import type { ReactNode } from "react"
import Link from "next/link"

import { accountUrl } from "@/lib/catalog"
import { siteConfig } from "@/lib/site"

export function SiteFooter() {
  const year = new Date().getFullYear()
  const accountHref = accountUrl()

  return (
    <footer className="mt-auto bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <p className="font-heading text-3xl tracking-[0.22em] text-gold uppercase">
            {siteConfig.name}
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-white/65">
            {siteConfig.description}
          </p>
          <p className="text-sm text-white/55">{siteConfig.addressDetail}</p>
          <p className="text-sm text-gold">{siteConfig.phone}</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="block text-sm text-white/70 transition-colors hover:text-gold"
          >
            {siteConfig.email}
          </a>
        </div>

        <FooterColumn title="Quick links">
          <FooterLink href="/about">About us</FooterLink>
          <FooterLink href="/contact">Contact us</FooterLink>
          <FooterLink href="#store-location">Store location</FooterLink>
          <FooterLink href="/shop">Shop</FooterLink>
        </FooterColumn>

        <FooterColumn title="Account">
          <FooterLink href={accountHref}>My account</FooterLink>
          <FooterLink href={accountHref}>Orders</FooterLink>
          <FooterLink href="/shop">Bestsellers</FooterLink>
        </FooterColumn>

        <FooterColumn title="Connect">
          <FooterLink href={siteConfig.social.facebook}>Facebook</FooterLink>
          <FooterLink href={siteConfig.social.instagram}>Instagram</FooterLink>
          <FooterLink href={siteConfig.social.youtube}>YouTube</FooterLink>
          <li className="flex gap-3 pt-2">
            <SocialLink href={siteConfig.social.facebook} label="Facebook">
              <FacebookIcon />
            </SocialLink>
            <SocialLink href={siteConfig.social.instagram} label="Instagram">
              <InstagramIcon />
            </SocialLink>
            <SocialLink href={siteConfig.social.youtube} label="YouTube">
              <YouTubeIcon />
            </SocialLink>
          </li>
        </FooterColumn>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="tracking-[0.14em] text-gold/70 uppercase">
            {siteConfig.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="mb-4 text-[11px] tracking-[0.22em] text-gold uppercase">
        {title}
      </p>
      <ul className="space-y-2.5 text-sm text-white/70">{children}</ul>
    </div>
  )
}

function FooterLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <li>
      <Link href={href} className="transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 shadow-soft transition-colors hover:border-gold hover:text-gold"
    >
      {children}
    </Link>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.2l.8-3H14V9z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm6.2-.9a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1zM12 9.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
      <path d="M23 12.2s0-3.4-.4-5a2.9 2.9 0 0 0-2-2C18.8 4.7 12 4.7 12 4.7s-6.8 0-8.6.5a2.9 2.9 0 0 0-2 2c-.4 1.6-.4 5-.4 5s0 3.4.4 5a2.9 2.9 0 0 0 2 2c1.8.5 8.6.5 8.6.5s6.8 0 8.6-.5a2.9 2.9 0 0 0 2-2c.4-1.6.4-5 .4-5zM9.8 15.5v-6l6.2 3-6.2 3z" />
    </svg>
  )
}
