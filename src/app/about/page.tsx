import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          About
        </p>
        <h1 className="text-3xl text-foreground">The Maison</h1>
        <p className="text-sm text-muted-foreground">
          Blisora & Blishing Parfums is a quiet atelier devoted to modern luxury
          fragrance. We design each blend to feel calm, luminous, and long
          lasting.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card className="border-[#C6A87D]/20 bg-card">
          <CardContent className="space-y-3">
            <p className="font-serif text-xl text-foreground">Our Craft</p>
            <p className="text-sm text-muted-foreground">
              Small-batch techniques and measured blends create a balanced,
              elegant trail for every ritual.
            </p>
          </CardContent>
        </Card>
        <Card className="border-[#C6A87D]/20 bg-card">
          <CardContent className="space-y-3">
            <p className="font-serif text-xl text-foreground">Our Promise</p>
            <p className="text-sm text-muted-foreground">
              Guest checkout, refined service, and curated collections built for
              lasting confidence.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
