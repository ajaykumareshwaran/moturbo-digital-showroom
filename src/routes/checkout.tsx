import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Building2, Truck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { LuxButton, LuxLink } from "@/components/lux";
import { useStore } from "@/context/StoreContext";
import { currency } from "@/data/catalog";
import { placeOrder } from "@/lib/commerce";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | MOTURBO" },
      { name: "description", content: "Secure checkout for the MOTURBO workroom collection with executive delivery." },
      { property: "og:title", content: "Checkout | MOTURBO" },
      { property: "og:description", content: "Choose pay at studio or pay on delivery." },
    ],
  }),
  component: CheckoutPage,
});

const METHODS = [
  { id: "pay_at_studio", label: "Pay at studio", icon: Building2 },
  { id: "pay_on_delivery", label: "Pay on delivery", icon: Truck },
];

function CheckoutPage() {
  const { lines, total, clearCart } = useStore();
  const [method, setMethod] = useState<"pay_at_studio" | "pay_on_delivery">("pay_at_studio");
  const [placed, setPlaced] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  async function submitOrder() {
    if (lines.length === 0) {
      toast.error("Your bag is empty");
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      toast.error("Please complete all checkout details");
      return;
    }

    setIsPlacing(true);

    try {
      const result = await placeOrder({
        data: {
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          city,
          address,
          paymentMethod: method,
          lines: lines.map(({ product, qty }) => ({
            slug: product.slug,
            name: product.name,
            price: product.price,
            qty,
          })),
        },
      });

      setPlaced(result.orderCode);
      clearCart();
      toast.success("Order confirmed");
    } catch (error) {
      console.error(error);
      toast.error("Could not place order. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  }

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
            <p className="mt-4 text-xs text-muted-foreground">An executive will call to arrange delivery.</p>
            <div className="mt-8 flex justify-center">
              <LuxLink to="/shop" variant="ghost">Continue browsing</LuxLink>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="glass lux-border space-y-6 rounded-3xl p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="input-lux" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input-lux" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="input-lux" />
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="input-lux" />
              </div>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery address" className="input-lux" />

              <div className="hairline" />
              <div className="eyebrow">Payment</div>
              <div className="grid gap-3 sm:grid-cols-2">
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
                  disabled={lines.length === 0 || isPlacing}
                  onClick={submitOrder}
                >
                  {isPlacing ? "Placing order..." : "Place order"}
                </LuxButton>
              </div>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}