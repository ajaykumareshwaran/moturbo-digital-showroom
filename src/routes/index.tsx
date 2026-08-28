import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, lazy, Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Gem, GaugeCircle, Shield, Star, Wrench } from "lucide-react";
import { LuxLink, Magnetic, Reveal, SectionHeading, TiltCard } from "@/components/lux";
import { ProductCard } from "@/components/ProductCard";
import { ServiceCard } from "@/components/ServiceCard";
import { PRODUCTS, SERVICES, currency } from "@/data/catalog";
import { SocialSection } from "@/components/SocialSection";
import { ShowroomLoadingOverlay } from "@/components/three/ShowroomStage";

// Lazy-load the heavy 3D showroom component (1.2MB bundle)
const ShowroomStage = lazy(() => import("@/components/three/ShowroomStage").then(m => ({ default: m.ShowroomStage })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MOTURBO — Flagship Automotive Showroom" },
      {
        name: "description",
        content:
          "Walk through the MOTURBO flagship showroom: ceramic coating, PPF, wrapping, bespoke accessories and an immersive 3D detailing experience.",
      },
      { property: "og:title", content: "MOTURBO — Flagship Automotive Showroom" },
      {
        property: "og:description",
        content:
          "An immersive luxury automotive studio. Detailing, protection and craft, rendered in real time.",
      },
    ],
    links: [
      // Preload 3D assets only on the homepage — other pages don't need them.
      { rel: "preload", href: "/showroom-bg.jpg", as: "image" },
      { rel: "preload", href: "/models/car2.glb", as: "fetch", crossOrigin: "anonymous" },
      { rel: "preload", href: "/dikhololo_night_1k.hdr", as: "fetch", crossOrigin: "anonymous" },
    ],
  }),
  component: Index,
});

const CHAPTERS = [
  {
    eyebrow: "Chapter 01 — Arrival",
    title: "The flagship showroom",
    body: "Glass walls, a mirror-black floor and a single machine under the light. This is where every MOTURBO build begins.",
  },
  {
    eyebrow: "Chapter 02 — Approach",
    title: "Closer to the metal",
    body: "Nine hardness ceramic over a corrected clear coat. Depth you can fall into, measured in microns.",
  },
  {
    eyebrow: "Chapter 03 — Optics",
    title: "Headlights, restored",
    body: "Wet-sanded, refinished and UV-sealed until the beam pattern is factory-sharp again.",
  },
  {
    eyebrow: "Chapter 04 — Stance",
    title: "Wheels off, always",
    body: "Barrels coated, calipers refinished, hardware torqued to spec. No shortcuts behind the spokes.",
  },
  {
    eyebrow: "Chapter 05 — Cabin",
    title: "Interior workroom",
    body: "Steam extraction, nappa reconditioning and a scent blended in-house across forty iterations.",
  },
  {
    eyebrow: "Chapter 06 — Bays",
    title: "Thirteen disciplines",
    body: "From signature wash to full paint protection film, each bay runs its own protocol and its own lighting.",
  },
  {
    eyebrow: "Chapter 07 — Workroom Wall",
    title: "Accessories on display",
    body: "Every product we sell is used on the studio floor first. If it doesn't survive here, it doesn't ship.",
  },
  {
    eyebrow: "Chapter 08 — Reception",
    title: "Reserve your slot",
    body: "One branch, executive collection and a live progress feed for every vehicle in the studio.",
  },
];

function Index() {
  const stageRef = useRef<HTMLElement | null>(null);
  const featured = PRODUCTS.slice(0, 6);
  const [shouldLoadShowroom, setShouldLoadShowroom] = useState(false);

  useEffect(() => {
    const node = stageRef.current;
    if (!node || typeof window === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setShouldLoadShowroom(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ---------- Cinematic 3D showroom (lazy-loaded only when near the viewport) ---------- */}
      {shouldLoadShowroom ? (
        <Suspense
          fallback={
            <div className="pointer-events-none fixed inset-0 z-[30] overflow-hidden">
              <ShowroomLoadingOverlay />
            </div>
          }
        >
          <ShowroomStage sectionRef={stageRef} />
        </Suspense>
      ) : (
        <div className="pointer-events-none fixed inset-0 z-[30] overflow-hidden">
          <ShowroomLoadingOverlay />
        </div>
      )}

      <section ref={stageRef} className="relative">
        {/* Hero */}
        <div className="relative flex h-screen flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="font-display text-[0.72rem] font-bold tracking-[0.34em] text-gold uppercase sm:text-[0.78rem]">
              EST. 2026 · LUXURY AUTOMOTIVE STUDIO
            </div>
            <h1 className="mt-6 font-display text-[13vw] leading-[0.85] font-black tracking-[-0.05em] text-chrome drop-shadow-[0_12px_30px_rgba(255,255,255,0.18)] sm:text-[8rem]">
              MOTURBO
            </h1>
            <div
              className="relative mx-auto mt-6 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-[#e8c37a]/80 bg-[#101115] px-4 py-4 shadow-[0_0_0_1px_rgba(232,195,122,0.35),0_0_30px_rgba(232,195,122,0.18),0_25px_60px_rgba(0,0,0,0.55)] sm:px-6"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_55%)]" />
              <div className="absolute inset-0 opacity-100" style={{ boxShadow: "inset 0 0 0 1px rgba(232,195,122,0.4), inset 0 0 18px rgba(232,195,122,0.12)" }} />
              <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: Shield,
                    title: "PREMIUM PROTECTION",
                    copy: "Advanced ceramic coatings for lasting brilliance.",
                  },
                  {
                    icon: Wrench,
                    title: "CUSTOMIZATION",
                    copy: "Personalized upgrades that define your style.",
                  },
                  {
                    icon: GaugeCircle,
                    title: "PERFORMANCE",
                    copy: "High performance parts built for enthusiasts.",
                  },
                  {
                    icon: Gem,
                    title: "LUXURY EXPERIENCE",
                    copy: "Crafted to deliver unmatched quality and service.",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className={`rounded-2xl border border-white/8 bg-[#16181d] px-4 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:border-[#e8c37a]/60 hover:bg-[#1a1d23] ${
                        i > 0 ? "border-t border-white/10 sm:border-t-0 lg:border-l" : ""
                      } ${i > 0 ? "lg:border-white/10" : ""}`}
                    >
                      <Icon className="size-5 text-gold drop-shadow-[0_0_12px_rgba(232,195,122,0.8)]" />
                      <div className="mt-3 font-display text-[0.58rem] font-black tracking-[0.18em] text-silver uppercase">
                        {item.title}
                      </div>
                      <p className="mt-2 text-[0.72rem] font-medium leading-relaxed text-white/80">
                        {item.copy}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <LuxLink to="/book">
                  Book Appointment <ArrowRight className="size-3.5" />
                </LuxLink>
              </Magnetic>
              <Magnetic>
                <LuxLink to="/shop">
                  EXPLORE SHOP <ArrowRight className="size-3.5" />
                </LuxLink>
              </Magnetic>
              <Magnetic>
                <LuxLink to="/locations">
                  GET DIRECTIONS <ArrowRight className="size-3.5" />
                </LuxLink>
              </Magnetic>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-10 hidden sm:flex flex-col items-center gap-2 text-muted-foreground"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          >
            <span className="font-display text-[0.58rem] tracking-[0.4em] uppercase">Walk in</span>
            <ChevronDown className="size-4" />
          </motion.div>
        </div>

        {/* Scroll chapters — camera moves through the showroom */}
        {CHAPTERS.map((c, i) => (
          <div
            key={c.title}
            className={`relative flex px-6 ${
              i === CHAPTERS.length - 1
                ? "flex-col gap-8 pt-24 pb-14 sm:flex-row sm:h-screen sm:items-center sm:justify-end sm:pr-14 sm:pt-0 sm:pb-0 sm:gap-0"
                : `h-screen items-center ${i % 2 === 0 ? "justify-start" : "justify-end"}`
            }`}
          >
            {/* Chapter 08: brand banner — absolute on desktop, stacked second on mobile */}
            {i === CHAPTERS.length - 1 && (
              <Reveal
                className="w-full order-2 sm:order-none sm:absolute sm:left-6 sm:top-1/2 sm:w-[50%] sm:-translate-y-1/2"
                y={30}
                delay={0.1}
              >
                <div className="glass-strong lux-border rounded-3xl p-8 sm:p-10 flex flex-col gap-7">
                  {/* Logo mark */}
                  <div className="flex items-center gap-4">
                    <img src="/moturbo_lg.png" alt="MOTURBO" className="h-14 w-14 object-contain" style={{ mixBlendMode: "screen" }} />
                    <div>
                      <div className="font-display text-sm font-black tracking-[0.32em] text-chrome">MOTURBO</div>
                      <div className="font-display text-[0.62rem] tracking-[0.22em] text-gold uppercase">Precision · Passion · Performance</div>
                    </div>
                  </div>

                  <div className="hairline w-full" />

                  {/* Services pills */}
                  <div>
                    <div className="eyebrow mb-3">What we do</div>
                    <div className="flex flex-wrap gap-2">
                      {["Ceramic Coating", "Paint Correction", "PPF", "Wrapping", "Window Tinting", "Wheel Refinishing", "Interior Detailing", "Accessories"].map((tag) => (
                        <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-display text-[0.62rem] tracking-[0.14em] text-silver uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="hairline w-full" />

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[["1000+", "Vehicles"], ["13", "Disciplines"], ["1", "Branch Currently"]].map(([val, label]) => (
                      <div key={label}>
                        <div className="font-display text-2xl font-bold text-gold">{val}</div>
                        <div className="mt-1 font-display text-[0.58rem] tracking-[0.18em] text-muted-foreground uppercase">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
            <Reveal className="glass-strong lux-border relative z-10 w-full max-w-md rounded-3xl p-8 order-1 sm:order-none" y={40}>
              <div className="eyebrow">{c.eyebrow}</div>
              <h2 className="mt-4 text-3xl leading-tight font-semibold">{c.title}</h2>
              <p className="mt-4 text-sm font-semibold leading-relaxed text-foreground">{c.body}</p>
              <div className="hairline mt-6 w-24" />
              {i === CHAPTERS.length - 1 && (
                <div className="mt-6">
                  <LuxLink to="/book">
                    Book Appointment <ArrowRight className="size-3.5" />
                  </LuxLink>
                </div>
              )}
            </Reveal>
          </div>
        ))}
      </section>

      {/* ---------- Marquee ---------- */}
      <div className="relative overflow-hidden border-y border-white/8 bg-white py-5">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-10">
              {[
                "Ceramic Coating",
                "Paint Protection Film",
                "Wrapping",
                "Window Tinting",
                "Paint Correction",
                "Bespoke Accessories",
              ].map((t) => (
                <span
                  key={t}
                  className="font-display text-sm tracking-[0.3em] text-neutral-800 uppercase"
                >
                  {t} <span className="text-amber-500">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Services ---------- */}
      <section className="relative mx-auto max-w-7xl px-6 py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Detailing Bays"
            title={
              <>
                Thirteen disciplines,
                <br /> one standard
              </>
            }
            sub="Each service runs its own protocol, its own lighting and its own quality gate before a vehicle leaves the studio."
          />
          <Reveal delay={0.15}>
            <LuxLink to="/services" variant="ghost">
              All Services <ArrowRight className="size-3.5" />
            </LuxLink>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 6).map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.06}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Featured products ---------- */}
      <section className="relative border-y border-white/8 py-28">
        <div className="absolute inset-0 spotlight" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Workroom Collection"
            title="Products on luxury display stands"
            sub="Move your cursor across each piece — lighting, reflections and depth respond in real time."
            align="center"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Magnetic>
              <LuxLink to="/shop">Enter the Shop</LuxLink>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* ---------- Numbers ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["1000+", "Vehicles finished"],
            ["13", "Studio disciplines"],
            ["4.9/5", "Client rating"],
            ["1", "Flagship branch currently"],
          ].map(([v, l], i) => (
            <Reveal key={l} delay={i * 0.07}>
              <TiltCard className="glass lux-border h-full rounded-3xl p-8 text-center">
                <div className="font-display text-4xl font-bold text-gold">{v}</div>
                <div className="mt-2 text-[0.7rem] tracking-[0.28em] text-muted-foreground uppercase">
                  {l}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <SectionHeading
          eyebrow="Client Voices"
          title="Trusted with the rarest keys in the city"
          align="center"
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {[
            [
              "The ceramic work on my GT3 is the best I've seen anywhere in Bangalore.",
              "Aravind R.",
              "Porsche 911 GT3",
            ],
            [
              "They wrapped a hypercar in satin without a single relief cut. Surgical.",
              "Jeevan",
              "Lamborghini",
            ],
            [
              "Dope collection, live progress photos, flawless finish. Effortless.",
              "Vishnu Raj",
              "Range Rover SV",
            ],
          ].map(([quote, name, car], i) => (
            <Reveal key={name} delay={i * 0.08}>
              <TiltCard className="glass lux-border h-full rounded-3xl p-8">
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-foreground/90">“{quote}”</p>
                <div className="mt-6 font-display text-xs tracking-[0.2em] uppercase">{name}</div>
                <div className="text-xs text-muted-foreground">{car}</div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Social — Stay in the Loop ---------- */}
      <SocialSection />

      {/* ---------- Booking CTA ---------- */}
      <section className="relative mx-auto max-w-7xl px-6 pb-32">
        <Reveal>
          <div className="glass-strong lux-border relative overflow-hidden rounded-[2rem] px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute -top-28 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full bg-purple-royal/25 blur-[110px]" />
            <div className="relative">
              <div className="eyebrow">Reservations</div>
              <h2 className="mx-auto mt-5 max-w-2xl text-4xl leading-tight font-semibold text-balance sm:text-5xl">
                Reserve an area in our <span className="text-gold">Moturbo Showroom</span>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-sm text-muted-foreground">
                Choose your vehicle, service and package. Executive collection available across
                bangalore from {currency(60)}.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Magnetic>
                  <LuxLink to="/book">Book Appointment</LuxLink>
                </Magnetic>
                <Magnetic>
                  <a
                    href="tel:+918123909685"
                    className="sheen inline-flex items-center justify-center gap-2 rounded-full border border-[#f0d28b] bg-transparent px-7 py-3.5 font-display text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#f6ecd2] shadow-[0_0_18px_rgba(232,195,122,0.18)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_0_34px_rgba(232,195,122,0.28)]"
                    style={{ backgroundImage: "var(--gradient-royal)" }}
                    aria-label="Call MOTURBO executive"
                  >
                    Talk to executive
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
