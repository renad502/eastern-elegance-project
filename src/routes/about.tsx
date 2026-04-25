import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Heart, Award } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Eastern Elegance" },
      {
        name: "description",
        content:
          "The story behind Eastern Elegance — heritage craftsmanship meets modern fashion, made in Pakistan.",
      },
      { property: "og:title", content: "About Us — Eastern Elegance" },
      {
        property: "og:description",
        content: "Heritage craftsmanship meets modern fashion, made in Pakistan.",
      },
      { property: "og:image", content: hero1 },
      { property: "twitter:image", content: hero1 },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-ink">
        <img src={hero1} alt="Eastern Elegance" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
        <div className="container mx-auto px-4 relative h-full flex items-end pb-16">
          <div className="text-cream max-w-2xl">
            <p className="font-logo text-xs text-accent tracking-[0.4em] mb-3">Our Story</p>
            <h1 className="font-display text-5xl md:text-6xl">Heritage, Reimagined</h1>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 max-w-3xl">
        <p className="font-display text-2xl leading-relaxed text-foreground mb-6 text-balance">
          Eastern Elegance was born from a simple belief — that the artistry of South Asian fashion
          deserves a global stage, in pieces that feel as relevant today as they did generations ago.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          From our atelier in Lahore, we work with master karigars and small-batch ateliers to create
          embroidery, drape, and tailoring of the highest order. Every kurti, sherwani, and dupatta
          carries the rhythm of hand-finished detail — and the comfort of a modern silhouette.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          We believe in slow fashion, fair partnerships, and pieces you'll keep in your wardrobe
          for years. Welcome to a different kind of luxury.
        </p>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-10 max-w-5xl">
          {[
            { Icon: Sparkles, title: "Crafted by Hand", text: "Every embroidery and finish is hand-finished by master artisans." },
            { Icon: Heart, title: "Made with Care", text: "Fair partnerships, ethical sourcing, slow-fashion principles." },
            { Icon: Award, title: "Heirloom Quality", text: "Pieces designed to be cherished and worn for years to come." },
          ].map((v) => (
            <div key={v.title} className="text-center">
              <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-cream border border-accent/40 flex items-center justify-center">
                <v.Icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-display text-xl mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 text-center max-w-xl">
        <h2 className="font-display text-3xl mb-4">Discover the Collection</h2>
        <p className="text-muted-foreground mb-7">
          Explore the season's most loved pieces.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-ink transition-colors"
        >
          Shop Now
        </Link>
      </section>
    </>
  );
}
