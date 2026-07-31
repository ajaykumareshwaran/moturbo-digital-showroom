import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, Landmark, Wallet } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { LuxButton, LuxLink } from "@/components/lux";
import { useStore } from "@/context/StoreContext";
import { currency } from "@/data/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | MOTURBO" },
      { name: "description", content: "Secure checkout for the MOTURBO atelier collection with concierge delivery." },
      { property: "og:title", content: "Checkout | MOTURBO" },
      { property: "og:description", content: "Card, transfer or pay at the studio." },
    ],
  }),
  component: CheckoutPage,
});

const METHODS = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "transfer", label: "Transfer", icon: Landmark },
  { id: "studio", label: "Pay at studio", icon: Wallet },
];

function CheckoutPage() {
  const { lines, total, clearCart } = useStore();
  const [method, setMethod] = useState("card");
  const [placed, setPlaced] = useState<string | null>(null);

  return (
    <>
      <PageHeader eyebrow="Secure" title={<>Complete your <span className="text-gold">order</span></>} />
      <section className="mx-auto max-w-5xl px-6 pb-28">
        {placed ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass lux-border rounded-[2rem] p-12 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full" style={{ backgroundImage: "var(--gradient-gold)" }}>
              <Check className="size-7 text-noir" />
            </div>
            <h2 className="mt-7 font-display text-3xl font-semibold">Order placed</h2>
            <div className="mt-5 font-display text-2xl font-bold text-gold">{placed}</div>
            <p className="mt-4 text-xs text-muted-foreground">A concierge will call to arrange delivery.</p>
            <div className="mt-8 flex justify-center">
              <LuxLink to="/shop" variant="ghost">Continue browsing</LuxLink>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="glass lux-border space-y-6 rounded-3xl p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <input placeholder="Full name" className="input-lux" />
                <input placeholder="Email" className="input-lux" />
                <input placeholder="Phone" className="input-lux" />
                <input placeholder="City" className="input-lux" />
              </div>
              <input placeholder="Delivery address" className="input-lux" />

              <div className="hairline" />
              <div className="eyebrow">Payment</div>
              <div className="grid gap-3 sm:grid-cols-3">
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-4 text-xs transition-all",
                      method === m.id ? "border-gold/50 bg-gold/5 text-gold" : "border-white/10 text-muted-foreground",
                    )}
                  >
                    <m.icon className="size-4" /> {m.label}
                  </button>
                ))}
              </div>
              {method === "card" && (
                <div className="grid gap-4 sm:grid-cols-3">
                  <input placeholder="Card number" className="input-lux sm:col-span-3" />
                  <input placeholder="MM / YY" className="input-lux" />
                  <input placeholder="CVC" className="input-lux" />
                  <input placeholder="ZIP" className="input-lux" />
                </div>
              )}
            </div>

            <aside className="glass lux-border h-fit rounded-3xl p-7">
              <div className="eyebrow">Order</div>
              <div className="mt-5 space-y-3 text-xs">
                {lines.map(({ product, qty }) => (
                  <div key={product.slug} className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      {product.name} × {qty}
                    </span>
                    <span>{currency(product.price * qty)}</span>
                  </div>
                ))}
                {lines.length === 0 && <p className="text-muted-foreground">No items yet.</p>}
              </div>
              <div className="hairline my-6" />
              <div className="flex items-center justify-between">
                <span className="eyebrow">Total</span>
                <span className="font-display text-2xl font-bold text-gold">{currency(total)}</span>
              </div>
              <div className="mt-7">
                <LuxButton
                  className="w-full"
                  disabled={lines.length === 0}
                  onClick={() => {
                    setPlaced(`MTB-${Math.random().toString(36).slice(2, 7).toUpperCase()}`);
                    clearCart();
                  }}
                >
                  Place order
                </LuxButton>
              </div>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}