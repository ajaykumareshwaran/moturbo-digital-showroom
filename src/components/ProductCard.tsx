import { Link } from "@tanstack/react-router";
import { Heart, Scale, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/context/StoreContext";
import { ProductOrb } from "@/components/ProductOrb";
import { TiltCard } from "@/components/lux";
import { currency, optimizeImageSrcSet, type Product } from "@/data/catalog";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist, toggleCompare, compare } = useStore();
  const wished = wishlist.includes(product.slug);
  const compared = compare.includes(product.slug);

  return (
    <TiltCard className="glass lux-border h-full overflow-hidden rounded-3xl">
      <div className="relative h-56 overflow-hidden rounded-t-3xl">
        {product.image ? (
          <img
            src={product.image}
            srcSet={optimizeImageSrcSet(product.image)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement?.querySelector("div[data-fallback]")?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div data-fallback className={cn("absolute inset-0 hidden", !product.image && "block")}>
          <ProductOrb hue={product.hue} />
        </div>
        {!product.image && <ProductOrb hue={product.hue} />}
        {product.badge && (
          <span className="absolute top-4 left-4 rounded-full bg-[image:var(--gradient-gold)] px-3 py-1 font-display text-[0.55rem] font-bold tracking-[0.2em] text-noir uppercase">
            {product.badge}
          </span>
        )}
        <div className="absolute top-3.5 right-3.5 flex flex-col gap-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <button
            aria-label="Wishlist"
            onClick={() => {
              toggleWishlist(product.slug);
              toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
            }}
            className={cn(
              "glass grid size-8 place-items-center rounded-full transition-colors",
              wished ? "text-gold" : "text-muted-foreground hover:text-gold-soft",
            )}
          >
            <Heart className={cn("size-3.5", wished && "fill-current")} />
          </button>
          <button
            aria-label="Compare"
            onClick={() => toggleCompare(product.slug)}
            className={cn(
              "glass grid size-8 place-items-center rounded-full transition-colors",
              compared ? "text-gold" : "text-muted-foreground hover:text-gold-soft",
            )}
          >
            <Scale className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between text-[0.6rem] tracking-[0.24em] text-muted-foreground uppercase">
          <span>{product.category}</span>
          <span className="flex items-center gap-1 text-gold">
            <Star className="size-3 fill-current" /> {product.rating}
          </span>
        </div>
        <Link
          to="/shop/$slug"
          params={{ slug: product.slug }}
          className="mt-3 block font-display text-lg leading-snug font-semibold transition-colors hover:text-gold-soft"
        >
          {product.name}
        </Link>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{product.tagline}</p>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-gold">{currency(product.price)}</span>
            {product.compareAt && (
              <span className="text-xs text-muted-foreground line-through">{currency(product.compareAt)}</span>
            )}
          </div>
          <button
            onClick={() => {
              addToCart(product.slug);
              toast.success(`${product.name} added`);
            }}
            className="sheen grid size-10 place-items-center rounded-full text-noir transition-transform duration-500 hover:scale-110"
            style={{ backgroundImage: "var(--gradient-gold)" }}
            aria-label="Add to cart"
          >
            <ShoppingBag className="size-4" />
          </button>
        </div>
      </div>
    </TiltCard>
  );
}