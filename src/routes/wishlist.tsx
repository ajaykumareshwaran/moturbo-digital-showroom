import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { LuxLink, Reveal } from "@/components/lux";
import { useStore } from "@/context/StoreContext";
import { PRODUCTS } from "@/data/catalog";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist | MOTURBO" },
      { name: "description", content: "Pieces you have saved from the MOTURBO atelier collection." },
      { property: "og:title", content: "Wishlist | MOTURBO" },
      { property: "og:description", content: "Saved pieces, kept for your next studio visit." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useStore();
  const items = wishlist.map((s) => PRODUCTS.find((p) => p.slug === s)).filter(Boolean);

  return (
    <>
      <PageHeader eyebrow="Saved" title={<>Your <span className="text-gold">wishlist</span></>} />
      <section className="mx-auto max-w-7xl px-6 pb-28">
        {items.length === 0 ? (
          <div className="glass rounded-3xl p-16 text-center">
            <p className="text-sm text-muted-foreground">Nothing saved yet.</p>
            <div className="mt-6">
              <LuxLink to="/shop">Browse the atelier</LuxLink>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <Reveal key={p!.slug} delay={(i % 3) * 0.06}>
                <ProductCard product={p!} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}