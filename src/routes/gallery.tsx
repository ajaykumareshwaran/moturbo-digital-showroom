import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/lux";
import { cn } from "@/lib/utils";
import { optimizeImageSrcSet } from "@/data/catalog";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Finished Work | MOTURBO" },
      { name: "description", content: "Before and after work from the MOTURBO bays: ceramic, PPF, wraps and interiors." },
      { property: "og:title", content: "Gallery — Finished Work | MOTURBO" },
      { property: "og:description", content: "Cinematic captures from the studio floor." },
    ],
  }),
  component: GalleryPage,
});

const FILTERS = ["All", "Ceramic", "PPF", "Wrap", "Interior"];
const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1489829545089-7832959374f5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
];

const ITEMS = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  tag: FILTERS[1 + (i % 4)]!,
  title: ["Midnight 911", "Chrome Delete G63", "Satin Gold RS6", "Cabin Restoration"][i % 4]!,
  hue: [286, 44, 262, 210][i % 4]!,
  image: GALLERY_IMAGES[i],
  span: i % 5 === 0 ? "lg:col-span-2 lg:row-span-2" : "",
}));

function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const list = ITEMS.filter((i) => filter === "All" || i.tag === filter);
  const active = ITEMS.find((i) => i.id === open);

  return (
    <>
      <style>{`
        @keyframes silverShine {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <PageHeader
        eyebrow="Portfolio"
        title={<>Finished <span className="text-gold">work</span></>}
        sub="Captured under studio lighting, untouched by filters."
      />

      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div
          className="mx-auto mb-10 flex w-full max-w-3xl flex-wrap justify-center gap-2 rounded-[2rem] border border-[#d9d3f2]/60 bg-[#120d1a]/90 p-2 shadow-[0_0_0_1px_rgba(231,227,255,0.06),0_18px_45px_rgba(166,120,255,0.12)]"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.12) 20%, rgba(191,199,216,0.85) 35%, rgba(255,255,255,0.2) 52%, rgba(191,199,216,0.8) 68%, rgba(255,255,255,0.05) 100%)",
            backgroundSize: "220% 100%",
            animation: "silverShine 5s linear infinite",
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-5 py-2.5 font-display text-[0.6rem] font-black tracking-[0.2em] uppercase transition-all duration-300",
                filter === f
                  ? "border-[#d7d1ee]/80 bg-[#0c0912]/90 text-[#f5f1ff] shadow-[0_0_18px_rgba(255,255,255,0.18)]"
                  : "border-white/10 bg-black/10 text-white/80 hover:border-white/20 hover:text-white",
              )}
              style={
                filter === f
                  ? {
                      textShadow: "0 0 18px rgba(255,255,255,0.4)",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 18px rgba(210,216,255,0.15)",
                    }
                  : undefined
              }
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((item, i) => (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setOpen(item.id)}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-white/10 transition-all duration-300",
                  item.span,
                  open === item.id && "border-[#5f8cff] shadow-[0_0_0_2px_rgba(95,140,255,0.28)]",
                )}
              >
                <img
                  src={item.image}
                  srcSet={optimizeImageSrcSet(item.image)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10,10,15,0.14) 0%, rgba(10,10,15,0.64) 100%)",
                  }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_32%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                  <div className="text-[0.55rem] font-black tracking-[0.24em] text-gold uppercase">{item.tag}</div>
                  <div className="mt-1.5 font-display text-sm font-extrabold text-white">{item.title}</div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] grid place-items-center bg-noir/85 p-6 backdrop-blur-xl"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass lux-border relative aspect-video w-full max-w-4xl overflow-hidden rounded-[2rem]"
            >
              <img
                src={active.image}
                srcSet={optimizeImageSrcSet(active.image)}
                sizes="100vw"
                alt={active.title}
                loading="eager"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir to-transparent p-8">
                <div className="text-[0.55rem] tracking-[0.24em] text-gold uppercase">{active.tag}</div>
                <h3 className="mt-2 font-display text-2xl font-semibold text-white">{active.title}</h3>
              </div>
              <button
                onClick={() => setOpen(null)}
                className="glass absolute top-5 right-5 grid size-10 place-items-center rounded-full"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}