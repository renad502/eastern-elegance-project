import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/**
 * Top-of-page loading bar that animates while the router is transitioning
 * between routes or while loaders are in flight. Provides clear feedback
 * during page navigation and content loading.
 */
export function RouteLoader() {
  const isLoading = useRouterState({
    select: (s) => s.isLoading || s.isTransitioning,
  });
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    let timeout: ReturnType<typeof setTimeout>;

    if (isLoading) {
      setVisible(true);
      setProgress(10);
      // Smoothly creep up to ~85% while loading
      const tick = () => {
        setProgress((p) => (p < 85 ? p + (85 - p) * 0.05 : p));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } else if (visible) {
      // Snap to 100, then fade out
      setProgress(100);
      timeout = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [isLoading, visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent pointer-events-none"
      role="progressbar"
      aria-label="Page loading"
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_10px_rgba(218,165,32,0.6)] transition-[width,opacity] duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}

/**
 * Inline spinner for content sections that are processing.
 */
export function Spinner({ size = "md", label }: { size?: "sm" | "md" | "lg"; label?: string }) {
  const sizes = { sm: "h-4 w-4 border-2", md: "h-8 w-8 border-[3px]", lg: "h-12 w-12 border-4" };
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <div
        className={`${sizes[size]} rounded-full border-accent/30 border-t-primary animate-spin`}
      />
      {label && <p className="text-sm text-muted-foreground tracking-wide">{label}</p>}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
