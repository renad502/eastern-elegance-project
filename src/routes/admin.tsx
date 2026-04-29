import { createFileRoute, Outlet, Link, useRouter, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Inbox,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { AdminProvider, useAdmin } from "@/context/AdminContext";


export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Eastern Elegance" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminProvider>
      <AdminShell />
    </AdminProvider>
  );
}

function AdminShell() {
  const { isAuthed, logout } = useAdmin();
  const router = useRouter();
  const path = router.state.location.pathname;

  // If not logged in, redirect into login route (which is /admin index)
  useEffect(() => {
    if (!isAuthed && path !== "/admin") {
      router.navigate({ to: "/admin" });
    }
  }, [isAuthed, path, router]);

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <Outlet />
      </div>
    );
  }

  const nav = [
    { to: "/admin/dashboard" as const, label: "Dashboard", Icon: LayoutDashboard },
    { to: "/admin/products" as const, label: "Products", Icon: Package },
    { to: "/admin/categories" as const, label: "Categories", Icon: Tags },
    { to: "/admin/orders" as const, label: "Orders", Icon: ShoppingCart },
    { to: "/admin/messages" as const, label: "Messages", Icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-secondary/20 flex">
      <aside className="hidden md:flex w-64 bg-ink text-cream flex-col">
        <div className="px-6 py-6 border-b border-cream/10 flex items-baseline gap-2">
          <span className="font-display text-2xl text-accent leading-none">EE</span>
          <div className="leading-tight">
            <p className="font-display text-base text-cream font-semibold">Eastern Elegance</p>
            <p className="text-[10px] text-accent tracking-[0.3em] uppercase">Admin Portal</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {nav.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-cream/75 hover:bg-cream/5 hover:text-cream"
                }`}
              >
                <n.Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-cream/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-cream/75 hover:bg-cream/5 hover:text-cream transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> View Store
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-cream/75 hover:bg-destructive/20 hover:text-cream transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-ink text-cream px-4 py-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-xl text-accent leading-none">EE</span>
          <span className="font-display text-sm font-semibold">Admin</span>
        </div>
        <button
          onClick={logout}
          className="text-xs uppercase tracking-wider text-cream/80 hover:text-accent"
        >
          Sign Out
        </button>
      </div>

      <main className="flex-1 md:ml-0 mt-12 md:mt-0 overflow-x-auto">
        {/* Mobile nav strip */}
        <div className="md:hidden flex gap-1 overflow-x-auto px-3 py-2 bg-background border-b border-border">
          {nav.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium ${
                  active ? "bg-primary text-primary-foreground" : "text-foreground/70"
                }`}
              >
                <n.Icon className="h-3.5 w-3.5" />
                {n.label}
              </Link>
            );
          })}
        </div>
        <div className="p-6 md:p-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
