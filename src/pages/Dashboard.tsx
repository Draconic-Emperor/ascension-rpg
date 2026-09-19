import { motion } from "framer-motion";
import { Flame, LogOut, RotateCcw, ScrollText, Swords, Trophy, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { toast } from "sonner";
import { AchievementsPanel } from "@/components/AchievementsPanel";
import { CharacterCreation } from "@/components/CharacterCreation";
import { LeaderboardPanel } from "@/components/LeaderboardPanel";
import { QuestBoard } from "@/components/QuestBoard";
import { StreakPanel } from "@/components/StreakPanel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import {
  addQuest,
  claimStreakReward,
  classMeta,
  clearSave,
  completeQuestToday,
  createProfile,
  emptySave,
  levelFromTotalXp,
  loadSave,
  persistSave,
  rankForLevel,
  removeQuest,
  rollStreak,
  RANKS,
  type ClassId,
  type GameSave,
} from "@/lib/game";

type SaveAction =
  | { type: "replace"; save: GameSave }
  | { type: "reset" };

function saveReducer(_state: GameSave, action: SaveAction): GameSave {
  switch (action.type) {
    case "replace":
      return action.save;
    case "reset":
      return emptySave();
  }
}

interface LevelUpPayload {
  newLevel: number;
  rankUp: string | null;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [save, dispatch] = useReducer(saveReducer, undefined, loadSave);
  const [levelUp, setLevelUp] = useState<LevelUpPayload | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  // Persist every save change.
  useEffect(() => {
    persistSave(save);
  }, [save]);

  // Daily login streak — runs once per app open.
  useEffect(() => {
    const { save: rolled, event } = rollStreak(save);
    if (event === null) return;
    dispatch({ type: "replace", save: rolled });
    if (event === "started") {
      toast.success("[SYSTEM] Login streak started — 1 day");
    } else if (event === "extended") {
      toast.success(`[SYSTEM] Login streak extended — ${rolled.streak} days`, {
        icon: "🔥",
      });
    } else {
      toast.warning("[SYSTEM] Streak reset — a new climb begins");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const level = useMemo(() => levelFromTotalXp(save.xp), [save.xp]);
  const rank = useMemo(() => rankForLevel(level.level), [level.level]);
  const meta = save.profile ? classMeta(save.profile.classId) : null;
  const ClassIcon = meta?.icon;

  const handleCreate = useCallback(
    (name: string, classId: ClassId) => {
      dispatch({ type: "replace", save: createProfile(loadSave(), name, classId) });
      toast.success("[SYSTEM] You have awakened. Welcome, " + name.trim());
    },
    [],
  );

  const handleAddQuest = useCallback((title: string, difficulty: Parameters<typeof addQuest>[2]) => {
    dispatch({ type: "replace", save: addQuest(loadSave(), title, difficulty) });
    toast.info("[SYSTEM] Quest registered");
  }, []);

  const handleComplete = useCallback((questId: string) => {
    const result = completeQuestToday(loadSave(), questId);
    if (!result) return;
    dispatch({ type: "replace", save: result.save });
    toast.success(`[SYSTEM] Quest cleared +${result.xpGained} XP`);
    if (result.rankUp) {
      setLevelUp({ newLevel: result.newLevel, rankUp: result.rankUp });
    } else if (result.levelsGained > 0) {
      setLevelUp({ newLevel: result.newLevel, rankUp: null });
    }
  }, []);

  const handleClaim = useCallback((day: number) => {
    const result = claimStreakReward(loadSave(), day);
    if (result.status === "granted") {
      dispatch({ type: "replace", save: result.save });
      toast.success(`[SYSTEM] Streak reward +${result.xpGained} XP`);
      if (result.levelsGained > 0) {
        setLevelUp({ newLevel: result.newLevel, rankUp: null });
      }
    } else if (result.status === "locked") {
      toast.error("[SYSTEM] Reward still locked");
    } else {
      toast.info("[SYSTEM] Reward already claimed");
    }
  }, []);

  const handleRemove = useCallback((questId: string) => {
    dispatch({ type: "replace", save: removeQuest(loadSave(), questId) });
  }, []);

  const handleReset = useCallback(() => {
    clearSave();
    dispatch({ type: "reset" });
    setResetOpen(false);
    toast.info("[SYSTEM] Progress erased. The System forgets… for now.");
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, [signOut]);

  /* --------------------------------------------------------------- */

  if (!save.profile) {
    return (
      <main className="grid-bg min-h-screen px-4 py-10 sm:py-16">
        <CharacterCreation onCreate={handleCreate} />
      </main>
    );
  }

  const xpPct = Math.round((level.xpIntoLevel / level.xpNeeded) * 100);

  return (
    <main className="grid-bg min-h-screen pb-16">
      {/* ------------------------------------------------- Top bar */}
      <header className="sticky top-0 z-30 border-b border-gold/15 bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-gold/10">
              {ClassIcon ? (
                <ClassIcon className={`size-4 ${meta?.iconClass}`} />
              ) : (
                <Zap className="size-4 text-gold" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold tracking-[0.2em]">
                ASCENSION
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {save.profile.name}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-crimson">
                  <RotateCcw className="size-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="panel">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">Erase all progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your class, XP, quests, streak, and achievements will be wiped. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    className="bg-crimson text-white hover:bg-crimson/90"
                  >
                    Erase progress
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 pt-5">
        {/* ------------------------------------------------- Status window */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="panel panel-glow corner-frame rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`flex size-12 shrink-0 items-center justify-center rounded-lg border bg-background/60 sm:size-14 ${meta?.frameClass}`}>
                {ClassIcon && <ClassIcon className={`size-6 sm:size-7 ${meta?.iconClass}`} />}
              </div>
              <div>
                <p className="font-display text-lg leading-tight font-bold sm:text-2xl">
                  {save.profile.name}
                </p>
                <p className={`text-xs font-semibold sm:text-sm ${meta?.chipClass.split(" ").pop()}`}>
                  {meta?.name} · {meta?.epithet}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-block rounded-md border px-2.5 py-1 text-[11px] font-bold tracking-[0.15em] uppercase ${rank.badgeClass}`}>
                {rank.name}
              </span>
              <p className="mt-1.5 flex items-baseline justify-end gap-1">
                <span className="font-display text-2xl leading-none font-black text-gold-bright sm:text-3xl">
                  {level.level}
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
                  LEVEL
                </span>
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-[11px] font-semibold">
              <span className="tracking-[0.2em] text-muted-foreground">EXPERIENCE</span>
              <span className="text-gold">
                {level.xpIntoLevel.toLocaleString()} / {level.xpNeeded.toLocaleString()} XP
              </span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-background/80 ring-1 ring-gold/25">
              <div
                className="xp-bar-fill relative h-full overflow-hidden rounded-full transition-[width] duration-700 ease-out"
                style={{ width: `${xpPct}%` }}
              >
                <span className="shimmer absolute inset-0 block" />
              </div>
            </div>
            <p className="mt-1 text-right text-[10px] text-muted-foreground">
              {xpPct}% to Level {level.level + 1} · {save.xp.toLocaleString()} total XP
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: Swords, label: "QUESTS", value: save.totalQuestCompletions.toLocaleString() },
              { icon: Flame, label: "STREAK", value: `${save.streak}d` },
              { icon: Trophy, label: "BEST STREAK", value: `${save.bestStreak}d` },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border/60 bg-background/40 px-2 py-2.5"
              >
                <s.icon className="mx-auto size-3.5 text-muted-foreground" />
                <p className="mt-1 text-sm font-black text-foreground sm:text-base">
                  {s.value || "—"}
                </p>
                <p className="text-[9px] font-bold tracking-[0.18em] text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ------------------------------------------------- Panels */}
        <QuestBoard
          save={save}
          onAddQuest={handleAddQuest}
          onComplete={handleComplete}
          onRemove={handleRemove}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <StreakPanel save={save} onClaim={handleClaim} />
          <LeaderboardPanel save={save} />
        </div>

        <AchievementsPanel save={save} />

        <section className="panel rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-md border border-azure/30 bg-azure/10">
              <ScrollText className="size-4 text-azure" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold tracking-wide sm:text-lg">
                RANK LADDER
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Your current standing in the system
              </p>
            </div>
          </div>
          <ol className="mt-4 space-y-1.5">
            {RANKS.map((r, i) => {
              const isCurrent = r.name === rank.name;
              const reached = level.level >= r.minLevel;
              return (
                <li
                  key={r.name}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-all ${
                    isCurrent
                      ? `${r.badgeClass} shadow-[0_0_16px_-8px] shadow-gold/60`
                      : "border-border/50 bg-background/40"
                  }`}
                >
                  <span className="w-5 text-center text-xs font-black text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className={`font-display text-sm font-bold tracking-wide ${isCurrent ? "" : "text-muted-foreground"}`}>
                    {r.name}
                  </span>
                  <span className="ml-auto text-[11px] font-semibold text-muted-foreground">
                    LV. {r.minLevel}+
                  </span>
                  <span
                    className={`size-1.5 rounded-full ${
                      reached ? "bg-gold" : "bg-muted-foreground/30"
                    }`}
                  />
                </li>
              );
            })}
          </ol>
        </section>

        <p className="pt-2 text-center text-[11px] text-muted-foreground">
          Progress is saved locally on this device · Level {level.level} ·{" "}
          {rank.name} · Streak {save.streak}d
        </p>
      </div>

      {/* ------------------------------------------------- Level-up dialog */}
      <Dialog open={levelUp !== null} onOpenChange={(open) => !open && setLevelUp(null)}>
        <DialogContent className="panel panel-glow corner-frame max-w-xs rounded-xl border-gold/40 text-center sm:max-w-sm">
          <DialogTitle className="sr-only">Level up</DialogTitle>
          <DialogDescription className="sr-only">
            You reached level {levelUp?.newLevel}
            {levelUp?.rankUp ? ` and rank ${levelUp.rankUp}` : ""}.
          </DialogDescription>
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <div className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-gold/60 bg-gold/15 animate-pulse-glow">
              <Zap className="size-8 text-gold" />
            </div>
            <p className="font-display mt-4 text-xs font-bold tracking-[0.35em] text-azure-bright">
              [ SYSTEM MESSAGE ]
            </p>
            <p className="font-display text-gradient-gold mt-2 text-3xl font-black text-shadow-gold">
              LEVEL UP!
            </p>
            <p className="mt-2 text-sm text-foreground">
              You reached <span className="font-bold text-gold">Level {levelUp?.newLevel}</span>
            </p>
            {levelUp?.rankUp && (
              <p className="mt-3 rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-sm font-bold text-gold">
                ⚔ RANK ADVANCEMENT — {levelUp.rankUp.toUpperCase()} ⚔
              </p>
            )}
            <Button
              onClick={() => setLevelUp(null)}
              className="mt-5 w-full bg-gradient-to-r from-gold/90 via-gold-bright to-gold/90 font-bold text-background hover:opacity-95"
            >
              CONTINUE
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
