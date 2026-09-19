import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Crosshair,
  Flame,
  MoonStar,
  Mountain,
  ScrollText,
  Sparkles,
  Swords,
  Trophy,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import EmberField from "@/components/EmberField";
import { useAuth } from "@/hooks/use-auth";
import { useCountUp } from "@/hooks/use-count-up";
import { levelFromTotalXp, MOCK_HUNTERS } from "@/lib/game";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

const CLASS_CARDS: { name: string; icon: LucideIcon; chip: string; blurb: string }[] = [
  {
    name: "Shadow Monarch",
    icon: MoonStar,
    chip: "text-violet-300",
    blurb: "Command the shadows. Rise alone, rule everything.",
  },
  {
    name: "Murim Warrior",
    icon: Swords,
    chip: "text-ember",
    blurb: "The blade remembers every dawn of training.",
  },
  {
    name: "Cyber Knight",
    icon: Bot,
    chip: "text-frost",
    blurb: "Chrome chassis. Unbreakable code of honor.",
  },
  {
    name: "Mage",
    icon: Wand2,
    chip: "text-sky-300",
    blurb: "Mana is a language. You are fluent.",
  },
  {
    name: "Hunter",
    icon: Crosshair,
    chip: "text-teal-300",
    blurb: "Every gate hides treasure. You take both.",
  },
  {
    name: "Titan",
    icon: Mountain,
    chip: "text-amber-300",
    blurb: "Mountains kneel to those who outlast them.",
  },
];

const FEATURES: {
  icon: LucideIcon;
  title: string;
  body: string;
  accent: string;
}[] = [
  {
    icon: ScrollText,
    title: "Daily Quest System",
    body: "Forge your own quest log. Easy, Medium, and Hard raids pay 10, 25, and 50 XP — every single day.",
    accent: "text-amethyst",
  },
  {
    icon: Zap,
    title: "XP & Ascension Ranks",
    body: "Levels rise automatically as XP flows in. Climb from Novice through Adept, Elite, and Master to Legend.",
    accent: "text-frost",
  },
  {
    icon: Flame,
    title: "Login Streaks & Rewards",
    body: "Return daily to grow your streak. Milestones at 3, 7, 14, and 30 days unlock XP caches — Monarch's Core awaits.",
    accent: "text-ember",
  },
  {
    icon: Trophy,
    title: "Achievement Codex",
    body: "First Quest. 7-Day Streak. 30-Day Streak. 100 Quests Completed. Proof, carved into your record.",
    accent: "text-amethyst",
  },
];

const RANK_LADDER = ["Novice", "Adept", "Elite", "Master", "Legend"];

const TICKER_ITEMS = [
  "[NOTICE] Iron Will_77 cleared a Hard raid · +50 XP",
  "[NOTICE] ArcaneLily reached Level 44",
  "[SYSTEM] Daily quests reset at midnight — local time",
  "[NOTICE] VoidWalker claimed Monarch's Core · +1,000 XP",
  "[SYSTEM] 7-day streak rewards are now claimable",
  "[NOTICE] EmberKai advanced to Adept rank",
  "[SYSTEM] The System never sleeps. Neither do legends.",
];

const TOTAL_QUESTS = MOCK_HUNTERS.reduce((sum, h) => sum + Math.round(h.xp / 25), 0);

function SystemBadge({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amethyst/25 bg-amethyst/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amethyst">
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}

function StatCounter({ value, label, accent }: { value: number; label: string; accent: string }) {
  const animated = useCountUp(value, 1400);
  return (
    <div className="text-center">
      <p className={`tnum font-display text-2xl font-black sm:text-3xl ${accent}`}>
        {animated.toLocaleString()}
      </p>
      <p className="mt-1 text-[10px] font-bold tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

/** Rotating [SYSTEM] notice line under the status window. */
function SystemNotice() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % TICKER_ITEMS.length),
      3600,
    );
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="mt-4 h-9 overflow-hidden rounded-md border border-frost/25 bg-frost/10 px-3 py-2 text-center text-xs font-medium text-frost-bright">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="truncate"
        >
          {TICKER_ITEMS[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const dashboardHref = "/dashboard";
  const primaryLabel = isLoading
    ? "…"
    : isAuthenticated
      ? "ENTER THE DASHBOARD"
      : "AWAKEN YOUR CLASS";

  return (
    <div className="grid-bg relative min-h-screen overflow-x-clip">
      {/* Ember particles + ambient glow orbs */}
      <EmberField />
      <div
        aria-hidden
        className="pointer-events-none fixed -top-32 left-1/2 z-0 size-[480px] -translate-x-1/2 rounded-full bg-amethyst/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed right-[-140px] top-1/3 z-0 size-[380px] rounded-full bg-ember/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed left-[-140px] bottom-[-80px] z-0 size-[380px] rounded-full bg-frost/10 blur-[120px]"
      />
      <div aria-hidden className="vignette pointer-events-none fixed inset-0 z-[2]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-4 sm:px-6">
        {/* ------------------------------------------------- Nav */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between py-5"
        >
          <a href="/" className="flex items-center gap-2.5">
            <div className="corner-frame panel flex size-9 items-center justify-center rounded-md">
              <Sparkles className="size-4.5 text-amethyst" />
            </div>
            <span className="font-display text-lg font-bold tracking-[0.22em] text-foreground">
              ASCENSION
            </span>
          </a>
          <a
            href={dashboardHref}
            className="rounded-md border border-amethyst/30 bg-amethyst/10 px-4 py-1.5 text-sm font-semibold text-amethyst transition-all hover:bg-amethyst/20 hover:shadow-[0_0_18px_-4px] hover:shadow-amethyst/40"
          >
            {isAuthenticated ? "Dashboard" : "Sign in"}
          </a>
        </motion.header>

        {/* ------------------------------------------------- Hero */}
        <section className="flex flex-col items-center pt-10 pb-20 text-center sm:pt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <SystemBadge icon={Sparkles} label="The System has awakened you" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display mt-6 text-4xl leading-tight font-extrabold text-shadow-amethyst sm:text-6xl"
          >
            <span className="text-gradient-amethyst">ASCEND</span>
            <br />
            <span className="text-foreground">OR REMAIN ORDINARY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            A hunter-system progression app for the disciplined. Complete daily
            quests, bank XP, hold your streak, and climb from{" "}
            <span className="font-semibold text-foreground">Novice</span> to{" "}
            <span className="font-semibold text-amethyst">Legend</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
          >
            <a
              href={dashboardHref}
              className="animate-pulse-glow group inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-amethyst/90 via-amethyst-bright to-amethyst/90 px-7 text-sm font-bold tracking-wide text-background transition-transform hover:scale-[1.02] sm:w-auto"
            >
              {primaryLabel}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#features"
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-border bg-card/60 px-7 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-accent sm:w-auto"
            >
              View the System
            </a>
          </motion.div>

          {/* System window mock — now with a ticking pulse */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="animate-float-slow panel panel-glow corner-frame mt-14 w-full max-w-md rounded-lg p-5 text-left"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-xs font-bold tracking-[0.3em] text-amethyst">
                STATUS WINDOW
              </span>
              <span className="flex items-center gap-1.5 rounded border border-amethyst/30 bg-amethyst/10 px-1.5 py-0.5 text-[10px] font-semibold text-amethyst">
                <span className="size-1.5 animate-pulse rounded-full bg-amethyst" />
                LIVE
              </span>
            </div>
            <p className="font-display text-lg font-bold text-foreground">
              Hunter — <span className="text-ember">Murim Warrior</span>
            </p>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                <span>XP</span>
                <span className="tnum">35 / 100</span>
              </div>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-background/80 ring-1 ring-amethyst/20">
                <div className="shimmer xp-bar-fill relative h-full w-[35%] rounded-full" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { k: "RANK", v: "Novice" },
                { k: "STREAK", v: "4d" },
                { k: "QUESTS", v: "12" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-md border border-border/70 bg-background/50 px-2 py-2"
                >
                  <p className="text-[10px] tracking-[0.2em] text-muted-foreground">
                    {s.k}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-foreground">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
            <SystemNotice />
          </motion.div>
        </section>

        {/* ------------------------------------------------- Ticker marquee */}
        <div className="relative -mx-4 mb-20 overflow-hidden border-y border-amethyst/15 bg-background/40 py-2.5 sm:-mx-6">
          <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex gap-10" aria-hidden={copy === 1}>
                {TICKER_ITEMS.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground"
                  >
                    <Zap className="size-3 text-amethyst" />
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
        </div>

        {/* ------------------------------------------------- Live stats */}
        <section className="pb-20">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="panel corner-frame grid grid-cols-3 gap-2 rounded-lg px-4 py-6"
          >
            <StatCounter value={MOCK_HUNTERS.length + 1} label="HUNTERS ENROLLED" accent="text-amethyst-bright" />
            <StatCounter value={TOTAL_QUESTS} label="QUESTS CLEARED" accent="text-ember-bright" />
            <StatCounter value={5} label="RANKS TO LEGEND" accent="text-frost-bright" />
          </motion.div>
        </section>

        {/* ------------------------------------------------- Classes */}
        <section className="pb-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center">
            <SystemBadge icon={Swords} label="Choose your path" />
            <h2 className="font-display mt-4 text-2xl font-bold sm:text-3xl">
              Six Classes. One Ascent.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
              Your class shapes your status window and colors your legend.
              Change it later — the grind remembers.
            </p>
          </motion.div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {CLASS_CARDS.map((c, i) => (
              <motion.div
                key={c.name}
                {...fadeUp}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="panel corner-frame group rounded-lg p-4 transition-transform hover:-translate-y-1"
              >
                <c.icon className={`size-7 ${c.chip} transition-transform group-hover:scale-110`} />
                <p className="font-display mt-3 text-sm font-bold tracking-wide sm:text-base">
                  {c.name}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {c.blurb}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------- Features */}
        <section id="features" className="scroll-mt-10 pb-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center">
            <SystemBadge icon={Zap} label="System mechanics" />
            <h2 className="font-display mt-4 text-2xl font-bold sm:text-3xl">
              Built Like the Grind You Love
            </h2>
          </motion.div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="panel rounded-lg p-5 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-amethyst/25 bg-amethyst/10">
                    <f.icon className={`size-4.5 ${f.accent}`} />
                  </div>
                  <h3 className="font-display text-base font-bold">{f.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------- Ranks + leaderboard */}
        <section className="grid gap-4 pb-20 lg:grid-cols-2">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="panel corner-frame rounded-lg p-6">
            <SystemBadge icon={Sparkles} label="Rank ladder" />
            <h2 className="font-display mt-4 text-xl font-bold sm:text-2xl">
              The Road to Legend
            </h2>
            <ol className="mt-5 space-y-2.5">
              {RANK_LADDER.map((rank, i) => (
                <li
                  key={rank}
                  className="flex items-center gap-3 rounded-md border border-border/60 bg-background/40 px-3 py-2.5"
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                      i === RANK_LADDER.length - 1
                        ? "border-amethyst/60 bg-amethyst/15 text-amethyst"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="font-display text-sm font-bold tracking-wide">
                    {rank}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    LV. {i === 0 ? 1 : i * 10}+
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="panel corner-frame rounded-lg p-6">
            <SystemBadge icon={Trophy} label="Weekly standings" />
            <h2 className="font-display mt-4 text-xl font-bold sm:text-2xl">
              Hunter Leaderboard
            </h2>
            <div className="mt-5 space-y-2">
              {MOCK_HUNTERS.slice(0, 4).map((h, i) => {
                const level = levelFromTotalXp(h.xp).level;
                return (
                  <div
                    key={h.name}
                    className={`flex items-center gap-3 rounded-md border px-3 py-2.5 ${
                      i === 0
                        ? "border-amethyst/40 bg-amethyst/10"
                        : "border-border/60 bg-background/40"
                    }`}
                  >
                    <span
                      className={`w-6 text-center text-sm font-bold ${
                        i === 0 ? "text-amethyst" : "text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{h.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        LV. {level}
                      </p>
                    </div>
                    <span className="tnum text-xs font-semibold text-frost-bright">
                      {h.xp.toLocaleString()} XP
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center gap-3 rounded-md border border-dashed border-amethyst/30 bg-amethyst/5 px-3 py-2.5">
                <span className="w-6 text-center text-sm font-bold text-amethyst">?</span>
                <p className="flex-1 text-sm font-semibold text-amethyst">Your name here</p>
                <span className="text-xs font-semibold text-muted-foreground">LV. 1</span>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Standings refresh weekly. Your slot is waiting.
            </p>
          </motion.div>
        </section>

        {/* ------------------------------------------------- CTA */}
        <section className="pb-24">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="panel panel-glow corner-frame rounded-xl p-8 text-center sm:p-12"
          >
            <p className="font-display text-xs font-bold tracking-[0.3em] text-ember">
              [QUEST AVAILABLE]
            </p>
            <h2 className="font-display mt-3 text-2xl font-bold sm:text-4xl">
              Your Status Window Is Empty
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
              Create a class, take your first quest, and start the streak that
              becomes a legend. Free — no gates required.
            </p>
            <a
              href={dashboardHref}
              className="group mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-amethyst/90 via-amethyst-bright to-amethyst/90 px-8 text-sm font-bold tracking-wide text-background transition-transform hover:scale-[1.02]"
            >
              BEGIN THE ASCENSION
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

          <p className="mt-10 text-center text-xs text-muted-foreground">
            Ascension · Progress saved on your device · Rank up daily
          </p>
        </section>
      </div>
    </div>
  );
}
