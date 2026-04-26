import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Eastern Elegance" },
      { name: "description", content: "Get in touch with the Eastern Elegance team. We're here to help." },
      { property: "og:title", content: "Contact Us — Eastern Elegance" },
      { property: "og:description", content: "Get in touch with the Eastern Elegance team." },
    ],
  }),
  component: ContactPage,
});

const MSG_KEY = "ee_admin_messages_v1";

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="container mx-auto px-4 py-10">
      <p className="text-xs text-muted-foreground mb-2 tracking-wide">
        <Link to="/" className="hover:text-primary">Home</Link> / Contact
      </p>
      <div className="text-center mb-14 mt-6">
        <p className="font-logo text-xs text-accent tracking-[0.4em] mb-3">We'd Love to Hear From You</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">Get in Touch</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14 max-w-5xl mx-auto">
        {[
          { Icon: MapPin, title: "Visit Us", text: "Liberty Market, Gulberg III, Lahore, Pakistan" },
          { Icon: Phone, title: "Call Us", text: "0300-1234567" },
          { Icon: Mail, title: "Email", text: "hello@easternelegance.pk" },
          { Icon: Clock, title: "Hours", text: "Mon–Sat: 11am–9pm PKT" },
        ].map((c) => (
          <div key={c.title} className="text-center bg-secondary/30 border border-border rounded-md p-6">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-cream border border-accent/40 flex items-center justify-center">
              <c.Icon className="h-5 w-5 text-accent" />
            </div>
            <p className="font-display text-base mb-1 font-semibold">{c.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitting(true);
            const form = e.target as HTMLFormElement;
            const data = new FormData(form);
            const msg = {
              id: `m_${Date.now()}`,
              name: String(data.get("name") || ""),
              email: String(data.get("email") || ""),
              subject: String(data.get("subject") || "(no subject)"),
              message: String(data.get("message") || ""),
              createdAt: new Date().toISOString(),
              status: "new" as const,
            };
            try {
              const raw = window.localStorage.getItem(MSG_KEY);
              const list = raw ? JSON.parse(raw) : [];
              list.unshift(msg);
              window.localStorage.setItem(MSG_KEY, JSON.stringify(list));
            } catch {}
            setTimeout(() => {
              toast.success("Thanks! We'll be in touch shortly.");
              form.reset();
              setSubmitting(false);
            }, 600);
          }}
          className="bg-secondary/30 border border-border rounded-md p-7"
        >
          <h2 className="font-display text-2xl mb-5 font-semibold">Send a Message</h2>
          <div className="space-y-4">
            <input
              required
              name="name"
              placeholder="Full name"
              className="w-full border border-border bg-background rounded-sm px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
            <input
              required
              type="email"
              name="email"
              placeholder="Email address"
              className="w-full border border-border bg-background rounded-sm px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
            <input
              name="subject"
              placeholder="Subject"
              className="w-full border border-border bg-background rounded-sm px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
            <textarea
              required
              name="message"
              placeholder="Your message"
              rows={5}
              className="w-full border border-border bg-background rounded-sm px-4 py-3 text-sm outline-none focus:border-primary resize-none transition-colors"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3.5 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-ink transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {submitting ? "Sending…" : (<>Send Message <Send className="h-4 w-4" /></>)}
            </button>
          </div>
        </form>

        <div className="bg-cream border border-border rounded-md p-7">
          <h2 className="font-display text-2xl mb-3 font-semibold">Common Questions</h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Quick answers to the questions our customers ask most often. For anything else, drop us
            a message — we usually reply within a few hours.
          </p>

          <div className="divide-y divide-border">
            <details className="py-4 group">
              <summary className="cursor-pointer text-sm font-semibold flex justify-between items-center">
                How long does shipping take?
                <span className="text-accent group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Standard delivery takes 3–5 business days; express is 1–2 days.
              </p>
            </details>
            <details className="py-4 group">
              <summary className="cursor-pointer text-sm font-semibold flex justify-between items-center">
                What is your return policy?
                <span className="text-accent group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                7-day easy returns on unworn items with original tags.
              </p>
            </details>
            <details className="py-4 group">
              <summary className="cursor-pointer text-sm font-semibold flex justify-between items-center">
                Do you offer custom tailoring?
                <span className="text-accent group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Yes — send us a message above for custom measurements and bridal commissions.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
