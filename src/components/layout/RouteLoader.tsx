import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/**
 * Top-of-page loading indicator that shows during route transitions.
 * Adds a slight visible delay to provide clear feedback even on fast navigations.
 */
export function RouteLoader() {
  const isLoading = useRouterState({ select: (s) => s.isLoading || s.isTransitioning });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isLoading) {
      setVisible(true);
    } else if (visible) {
      // Keep visible briefly so users always see the indicator
      timer = setTimeout(() => setVisible(false), 350);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, visible]);

  if (!visible) return null;

  return (
    <>
      {/* Top progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-accent to-primary animate-route-bar" />
      </div>
      {/* Centered spinner overlay */}
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-0 z-[99] flex items-center justify-center bg-background/40 backdrop-blur-[2px] pointer-events-none animate-fade-in"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-accent animate-spin" />
          </div>
          <span className="font-display text-xs tracking-[0.3em] uppercase text-primary/80">
            Loading
          </span>
        </div>
      </div>
    </>
  );
}
