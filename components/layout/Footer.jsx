import Link from "next/link";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import FooterLinkColumn from "./FooterLinkColumn";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// ✅ matches CategoryCard.jsx's link pattern (/shop?category=value)
const shopLinks = [
  { href: "/shop?category=mens", label: "Mens Wear" },
  { href: "/shop?category=womens", label: "WomensWear" },
  { href: "/shop?category=kids", label: "Kids Wear" },
  { href: "/shop?category=accessories", label: "Accessories" },
];

// ✅ Fixed: each link now points somewhere distinct instead of
// both collapsing onto /user/orders
const helpLinks = [
  { href: "/user/orders", label: "Order Status" },
  { href: "/contact", label: "Shipping & Delivery" },
];

// ✅ Fixed: "Track Order" and "Order History" both legitimately mean
// /user/orders, so they're merged into one link to avoid duplicate keys
const profileLinks = [
  { href: "/profile", label: "My Account" },
  { href: "/user/orders", label: "My Orders" },
  { href: "/cart", label: "My Cart" },
];

const socialLinks = [
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaXTwitter, href: "https://x.com", label: "X" },
];

export default function Footer() {
  return (
    <footer className="bg-black px-4 py-16 text-white sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-6 md:gap-8">
          <div className="col-span-2">
            <Link href="/" className="mb-5 inline-flex items-center gap-2">
              <img src="/footer-logo.svg" alt="" className="h-15 w-40" />
            </Link>
            <p className="max-w-xs text-base leading-relaxed text-slate-200">
              Classic looks for Men, Women & Kids.
            </p>
            <div className="mt-6 flex items-center gap-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-white transition-colors hover:text-primary"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <FooterLinkColumn title="Quick Links" links={quickLinks} activeHref="/" />
          <FooterLinkColumn title="Shop" links={shopLinks} />
          <FooterLinkColumn title="Help" links={helpLinks} />
          <FooterLinkColumn title="My Profile" links={profileLinks} />
        </div>

        <div className="mt-14 border-t border-white/15 pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-slate-300">
              Copyright © 2026 Clothing Store. All rights reserved.
            </p>
            <img
              src="/payments1.svg"
              alt="Accepted payment methods: PayPal, Visa, Mastercard, Discover, American Express"
              className="h-9 w-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}