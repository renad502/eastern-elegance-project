import { Link } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, User, Menu, X, Phone, Facebook, Instagram } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import logoEE from "@/assets/logo-ee.png";

const NAV = [
  { label: "Home", to: "/" as const },
  { label: "Shop", to: "/shop" as const },
  { label: "About", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
];

export function Header() {
  const { cartCount, wishlistCount } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/60">
      {/* Main bar */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-6">
        <button
          aria-label="Open menu"
          className="lg:hidden p-2 -ml-2"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <span className="relative inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-gradient-gold/10 ring-1 ring-accent/30 transition-all group-hover:ring-accent/60">
            <img
              src={logoEE}
              alt="Eastern Elegance"
              className="h-9 md:h-11 w-auto object-contain"
            />
          </span>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-display text-[22px] md:text-[26px] text-primary tracking-[0.01em] font-semibold">
              Eastern Elegance
            </span>
            <span className="font-logo text-[10px] md:text-[11px] text-accent tracking-[0.36em] uppercase mt-1.5">
              Tradition · Style
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-12 xl:gap-16 mx-auto">
          {NAV.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              className="text-[13px] font-semibold tracking-[0.18em] uppercase hover:text-primary transition-colors relative group py-1"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
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
              placeholder="Search for kurtis, sherwanis..."
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
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-gold/10 ring-1 ring-accent/30">
                <img src={logoEE} alt="Eastern Elegance" className="h-8 w-auto" />
              </span>
              <span className="font-display text-lg text-primary font-semibold">Eastern Elegance</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="ml-auto">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  to={n.to}
                  className="py-3 px-2 text-base font-semibold tracking-wider uppercase border-b border-border/50 hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/account"
                className="py-3 px-2 text-base font-semibold tracking-wider uppercase border-b border-border/50"
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
