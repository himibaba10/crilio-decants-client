/** Site copy, contact, and homepage media paths. */

export const siteConfig = {
  name: "Crilio",
  tagline: "Premium perfume decants",
  description:
    "Discover refined fragrance decants — curated oils and sprays in 3ml, 5ml, and 10ml sizes, with cash on delivery across Bangladesh.",
  phone: "01XXX-XXXXXX",
  email: "hello@crilio.shop",
  address: "Dhaka, Bangladesh",
  addressDetail: "Boutique address coming soon — shop online with COD.",
  hours: "11 AM – 7 PM",
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Find us", href: "#store-location" },
    { label: "Contact", href: "/contact" },
  ],
  images: {
    hero: "/images/home/hero.jpg",
    whyChoose: "/images/home/why-choose.jpg",
    store: "/images/home/store.jpg",
  },
  categoryShowcase: [
    {
      name: "Male",
      slug: "male",
      image: "/images/home/category-male.jpg",
      tone: "from-[#2a2a2a] to-[#6b6b6b]",
    },
    {
      name: "Female",
      slug: "female",
      image: "/images/home/category-female.jpg",
      tone: "from-[#f3d6df] to-[#f8ecef]",
    },
    {
      name: "Fresh",
      slug: "fresh",
      image: "/images/home/category-fresh.jpg",
      tone: "from-[#cfe8f5] to-[#eaf6fb]",
    },
  ],
  collectionBanners: [
    {
      name: "Male",
      slug: "male",
      banner: "/images/home/collection-woody.jpg",
    },
    {
      name: "Female",
      slug: "female",
      banner: "/images/home/collection-floral.jpg",
    },
    {
      name: "Fresh",
      slug: "fresh",
      banner: "/images/home/collection-sweet.jpg",
    },
  ],
  perks: [
    {
      title: "100% Authentic",
      description: "Genuine fragrance oils only",
    },
    {
      title: "Quick Delivery",
      description: "Fast shipping across Bangladesh",
    },
    {
      title: "Cash on Delivery",
      description: "Pay when you receive",
    },
  ],
  whyChoose: {
    title: "Why choose Crilio?",
    body: "Crilio is built for fragrance lovers who want to explore without committing to a full bottle. Every decant is carefully filled, sealed, and labeled so you can sample premium perfume oils with confidence. We focus on authenticity, lasting wear, and a smooth COD checkout experience.",
  },
  testimonials: [
    {
      name: "Ayesha R.",
      quote:
        "The decants smell exactly like the full bottles I know. Packaging was neat and delivery was quick.",
    },
    {
      name: "Rahim K.",
      quote:
        "Finally an easy way to try sizes before buying bigger. The 5ml is perfect for travel.",
    },
    {
      name: "Nusrat F.",
      quote:
        "Honest listing and long-lasting oils. Cash on delivery made ordering stress-free.",
    },
    {
      name: "Imran H.",
      quote:
        "Great selection and clear size options. Will order again once my current decants run out.",
    },
  ],
} as const
