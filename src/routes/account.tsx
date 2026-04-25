import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Sign In — Eastern Elegance" },
      { name: "description", content: "Sign in to your Eastern Elegance account." },
      { property: "og:title", content: "Sign In — Eastern Elegance" },
      { property: "og:description", content: "Sign in to your account." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-secondary/30 border border-border rounded-md p-8">
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex flex-col leading-none mb-4">
            <span className="font-logo text-xl text-primary tracking-wider">EASTERN</span>
            <span className="font-logo text-[10px] text-accent tracking-[0.4em] -mt-0.5">ELEGANCE</span>
          </Link>
          <h1 className="font-display text-2xl mb-1">
            {mode === "login" ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? "Sign in to continue shopping" : "Join the Eastern Elegance family"}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.info("Connect Lovable Cloud to enable accounts");
          }}
          className="space-y-4"
        >
          {mode === "register" && (
            <input
              required
              placeholder="Full name"
              className="w-full border border-border bg-background rounded-sm px-4 py-3 text-sm outline-none focus:border-primary"
            />
          )}
          <input
            required
            type="email"
            placeholder="Email or phone"
            className="w-full border border-border bg-background rounded-sm px-4 py-3 text-sm outline-none focus:border-primary"
          />
          {mode === "register" && (
            <input
              placeholder="Phone number"
              className="w-full border border-border bg-background rounded-sm px-4 py-3 text-sm outline-none focus:border-primary"
            />
          )}
          <div className="relative">
            <input
              required
              type={showPw ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-border bg-background rounded-sm px-4 py-3 pr-11 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              aria-label="Toggle password"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {mode === "login" && (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-primary" /> Remember me
              </label>
              <a href="#" className="text-primary hover:underline">Forgot password?</a>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3.5 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-ink transition-colors"
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> OR <div className="flex-1 h-px bg-border" />
        </div>

        <div className="space-y-2">
          <button className="w-full border border-border py-3 rounded-sm text-sm font-semibold hover:bg-background transition-colors">
            Continue with Google
          </button>
          <button className="w-full border border-border py-3 rounded-sm text-sm font-semibold hover:bg-background transition-colors">
            Continue with Facebook
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-primary font-semibold hover:underline"
          >
            {mode === "login" ? "Register here" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
