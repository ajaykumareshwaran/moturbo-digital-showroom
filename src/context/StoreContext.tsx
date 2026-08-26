import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/data/catalog";

export type CartLine = { slug: string; qty: number };
export type Booking = {
  id: string;
  service: string;
  package: string;
  date: string;
  time: string;
  branch: string;
  vehicle: string;
  total: number;
  status: "Confirmed" | "In studio" | "Completed";
};

type StoreValue = {
  cart: CartLine[];
  wishlist: string[];
  compare: string[];
  recent: string[];
  bookings: Booking[];
  miniCartOpen: boolean;
  setMiniCartOpen: (v: boolean) => void;
  addToCart: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  markViewed: (slug: string) => void;
  addBooking: (b: Omit<Booking, "id" | "status"> & Partial<Pick<Booking, "id" | "status">>) => Booking;
  coupon: string | null;
  applyCoupon: (code: string) => boolean;
  subtotal: number;
  discount: number;
  total: number;
  count: number;
  lines: { product: Product; qty: number }[];
};

const StoreContext = createContext<StoreValue | null>(null);
const KEY = "moturbo.store.v1";
const COUPONS: Record<string, number> = { MOTURBO10: 0.1, GOLD20: 0.2, WORKROOM15: 0.15 };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setCart(s.cart ?? []);
        setWishlist(s.wishlist ?? []);
        setCompare(s.compare ?? []);
        setRecent(s.recent ?? []);
        setBookings(s.bookings ?? []);
        setCoupon(s.coupon ?? null);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify({ cart, wishlist, compare, recent, bookings, coupon }));
  }, [cart, wishlist, compare, recent, bookings, coupon, hydrated]);

  const addToCart = useCallback((slug: string, qty = 1) => {
    setCart((c) => {
      const found = c.find((l) => l.slug === slug);
      if (found) return c.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l));
      return [...c, { slug, qty }];
    });
    setMiniCartOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setCart((c) => (qty <= 0 ? c.filter((l) => l.slug !== slug) : c.map((l) => (l.slug === slug ? { ...l, qty } : l))));
  }, []);

  const removeFromCart = useCallback((slug: string) => setCart((c) => c.filter((l) => l.slug !== slug)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (slug: string) => setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug])),
    [],
  );
  const toggleCompare = useCallback(
    (slug: string) =>
      setCompare((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : w.length >= 3 ? w : [...w, slug])),
    [],
  );
  const markViewed = useCallback(
    (slug: string) => setRecent((r) => [slug, ...r.filter((s) => s !== slug)].slice(0, 8)),
    [],
  );

  const addBooking = useCallback((b: Omit<Booking, "id" | "status"> & Partial<Pick<Booking, "id" | "status">>) => {
    const booking: Booking = {
      ...b,
      id: b.id ?? `MT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      status: b.status ?? "Confirmed",
    };
    setBookings((prev) => [booking, ...prev]);
    return booking;
  }, []);

  const applyCoupon = useCallback((code: string) => {
    const key = code.trim().toUpperCase();
    if (COUPONS[key]) {
      setCoupon(key);
      return true;
    }
    return false;
  }, []);

  const lines = useMemo(
    () =>
      cart
        .map((l) => ({ product: PRODUCTS.find((p) => p.slug === l.slug)!, qty: l.qty }))
        .filter((l) => Boolean(l.product)),
    [cart],
  );
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.product.price * l.qty, 0), [lines]);
  const discount = useMemo(
    () => (coupon && COUPONS[coupon] ? Math.round(subtotal * COUPONS[coupon]) : 0),
    [coupon, subtotal],
  );
  const count = useMemo(() => cart.reduce((s, l) => s + l.qty, 0), [cart]);

  const value: StoreValue = {
    cart,
    wishlist,
    compare,
    recent,
    bookings,
    miniCartOpen,
    setMiniCartOpen,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    toggleCompare,
    markViewed,
    addBooking,
    coupon,
    applyCoupon,
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
    count,
    lines,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}