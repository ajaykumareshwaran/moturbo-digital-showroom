import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function PageHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
}) {
  return (
    <header className="relative overflow-hidden px-6 pt-40 pb-20">
      <div className="absolute inset-0 spotlight" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-purple-royal/16 blur-[130px]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="mt-6 text-5xl leading-[0.95] font-semibold text-balance sm:text-7xl">{title}</h1>
          {sub && <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">{sub}</p>}
          <div className="hairline mx-auto mt-10 w-52" />
        </motion.div>
      </div>
    </header>
  );
}