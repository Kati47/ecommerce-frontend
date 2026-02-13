import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Contact
        </p>
        <h1 className="text-3xl text-foreground">Concierge Support</h1>
        <p className="text-sm text-muted-foreground">
          Reach our concierge for fragrance guidance, order updates, or gifting
          requests.
        </p>
      </div>

      <Card className="mt-10 border-[#C6A87D]/20 bg-card">
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Full Name</Label>
              <Input id="contact-name" placeholder="Alexandra Bloom" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" type="email" placeholder="alexandra@email.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Tell us how we can help." />
          </div>
          <Button>Send Message</Button>
        </CardContent>
      </Card>
    </div>
  );
}
