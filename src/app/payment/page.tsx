import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

export default function PaymentPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Payment
        </p>
        <h1 className="text-3xl text-foreground">Secure Payment</h1>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-[#C6A87D]/20 bg-card">
          <CardContent className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Payment Method
            </p>
            <RadioGroup defaultValue="card" className="space-y-4">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="card" id="pay-card" />
                <Label htmlFor="pay-card">Credit or Debit Card</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="cod" id="pay-cod" />
                <Label htmlFor="pay-cod">Cash on Delivery</Label>
              </div>
            </RadioGroup>

            <Separator className="bg-[#C6A87D]/30" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="card-name">Cardholder Name</Label>
                <Input id="card-name" placeholder="Alexandra Bloom" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="0000 0000 0000 0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiration</Label>
                <Input id="expiry" placeholder="MM / YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" />
              </div>
            </div>

            <Button className="w-full" asChild>
              <Link href="/confirmation">Pay $373</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-[#C6A87D]/20 bg-card">
            <CardContent className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Order Summary
              </p>
              <div className="space-y-2 text-sm">
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
            </CardContent>
          </Card>

          <Card className="border-[#C6A87D]/20 bg-[#fdfbf9]">
            <CardContent className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Payment Status
              </p>
              <p className="text-sm text-foreground">
                Success: Your payment is encrypted and secure.
              </p>
              <p className="text-sm text-muted-foreground">
                Error: Verify card details and try again.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
