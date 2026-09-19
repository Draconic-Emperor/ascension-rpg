import { Crown, Trophy } from "lucide-react";
import {
  classMeta,
  leaderboardRows,
  type GameSave,
} from "@/lib/game";
import { cn } from "@/lib/utils";

interface LeaderboardPanelProps {
  save: GameSave;
}

export function LeaderboardPanel({ save }: LeaderboardPanelProps) {
  const { rows, userRank, userRow } = leaderboardRows(save);

  return (
    <section className="panel corner-frame rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-md border border-frost/30 bg-frost/10">
          <Trophy className="size-4 text-frost" />
        </div>
        <div>
          <h2 className="font-display text-base font-bold tracking-wide sm:text-lg">
            HUNTER LEADERBOARD
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Weekly standings · global mock
          </p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 rounded-md border border-amethyst/30 bg-amethyst/10 px-2.5 py-1 text-[11px] font-bold text-amethyst">
          <Crown className="size-3.5" />#{userRank}
        </span>
      </div>

      <div className="mt-4 space-y-1.5">
        {rows.map((row, i) => {
          const meta = row.classId ? classMeta(row.classId) : null;
          const Icon = meta?.icon;
          return (
            <div
              key={row.name}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2 transition-all",
                row.isUser
                  ? "border-amethyst/50 bg-amethyst/10 shadow-[0_0_16px_-8px] shadow-amethyst/60"
                  : "border-border/50 bg-background/40",
              )}
            >
              <span
                className={cn(
                  "w-6 shrink-0 text-center text-sm font-black",
                  i === 0
                    ? "text-amethyst"
                    : i === 1
                      ? "text-slate-300"
                      : i === 2
                        ? "text-amber-600"
                        : "text-muted-foreground/70",
                )}
              >
                {i + 1}
              </span>
              {Icon && (
                <Icon className={cn("size-4 shrink-0", meta?.iconClass)} />
              )}
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate text-sm font-semibold",
                    row.isUser && "text-amethyst",
                  )}
                >
                  {row.name}
                  {row.isUser && " (you)"}
                </p>
              </div>
              <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">
                LV.{row.level}
              </span>
              <span className="w-16 shrink-0 text-right text-[11px] font-bold text-frost-bright">
                {row.xp.toLocaleString()} XP
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        You are ranked #{userRank} with {userRow.xp.toLocaleString()} lifetime
        XP. Keep grinding.
      </p>
    </section>
  );
}
