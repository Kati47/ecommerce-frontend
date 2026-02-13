"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4002/api";

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

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = (await response.json()) as Cart;
        setCart(data);
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load cart",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (
    productId: string,
    newQuantity: number,
    variant?: { size?: string; color?: string }
  ) => {
    setUpdatingItemId(productId);

    try {
      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          item: {
            productId,
            quantity: newQuantity,
            ...(variant && { variant }),
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update cart");
      }

      await fetchCart();

      if (newQuantity === 0) {
        toast({
          title: "Item removed",
          description: "Item removed from cart",
        });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update cart",
      });
    } finally {
      setUpdatingItemId(null);
    }
  };

  const removeItem = async (
    productId: string,
    variant?: { size?: string; color?: string }
  ) => {
    await updateQuantity(productId, 0, variant);
  };

  const summary = useMemo(() => {
    const subtotal = cart?.subtotal ?? 0;
    const shipping = subtotal > 0 ? 18 : 0;
    const discount = subtotal > 0 ? 10 : 0;
    const total = Math.max(subtotal + shipping - discount, 0);
    return { subtotal, shipping, discount, total };
  }, [cart]);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <p className="text-center text-muted-foreground">Loading cart...</p>
      </div>
    );
  }

  const items = cart?.items ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Cart
        </p>
        <h1 className="text-3xl text-foreground">Your Bag</h1>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {items.length === 0 ? (
            <Card className="border-[#C6A87D]/20 bg-card">
              <CardContent className="flex items-center gap-3 py-10">
                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Your cart is empty.
                </p>
              </CardContent>
            </Card>
          ) : (
            items.map((item) => (
              <Card
                key={`${item.productId._id}-${item.variant?.size ?? ""}-${item.variant?.color ?? ""}`}
                className="border-[#C6A87D]/20 bg-card"
              >
                <CardContent className="grid gap-6 sm:grid-cols-[120px_1fr]">
                  <div className="aspect-[3/4] rounded-xl border border-[#C6A87D]/20 bg-[#fdfbf9]" />
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-serif text-lg text-foreground">
                          {item.productId.name}
                        </p>
                        {(item.variant?.size || item.variant?.color) && (
                          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            {item.variant?.size ?? "Standard"}{" "}
                            {item.variant?.color ? `· ${item.variant.color}` : ""}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        ${item.productId.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        size="icon-sm"
                        variant="outline"
                        aria-label="Decrease"
                        disabled={updatingItemId === item.productId._id}
                        onClick={() =>
                          updateQuantity(
                            item.productId._id,
                            Math.max(0, item.quantity - 1),
                            item.variant
                          )
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-foreground">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        aria-label="Increase"
                        disabled={updatingItemId === item.productId._id}
                        onClick={() =>
                          updateQuantity(
                            item.productId._id,
                            item.quantity + 1,
                            item.variant
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="ml-auto text-xs uppercase tracking-[0.3em]"
                        disabled={updatingItemId === item.productId._id}
                        onClick={() =>
                          removeItem(item.productId._id, item.variant)
                        }
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card className="h-fit border-[#C6A87D]/20 bg-card">
          <CardContent className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Summary
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${summary.subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>${summary.shipping}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <span>-${summary.discount}</span>
              </div>
            </div>
            <Separator className="bg-[#C6A87D]/30" />
            <div className="flex items-center justify-between text-base font-medium text-foreground">
              <span>Total</span>
              <span>${summary.total}</span>
            </div>
            <Button className="w-full" asChild disabled={items.length === 0}>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Guest checkout only. No login required.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}