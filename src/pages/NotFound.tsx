import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid-bg flex min-h-screen flex-col"
    >
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="animate-float-slow flex size-14 items-center justify-center rounded-lg border border-gold/40 bg-gold/10">
          <Sparkles className="size-6 text-gold" />
        </div>
        <p className="font-display mt-6 text-xs font-bold tracking-[0.35em] text-azure-bright">
          [ SYSTEM MESSAGE ]
        </p>
        <h1 className="font-display text-gradient-gold text-6xl font-black text-shadow-gold sm:text-7xl">
          404
        </h1>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          This gate does not exist. The System redirects all who wander.
        </p>
        <a
          href="/"
          className="group mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-gold/90 via-gold-bright to-gold/90 px-7 text-sm font-bold tracking-wide text-background transition-transform hover:scale-[1.02]"
        >
          RETURN TO THE SURFACE
        </a>
      </div>
    </motion.div>
  );
}
