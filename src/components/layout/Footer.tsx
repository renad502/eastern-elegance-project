import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MessageCircle, MapPin, Phone, Mail, Send } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-ink text-cream/90 mt-24">
      <div className="container mx-auto px-4 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="inline-flex items-center mb-4 bg-cream rounded-md p-3" aria-label="Eastern Elegance — Home">
            <img
              src={logo}
              alt="Eastern Elegance"
              loading="lazy"
              className="h-16 w-auto object-contain"
            />
          </Link>
          <p className="text-sm text-cream/70 italic mb-4">"Where Tradition Meets Style"</p>
          <p className="text-sm text-cream/60 leading-relaxed mb-5">
            Crafted with care in Pakistan. We design heirloom-quality eastern wear and modern fusion
            pieces for the moments that matter.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, MessageCircle].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg text-cream mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-cream/70">
            {[
              { label: "About Us", to: "/about" },
              { label: "Contact", to: "/contact" },
              { label: "FAQs", to: "/contact" },
              { label: "Shipping Info", to: "/contact" },
              { label: "Returns Policy", to: "/contact" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="hover:text-accent transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-cream mb-4">Shop</h4>
          <ul className="space-y-2.5 text-sm text-cream/70">
            {["Women", "Men", "Kids", "Accessories", "Sale"].map((c) => (
              <li key={c}>
                <Link to="/shop" className="hover:text-accent transition-colors">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-cream mb-4">Stay in Touch</h4>
          <ul className="space-y-3 text-sm text-cream/70 mb-5">
            <li className="flex gap-2.5">
              <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
              <span>Liberty Market, Gulberg III, Lahore, Pakistan</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="h-4 w-4 mt-0.5 text-accent shrink-0" />
              <span>0300-1234567</span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="h-4 w-4 mt-0.5 text-accent shrink-0" />
              <span>hello@easternelegance.pk</span>
            </li>
          </ul>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex border border-cream/20 rounded-full overflow-hidden bg-cream/5"
          >
            <input
              type="email"
              placeholder="Your email"
              className="bg-transparent flex-1 px-4 py-2.5 text-sm placeholder:text-cream/40 outline-none"
            />
            <button
              type="submit"
              className="bg-accent text-accent-foreground px-4 hover:bg-accent/90 transition-colors"
              aria-label="Subscribe"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/50">
          <span>© 2026 Eastern Elegance. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-accent">Privacy Policy</a>
            <a href="#" className="hover:text-accent">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
