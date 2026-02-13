import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Checkout
        </p>
        <h1 className="text-3xl text-foreground">Guest Checkout</h1>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <Card className="border-[#C6A87D]/20 bg-card">
            <CardContent className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Contact
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" placeholder="Alexandra Bloom" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="alexandra@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 010-2030" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C6A87D]/20 bg-card">
            <CardContent className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Shipping Address
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="125 Blossom Avenue" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal">Postal Code</Label>
                  <Input id="postal" placeholder="10001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="United States" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C6A87D]/20 bg-card">
            <CardContent className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Billing Address
              </p>
              <div className="flex items-center gap-2">
                <Checkbox id="billing-same" defaultChecked />
                <Label htmlFor="billing-same">Same as shipping</Label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="billing-address">Address</Label>
                  <Input id="billing-address" placeholder="125 Blossom Avenue" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-city">City</Label>
                  <Input id="billing-city" placeholder="New York" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-postal">Postal Code</Label>
                  <Input id="billing-postal" placeholder="10001" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit border-[#C6A87D]/20 bg-card lg:sticky lg:top-10">
          <CardContent className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Order Summary
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Nocturne Veil</span>
                <span>$165</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Lune Noire</span>
                <span>$190</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>$18</span>
              </div>
            </div>
            <Separator className="bg-[#C6A87D]/30" />
            <div className="flex items-center justify-between text-base font-medium text-foreground">
              <span>Total</span>
              <span>$373</span>
            </div>
            <Button className="w-full" asChild>
              <Link href="/payment">Continue to Payment</Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              No account required. Orders are processed as guests.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
