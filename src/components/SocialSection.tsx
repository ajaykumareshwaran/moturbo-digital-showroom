import { ArrowRight } from "lucide-react";
import { Reveal, TiltCard } from "@/components/lux";
import { SOCIAL_LINKS, WhatsAppSVG, InstagramSVG, FacebookSVG } from "@/components/SocialFloating";

const CARDS = [
  {
    id: "instagram",
    platform: "Instagram",
    handle: "@moturbo",
    tagline: "Behind-the-build reels, paint corrections in progress and the rarest finishes on the floor.",
    cta: "Follow",
    href: SOCIAL_LINKS.instagram,
    Icon: InstagramSVG,
    glowColor: "oklch(0.68 0.2 300 / 35%)",
    accentColor: "oklch(0.78 0.15 300)",
    borderGlow: "oklch(0.55 0.21 298 / 55%)",
  },
  {
    id: "facebook",
    platform: "Facebook",
    handle: "MOTURBO Studio",
    tagline: "Studio news, launch events, client showcases and appointment updates — all in one place.",
    cta: "Like & Follow",
    href: SOCIAL_LINKS.facebook,
    Icon: FacebookSVG,
    glowColor: "oklch(0.45 0.16 270 / 35%)",
    accentColor: "oklch(0.65 0.14 268)",
    borderGlow: "oklch(0.45 0.18 268 / 55%)",
  },
  {
    id: "whatsapp",
    platform: "WhatsApp",
    handle: "+91 81477 02688",
    tagline: "Direct line to our studio executives. Bookings, queries and bespoke package discussions.",
    cta: "Start Chat",
    href: SOCIAL_LINKS.whatsapp,
    Icon: WhatsAppSVG,
    glowColor: "oklch(0.82 0.13 88 / 28%)",
    accentColor: "oklch(0.82 0.13 88)",
    borderGlow: "oklch(0.82 0.13 88 / 50%)",
  },
] as const;

export function SocialSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient purple glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full blur-[130px]"
        style={{ background: "oklch(0.3 0.14 300 / 22%)" }}
      />
      {/* Gold-purple hairline top separator */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.82 0.13 88 / 50%) 30%, oklch(0.55 0.21 298 / 45%) 70%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
        {/* Heading */}
        <Reveal className="text-center">
          <div className="eyebrow">Social</div>
          <h2
            className="mt-5 font-display text-4xl font-black leading-none tracking-tight text-balance sm:text-5xl"
            style={{ textShadow: "0 0 60px oklch(0.68 0.2 300 / 30%)" }}
          >
            <span
              style={{
                backgroundImage:
                  "linear-gradient(100deg, oklch(0.72 0.1 78), oklch(0.9 0.08 92) 45%, oklch(0.68 0.1 72))",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              STAY IN THE LOOP
            </span>
          </h2>
          <p className="mt-4 font-display text-sm tracking-[0.28em] text-muted-foreground uppercase">
            Follow the MOTURBO journey.
          </p>
          <div
            className="mx-auto mt-7 h-px w-40"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.82 0.13 88 / 55%), oklch(0.55 0.21 298 / 45%), transparent)",
            }}
          />
        </Reveal>

        {/* Social cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {CARDS.map((card, i) => (
            <Reveal key={card.id} delay={i * 0.1}>
              <TiltCard intensity={8} className="h-full">
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`MOTURBO on ${card.platform}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl p-8"
                  style={{
                    background:
                      "linear-gradient(145deg, oklch(0.13 0.02 300 / 85%) 0%, oklch(0.1 0.016 300 / 92%) 100%)",
                    backdropFilter: "blur(24px) saturate(140%)",
                    WebkitBackdropFilter: "blur(24px) saturate(140%)",
                    border: "1px solid oklch(1 0 0 / 9%)",
                    boxShadow:
                      "inset 0 1px 0 oklch(1 0 0 / 8%), 0 24px 60px -16px oklch(0 0 0 / 55%)",
                  }}
                >
                  {/* lux-border gradient overlay via pseudo-element simulation */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${card.glowColor}, transparent 70%)`,
                    }}
                  />
                  {/* Gold edge border shimmer */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-3xl"
                    style={{
                      padding: 1,
                      background: `linear-gradient(140deg, ${card.borderGlow} 0%, transparent 40%, transparent 60%, oklch(0.82 0.13 88 / 20%) 100%)`,
                      WebkitMask:
                        "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />

                  {/* Icon circle */}
                  <div
                    className="relative flex size-16 items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110"
                    style={{
                      background:
                        "linear-gradient(145deg, oklch(0.18 0.03 300 / 80%), oklch(0.12 0.02 300 / 90%))",
                      border: `1px solid ${card.accentColor}40`,
                      boxShadow: `0 0 0 0 ${card.accentColor}00`,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        boxShadow: `0 0 24px -4px ${card.glowColor}, inset 0 1px 0 oklch(1 0 0 / 10%)`,
                      }}
                    />
                    <card.Icon
                      className="relative size-7 transition-colors duration-300"
                      style={{ color: card.accentColor }}
                    />
                  </div>

                  {/* Platform name */}
                  <div className="mt-6">
                    <h3
                      className="font-display text-xl font-bold tracking-tight text-foreground"
                      style={{ textShadow: `0 0 30px ${card.glowColor}` }}
                    >
                      {card.platform}
                    </h3>
                    <p
                      className="mt-1 font-display text-[0.62rem] font-semibold tracking-[0.22em] uppercase"
                      style={{ color: card.accentColor }}
                    >
                      {card.handle}
                    </p>
                  </div>

                  {/* Tagline */}
                  <p className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {card.tagline}
                  </p>

                  {/* CTA row */}
                  <div
                    className="mt-8 flex items-center gap-2 font-display text-[0.65rem] font-semibold tracking-[0.24em] uppercase transition-colors duration-300 group-hover:opacity-100"
                    style={{ color: card.accentColor, opacity: 0.75 }}
                  >
                    <span>{card.cta}</span>
                    <ArrowRight
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
