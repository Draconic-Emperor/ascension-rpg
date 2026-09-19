import { Flame, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addQuest,
  dateKey,
  DIFFICULTIES,
  DIFFICULTY_META,
  DIFFICULTY_XP,
  questsClearedToday,
  removeQuest,
  type Difficulty,
  type GameSave,
} from "@/lib/game";
import { cn } from "@/lib/utils";

interface QuestBoardProps {
  save: GameSave;
  onAddQuest: (title: string, difficulty: Difficulty) => void;
  onComplete: (questId: string) => void;
  onRemove: (questId: string) => void;
}

export function QuestBoard({
  save,
  onAddQuest,
  onComplete,
  onRemove,
}: QuestBoardProps) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [adding, setAdding] = useState(false);

  const today = dateKey();
  const clearedToday = questsClearedToday(save);
  const activeQuests = [...save.quests].sort((a, b) => {
    const aDone = a.lastCompletedDate === today;
    const bDone = b.lastCompletedDate === today;
    if (aDone !== bDone) return aDone ? 1 : -1;
    return a.createdAt - b.createdAt;
  });

  const submit = () => {
    if (!title.trim()) return;
    onAddQuest(title, difficulty);
    setTitle("");
    setDifficulty("easy");
    setAdding(false);
  };

  return (
    <section className="panel corner-frame rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-md border border-ember/30 bg-ember/10">
            <Flame className="size-4 text-ember" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold tracking-wide sm:text-lg">
              DAILY QUESTS
            </h2>
            <p className="text-[11px] text-muted-foreground">
              {clearedToday}/{activeQuests.length} cleared today
            </p>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setAdding((v) => !v)}
          className="shrink-0 gap-1 border-amethyst/30 bg-amethyst/10 text-xs font-semibold text-amethyst hover:bg-amethyst/20"
        >
          {adding ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
          New Quest
        </Button>
      </div>

      {adding && (
        <div className="mt-4 rounded-lg border border-amethyst/20 bg-background/50 p-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="Quest title — e.g. 100 push-ups"
            maxLength={80}
            className="h-9 border-amethyst/20 bg-background/60"
          />
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {DIFFICULTIES.map((d) => {
              const meta = DIFFICULTY_META[d];
              const active = difficulty === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all",
                    active ? meta.chipClass : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className={cn("size-1.5 rounded-full", active ? meta.dotClass : "bg-muted-foreground/50")} />
                  {meta.label} · {DIFFICULTY_XP[d]} XP
                </button>
              );
            })}
            <Button
              type="button"
              size="sm"
              onClick={submit}
              disabled={!title.trim()}
              className="ml-auto bg-gradient-to-r from-amethyst/90 via-amethyst-bright to-amethyst/90 text-background hover:opacity-95"
            >
              Add Quest
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {activeQuests.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
            No quests yet. Forge your first daily trial — the System is
            watching.
          </p>
        ) : (
          activeQuests.map((quest) => {
            const done = quest.lastCompletedDate === today;
            const meta = DIFFICULTY_META[quest.difficulty];
            return (
              <div
                key={quest.id}
                className={cn(
                  "group flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all",
                  done
                    ? "border-amethyst/25 bg-amethyst/5"
                    : "border-border/70 bg-background/40",
                )}
              >
                <button
                  type="button"
                  aria-label={done ? "Completed today" : "Complete quest"}
                  disabled={done}
                  onClick={() => onComplete(quest.id)}
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-md border transition-all",
                    done
                      ? "border-amethyst bg-amethyst text-background"
                      : "border-amethyst/40 bg-transparent hover:bg-amethyst/20",
                  )}
                >
                  {done && <span className="text-xs font-black">✓</span>}
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-semibold",
                      done && "text-muted-foreground line-through decoration-amethyst/50",
                    )}
                  >
                    {quest.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full border px-1.5 py-0.5 text-[10px] font-bold tracking-wider",
                        meta.chipClass,
                      )}
                    >
                      {meta.label}
                    </span>
                    {quest.totalCompletions > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        ×{quest.totalCompletions}
                      </span>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-xs font-bold text-amethyst">
                  +{DIFFICULTY_XP[quest.difficulty]} XP
                </span>
                <button
                  type="button"
                  aria-label="Delete quest"
                  onClick={() => onRemove(quest.id)}
                  className="shrink-0 text-muted-foreground/50 transition-colors hover:text-ember"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
