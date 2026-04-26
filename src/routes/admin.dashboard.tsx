import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, ShoppingCart, Inbox, TrendingUp } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { formatPKR } from "@/lib/format";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { products, orders, messages } = useAdmin();

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const newMessages = messages.filter((m) => m.status === "new").length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;

  const stats = [
    {
      Icon: Package,
      label: "Total Products",
      value: products.length.toString(),
      hint: `${products.filter((p) => p.stock < 5).length} low stock`,
      to: "/admin/products" as const,
      tint: "from-amber-500/15",
    },
    {
      Icon: ShoppingCart,
      label: "Orders",
      value: orders.length.toString(),
      hint: `${pendingOrders} need action`,
      to: "/admin/orders" as const,
      tint: "from-blue-500/15",
    },
    {
      Icon: Inbox,
      label: "Messages",
      value: messages.length.toString(),
      hint: `${newMessages} unread`,
      to: "/admin/messages" as const,
      tint: "from-emerald-500/15",
    },
    {
      Icon: TrendingUp,
      label: "Revenue",
      value: formatPKR(revenue),
      hint: "Lifetime (mock)",
      to: "/admin/orders" as const,
      tint: "from-rose-500/15",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="font-logo text-xs text-accent tracking-[0.35em] mb-2">Overview</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A quick look at how Eastern Elegance is performing today.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className={`relative bg-background border border-border rounded-lg p-5 hover:shadow-soft transition-all bg-gradient-to-br ${s.tint} to-transparent`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <s.Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {s.label}
            </p>
            <p className="font-display text-2xl font-semibold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.hint}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-background border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{o.customerName}</p>
                  <p className="text-xs text-muted-foreground">{o.id} • {o.itemCount} items</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatPKR(o.total)}</p>
                  <span className={`text-[10px] uppercase tracking-wider ${statusTone(o.status)}`}>
                    {o.status}
                  </span>
                </div>
              </li>
            ))}
            {orders.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">No orders yet.</li>
            )}
          </ul>
        </section>

        <section className="bg-background border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Recent Messages</h2>
            <Link to="/admin/messages" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {messages.slice(0, 5).map((m) => (
              <li key={m.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.subject}</p>
                  </div>
                  {m.status === "new" && (
                    <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                  )}
                </div>
              </li>
            ))}
            {messages.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">
                No customer messages yet. They'll appear here once submitted via the contact form.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

function statusTone(status: string) {
  switch (status) {
    case "pending":
      return "text-amber-600";
    case "processing":
      return "text-blue-600";
    case "shipped":
      return "text-indigo-600";
    case "delivered":
      return "text-emerald-600";
    case "cancelled":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
}
