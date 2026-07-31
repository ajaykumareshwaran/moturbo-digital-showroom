import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Reveal, TiltCard } from "@/components/lux";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — Detailing Craft Notes | MOTURBO" },
      { name: "description", content: "Field notes from the MOTURBO bays: coatings chemistry, film science and care rituals." },
      { property: "og:title", content: "Journal — Detailing Craft Notes | MOTURBO" },
      { property: "og:description", content: "Written by the people holding the polisher." },
    ],
  }),
  component: BlogPage,
});

const POSTS = [
  ["Why graphene changed our coating bay", "Coatings", "6 min", 286],
  ["Paint depth mapping, explained", "Craft", "4 min", 44],
  ["Self-healing film in real climates", "Protection", "7 min", 262],
  ["The two-bucket ritual, refined", "Care", "3 min", 210],
  ["Satin wraps: living with the finish", "Wrapping", "5 min", 300],
  ["Interior leather without the shine", "Interior", "4 min", 60],
] as const;

function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title={<>Notes from the <span className="text-gold">bays</span></>}
        sub="Chemistry, technique and the small decisions that separate good from immaculate."
      />
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map(([title, tag, read, hue], i) => (
            <Reveal key={title} delay={(i % 3) * 0.07}>
              <TiltCard className="glass lux-border h-full overflow-hidden rounded-3xl">
                <div
                  className="h-40"
                  style={{
                    background: `radial-gradient(110% 90% at 30% 20%, oklch(0.40 0.15 ${hue}) 0%, oklch(0.14 0.03 280) 70%)`,
                  }}
                />
                <div className="p-7">
                  <div className="flex items-center justify-between text-[0.55rem] tracking-[0.22em] uppercase">
                    <span className="text-gold">{tag}</span>
                    <span className="text-muted-foreground">{read} read</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg leading-snug font-semibold">{title}</h3>
                  <div className="mt-6 inline-flex items-center gap-2 font-display text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase transition-colors group-hover:text-gold">
                    Read note <ArrowUpRight className="size-3.5" />
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}