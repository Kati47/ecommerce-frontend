import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer
      className="border-t border-[#C6A87D]/30 bg-cover bg-center"
      style={{ backgroundImage: "url('/marbel.jpg')" }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div className="space-y-3">
            <p className="font-serif text-lg tracking-[0.2em] text-foreground">
              Blisora & Blisking Parfums
            </p>
            <p className="text-sm text-muted-foreground">
              Maison fragrance studio for calm rituals.
            </p>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground">
              Contact
            </p>
            <p>atelier@blisora-parfums.com</p>
            <p>+1 (212) 555-0117</p>
            <p>New York, NY</p>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground">
              Legal
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/" className="hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/" className="hover:text-foreground">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-[#C6A87D]/30" />
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Guest checkout. Curated luxury fragrance.
        </p>
      </div>
    </footer>
  );
}
