import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ConfirmationPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <Card className="border-[#C6A87D]/20 bg-card">
        <CardContent className="space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Order Confirmed
          </p>
          <h1 className="text-3xl text-foreground">Thank you for your order.</h1>
          <p className="text-sm text-muted-foreground">
            Your fragrance ritual is now in motion. We will notify you as soon as
            your order ships.
          </p>
          <Separator className="bg-[#C6A87D]/30" />
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">Order Reference</p>
            <p className="font-serif text-xl text-foreground">BLIS-20458</p>
          </div>
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
            <Separator className="bg-[#C6A87D]/30" />
            <div className="flex items-center justify-between text-base font-medium text-foreground">
              <span>Total</span>
              <span>$373</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Track your order using your reference number and email.
          </p>
          <Button asChild>
            <Link href="/tracking">Track Order</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
