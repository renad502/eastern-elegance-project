import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Truck, Shield, RotateCcw, Headphones, ArrowRight, Quote, Star } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import promoEid from "@/assets/promo-eid.jpg";
import { CATEGORIES, getAllProducts } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eastern Elegance — Premium Eastern Wear & Modern Fusion" },
      {
        name: "description",
        content:
          "Discover hand-embroidered kurtis, sherwanis and lehengas at Eastern Elegance — luxury eastern fashion for every occasion.",
      },
      { property: "og:title", content: "Eastern Elegance — Where Tradition Meets Style" },
      {
        property: "og:description",
        content: "Premium eastern wear and modern fusion — crafted in Pakistan.",
      },
      { property: "og:image", content: hero1 },
      { property: "twitter:image", content: hero1 },
    ],
  }),
  component: HomePage,
});

const SLIDES = [
  {
    image: hero1,
    eyebrow: "Bridal Couture",
    title: "Bridal Wear & Sherwanis",
    sub: "Hand-embroidered bridal lehengas and regal sherwanis crafted for your most cherished moments.",
    cta: "Shop Bridal",
    align: "right" as const,
  },
  {
    image: hero2,
    eyebrow: "Premium Line",
    title: "Luxury Formal Wear",
    sub: "Statement sherwanis and tailored ensembles for unforgettable evenings.",
    cta: "Explore Collection",
  },
  {
    image: hero3,
    eyebrow: "Limited Time",
    title: "Up to 50% Off",
    sub: "End-of-season favourites at our most generous prices.",
    cta: "Grab Deals",
  },
];

function HomePage() {
  return (
    <>
      <HeroSlider />
      <CategoriesGrid />
      <TrendingSection />
      <PromoBanner />
      <BestSellers />
      <WhyUs />
      <Reviews />
      <BrandStatement />
    </>
  );
}

function BrandStatement() {
  return (
    <section className="relative overflow-hidden bg-gradient-brand text-cream py-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_20%_20%,_var(--color-accent)_0,_transparent_40%),radial-gradient(circle_at_80%_80%,_var(--color-accent)_0,_transparent_40%)]"
      />
      <div className="container mx-auto px-4 relative text-center max-w-3xl">
        <p className="font-logo text-xs text-accent tracking-[0.4em] mb-4">
          The Eastern Elegance Promise
        </p>
        <h2 className="font-display text-4xl md:text-5xl mb-5 leading-tight">
          Redefining Eastern Fashion
        </h2>
        <div className="ornament-divider mb-6"><span className="text-base">✦</span></div>
        <p className="text-cream/80 text-base md:text-lg leading-relaxed italic font-display">
          Discover a blend of tradition and modern elegance. At Eastern Elegance,
          every piece is crafted to make you stand out with confidence and grace.
        </p>
      </div>
    </section>
  );
}

function HeroSlider() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[560px] overflow-hidden bg-ink">
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" />
          <div className="container mx-auto px-4 relative h-full flex items-center">
            <div className="max-w-xl text-cream animate-fade-up" key={`${i}-${idx}`}>
              <p className="font-logo text-sm text-accent tracking-[0.4em] mb-4">{s.eyebrow}</p>
              <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-5">
                {s.title}
              </h1>
              <p className="text-lg text-cream/80 mb-8 max-w-md">{s.sub}</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-cream transition-colors shadow-gold"
              >
                {s.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      <button
        aria-label="Previous"
        onClick={() => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-cream/10 backdrop-blur border border-cream/20 text-cream flex items-center justify-center hover:bg-cream hover:text-ink transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        aria-label="Next"
        onClick={() => setIdx((i) => (i + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-cream/10 backdrop-blur border border-cream/20 text-cream flex items-center justify-center hover:bg-cream hover:text-ink transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`h-1.5 transition-all rounded-full ${i === idx ? "w-10 bg-accent" : "w-6 bg-cream/40"}`}
          />
        ))}
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="text-center mb-12">
      {eyebrow && (
        <p className="font-logo text-xs text-accent tracking-[0.4em] mb-3">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">{title}</h2>
      <div className="ornament-divider"><span className="text-base">✦</span></div>
    </div>
  );
}

function CategoriesGrid() {
  return (
    <section className="container mx-auto px-4 py-20">
      <SectionHeading eyebrow="Curated for you" title="Shop by Category" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to="/shop"
            search={{ category: c.id }}
            className="group relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-md bg-muted block"
          >
            <img
              src={c.image}
              alt={c.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover img-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
              <p className="font-logo text-[10px] text-accent tracking-[0.3em] mb-1">{c.tagline}</p>
              <h3 className="font-display text-2xl mb-2">{c.name}</h3>
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider border-b border-accent pb-0.5 group-hover:gap-3 transition-all">
                View All <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TrendingSection() {
  const trending = getAllProducts().slice(0, 8);
  return (
    <section className="container mx-auto px-4 py-20">
      <SectionHeading eyebrow="Loved this week" title="Trending Now" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
        {trending.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="text-center mt-14">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3.5 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          View All Products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

function PromoBanner() {
  const target = new Date(Date.now() + 15 * 86400000 + 6 * 3600000 + 23 * 60000);
  const { days, hours, minutes, seconds } = useCountdown(target);
  return (
    <section className="relative my-16 overflow-hidden">
      <div className="relative min-h-[420px] flex items-center">
        <img src={promoEid} alt="Eid Collection" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 to-ink/30" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-xl text-cream py-16">
            <p className="font-logo text-xs text-accent tracking-[0.4em] mb-3">Pre-Order Open</p>
            <h2 className="font-display text-4xl md:text-5xl mb-4 leading-tight">
              The Exclusive Eid Collection
            </h2>
            <p className="text-cream/75 mb-8">
              Heritage embroidery, modern silhouettes. Reserve yours before the world catches on.
            </p>
            <div className="grid grid-cols-4 gap-3 max-w-md mb-8">
              {[
                { v: days, l: "Days" },
                { v: hours, l: "Hours" },
                { v: minutes, l: "Minutes" },
                { v: seconds, l: "Seconds" },
              ].map((u) => (
                <div key={u.l} className="text-center bg-cream/10 backdrop-blur border border-cream/20 rounded-md py-3">
                  <div className="font-display text-2xl md:text-3xl text-accent">{String(u.v).padStart(2, "0")}</div>
                  <div className="text-[10px] uppercase tracking-widest text-cream/70">{u.l}</div>
                </div>
              ))}
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-7 py-3.5 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-cream transition-colors"
            >
              Reserve Yours <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function BestSellers() {
  const items = [...getAllProducts()].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6);
  const [start, setStart] = useState(0);
  const visible = 3;
  const max = items.length - visible;
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="font-logo text-xs text-accent tracking-[0.4em] mb-2">Customer Favourites</p>
          <h2 className="font-display text-3xl md:text-5xl">Best Sellers</h2>
        </div>
        <div className="flex gap-2">
          <button
            aria-label="Previous"
            onClick={() => setStart((s) => Math.max(0, s - 1))}
            disabled={start === 0}
            className="h-11 w-11 border border-border rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Next"
            onClick={() => setStart((s) => Math.min(max, s + 1))}
            disabled={start === max}
            className="h-11 w-11 border border-border rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out gap-5"
          style={{ transform: `translateX(calc(${-start} * (100% / ${visible} + 0px)))` }}
        >
          {items.map((p) => (
            <div key={p.id} className="shrink-0 w-1/2 md:w-1/3">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const features = [
    { Icon: Truck, title: "Free Shipping", text: "On all orders over Rs. 5,000" },
    { Icon: Shield, title: "Secure Payment", text: "100% safe & encrypted" },
    { Icon: RotateCcw, title: "Easy Returns", text: "Hassle-free 7-day returns" },
    { Icon: Headphones, title: "24/7 Support", text: "Dedicated customer care" },
  ];
  return (
    <section className="bg-secondary/40 py-20">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow="Our Promise" title="Why Eastern Elegance?" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="text-center group">
              <div className="mx-auto mb-5 h-20 w-20 rounded-full bg-cream border border-accent/30 flex items-center justify-center group-hover:bg-gradient-gold group-hover:border-accent transition-all shadow-soft">
                <f.Icon className="h-8 w-8 text-primary group-hover:text-accent-foreground transition-colors" />
              </div>
              <h3 className="font-display text-lg mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const REVIEWS = [
  {
    name: "Ayesha Khan",
    location: "Lahore, Pakistan",
    text: "Absolutely stunning craftsmanship. The embroidery on my anarkali was even more beautiful in person. Eastern Elegance has my heart.",
    initial: "AK",
  },
  {
    name: "Fatima R.",
    location: "Karachi, Pakistan",
    text: "Fast delivery, perfect fit, and the gold detailing is divine. I've already ordered three more pieces!",
    initial: "FR",
  },
  {
    name: "Hassan Ali",
    location: "Islamabad, Pakistan",
    text: "Got my wedding sherwani here — the quality is wedding-album worthy. Best shopping experience I've had online.",
    initial: "HA",
  },
];

function Reviews() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % REVIEWS.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="container mx-auto px-4 py-24">
      <SectionHeading eyebrow="Kind Words" title="What Our Customers Say" />
      <div className="max-w-3xl mx-auto text-center">
        <Quote className="h-10 w-10 text-accent/40 mx-auto mb-6" />
        <p className="font-display text-xl md:text-2xl text-foreground italic leading-relaxed mb-8 min-h-[120px]">
          "{REVIEWS[idx].text}"
        </p>
        <div className="flex items-center justify-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-accent text-accent" />
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-gradient-gold flex items-center justify-center font-display text-base text-accent-foreground">
            {REVIEWS[idx].initial}
          </div>
          <div>
            <p className="font-semibold">{REVIEWS[idx].name}</p>
            <p className="text-xs text-muted-foreground">{REVIEWS[idx].location}</p>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-accent" : "w-4 bg-border"}`}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

