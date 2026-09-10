import type { Metadata } from "next"
import { Poppins } from "next/font/google"

import { NavigationProgressProvider } from "@/components/layout/navigation-progress"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { CartProvider } from "@/context/cart-provider"
import { ToastProvider } from "@/context/toast-provider"
import { siteConfig } from "@/lib/site"

import "./globals.css"

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: siteConfig.images.logo,
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans text-foreground">
        <CartProvider>
          <ToastProvider>
            <NavigationProgressProvider>
              <SiteHeader />
              {children}
              <SiteFooter />
            </NavigationProgressProvider>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  )
}
