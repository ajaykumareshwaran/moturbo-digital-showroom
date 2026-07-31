import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { LuxLink } from "@/components/lux";
import { useStore } from "@/context/StoreContext";
import { currency } from "@/data/catalog";
import { ProductOrb } from "@/components/ProductOrb";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | MOTURBO" },
      { name: "description", content: "Review your MOTURBO atelier selection, apply a coupon and check out." },
      { property: "og:title", content: "Your Cart | MOTURBO" },
      { property: "og:description", content: "Concierge delivery on every atelier order." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQty, removeFromCart, subtotal, discount, total, applyCoupon, coupon } = useStore();
  const [code, setCode] = useState("");

  return (
    <>
      <PageHeader eyebrow="Bag" title={<>Your <span className="text-gold">selection</span></>} />
      <section className="mx-auto max-w-6xl gap-10 px-6 pb-28 lg:flex">
        <div className="flex-1 space-y-4">
          {lines.length === 0 && (
            <div className="glass rounded-3xl p-14 text-center">
              <p className="text-sm text-muted-foreground">Your bag is empty.</p>
              <div className="mt-6">
                <LuxLink to="/shop">Browse the atelier</LuxLink>
              </div>
            </div>
          )}
          {lines.map(({ product, qty }) => (
            <div key={product.slug} className="glass lux-border flex items-center gap-5 rounded-3xl p-4">
              <div className="size-24 shrink-0 overflow-hidden rounded-2xl">
                <ProductOrb hue={product.hue} />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  to="/shop/$slug"
                  params={{ slug: product.slug }}
                  className="font-display text-sm font-semibold hover:text-gold-soft"
                >
                  {product.name}
                </Link>
                <div className="mt-1 text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
                  {product.brand}
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="glass flex items-center gap-3 rounded-full px-3 py-1.5">
                    <button onClick={() => setQty(product.slug, qty - 1)} aria-label="Decrease">
                      <Minus className="size-3" />
                    </button>
                    <span className="w-5 text-center font-display text-xs">{qty}</span>
                    <button onClick={() => setQty(product.slug, qty + 1)} aria-label="Increase">
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.slug)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="font-display text-sm font-bold text-gold">{currency(product.price * qty)}</div>
            </div>
          ))}
        </div>

        <aside className="glass lux-border mt-10 h-fit rounded-3xl p-7 lg:mt-0 lg:w-80 lg:sticky lg:top-28">
          <div className="eyebrow">Summary</div>
          <div className="mt-6 space-y-3 text-sm">
            <Row label="Subtotal" value={currency(subtotal)} />
            {discount > 0 && <Row label={`Coupon ${coupon}`} value={`- ${currency(discount)}`} gold />}
            <Row label="Delivery" value={subtotal > 300 ? "Complimentary" : currency(25)} />
          </div>
          <div className="hairline my-6" />
          <div className="flex items-center justify-between">
            <span className="eyebrow">Total</span>
            <span className="font-display text-2xl font-bold text-gold">
              {currency(total + (subtotal > 300 || subtotal === 0 ? 0 : 25))}
            </span>
          </div>
          <div className="mt-6 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Coupon"
              className="input-lux flex-1"
            />
            <button
              onClick={() => toast[applyCoupon(code) ? "success" : "error"](applyCoupon(code) ? "Coupon applied" : "Invalid coupon")}
              className="rounded-xl px-4 font-display text-[0.6rem] tracking-[0.2em] text-noir uppercase"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              Apply
            </button>
          </div>
          <div className="mt-6">
            <LuxLink to="/checkout" className="w-full">
              Checkout
            </LuxLink>
          </div>
        </aside>
      </section>
    </>
  );
}

function Row({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={gold ? "text-gold" : ""}>{value}</span>
    </div>
  );
}