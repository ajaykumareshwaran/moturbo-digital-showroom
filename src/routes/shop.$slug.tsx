import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Minus, Plus, Scale, Star, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PRODUCTS, currency } from "@/data/catalog";
import { ProductOrb } from "@/components/ProductOrb";
import { ProductCard } from "@/components/ProductCard";
import { LuxButton, Magnetic, Reveal, TiltCard } from "@/components/lux";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product unavailable — MOTURBO" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — MOTURBO Atelier` },
        { name: "description", content: p.tagline },
        { property: "og:title", content: `${p.name} — MOTURBO Atelier` },
        { property: "og:description", content: p.tagline },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, wishlist, toggleCompare, markViewed } = useStore();
  const [qty, setQty] = useState(1);
  const wished = wishlist.includes(product.slug);

  useEffect(() => {
    markViewed(product.slug);
  }, [product.slug, markViewed]);

  const related = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);
  const recommended = PRODUCTS.filter((p) => p.slug !== product.slug).slice(-3);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-36 pb-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <TiltCard className="glass lux-border h-[520px] overflow-hidden rounded-[2rem]" intensity={14}>
              <ProductOrb hue={product.hue} />
            </TiltCard>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="text-[0.62rem] tracking-[0.3em] text-muted-foreground uppercase">
              {product.brand} · {product.category}
            </div>
            <h1 className="mt-4 text-4xl leading-tight font-semibold sm:text-5xl">{product.name}</h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("size-3.5", i < Math.round(product.rating) && "fill-current")} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {product.rating} · {product.reviews} reviews
              </span>
            </div>

            <div className="mt-7 flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-gold">{currency(product.price)}</span>
              {product.compareAt && (
                <span className="text-sm text-muted-foreground line-through">{currency(product.compareAt)}</span>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="hairline my-8" />

            <div className="flex flex-wrap items-center gap-3">
              <div className="glass flex items-center gap-4 rounded-full px-4 py-3">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                  <Minus className="size-3.5" />
                </button>
                <span className="w-6 text-center font-display text-sm">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">
                  <Plus className="size-3.5" />
                </button>
              </div>
              <Magnetic>
                <LuxButton
                  onClick={() => {
                    addToCart(product.slug, qty);
                    toast.success(`${product.name} × ${qty} added`);
                  }}
                >
                  Add to Cart
                </LuxButton>
              </Magnetic>
              <button
                onClick={() => toggleWishlist(product.slug)}
                className={cn("glass grid size-12 place-items-center rounded-full", wished ? "text-gold" : "text-muted-foreground")}
                aria-label="Wishlist"
              >
                <Heart className={cn("size-4", wished && "fill-current")} />
              </button>
              <button
                onClick={() => toggleCompare(product.slug)}
                className="glass grid size-12 place-items-center rounded-full text-muted-foreground hover:text-gold-soft"
                aria-label="Compare"
              >
                <Scale className="size-4" />
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="glass flex items-center gap-3 rounded-2xl px-5 py-4 text-xs text-muted-foreground">
                <Truck className="size-4 text-gold/70" /> Concierge delivery in 48h
              </div>
              <div className="glass flex items-center gap-3 rounded-2xl px-5 py-4 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-gold/70" /> 24-month studio warranty
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {product.specs.map((s) => (
                <div key={s.label} className="glass rounded-2xl p-4">
                  <div className="text-[0.55rem] tracking-[0.2em] text-muted-foreground uppercase">{s.label}</div>
                  <div className="mt-1.5 font-display text-xs">{s.value}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="eyebrow">Reviews</div>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {[
            ["Exceptional finish", "Better slickness than anything else on my shelf.", "Verified client"],
            ["Worth the price", "Used it across three cars, still half full.", "Studio member"],
            ["Packaging is art", "Purple and gold box, hand-sealed. Feels expensive.", "Verified client"],
          ].map(([t, b, who], i) => (
            <Reveal key={t} delay={i * 0.06}>
              <div className="glass lux-border h-full rounded-3xl p-6">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-3 fill-current" />
                  ))}
                </div>
                <h4 className="mt-4 font-display text-sm font-semibold">{t}</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{b}</p>
                <div className="mt-4 text-[0.55rem] tracking-[0.24em] text-muted-foreground uppercase">{who}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {[
        ["Related pieces", related],
        ["Recommended for you", recommended],
      ].map(([title, list]) => (
        <section key={title as string} className="mx-auto max-w-7xl px-6 pb-20">
          <div className="eyebrow">{title as string}</div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(list as typeof related).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}