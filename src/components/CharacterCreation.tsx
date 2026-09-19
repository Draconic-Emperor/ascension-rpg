import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CLASSES, type ClassId } from "@/lib/game";
import { cn } from "@/lib/utils";

interface CharacterCreationProps {
  onCreate: (name: string, classId: ClassId) => void;
}

export function CharacterCreation({ onCreate }: CharacterCreationProps) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<ClassId | null>(null);

  const canCreate = selected !== null && name.trim().length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="panel panel-glow corner-frame rounded-xl p-5 sm:p-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amethyst/25 bg-amethyst/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amethyst">
            <Sparkles className="size-3.5" />
            Character Creation
          </span>
          <h1 className="font-display mt-4 text-2xl font-bold text-shadow-amethyst sm:text-3xl">
            [ THE SYSTEM ASKS ]
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Speak your name and choose your path. This cannot be undone
            lightly.
          </p>
        </div>

        <div className="mt-6">
          <label
            htmlFor="hunter-name"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Hunter Name
          </label>
          <Input
            id="hunter-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canCreate) onCreate(name, selected);
            }}
            autoFocus
            placeholder="e.g. Jin-Woo"
            maxLength={24}
            className="mt-2 h-11 border-amethyst/20 bg-background/60 text-base focus-visible:ring-amethyst/40"
          />
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Choose Your Class
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {CLASSES.map((c) => {
              const active = selected === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelected(c.id)}
                  className={cn(
                    "group relative rounded-lg border bg-background/50 p-3 text-left transition-all duration-200 hover:-translate-y-0.5",
                    active
                      ? c.frameClass
                      : "border-border/70 hover:border-amethyst/30 hover:bg-accent/40",
                  )}
                >
                  {active && (
                    <span
                      className={cn(
                        "absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full border-2 border-background",
                        "bg-amethyst text-background",
                      )}
                    >
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  )}
                  <c.icon
                    className={cn(
                      "size-6 transition-transform group-hover:scale-110",
                      active ? c.iconClass : "text-muted-foreground",
                    )}
                  />
                  <p className="mt-2 text-sm font-bold leading-tight">
                    {c.name}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                    {c.epithet}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {selected && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 rounded-md border border-frost/25 bg-frost/10 px-3 py-2 text-center text-xs font-medium text-frost-bright"
          >
            [{CLASSES.find((c) => c.id === selected)?.tagline}]
          </motion.p>
        )}

        <Button
          type="button"
          disabled={!canCreate}
          onClick={() => selected && onCreate(name, selected)}
          className="mt-6 h-11 w-full bg-gradient-to-r from-amethyst/90 via-amethyst-bright to-amethyst/90 text-sm font-bold tracking-wide text-background hover:opacity-95"
        >
          AWAKEN — BEGIN THE ASCENT
        </Button>
      </div>
    </motion.div>
  );
}
