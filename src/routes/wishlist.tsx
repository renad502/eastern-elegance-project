import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist — Eastern Elegance" },
      { name: "description", content: "Your saved favourites at Eastern Elegance." },
      { property: "og:title", content: "My Wishlist — Eastern Elegance" },
      { property: "og:description", content: "Your saved favourites." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useStore();
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="container mx-auto px-4 py-10">
      <p className="text-xs text-muted-foreground mb-2">
        <Link to="/" className="hover:text-primary">Home</Link> / Wishlist
      </p>
      <h1 className="font-display text-3xl md:text-4xl mb-8">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="mx-auto h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-6">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl mb-3">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">
            Save your favourite pieces for later — tap the heart on any product.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-ink transition-colors"
          >
            Discover Pieces <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
