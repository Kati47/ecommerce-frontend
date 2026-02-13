import Link from "next/link";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/marbel.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/75" />

      <div className="relative z-10">
        <section className="mx-auto w-full max-w-6xl px-6 py-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="font-serif text-2xl leading-tight text-black sm:text-3xl">
              <span className="text-3xl sm:text-4xl">B</span>lisora &
              <span className="text-3xl sm:text-4xl"> B</span>lisking Parfums
            </p>
            <p className="text-xs uppercase tracking-[0.35em] text-black/70">
              Maison fragrance rituals
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-10 pt-2">
          <div className="mx-auto grid max-w-xl gap-3 md:grid-cols-2">
            <div className="group relative flex h-full flex-col rounded-[2.5rem] border border-black/20 bg-white/80 p-6 text-center backdrop-blur-sm shadow-[0_28px_70px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_36px_90px_rgba(0,0,0,0.18)]">
              <div className="pointer-events-none absolute inset-3 rounded-[2rem] border border-black/10" />
              <div className="mx-auto mb-4 h-px w-20 bg-gradient-to-r from-transparent via-black/90 to-transparent" />
              <h3 className="text-2xl font-serif text-black">
                <span className="text-3xl">F</span>or Her
              </h3>
              <div className="mt-5 flex items-center justify-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-black/15 bg-white/95 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                  <Crown className="h-12 w-12 text-black" strokeWidth={1.2} />
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <Button
                  className="rounded-full border border-black bg-white px-6 text-xs font-medium uppercase tracking-[0.32em] text-black transition hover:bg-black hover:text-white"
                  asChild
                >
                  <Link href="/shop?audience=her">Shop For Her</Link>
                </Button>
              </div>
            </div>

            <div className="group relative flex h-full flex-col rounded-[2.5rem] border border-black/20 bg-white/80 p-6 text-center backdrop-blur-sm shadow-[0_28px_70px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_36px_90px_rgba(0,0,0,0.18)]">
              <div className="pointer-events-none absolute inset-3 rounded-[2rem] border border-black/10" />
              <div className="mx-auto mb-4 h-px w-20 bg-gradient-to-r from-transparent via-black/90 to-transparent" />
              <h3 className="text-2xl font-serif text-black">
                <span className="text-3xl">F</span>or Him
              </h3>
              <div className="mt-5 flex items-center justify-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-black/15 bg-white/95 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                  <Crown className="h-12 w-12 text-black" strokeWidth={1.2} />
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <Button
                  className="rounded-full border border-black bg-black px-6 text-xs font-medium uppercase tracking-[0.32em] text-white transition hover:bg-white hover:text-black"
                  asChild
                >
                  <Link href="/shop?audience=him">Shop For Him</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
