import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Reveal, TiltCard } from "@/components/lux";
import { ArrowUpRight, X } from "lucide-react";

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

const FALLBACK_POST_IMAGE =
  "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80";

const POSTS = [
  {
    title: "Why graphene changed our coating bay",
    tag: "Coatings",
    read: "6 min",
    image:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Graphene top coats changed how we measure slickness and durability across Bangalore’s heat cycles.",
    notes: [
      "We moved to graphene-derived sealants to reduce heat retention and keep gloss more stable under intense UV exposure.",
      "The real win was in the water behaviour: less drag, faster drying and a cleaner finish after monsoon mud and dust.",
      "For clients who drive daily, the coat now performs more consistently across the full paint stack.",
    ],
  },
  {
    title: "Paint depth mapping, explained",
    tag: "Craft",
    read: "4 min",
    image:
      "https://images.unsplash.com/photo-1585759296443-c5f1f3c0c2bb?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "The right correction plan begins with the paint itself, not just the polishing pads we reach for.",
    notes: [
      "Every MOTURBO correction starts with a paint-depth check so we know where the clear coat is still healthy and where it is thinning.",
      "This lets our techs remove defects without overcutting and keeps the finish looking factory-correct rather than artificially glossy.",
      "The result: better clarity, safer correction, and a more durable long-term coating system.",
    ],
  },
  {
    title: "Self-healing film in real climates",
    tag: "Protection",
    read: "7 min",
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "PPF works best when the film, surface prep and installation environment all respect one another.",
    notes: [
      "The visible difference between a well-laid film and a rushed install is not just aesthetics; it is how the finish handles heat, stone chips and daily grime.",
      "In warmer climates, we pay more attention to panel temperature and edge wrap quality so the film stays invisible and resilient.",
      "That is why our front-end PPF packages are still designed around the real use case, not just a showcase panel.",
    ],
  },
  {
    title: "The two-bucket ritual, refined",
    tag: "Care",
    read: "3 min",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "The bucket routine sounds simple, but the sequence determines whether the finish stays clean or turns into micro-marring.",
    notes: [
      "The first bucket removes the grit. The second bucket is for controlled contact and finish-safe rinsing.",
      "At MOTURBO, this is not a marketing step; it is how we protect the top layer of paint across weekly maintenance visits.",
      "Clean tools, clean water and a deliberate flow is what keeps a detail looking crisp long after the wash ends.",
    ],
  },
  {
    title: "Satin wraps: living with the finish",
    tag: "Wrapping",
    read: "5 min",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "A satin finish is not just a colour choice; it is a daily maintenance philosophy and a design signature.",
    notes: [
      "We tune low-sheen wraps to the vehicle’s geometry so the body lines still read clearly without an overly reflective surface.",
      "The real challenge is balancing appearance with washability, especially on trims, edges and blacked-out trims.",
      "A good wrap should feel intentional, not just visual. That is the MOTURBO standard.",
    ],
  },
  {
    title: "Interior leather without the shine",
    tag: "Interior",
    read: "4 min",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "A refined cabin should feel tactile, not greasy. That is why we treat leather with restraint and precision.",
    notes: [
      "The goal is to restore suppleness without hiding the natural grain or overloading the finish with silicone-heavy products.",
      "We use controlled feed products, then buff to a dry, matte finish so the leather feels premium every time the hand touches it.",
      "For clients who spend long hours in the drivers seat, this is the detail that makes the cabin feel properly finished.",
    ],
  },
] as const;

function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<(typeof POSTS)[number] | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title={
          <>
            Notes from the <span className="text-gold">bays</span>
          </>
        }
        sub="Chemistry, technique and the small decisions that separate good from immaculate."
      />
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post, i) => (
            <Reveal key={post.title} delay={(i % 3) * 0.07}>
              <TiltCard className="glass lux-border h-full overflow-hidden rounded-3xl">
                <button type="button" onClick={() => setSelectedPost(post)} className="block h-full w-full text-left">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_POST_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  </div>
                  <div className="p-7">
                    <div className="flex items-center justify-between text-[0.55rem] tracking-[0.22em] uppercase">
                      <span className="text-gold">{post.tag}</span>
                      <span className="text-muted-foreground">{post.read} read</span>
                    </div>
                    <h3 className="mt-4 font-display text-lg leading-snug font-semibold text-white">{post.title}</h3>
                    <div className="mt-6 inline-flex items-center gap-2 font-display text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase transition-colors group-hover:text-gold">
                      Read note <ArrowUpRight className="size-3.5" />
                    </div>
                  </div>
                </button>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="glass lux-border relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10">
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border border-white/10 bg-black/30 text-white transition-colors hover:text-gold-soft"
              aria-label="Close note"
            >
              <X className="size-4" />
            </button>

            <div className="h-56 w-full overflow-hidden">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_POST_IMAGE;
                }}
              />
            </div>

            <div className="space-y-6 p-7 sm:p-8">
              <div className="flex items-center justify-between gap-4 text-[0.55rem] tracking-[0.22em] uppercase">
                <span className="text-gold">{selectedPost.tag}</span>
                <span className="text-muted-foreground">{selectedPost.read}</span>
              </div>

              <h3 className="font-display text-3xl leading-tight font-semibold text-white">{selectedPost.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{selectedPost.excerpt}</p>

              <div className="space-y-4">
                {selectedPost.notes.map((note) => (
                  <div key={note} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-sm leading-relaxed text-foreground/90">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}