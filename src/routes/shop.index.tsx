import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/lux";
import { BRANDS, CATEGORIES, PRODUCTS, currency } from "@/data/catalog";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop — Workroom Detailing Collection | MOTURBO" },
      {
        name: "description",
        content:
          "Ceramic kits, machines, fragrances and interior care from the MOTURBO workroom. Filter by category, brand, price and rating.",
      },
      { property: "og:title", content: "Shop — Workroom Detailing Collection | MOTURBO" },
      { property: "og:description", content: "Every product is used on the studio floor before it ships." },
    ],
  }),
  component: ShopPage,
});

const SORTS = ["Featured", "Price: Low", "Price: High", "Top Rated"] as const;

function ShopPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [brand, setBrand] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { recent, compare } = useStore();

  const results = useMemo(() => {
    let list = PRODUCTS.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (brand.length === 0 || brand.includes(p.brand)) &&
        p.price <= maxPrice &&
        (q === "" ||
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.tagline.toLowerCase().includes(q.toLowerCase())),
    );
    if (sort === "Price: Low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "Top Rated") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [q, cat, brand, maxPrice, sort]);

  const recentProducts = useMemo(
    () => recent.map((s) => PRODUCTS.find((p) => p.slug === s)!).filter(Boolean),
    [recent],
  );
  const compareProducts = useMemo(
    () => compare.map((s) => PRODUCTS.find((p) => p.slug === s)!).filter(Boolean),
    [compare],
  );

  return (
    <>
      <PageHeader
        eyebrow="Workroom Collection"
        title={<>The MOTURBO <span className="text-gold">shop</span></>}
        sub="Sixteen studio-tested pieces across protection, machines, interior and fragrance."
      />

      {/* offers strip */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="glass lux-border flex flex-wrap items-center justify-between gap-4 rounded-2xl px-6 py-4">
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Offer · Free executive delivery over {currency(300)}
          </p>
          <p className="font-display text-xs tracking-[0.2em] text-gold uppercase">
            Coupon: MOTURBO10 · GOLD20 · WORKROOM15
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-7xl gap-10 px-6 py-14 lg:flex">
        {/* Filters */}
        <aside
          className={cn(
            "glass lux-border mb-8 h-fit shrink-0 rounded-3xl p-6 lg:mb-0 lg:w-64 lg:sticky lg:top-28",
            !filtersOpen && "hidden lg:block",
          )}
        >
          <div className="eyebrow">Categories</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[0.65rem] tracking-[0.14em] uppercase transition-all",
                  cat === c
                    ? "border-gold/60 text-gold"
                    : "border-white/10 text-muted-foreground hover:border-white/25",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="hairline my-6" />
          <div className="eyebrow">Brands</div>
          <div className="mt-4 space-y-2">
            {BRANDS.map((b) => (
              <label key={b} className="flex cursor-pointer items-center gap-2.5 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={brand.includes(b)}
                  onChange={() => setBrand((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]))}
                  className="size-3.5 accent-[oklch(0.82_0.13_88)]"
                />
                {b}
              </label>
            ))}
          </div>

          <div className="hairline my-6" />
          <div className="eyebrow">Max price</div>
          <input
            type="range"
            min={30}
            max={1000}
            step={10}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-4 w-full accent-[oklch(0.82_0.13_88)]"
          />
          <div className="mt-2 font-display text-xs text-gold">{currency(maxPrice)}</div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <div className="glass flex flex-1 items-center gap-3 rounded-full px-5 py-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the workroom…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
              {q && (
                <button onClick={() => setQ("")} aria-label="Clear">
                  <X className="size-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className="glass grid size-11 place-items-center rounded-full text-muted-foreground lg:hidden"
              aria-label="Filters"
            >
              <SlidersHorizontal className="size-4" />
            </button>
            <div className="glass flex items-center gap-1 rounded-full p-1">
              {SORTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={cn(
                    "rounded-full px-3.5 py-2 font-display text-[0.6rem] tracking-[0.16em] uppercase transition-colors",
                    sort === s ? "bg-[image:var(--gradient-gold)] text-noir" : "text-muted-foreground",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <p className="mb-6 text-xs tracking-[0.2em] text-muted-foreground uppercase">{results.length} pieces</p>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.05}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
          {results.length === 0 && (
            <p className="py-20 text-center text-sm text-muted-foreground">No pieces match this configuration.</p>
          )}

          {compareProducts.length > 0 && (
            <div className="mt-16">
              <div className="eyebrow">Compare</div>
              <div className="glass lux-border mt-4 overflow-x-auto rounded-3xl p-6">
                <table className="w-full text-left text-sm">
                  <thead className="text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
                    <tr>
                      <th className="pb-3">Product</th>
                      <th className="pb-3">Brand</th>
                      <th className="pb-3">Rating</th>
                      <th className="pb-3">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareProducts.map((p) => (
                      <tr key={p.slug} className="border-t border-white/8">
                        <td className="py-3 font-display">{p.name}</td>
                        <td className="py-3 text-muted-foreground">{p.brand}</td>
                        <td className="py-3 text-muted-foreground">{p.rating}</td>
                        <td className="py-3 text-gold">{currency(p.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {recentProducts.length > 0 && (
            <div className="mt-16">
              <div className="eyebrow">Recently viewed</div>
              <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {recentProducts.slice(0, 3).map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}