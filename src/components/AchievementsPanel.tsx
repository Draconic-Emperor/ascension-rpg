import { Trophy } from "lucide-react";
import {
  achievementState,
  type GameSave,
} from "@/lib/game";
import { cn } from "@/lib/utils";

interface AchievementsPanelProps {
  save: GameSave;
}

export function AchievementsPanel({ save }: AchievementsPanelProps) {
  const states = achievementState(save);
  const unlockedCount = states.filter((s) => s.unlocked).length;

  return (
    <section className="panel corner-frame rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-md border border-amethyst/30 bg-amethyst/10">
          <Trophy className="size-4 text-amethyst" />
        </div>
        <div>
          <h2 className="font-display text-base font-bold tracking-wide sm:text-lg">
            ACHIEVEMENTS
          </h2>
          <p className="text-[11px] text-muted-foreground">
            {unlockedCount}/{states.length} unlocked
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {states.map(({ def, unlocked, value, pct }) => (
          <div
            key={def.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border px-3 py-3 transition-all",
              unlocked
                ? "border-amethyst/40 bg-amethyst/10 shadow-[0_0_18px_-8px] shadow-amethyst/60"
                : "border-border/60 bg-background/40",
            )}
          >
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-md border",
                unlocked
                  ? "border-amethyst/50 bg-amethyst/15"
                  : "border-border/70 bg-background/60 opacity-50 grayscale",
              )}
            >
              <def.icon
                className={cn(
                  "size-4.5",
                  unlocked ? "text-amethyst" : "text-muted-foreground",
                )}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={cn(
                    "truncate text-sm font-bold",
                    unlocked ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {def.title}
                </p>
                <span className="shrink-0 text-[10px] font-semibold text-muted-foreground">
                  {def.goal > 1 ? `${value}/${def.goal}` : unlocked ? "DONE" : "LOCKED"}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                {def.description}
              </p>
              {def.goal > 1 && (
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-background">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      unlocked ? "bg-amethyst" : "bg-muted-foreground/40",
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
