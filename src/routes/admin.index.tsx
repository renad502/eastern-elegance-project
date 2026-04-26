import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import logoEE from "@/assets/logo-ee.png";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminLogin,
});

function AdminLogin() {
  const { isAuthed, login } = useAdmin();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthed) router.navigate({ to: "/admin/dashboard" });
  }, [isAuthed, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const ok = login(username, password);
      setLoading(false);
      if (ok) {
        toast.success("Welcome back, admin");
        router.navigate({ to: "/admin/dashboard" });
      } else {
        setError("Invalid credentials. Try admin / admin123");
      }
    }, 500);
  }

  return (
    <div className="min-h-[calc(100vh-3rem)] md:min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-background border border-border rounded-xl shadow-elegant p-8">
        <div className="flex flex-col items-center mb-7 text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold/10 ring-1 ring-accent/40 mb-4">
            <img src={logoEE} alt="Eastern Elegance" className="h-12 w-auto" />
          </span>
          <p className="font-logo text-xs text-accent tracking-[0.4em] mb-1">Admin Portal</p>
          <h1 className="font-display text-2xl font-semibold">Eastern Elegance</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage your store</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Username
            </label>
            <input
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full border border-border bg-background rounded-sm px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-border bg-background rounded-sm px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          {error && (
            <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-sm px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-ink transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              "Signing in…"
            ) : (
              <>
                <Lock className="h-4 w-4" /> Sign In <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[11px] text-muted-foreground mt-6">
          Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}
