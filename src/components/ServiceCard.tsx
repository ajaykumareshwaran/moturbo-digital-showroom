import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/lux";
import { currency, type Service } from "@/data/catalog";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon] ?? Icons.Sparkles;
  return (
    <TiltCard className="glass lux-border h-full rounded-3xl p-7" intensity={7}>
      <div className="flex items-start justify-between">
        <div
          className="grid size-12 place-items-center rounded-2xl transition-shadow duration-500 group-hover:shadow-[var(--shadow-gold)]"
          style={{ backgroundImage: "var(--gradient-royal)" }}
        >
          <Icon className="size-5 text-gold-soft" />
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold" />
      </div>
      <h3 className="mt-6 font-display text-xl font-semibold">{service.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.summary}</p>
      <div className="hairline my-6" />
      <div className="flex items-center justify-between text-[0.62rem] tracking-[0.22em] uppercase">
        <span className="text-muted-foreground">{service.duration}</span>
        <span className="text-gold">From {currency(service.from)}</span>
      </div>
      <Link
        to="/book"
        search={{ service: service.slug }}
        className="mt-6 inline-flex font-display text-[0.62rem] tracking-[0.24em] text-foreground uppercase underline-offset-8 hover:text-gold-soft hover:underline"
      >
        Reserve this bay
      </Link>
    </TiltCard>
  );
}