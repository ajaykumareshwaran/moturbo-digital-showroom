import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/StoreContext";
import { LuxLink, Magnetic } from "@/components/lux";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Showroom" },
  { to: "/services", label: "Services" },
  { to: "/shop", label: "Shop" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "Studio" },
  { to: "/journal", label: "Journal" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { count, wishlist, setMiniCartOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[90] flex justify-center px-4 pt-4 sm:pt-6">
        <motion.nav
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "glass-strong pointer-events-auto flex w-full max-w-6xl items-center gap-3 rounded-full py-2.5 pr-2.5 pl-5 transition-all duration-700",
            scrolled ? "shadow-[var(--shadow-lift)] backdrop-blur-3xl" : "",
          )}
        >
          <Link to="/" className="mr-auto flex items-center gap-2.5">
            <span className="relative grid size-8 place-items-center rounded-lg" style={{ backgroundImage: "var(--gradient-royal)" }}>
              <span className="font-display text-[0.7rem] font-black text-gold-soft">M</span>
            </span>
            <span className="font-display text-sm font-extrabold tracking-[0.34em] text-chrome">MOTURBO</span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="group relative rounded-full px-3.5 py-2 font-display text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground data-[status=active]:text-foreground"
              >
                {l.label}
                <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-[image:var(--gradient-gold)] transition-transform duration-500 group-hover:scale-x-100 group-data-[status=active]:scale-x-100" />
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            <Link
              to="/wishlist"
              className="relative grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:text-gold-soft"
              aria-label="Wishlist"
            >
              <Heart className="size-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 size-1.5 rounded-full bg-gold" />
              )}
            </Link>
            <button
              onClick={() => setMiniCartOpen(true)}
              className="relative grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:text-gold-soft"
              aria-label="Cart"
            >
              <ShoppingBag className="size-4" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-[image:var(--gradient-gold)] font-display text-[0.55rem] font-bold text-noir">
                  {count}
                </span>
              )}
            </button>
            <div className="hidden sm:block">
              <Magnetic>
                <LuxLink to="/book" className="px-5 py-2.5 text-[0.62rem]">
                  Book Now
                </LuxLink>
              </Magnetic>
            </div>
            <button
              onClick={() => setOpen((o) => !o)}
              className="grid size-9 place-items-center rounded-full text-foreground lg:hidden"
              aria-label="Menu"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] bg-noir/92 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-full flex-col justify-center gap-1 px-8">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={l.to} className="block border-b border-white/5 py-4 font-display text-2xl font-semibold">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <LuxLink to="/book" className="mt-8 self-start">
                Book Appointment
              </LuxLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}