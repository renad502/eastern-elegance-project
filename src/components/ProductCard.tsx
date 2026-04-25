import { Link } from "@tanstack/react-router";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { type Product } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { formatPKR, discountPercent } from "@/lib/format";
import { toast } from "sonner";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { toggleWishlist, isInWishlist, addToCart } = useStore();
  const inWishlist = isInWishlist(product.id);
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <article className="group relative">
      <div className="relative overflow-hidden bg-muted aspect-[4/5] rounded-md">
        <Link to="/product/$slug" params={{ slug: product.slug }} className="block h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover img-zoom"
          />
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge === "new" && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-accent text-accent-foreground text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm">
              -{discount}%
            </span>
          )}
          {product.badge === "bestseller" && (
            <span className="bg-ink text-cream text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => {
            toggleWishlist(product.id);
            toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
          }}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-soft hover:bg-background transition-colors"
        >
          <Heart
            className={`h-4 w-4 transition-all ${inWishlist ? "fill-destructive text-destructive scale-110" : "text-foreground"}`}
          />
        </button>

        {/* Quick view */}
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          aria-label="Quick view"
          className="absolute bottom-14 right-3 z-10 h-9 w-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-soft opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all"
        >
          <Eye className="h-4 w-4" />
        </Link>

        {/* Add to cart */}
        <button
          onClick={() => {
            addToCart({
              productId: product.id,
              size: product.sizes[0],
              color: product.colors[0].name,
              quantity: 1,
            });
            toast.success(`${product.name} added to cart`);
          }}
          className="absolute left-3 right-3 bottom-3 z-10 bg-primary text-primary-foreground text-xs font-semibold tracking-wider uppercase py-2.5 rounded-sm flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:bg-ink"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Add to Cart
        </button>
      </div>

      <div className="pt-4 px-1">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
          {product.subCategory}
        </p>
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          <h3 className="font-display text-base text-foreground line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.round(product.rating) ? "fill-accent text-accent" : "text-muted"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-display text-lg text-primary font-semibold">
            {formatPKR(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPKR(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
