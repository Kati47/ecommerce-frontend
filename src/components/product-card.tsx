import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type ProductCardItem = {
  slug: string;
  name: string;
  price: number;
  category?: string;
  concentration?: string;
  description?: string;
};

type ProductCardProps = Readonly<{
  product: ProductCardItem;
}>;

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group h-full border border-black/15 bg-white/80 transition-all hover:-translate-y-1 hover:border-black/40 hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]">
      <CardContent className="space-y-4">
        {(product.category || product.concentration) && (
          <div className="flex items-start justify-between gap-3">
            {product.category ? (
              <Badge
                variant="outline"
                className="border-black/30 bg-white/90 text-xs text-black"
              >
                {product.category}
              </Badge>
            ) : (
              <span />
            )}
            {product.concentration && (
              <span className="text-sm text-black/60">
                {product.concentration}
              </span>
            )}
          </div>
        )}
        <p className="font-serif text-lg tracking-[0.18em] text-black">
          {product.name}
        </p>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.75rem] border border-black/15 bg-white/90">
          <Image
            src="/kiiiiiii.png"
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        {product.description && (
          <p className="text-sm text-black/70">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-black">
            ${product.price}
          </span>
          <Link
            href={`/shop/${product.slug}`}
            className="text-xs uppercase tracking-[0.3em] text-black/80 transition hover:text-black"
          >
            View
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
