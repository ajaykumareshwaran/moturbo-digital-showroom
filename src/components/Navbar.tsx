import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Menu, ShoppingBag, Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/StoreContext";
import { LuxLink, Magnetic } from "@/components/lux";
import { MoturboLogo } from "@/components/MoturboLogo";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Showroom" },
  { to: "/services", label: "Services" },
  { to: "/shop", label: "Shop" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "Studio" },
  { to: "/blog", label: "Journal" },
  { to: "/contact", label: "Contact" },
  { to: "/locations", label: "Location" },
] as const;

export function Navbar() {
  const { count, wishlist, setMiniCartOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scrollRafRef = useRef<number | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      if (scrollRafRef.current) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null;
        const shouldBeScrolled = window.scrollY > 40;
        if (shouldBeScrolled !== lastScrollY > 40) {
          lastScrollY = window.scrollY;
          setScrolled(shouldBeScrolled);
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      window.removeEventListener("scroll", onScroll);
    };
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
            "glass-strong pointer-events-auto flex w-full max-w-[78rem] items-center gap-3 rounded-full py-3 pr-2.5 pl-4 transition-all duration-700 sm:py-2.5 sm:pl-5",
            scrolled ? "shadow-[var(--shadow-lift)] backdrop-blur-3xl" : "",
          )}
        >
          <Link to="/" className="mr-auto flex items-center gap-2.5">
            <div className="size-8 sm:size-10">
              <MoturboLogo />
            </div>
            <span className="font-display text-[0.7rem] font-extrabold tracking-[0.26em] text-chrome sm:text-sm sm:tracking-[0.34em]">
              MOTURBO
            </span>
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

          <div className="ml-auto flex max-w-full items-center gap-0.5 sm:gap-1.5 lg:ml-0">
            <Link
              to="/wishlist"
              className="relative grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-gold-soft sm:size-9"
              aria-label="Wishlist"
            >
              <Heart className="size-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 size-1.5 rounded-full bg-gold" />
              )}
            </Link>
            <button
              onClick={() => setMiniCartOpen(true)}
              className="relative grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-gold-soft sm:size-9"
              aria-label="Cart"
            >
              <ShoppingBag className="size-4" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-[image:var(--gradient-gold)] font-display text-[0.55rem] font-bold text-noir">
                  {count}
                </span>
              )}
            </button>
            <div className="block shrink-0">
              <Magnetic>
                <LuxLink to="/book" className="px-2.5 py-2 text-[0.48rem] whitespace-nowrap sm:px-4 sm:py-2.5 sm:text-[0.58rem]">
                  Book Now
                </LuxLink>
              </Magnetic>
            </div>
            <button
              onClick={() => setOpen((o) => !o)}
              className="-ml-0.5 grid size-8 shrink-0 place-items-center rounded-full text-foreground lg:hidden sm:size-9 sm:ml-0"
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
                  <Link
                    to={l.to}
                    className="block border-b border-white/5 py-4 font-display text-2xl font-semibold"
                  >
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
