import { Flame, Gift, Lock, Sparkles } from "lucide-react";
import {
  STREAK_REWARDS,
  type GameSave,
} from "@/lib/game";
import { cn } from "@/lib/utils";

interface StreakPanelProps {
  save: GameSave;
  onClaim: (day: number) => void;
}

export function StreakPanel({ save, onClaim }: StreakPanelProps) {
  return (
    <section className="panel corner-frame rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-md border border-ember/30 bg-ember/10">
          <Flame className="size-4 text-ember" />
        </div>
        <div>
          <h2 className="font-display text-base font-bold tracking-wide sm:text-lg">
            LOGIN STREAK
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Best: {save.bestStreak} day{save.bestStreak === 1 ? "" : "s"}
          </p>
        </div>
        <span className="ml-auto rounded-md border border-ember/40 bg-ember/10 px-3 py-1.5 text-center">
          <span className="block text-lg leading-none font-black text-ember-bright">
            {save.streak}
          </span>
          <span className="text-[10px] font-semibold tracking-[0.15em] text-ember">
            DAY{save.streak === 1 ? "" : "S"}
          </span>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {STREAK_REWARDS.map((reward) => {
          const claimed = save.claimedRewards.includes(reward.day);
          const unlocked = save.streak >= reward.day;
          return (
            <button
              key={reward.day}
              type="button"
              disabled={!unlocked || claimed}
              onClick={() => onClaim(reward.day)}
              className={cn(
                "group relative flex flex-col items-center rounded-lg border px-2 py-3 text-center transition-all",
                claimed
                  ? "border-amethyst/40 bg-amethyst/10"
                  : unlocked
                    ? "border-amethyst/50 bg-amethyst/10 shadow-[0_0_16px_-6px] shadow-amethyst/50 hover:scale-[1.03]"
                    : "border-border/60 bg-background/40 opacity-60",
              )}
            >
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground">
                D{reward.day}
              </span>
              {claimed ? (
                <Sparkles className="mt-1.5 size-4 text-amethyst" />
              ) : unlocked ? (
                <Gift className="mt-1.5 size-4 animate-pulse text-amethyst" />
              ) : (
                <Lock className="mt-1.5 size-4 text-muted-foreground/60" />
              )}
              <span
                className={cn(
                  "mt-1 text-[10px] leading-tight font-semibold",
                  claimed || unlocked ? "text-amethyst" : "text-muted-foreground",
                )}
              >
                {reward.label}
              </span>
              <span className="text-[10px] text-muted-foreground">
                +{reward.xp} XP
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Log in daily to grow the streak. Miss a day and it resets to zero.
      </p>
    </section>
  );
}
