import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header
      className="border-b border-[#C6A87D]/30 bg-cover bg-center"
      style={{ backgroundImage: "url('/marbel.jpg')" }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex flex-col text-sm uppercase">
          <span className="font-serif text-lg tracking-[0.2em] text-foreground">
            Blisora & Blisking
          </span>
          <span className="text-[0.65rem] tracking-[0.32em] text-muted-foreground">
            Parfums
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm uppercase tracking-[0.2em] text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/cart"
          className="flex items-center gap-3 text-sm text-foreground"
          aria-label="Cart"
        >
          <div className="relative">
            <ShoppingBag className="size-5" />
            <Badge className="absolute -right-2.5 -top-2 h-5 min-w-5 justify-center px-1 bg-black text-white">
              2
            </Badge>
          </div>
        </Link>
      </div>
      <nav className="flex items-center justify-center gap-6 border-t border-[#C6A87D]/20 px-6 py-3 text-xs uppercase tracking-[0.25em] text-muted-foreground md:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
