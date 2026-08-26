import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { currency } from "@/data/catalog";
import { LuxLink } from "@/components/lux";
import { ProductOrb } from "@/components/ProductOrb";

export function MiniCart() {
  const { miniCartOpen, setMiniCartOpen, lines, setQty, removeFromCart, subtotal } = useStore();
  return (
    <AnimatePresence>
      {miniCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMiniCartOpen(false)}
            className="fixed inset-0 z-[95] bg-noir/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong fixed top-0 right-0 z-[96] flex h-full w-full max-w-md flex-col rounded-l-3xl"
          >
            <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
              <div>
                <div className="eyebrow">Your selection</div>
                <h3 className="mt-1 font-display text-lg font-semibold">Mini Cart</h3>
              </div>
              <button onClick={() => setMiniCartOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
              {lines.length === 0 && (
                <p className="pt-16 text-center text-sm text-muted-foreground">
                  The display stand is empty. Browse the shop collection.
                </p>
              )}
              {lines.map(({ product, qty }) => (
                <div key={product.slug} className="glass flex items-center gap-4 rounded-2xl p-3">
                  <div className="size-16 shrink-0 overflow-hidden rounded-xl">
                    <ProductOrb hue={product.hue} compact />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/shop/$slug"
                      params={{ slug: product.slug }}
                      onClick={() => setMiniCartOpen(false)}
                      className="line-clamp-1 font-display text-sm font-semibold hover:text-gold-soft"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-1 text-xs text-muted-foreground">{currency(product.price)}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => setQty(product.slug, qty - 1)} className="grid size-6 place-items-center rounded-full border border-white/10 hover:border-gold/50">
                        <Minus className="size-3" />
                      </button>
                      <span className="w-5 text-center font-display text-xs">{qty}</span>
                      <button onClick={() => setQty(product.slug, qty + 1)} className="grid size-6 place-items-center rounded-full border border-white/10 hover:border-gold/50">
                        <Plus className="size-3" />
                      </button>
                      <button onClick={() => removeFromCart(product.slug)} className="ml-auto text-muted-foreground hover:text-destructive">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/8 px-6 py-5">
              <div className="flex items-center justify-between font-display text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-gold">{currency(subtotal)}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <LuxLink to="/cart" variant="ghost" className="flex-1" onClick={() => setMiniCartOpen(false)}>
                  View Cart
                </LuxLink>
                <LuxLink to="/checkout" className="flex-1" onClick={() => setMiniCartOpen(false)}>
                  Checkout
                </LuxLink>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}