import { createFileRoute } from "@tanstack/react-router";
import { useAdmin, type AdminOrder } from "@/context/AdminContext";
import { formatPKR } from "@/lib/format";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersAdmin,
});

const STATUSES: AdminOrder["status"][] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function OrdersAdmin() {
  const { orders, setOrderStatus, deleteOrder } = useAdmin();

  return (
    <div className="space-y-6">
      <header>
        <p className="font-logo text-xs text-accent tracking-[0.35em] mb-2">Fulfilment</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track and update the status of customer orders.
        </p>
      </header>

      <div className="bg-background border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Order</th>
              <th className="text-left px-4 py-3 font-semibold">Customer</th>
              <th className="text-right px-4 py-3 font-semibold">Total</th>
              <th className="text-left px-4 py-3 font-semibold">Date</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-secondary/20">
                <td className="px-4 py-3">
                  <p className="font-semibold">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{o.itemCount} items</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{o.customerName}</p>
                  <p className="text-xs text-muted-foreground">{o.email}</p>
                </td>
                <td className="px-4 py-3 text-right font-semibold">{formatPKR(o.total)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => {
                      setOrderStatus(o.id, e.target.value as AdminOrder["status"]);
                      toast.success(`Order ${o.id} updated`);
                    }}
                    className="text-xs border border-border bg-background rounded px-2 py-1.5 capitalize"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      if (confirm(`Delete order ${o.id}?`)) {
                        deleteOrder(o.id);
                        toast.success("Order deleted");
                      }
                    }}
                    className="p-2 hover:bg-destructive/10 rounded text-destructive"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
