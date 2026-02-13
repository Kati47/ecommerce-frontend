import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function TrackingPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Tracking
        </p>
        <h1 className="text-3xl text-foreground">Track Your Order</h1>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <Card className="border-[#C6A87D]/20 bg-card">
          <CardContent className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Lookup
            </p>
            <div className="space-y-2">
              <Label htmlFor="reference">Order Reference</Label>
              <Input id="reference" placeholder="BLIS-20458" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Email or Phone</Label>
              <Input id="contact" placeholder="alexandra@email.com" />
            </div>
            <Button className="w-full">Check Status</Button>
          </CardContent>
        </Card>

        <Card className="border-[#C6A87D]/20 bg-card">
          <CardContent className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Status
            </p>
            <p className="text-sm text-foreground">Order is in transit.</p>
            <Separator className="bg-[#C6A87D]/30" />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Feb 12 - Order confirmed</p>
              <p>Feb 13 - Packed at atelier</p>
              <p>Feb 14 - Handed to courier</p>
              <p>Feb 15 - Out for delivery</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
