import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="grid-bg flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
        <div className="animate-pulse-glow flex size-12 items-center justify-center rounded-lg border border-amethyst/40 bg-amethyst/10">
          <Loader2 className="size-5 animate-spin text-amethyst" />
        </div>
        <p className="font-display text-xs tracking-[0.3em] text-muted-foreground">
          VERIFYING HUNTER REGISTRY…
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/auth?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    );
  }

  return children;
}
