import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Mail, CheckCircle2 } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/messages")({
  component: MessagesAdmin,
});

function MessagesAdmin() {
  const { messages, markMessage, deleteMessage } = useAdmin();
  const [activeId, setActiveId] = useState<string | null>(messages[0]?.id ?? null);
  const active = messages.find((m) => m.id === activeId) ?? messages[0];

  return (
    <div className="space-y-6">
      <header>
        <p className="font-logo text-xs text-accent tracking-[0.35em] mb-2">Inbox</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold">Customer Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Inquiries submitted through the contact form on the website.
        </p>
      </header>

      {messages.length === 0 ? (
        <div className="bg-background border border-border rounded-lg p-12 text-center">
          <Mail className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-display text-lg font-semibold mb-1">No messages yet</p>
          <p className="text-sm text-muted-foreground">
            New inquiries from the contact form will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[320px_1fr] gap-5">
          <ul className="bg-background border border-border rounded-lg overflow-hidden divide-y divide-border max-h-[70vh] overflow-y-auto">
            {messages.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => {
                    setActiveId(m.id);
                    if (m.status === "new") markMessage(m.id, "read");
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-secondary/30 transition-colors ${
                    active?.id === m.id ? "bg-secondary/40" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm truncate">{m.name}</p>
                    {m.status === "new" && (
                      <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded shrink-0">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{m.subject}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {active && (
            <article className="bg-background border border-border rounded-lg p-6">
              <header className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-border mb-4">
                <div>
                  <h2 className="font-display text-xl font-semibold">{active.subject}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    From <strong className="text-foreground">{active.name}</strong> ·{" "}
                    <a className="text-primary" href={`mailto:${active.email}`}>
                      {active.email}
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(active.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      markMessage(active.id, "replied");
                      toast.success("Marked as replied");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs bg-success/15 text-success border border-success/30 px-3 py-1.5 rounded hover:bg-success/25"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mark replied
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this message?")) {
                        deleteMessage(active.id);
                        setActiveId(null);
                        toast.success("Message deleted");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs bg-destructive/10 text-destructive border border-destructive/30 px-3 py-1.5 rounded hover:bg-destructive/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </header>
              <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                {active.message}
              </p>
            </article>
          )}
        </div>
      )}
    </div>
  );
}
