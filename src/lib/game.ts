import {
  Bot,
  Crosshair,
  Flame,
  MoonStar,
  Mountain,
  Sparkles,
  Swords,
  Trophy,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Classes                                                             */
/* ------------------------------------------------------------------ */

export const CLASS_IDS = [
  "shadow-monarch",
  "murim-warrior",
  "cyber-knight",
  "mage",
  "hunter",
  "titan",
] as const;
export type ClassId = (typeof CLASS_IDS)[number];

export interface ClassMeta {
  id: ClassId;
  name: string;
  epithet: string;
  tagline: string;
  icon: LucideIcon;
  /** text color for the icon */
  iconClass: string;
  /** border + glow treatment for frames */
  frameClass: string;
  /** small chip / badge treatment */
  chipClass: string;
}

export const CLASSES: ClassMeta[] = [
  {
    id: "shadow-monarch",
    name: "Shadow Monarch",
    epithet: "Sovereign of the Night",
    tagline: "Command the shadows. Rise alone, rule everything.",
    icon: MoonStar,
    iconClass: "text-violet-300",
    frameClass: "border-violet-400/40 shadow-[0_0_28px_-6px] shadow-violet-500/40",
    chipClass: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  },
  {
    id: "murim-warrior",
    name: "Murim Warrior",
    epithet: "Blade of the Orthodox Path",
    tagline: "The blade remembers every dawn of training.",
    icon: Swords,
    iconClass: "text-ember",
    frameClass: "border-ember/40 shadow-[0_0_28px_-6px] shadow-ember/40",
    chipClass: "border-ember/40 bg-ember/10 text-ember",
  },
  {
    id: "cyber-knight",
    name: "Cyber Knight",
    epithet: "Oathbound Protocol",
    tagline: "Chrome chassis. Unbreakable code of honor.",
    icon: Bot,
    iconClass: "text-frost",
    frameClass: "border-frost/40 shadow-[0_0_28px_-6px] shadow-frost/40",
    chipClass: "border-frost/40 bg-frost/10 text-frost",
  },
  {
    id: "mage",
    name: "Mage",
    epithet: "Architect of Mana",
    tagline: "Mana is a language. You are fluent.",
    icon: Wand2,
    iconClass: "text-sky-300",
    frameClass: "border-sky-400/40 shadow-[0_0_28px_-6px] shadow-sky-500/40",
    chipClass: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  },
  {
    id: "hunter",
    name: "Hunter",
    epithet: "Gatebreaker",
    tagline: "Every gate hides treasure. You take both.",
    icon: Crosshair,
    iconClass: "text-teal-300",
    frameClass: "border-teal-400/40 shadow-[0_0_28px_-6px] shadow-teal-500/40",
    chipClass: "border-teal-400/40 bg-teal-400/10 text-teal-300",
  },
  {
    id: "titan",
    name: "Titan",
    epithet: "The Unmoving",
    tagline: "Mountains kneel to those who outlast them.",
    icon: Mountain,
    iconClass: "text-amber-300",
    frameClass: "border-amber-400/40 shadow-[0_0_28px_-6px] shadow-amber-500/40",
    chipClass: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  },
];

export function classMeta(id: ClassId): ClassMeta {
  return CLASSES.find((c) => c.id === id) ?? CLASSES[4];
}

/* ------------------------------------------------------------------ */
/* Quest difficulty                                                    */
/* ------------------------------------------------------------------ */

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const DIFFICULTY_XP: Record<Difficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; letter: string; chipClass: string; dotClass: string }
> = {
  easy: {
    label: "Easy",
    letter: "E",
    chipClass: "border-frost/40 bg-frost/10 text-frost",
    dotClass: "bg-frost",
  },
  medium: {
    label: "Medium",
    letter: "M",
    chipClass: "border-amethyst/40 bg-amethyst/10 text-amethyst",
    dotClass: "bg-amethyst",
  },
  hard: {
    label: "Hard",
    letter: "H",
    chipClass: "border-ember/40 bg-ember/10 text-ember",
    dotClass: "bg-ember",
  },
};

/* ------------------------------------------------------------------ */
/* Levels & ranks                                                      */
/* ------------------------------------------------------------------ */

/** XP required to advance from `level` to `level + 1`. */
export function xpToNext(level: number): number {
  return Math.floor(100 * Math.pow(1.18, level - 1));
}

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpNeeded: number;
}

export function levelFromTotalXp(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXp));
  while (remaining >= xpToNext(level) && level < 999) {
    remaining -= xpToNext(level);
    level += 1;
  }
  return { level, xpIntoLevel: remaining, xpNeeded: xpToNext(level) };
}

export interface RankMeta {
  name: string;
  minLevel: number;
  badgeClass: string;
}

export const RANKS: RankMeta[] = [
  {
    name: "Novice",
    minLevel: 1,
    badgeClass: "border-slate-400/40 bg-slate-400/10 text-slate-300",
  },
  {
    name: "Adept",
    minLevel: 10,
    badgeClass: "border-frost/40 bg-frost/10 text-frost",
  },
  {
    name: "Elite",
    minLevel: 20,
    badgeClass: "border-amethyst/40 bg-amethyst/10 text-amethyst",
  },
  {
    name: "Master",
    minLevel: 30,
    badgeClass: "border-ember/40 bg-ember/10 text-ember",
  },
  {
    name: "Legend",
    minLevel: 40,
    badgeClass:
      "border-amethyst/60 bg-gradient-to-r from-amethyst/25 via-ember/25 to-amethyst/25 text-amethyst-bright",
  },
];

export function rankForLevel(level: number): RankMeta {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (level >= r.minLevel) rank = r;
  }
  return rank;
}

/* ------------------------------------------------------------------ */
/* Save data                                                           */
/* ------------------------------------------------------------------ */

export interface Quest {
  id: string;
  title: string;
  difficulty: Difficulty;
  createdAt: number;
  /** local date key (YYYY-MM-DD) of the last day this quest was cleared */
  lastCompletedDate: string | null;
  totalCompletions: number;
}

export interface PlayerProfile {
  name: string;
  classId: ClassId;
  awakenedAt: number;
}

export interface GameSave {
  version: 1;
  profile: PlayerProfile | null;
  /** lifetime XP */
  xp: number;
  quests: Quest[];
  streak: number;
  bestStreak: number;
  /** local date key of the last day the player logged in */
  lastActiveDate: string | null;
  /** recent local date keys with activity (trimmed) */
  activeDates: string[];
  /** streak-reward milestone days already claimed */
  claimedRewards: number[];
  totalQuestCompletions: number;
}

export function emptySave(): GameSave {
  return {
    version: 1,
    profile: null,
    xp: 0,
    quests: [],
    streak: 0,
    bestStreak: 0,
    lastActiveDate: null,
    activeDates: [],
    claimedRewards: [],
    totalQuestCompletions: 0,
  };
}

const STORAGE_KEY = "ascension.save.v1";

export function loadSave(): GameSave {
  if (typeof window === "undefined") return emptySave();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySave();
    const parsed = JSON.parse(raw) as Partial<GameSave>;
    return { ...emptySave(), ...parsed, version: 1 };
  } catch {
    return emptySave();
  }
}

export function persistSave(save: GameSave): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } catch {
    // storage unavailable (private mode etc.) — game still plays in memory
  }
}

export function clearSave(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/* ------------------------------------------------------------------ */
/* Date helpers (local time)                                           */
/* ------------------------------------------------------------------ */

export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function diffDays(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round(
    (Date.UTC(ay, am - 1, ad) - Date.UTC(by, bm - 1, bd)) / 86_400_000,
  );
}

/** The last `count` local date keys, oldest first, ending today. */
export function recentDayKeys(count: number): string[] {
  const today = new Date();
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    keys.push(dateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)));
  }
  return keys;
}

/* ------------------------------------------------------------------ */
/* Pure game operations                                                */
/* ------------------------------------------------------------------ */

export type StreakEvent = "started" | "extended" | "resumed";

/** Call once per app open: extends/resets the daily login streak. */
export function rollStreak(
  save: GameSave,
): { save: GameSave; event: StreakEvent | null } {
  const today = dateKey();
  if (save.lastActiveDate === today) return { save, event: null };

  let streak: number;
  let event: StreakEvent;
  if (!save.lastActiveDate) {
    streak = 1;
    event = "started";
  } else if (diffDays(today, save.lastActiveDate) === 1) {
    streak = save.streak + 1;
    event = "extended";
  } else {
    streak = 1;
    event = "resumed";
  }

  const activeDates = Array.from(new Set([...save.activeDates, today]))
    .sort()
    .slice(-60);

  return {
    save: {
      ...save,
      streak,
      bestStreak: Math.max(save.bestStreak, streak),
      lastActiveDate: today,
      activeDates,
    },
    event,
  };
}

export function grantXp(
  save: GameSave,
  amount: number,
): {
  save: GameSave;
  levelsGained: number;
  before: LevelInfo;
  after: LevelInfo;
} {
  const before = levelFromTotalXp(save.xp);
  const after = levelFromTotalXp(save.xp + amount);
  return {
    save: { ...save, xp: save.xp + amount },
    levelsGained: after.level - before.level,
    before,
    after,
  };
}

export function createProfile(
  save: GameSave,
  name: string,
  classId: ClassId,
): GameSave {
  const trimmed = name.trim() || "Hunter";
  return {
    ...save,
    profile: { name: trimmed.slice(0, 24), classId, awakenedAt: Date.now() },
  };
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function addQuest(
  save: GameSave,
  title: string,
  difficulty: Difficulty,
): GameSave {
  const quest: Quest = {
    id: newId(),
    title: title.trim().slice(0, 80),
    difficulty,
    createdAt: Date.now(),
    lastCompletedDate: null,
    totalCompletions: 0,
  };
  return { ...save, quests: [...save.quests, quest] };
}

export function removeQuest(save: GameSave, questId: string): GameSave {
  return { ...save, quests: save.quests.filter((q) => q.id !== questId) };
}

export interface CompleteQuestResult {
  save: GameSave;
  xpGained: number;
  levelsGained: number;
  newLevel: number;
  /** name of the new rank if this completion crossed a rank threshold */
  rankUp: string | null;
}

export function completeQuestToday(
  save: GameSave,
  questId: string,
): CompleteQuestResult | null {
  const today = dateKey();
  const quest = save.quests.find((q) => q.id === questId);
  if (!quest || quest.lastCompletedDate === today) return null;

  const quests = save.quests.map((q) =>
    q.id === questId
      ? { ...q, lastCompletedDate: today, totalCompletions: q.totalCompletions + 1 }
      : q,
  );
  const base: GameSave = {
    ...save,
    quests,
    totalQuestCompletions: save.totalQuestCompletions + 1,
  };
  const xpGained = DIFFICULTY_XP[quest.difficulty];
  const { save: withXp, levelsGained, before, after } = grantXp(base, xpGained);
  const rankUp =
    rankForLevel(after.level).name !== rankForLevel(before.level).name
      ? rankForLevel(after.level).name
      : null;
  return { save: withXp, xpGained, levelsGained, newLevel: after.level, rankUp };
}

/* ------------------------------------------------------------------ */
/* Streak rewards                                                      */
/* ------------------------------------------------------------------ */

export interface StreakReward {
  day: number;
  xp: number;
  label: string;
}

export const STREAK_REWARDS: StreakReward[] = [
  { day: 3, xp: 50, label: "Iron Will" },
  { day: 7, xp: 150, label: "Hunter's Resolve" },
  { day: 14, xp: 400, label: "Mana Heart" },
  { day: 30, xp: 1000, label: "Monarch's Core" },
];

export type ClaimRewardResult =
  | { status: "granted"; save: GameSave; xpGained: number; levelsGained: number; newLevel: number }
  | { status: "locked" }
  | { status: "already" };

export function claimStreakReward(
  save: GameSave,
  day: number,
): ClaimRewardResult {
  if (save.claimedRewards.includes(day)) return { status: "already" };
  if (save.streak < day) return { status: "locked" };
  const { save: withXp, levelsGained, after } = grantXp(
    { ...save, claimedRewards: [...save.claimedRewards, day] },
    STREAK_REWARDS.find((r) => r.day === day)?.xp ?? 0,
  );
  return {
    status: "granted",
    save: withXp,
    xpGained: STREAK_REWARDS.find((r) => r.day === day)?.xp ?? 0,
    levelsGained,
    newLevel: after.level,
  };
}

/* ------------------------------------------------------------------ */
/* Achievements                                                        */
/* ------------------------------------------------------------------ */

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  goal: number;
  value: (save: GameSave) => number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "awakened",
    title: "The Awakening",
    description: "Choose your class and begin the climb.",
    icon: Sparkles,
    goal: 1,
    value: (s) => (s.profile ? 1 : 0),
  },
  {
    id: "first-quest",
    title: "First Quest",
    description: "Clear your first daily quest.",
    icon: Swords,
    goal: 1,
    value: (s) => s.totalQuestCompletions,
  },
  {
    id: "streak-7",
    title: "7-Day Streak",
    description: "Log in seven days in a row.",
    icon: Flame,
    goal: 7,
    value: (s) => s.bestStreak,
  },
  {
    id: "streak-30",
    title: "30-Day Streak",
    description: "A full month of unbroken discipline.",
    icon: Zap,
    goal: 30,
    value: (s) => s.bestStreak,
  },
  {
    id: "quests-100",
    title: "100 Quests Completed",
    description: "Clear 100 quests in total.",
    icon: Trophy,
    goal: 100,
    value: (s) => s.totalQuestCompletions,
  },
  {
    id: "level-10",
    title: "Ascendant",
    description: "Reach Level 10.",
    icon: Trophy,
    goal: 10,
    value: (s) => levelFromTotalXp(s.xp).level,
  },
];

export interface AchievementState {
  def: AchievementDef;
  unlocked: boolean;
  value: number;
  pct: number;
}

export function achievementState(save: GameSave): AchievementState[] {
  return ACHIEVEMENTS.map((def) => {
    const value = Math.min(def.value(save), def.goal);
    return {
      def,
      unlocked: def.value(save) >= def.goal,
      value,
      pct: Math.min(100, Math.round((value / def.goal) * 100)),
    };
  });
}

/* ------------------------------------------------------------------ */
/* Leaderboard (mock players)                                          */
/* ------------------------------------------------------------------ */

export interface MockHunter {
  name: string;
  classId: ClassId;
  xp: number;
}

export const MOCK_HUNTERS: MockHunter[] = [
  { name: "NovaStrike", classId: "hunter", xp: 48200 },
  { name: "ArcaneLily", classId: "mage", xp: 41350 },
  { name: "VoidWalker", classId: "shadow-monarch", xp: 36900 },
  { name: "IronWill_77", classId: "titan", xp: 28450 },
  { name: "Sylas_Grey", classId: "murim-warrior", xp: 22100 },
  { name: "HexCipher", classId: "cyber-knight", xp: 15750 },
  { name: "EmberKai", classId: "murim-warrior", xp: 9800 },
  { name: "LunarVale", classId: "mage", xp: 6400 },
  { name: "Grimshaw", classId: "hunter", xp: 3100 },
  { name: "DawnBlade", classId: "cyber-knight", xp: 1450 },
];

export interface LeaderRow {
  name: string;
  classId: ClassId | null;
  xp: number;
  level: number;
  isUser: boolean;
}

/**
 * Mock leaderboard with the local player inserted by lifetime XP.
 * Returns the visible rows plus the player's overall position.
 */
export function leaderboardRows(
  save: GameSave,
  limit = 8,
): { rows: LeaderRow[]; userRank: number; userRow: LeaderRow } {
  const all: LeaderRow[] = [
    ...MOCK_HUNTERS.map((h) => ({
      name: h.name,
      classId: h.classId,
      xp: h.xp,
      level: levelFromTotalXp(h.xp).level,
      isUser: false,
    })),
    {
      name: save.profile?.name ?? "You",
      classId: save.profile?.classId ?? null,
      xp: save.xp,
      level: levelFromTotalXp(save.xp).level,
      isUser: true,
    },
  ].sort((a, b) => b.xp - a.xp);

  const userIndex = all.findIndex((r) => r.isUser);
  const userRow = all[userIndex];
  const rows = all.slice(0, limit);
  if (userIndex >= limit) rows.push(userRow);

  return { rows, userRank: userIndex + 1, userRow };
}

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */

export function questsClearedToday(save: GameSave): number {
  const today = dateKey();
  return save.quests.filter((q) => q.lastCompletedDate === today).length;
}

/* ------------------------------------------------------------------ */
/* Activity heatmap                                                    */
/* ------------------------------------------------------------------ */

export interface ActivityDay {
  key: string;
  /** 0 = inactive, 1 = login only, 2 = 1–2 quests, 3 = 3+ quests */
  level: 0 | 1 | 2 | 3;
}

/**
 * Last `days` local days of activity, oldest first. Best-effort history:
 * per-quest completion history isn't stored, so past days reflect the
 * most recent completion of each surviving quest plus the login log.
 */
export function activityHeatmap(save: GameSave, days = 35): ActivityDay[] {
  const today = dateKey();
  const logins = new Set(save.activeDates);
  const out: ActivityDay[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const key = dateKey(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - i));
    const cleared = save.quests.filter((q) => q.lastCompletedDate === key).length;
    const active = logins.has(key) || cleared > 0;
    const level: ActivityDay["level"] = !active
      ? 0
      : cleared >= 3
        ? 3
        : cleared >= 1
          ? 2
          : 1;
    out.push({ key: key === today ? "today" : key, level });
  }
  return out;
}
