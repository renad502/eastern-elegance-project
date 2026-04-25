import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { toast } from "sonner";

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

function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <p className="text-xs text-muted-foreground mb-2">
        <Link to="/" className="hover:text-primary">Home</Link> / Contact
      </p>
      <div className="text-center mb-12 mt-6">
        <p className="font-logo text-xs text-accent tracking-[0.4em] mb-3">We'd Love to Hear From You</p>
        <h1 className="font-display text-4xl md:text-5xl">Get in Touch</h1>
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
            <p className="font-display text-base mb-1">{c.title}</p>
            <p className="text-sm text-muted-foreground">{c.text}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Thanks! We'll be in touch shortly.");
            (e.target as HTMLFormElement).reset();
          }}
          className="bg-secondary/30 border border-border rounded-md p-7"
        >
          <h2 className="font-display text-2xl mb-5">Send a Message</h2>
          <div className="space-y-4">
            <input
              required
              placeholder="Full name"
              className="w-full border border-border bg-background rounded-sm px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              required
              type="email"
              placeholder="Email address"
              className="w-full border border-border bg-background rounded-sm px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              placeholder="Subject"
              className="w-full border border-border bg-background rounded-sm px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <textarea
              required
              placeholder="Your message"
              rows={5}
              className="w-full border border-border bg-background rounded-sm px-4 py-3 text-sm outline-none focus:border-primary resize-none"
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3.5 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-ink transition-colors"
            >
              Send Message
            </button>
          </div>
        </form>

        <div className="bg-cream border border-border rounded-md p-7">
          <h2 className="font-display text-2xl mb-5">Quick WhatsApp</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Chat with our styling team in real time. We're available 7 days a week to help with
            sizing, custom orders, and styling questions.
          </p>
          <a
            href="https://wa.me/923001234567"
            className="inline-flex items-center gap-2 bg-success text-success-foreground px-6 py-3.5 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="h-4 w-4" /> Message on WhatsApp
          </a>

          <div className="mt-10 pt-6 border-t border-border">
            <h3 className="font-display text-lg mb-4">Common Questions</h3>
            <details className="border-b border-border py-3">
              <summary className="cursor-pointer text-sm font-semibold">How long does shipping take?</summary>
              <p className="mt-2 text-sm text-muted-foreground">Standard delivery takes 3–5 business days; express is 1–2 days.</p>
            </details>
            <details className="border-b border-border py-3">
              <summary className="cursor-pointer text-sm font-semibold">What is your return policy?</summary>
              <p className="mt-2 text-sm text-muted-foreground">7-day easy returns on unworn items with original tags.</p>
            </details>
            <details className="py-3">
              <summary className="cursor-pointer text-sm font-semibold">Do you offer custom tailoring?</summary>
              <p className="mt-2 text-sm text-muted-foreground">Yes — message us on WhatsApp for custom measurements and bridal commissions.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
