"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4002/api";

type ProductDetailsProps = {
  params: Promise<{ slug: string }>;
};

type ApiProduct = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  category?: string | { _id: string; name: string };
  totalStock?: number;
  notes?: {
    top?: string[];
    middle?: string[];
    base?: string[];
  };
  variants?: Array<{
    size?: string;
    color?: string;
    stock?: number;
  }>;
};

type CartItem = {
  productId: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
};

type Cart = {
  _id: string;
  sessionId: string;
  items: CartItem[];
  subtotal: number;
};


const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function ProductDetailsPage({
  params,
}: ProductDetailsProps) {
  const [slug, setSlug] = useState<string>("");
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [notFoundError, setNotFoundError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getParams = async () => {
      const { slug: paramSlug } = await params;
      setSlug(paramSlug);

      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (response.ok) {
          const products = (await response.json()) as ApiProduct[];
          const foundProduct =
            products.find((p) => toSlug(p.name) === paramSlug) ?? null;
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            setNotFoundError(true);
          }
        } else {
          setNotFoundError(true);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setNotFoundError(true);
      }
    };

    getParams();
    fetchCart();
  }, [params]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = (await response.json()) as Cart;
        setCart(data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const isProductInCart = product ? cart?.items.some((item) => item.productId._id === product._id) : false;

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          item: {
            productId: product._id,
            quantity: quantity,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add to cart");
      }

      await fetchCart();

      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name}`,
      });

      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add to cart",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (notFoundError) {
    return (
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/marbel.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/75" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12">
          <p className="text-center text-black/70">Product not found</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/marbel.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/75" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12">
          <p className="text-center text-black/70">Loading...</p>
        </div>
      </div>
    );
  }

  const categoryLabel = "Maison fragrance";

  const topNotes = product.notes?.top ?? [];
  const middleNotes = product.notes?.middle ?? [];
  const baseNotes = product.notes?.base ?? [];

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/marbel.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/75" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="group relative aspect-[3/4] overflow-hidden rounded-[2.5rem] border border-black/15 bg-white/80 p-6 shadow-[0_28px_70px_rgba(0,0,0,0.14)]">
              <div className="pointer-events-none absolute inset-3 rounded-[2rem] border border-black/10" />
              <Image
                src={`/${product.images?.[0] ?? "kiiiiiii.png"}`}
                alt={product.name}
                fill
                className="rounded-[2rem] object-cover"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-black/60">
                {categoryLabel}
              </p>
              <h1 className="font-serif text-3xl text-black sm:text-4xl">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-lg font-medium text-black">
                  ${product.price}
                </p>
                <Badge className="bg-black text-white">
                  {product.totalStock ?? "In Stock"}
                </Badge>
              </div>
            </div>

            <Card className="border-black/15 bg-white/80 shadow-[0_18px_45px_rgba(0,0,0,0.12)]">
              <CardContent className="space-y-5">
                {topNotes.length + middleNotes.length + baseNotes.length > 0 ? (
                  <div className="space-y-5">
                    {topNotes.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold italic text-black">
                          Top Notes
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {topNotes.map((note) => (
                            <Badge
                              key={`top-${note}`}
                              variant="outline"
                              className="border-black/30 bg-white/90 text-xs font-medium text-black"
                            >
                              {note}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {middleNotes.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold italic text-black">
                          Heart Notes
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {middleNotes.map((note) => (
                            <Badge
                              key={`middle-${note}`}
                              variant="outline"
                              className="border-black/30 bg-white/90 text-xs font-medium text-black"
                            >
                              {note}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {baseNotes.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold italic text-black">
                          Base Notes
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {baseNotes.map((note) => (
                            <Badge
                              key={`base-${note}`}
                              variant="outline"
                              className="border-black/30 bg-white/90 text-xs font-medium text-black"
                            >
                              {note}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-black/60">
                    No scent notes available
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-black/60">
                Quantity
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isAddingToCart}
                  className="rounded-full border border-black/20 bg-white/90 p-2 shadow-[0_12px_26px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-black hover:text-white disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-lg font-medium text-black">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isAddingToCart}
                  className="rounded-full border border-black/20 bg-white/90 p-2 shadow-[0_12px_26px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-black hover:text-white disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Button 
              onClick={handleAddToCart}
              disabled={isAddingToCart || isProductInCart}
              className="w-full rounded-full border border-black bg-black text-xs uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black disabled:opacity-50"
            >
              {isAddingToCart ? (
                "Adding..."
              ) : isProductInCart ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Already in Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>

            <Card className="border-black/15 bg-white/80 shadow-[0_18px_45px_rgba(0,0,0,0.12)]">
              <CardContent className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-black/60">
                  Availability
                </p>
                <p className="text-sm text-black/70">
                  Ships within 2-3 business days with tracked delivery.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}