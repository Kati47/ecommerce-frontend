"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/product-card";

type AudienceFilter = "her" | "him" | "unisex" | null;

type ApiProduct = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  gender?: "men" | "women";
  category?: string | { _id: string; name: string };
  totalStock?: number;
  isActive?: boolean;
};

type ProductCardItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
  stock?: number;
};

const AUDIENCE_KEY = "blisora_audience";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4002/api";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isObjectId = (value: string) => /^[a-f0-9]{24}$/i.test(value);

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [audienceFilter, setAudienceFilter] = useState<AudienceFilter>(null);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const param = searchParams.get("audience");
    if (param === "her" || param === "him" || param === "unisex") {
      setAudienceFilter(param);
      globalThis?.localStorage?.setItem(AUDIENCE_KEY, param);
      return;
    }
    const stored = globalThis?.localStorage?.getItem(AUDIENCE_KEY);
    if (stored === "her" || stored === "him" || stored === "unisex") {
      setAudienceFilter(stored);
    }
  }, [searchParams]);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const loadProducts = async () => {
      setIsLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        if (search.trim()) {
          params.set("q", search.trim());
        }
        if (audienceFilter === "her") {
          params.set("gender", "women");
        }
        if (audienceFilter === "him") {
          params.set("gender", "men");
        }

        const query = params.toString();
        const response = await fetch(
          `${API_BASE_URL}/products${query ? `?${query}` : ""}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load products.");
        }

        const data = (await response.json()) as ApiProduct[];
        if (isActive) {
          setProducts(data);
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error ? err.message : "Failed to load products."
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [search, audienceFilter]);

  const cardProducts = useMemo<ProductCardItem[]>(
    () =>
      products.map((product) => ({
        id: product._id,
        slug: toSlug(product.name),
        name: product.name,
        price: product.price,
        image: product.images?.[0] ?? "",
        category:
          typeof product.category === "string"
            ? isObjectId(product.category)
              ? undefined
              : product.category
            : product.category?.name,
        description: product.description ?? "",
        stock: product.totalStock ?? 0,
      })),
    [products]
  );

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/whitemarble.avif')" }}
    >
      <div className="absolute inset-0 bg-white/75" />
      <div className="relative z-10">
        <section className="mx-auto w-full max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-black/60">
                Shop
              </p>
              <h1 className="font-serif text-3xl text-black sm:text-4xl">
                {audienceFilter === "her"
                  ? "For Her"
                  : audienceFilter === "him"
                  ? "For Him"
                  : "All Fragrances"}
              </h1>
              <p className="max-w-xl text-sm text-black/70">
                Explore our complete selection of luxury perfume, crafted for a
                refined guest checkout experience.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 md:max-w-sm">
              <Input
                placeholder="Search by name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-full border border-black/25 bg-white px-5 font-serif text-sm text-black placeholder:text-black/50 shadow-[0_16px_36px_rgba(0,0,0,0.12)] focus-visible:ring-black/40"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-12">
          <div className="rounded-[2.5rem] border border-black/15 bg-white/80 p-6 backdrop-blur-sm shadow-[0_28px_70px_rgba(0,0,0,0.14)]">
            <div className="pointer-events-none rounded-[2rem] border border-black/10" />
            <Separator className="my-6 bg-black/10" />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {isLoading && (
                <p className="text-sm text-black/60">Loading…</p>
              )}
              {!isLoading && error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              {!isLoading &&
                !error &&
                cardProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}