import { Link } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, User, Menu, X, Phone, Facebook, Instagram, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";

const NAV = [
  { label: "Home", to: "/" as const },
  { label: "Shop", to: "/shop" as const },
  { label: "Collections", to: "/shop" as const, search: { category: "women" } },
  { label: "New Arrivals", to: "/shop" as const, search: { sort: "new" } },
  { label: "Sale", to: "/shop" as const, search: { sale: true } },
  { label: "About", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
];

export function Header() {
  const { cartCount, wishlistCount } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/60">
      {/* Top bar */}
      <div className="bg-ink text-cream text-xs">
        <div className="container mx-auto flex items-center justify-between py-2 px-4">
          <div className="hidden md:flex items-center gap-6">
            <span className="text-accent">✦</span>
            <span>Free Shipping on Orders Over Rs. 5,000</span>
            <span className="opacity-40">|</span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" /> 0300-1234567
            </span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <span className="opacity-80">EN | UR</span>
            <span className="opacity-40">|</span>
            <span className="opacity-80">PKR</span>
            <span className="opacity-40 hidden md:inline">|</span>
            <div className="hidden md:flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="hover:text-accent transition-colors">
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-accent transition-colors">
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a href="#" aria-label="WhatsApp" className="hover:text-accent transition-colors">
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <button
          aria-label="Open menu"
          className="lg:hidden p-2 -ml-2"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link to="/" className="flex flex-col leading-none">
          <span className="font-logo text-2xl md:text-3xl text-primary tracking-wider">
            EASTERN
          </span>
          <span className="font-logo text-xs md:text-sm text-accent tracking-[0.4em] -mt-1">
            ELEGANCE
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 mx-auto">
          {NAV.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              className="text-sm font-medium tracking-wide hover:text-primary transition-colors relative group"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            aria-label="Search"
            className="p-2 hover:text-primary transition-colors"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="p-2 hover:text-primary transition-colors relative"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            aria-label="Cart"
            className="p-2 hover:text-primary transition-colors relative"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/account"
            aria-label="Account"
            className="p-2 hover:text-primary transition-colors hidden md:inline-flex"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-border bg-background animate-fade-up">
          <div className="container mx-auto px-4 py-4 flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              placeholder="Search for kurtis, sherwanis, accessories..."
              className="flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground"
            />
            <button onClick={() => setSearchOpen(false)} aria-label="Close search">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-ink/60" />
          <div
            className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-logo text-xl text-primary">EASTERN ELEGANCE</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  to={n.to}
                  className="py-3 px-2 text-base font-medium border-b border-border/50 hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/account"
                className="py-3 px-2 text-base font-medium border-b border-border/50"
                onClick={() => setMobileOpen(false)}
              >
                My Account
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
