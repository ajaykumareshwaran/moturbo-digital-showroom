import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/lux";
import { cn } from "@/lib/utils";

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
const ITEMS = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  tag: FILTERS[1 + (i % 4)]!,
  title: ["Midnight 911", "Chrome Delete G63", "Satin Gold RS6", "Cabin Restoration"][i % 4]!,
  hue: [286, 44, 262, 210][i % 4]!,
  span: i % 5 === 0 ? "lg:col-span-2 lg:row-span-2" : "",
}));

function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const list = ITEMS.filter((i) => filter === "All" || i.tag === filter);
  const active = ITEMS.find((i) => i.id === open);

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title={<>Finished <span className="text-gold">work</span></>}
        sub="Captured under studio lighting, untouched by filters."
      />

      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-5 py-2.5 font-display text-[0.6rem] tracking-[0.2em] uppercase transition-all",
                filter === f ? "border-gold/50 text-gold" : "border-white/10 text-muted-foreground hover:border-white/25",
              )}
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
                className={cn("group relative overflow-hidden rounded-3xl lux-border", item.span)}
              >
                <div
                  className="absolute inset-0 transition-transform duration-[1.2s] group-hover:scale-110"
                  style={{
                    background: `radial-gradient(120% 90% at 30% 20%, oklch(0.42 0.16 ${item.hue}) 0%, oklch(0.16 0.04 280) 55%, oklch(0.08 0.01 280) 100%)`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/85 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                  <div className="text-[0.55rem] tracking-[0.24em] text-gold uppercase">{item.tag}</div>
                  <div className="mt-1.5 font-display text-sm font-semibold">{item.title}</div>
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
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(120% 90% at 30% 20%, oklch(0.45 0.17 ${active.hue}) 0%, oklch(0.16 0.04 280) 55%, oklch(0.08 0.01 280) 100%)`,
                }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir to-transparent p-8">
                <div className="text-[0.55rem] tracking-[0.24em] text-gold uppercase">{active.tag}</div>
                <h3 className="mt-2 font-display text-2xl font-semibold">{active.title}</h3>
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