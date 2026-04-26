import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  Minus,
  Plus,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Share2,
  Facebook,
  Instagram,
  Copy,
} from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { formatPKR, discountPercent } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Product" }] };
    return {
      meta: [
        { title: `${p.name} — Eastern Elegance` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.name} — Eastern Elegance` },
        { property: "og:description", content: p.description },
        { property: "og:image", content: p.image },
        { property: "twitter:image", content: p.image },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [activeImg, setActiveImg] = useState(product.gallery[0] ?? product.image);
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"description" | "reviews" | "size" | "shipping">("description");
  const inWishlist = isInWishlist(product.id);
  const discount = discountPercent(product.price, product.originalPrice);
  const related = getRelatedProducts(product, 4);

  function handleAdd() {
    addToCart({ productId: product.id, size, color, quantity: qty });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> /{" "}
        <Link to="/shop" className="hover:text-primary">Shop</Link> /{" "}
        <span className="text-foreground">{product.name}</span>
      </div>

      <section className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 pb-16">
        {/* Gallery */}
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded-md bg-muted relative group">
            <img src={activeImg} alt={product.name} className="h-full w-full object-cover" />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-sm">
                -{discount}% OFF
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3 mt-4">
            {product.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(img)}
                className={`aspect-square overflow-hidden rounded-sm bg-muted border-2 transition-all ${activeImg === img ? "border-primary" : "border-transparent hover:border-border"}`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="font-logo text-xs text-accent tracking-[0.4em] mb-2">{product.subCategory}</p>
          <h1 className="font-display text-3xl md:text-4xl mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-accent text-accent" : "text-muted"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            SKU: {product.sku} &nbsp;|&nbsp; Brand: <span className="text-foreground">{product.brand}</span>
          </p>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-display text-3xl text-primary font-bold">{formatPKR(product.price)}</span>
            {product.originalPrice && (
              <span className="text-base text-muted-foreground line-through">
                {formatPKR(product.originalPrice)}
              </span>
            )}
          </div>
          {product.originalPrice && (
            <p className="text-sm text-success font-semibold mb-5">
              You save {formatPKR(product.originalPrice - product.price)} ({discount}% off)
            </p>
          )}

          <p
            className={`text-sm font-semibold mb-5 ${product.stock > 5 ? "text-success" : "text-destructive"}`}
          >
            {product.stock > 5 ? "In Stock" : `Only ${product.stock} left!`}
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed mb-7 pb-7 border-b border-border">
            {product.description}
          </p>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold uppercase tracking-wider">Select Size</p>
              <button className="text-xs text-primary underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-12 h-11 px-3 text-sm font-semibold border rounded-sm transition-all ${size === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider mb-2">
              Color: <span className="text-muted-foreground font-normal normal-case">{color}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  title={c.name}
                  className={`h-10 w-10 rounded-full border-2 transition-all ${color === c.name ? "border-primary scale-110 ring-2 ring-accent/40 ring-offset-2 ring-offset-background" : "border-border hover:border-primary"}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider mb-2">Quantity</p>
            <div className="inline-flex items-center border border-border rounded-sm">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-11 w-11 flex items-center justify-center hover:bg-muted"
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                className="w-16 text-center bg-transparent outline-none font-semibold"
              />
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="h-11 w-11 flex items-center justify-center hover:bg-muted"
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3 mb-7">
            <button
              onClick={handleAdd}
              className="w-full bg-primary text-primary-foreground py-4 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-ink transition-colors"
            >
              Add to Cart
            </button>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                onClick={handleAdd}
                className="bg-accent text-accent-foreground py-3.5 text-sm font-bold uppercase tracking-wider rounded-sm hover:bg-cream hover:text-ink transition-colors text-center"
              >
                Buy Now
              </Link>
              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
                }}
                className="border border-primary text-primary py-3.5 text-sm font-bold uppercase tracking-wider rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-2"
              >
                <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
                Wishlist
              </button>
            </div>
          </div>

          <div className="space-y-2.5 text-sm text-muted-foreground border-t border-border pt-6">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-accent" /> Free shipping on orders over Rs. 5,000
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" /> Cash on Delivery available
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-accent" /> 7-day easy return policy
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
            <Share2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Share:</span>
            {[Facebook, Instagram, Copy].map((Icon, i) => (
              <button
                key={i}
                className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="container mx-auto px-4 py-12 border-t border-border">
        <div className="flex flex-wrap gap-1 mb-8 border-b border-border">
          {[
            { id: "description", label: "Description" },
            { id: "reviews", label: `Reviews (${product.reviewCount})` },
            { id: "size", label: "Size Guide" },
            { id: "shipping", label: "Shipping Info" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`px-5 py-3 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 -mb-px ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="max-w-3xl">
          {tab === "description" && (
            <div className="prose prose-sm">
              <p className="text-base leading-relaxed mb-4">{product.description}</p>
              <h4 className="font-display text-lg mt-6 mb-2">Fabric & Care</h4>
              <p className="text-sm text-muted-foreground">{product.fabric}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  "Hand-finished embroidery",
                  "Premium fabric quality",
                  "Comfortable, true-to-size fit",
                  "Dry clean recommended",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-accent">✦</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "reviews" && (
            <div>
              <div className="flex items-center gap-6 mb-8 pb-6 border-b border-border">
                <div className="text-center">
                  <p className="font-display text-5xl text-primary">{product.rating}</p>
                  <div className="flex justify-center my-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < Math.round(product.rating) ? "fill-accent text-accent" : "text-muted"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{product.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = star === 5 ? 64 : star === 4 ? 24 : star === 3 ? 8 : star === 2 ? 2 : 2;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-4">{star}★</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-10 text-right text-muted-foreground">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-5">
                {[
                  { name: "Sana A.", date: "2 weeks ago", rating: 5, title: "Stunning quality!", text: "Even more beautiful than the photos. Fit is perfect and embroidery is exquisite." },
                  { name: "Mariam S.", date: "1 month ago", rating: 5, title: "Worth every rupee", text: "Bought for my engagement — got endless compliments. Wrapped beautifully too." },
                  { name: "Hira K.", date: "1 month ago", rating: 4, title: "Lovely outfit", text: "Color is slightly different from screen but absolutely gorgeous in person." },
                ].map((r, i) => (
                  <div key={i} className="border border-border rounded-md p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm">{r.name} <span className="ml-2 text-[10px] bg-success/15 text-success px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Verified</span></p>
                        <div className="flex mt-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className={`h-3 w-3 ${j < r.rating ? "fill-accent text-accent" : "text-muted"}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <p className="font-display text-base mb-1">{r.title}</p>
                    <p className="text-sm text-muted-foreground">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "size" && (
            <table className="w-full text-sm border border-border">
              <thead className="bg-secondary">
                <tr>
                  {["Size", "Bust (in)", "Waist (in)", "Hip (in)", "Length (in)"].map((h) => (
                    <th key={h} className="p-3 text-left font-display font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["XS", "32", "26", "34", "44"],
                  ["S", "34", "28", "36", "44"],
                  ["M", "36", "30", "38", "45"],
                  ["L", "38", "32", "40", "45"],
                  ["XL", "40", "34", "42", "46"],
                  ["XXL", "42", "36", "44", "46"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border">
                    {row.map((c, i) => (
                      <td key={i} className="p-3">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "shipping" && (
            <div className="space-y-4 text-sm">
              <p>📦 <strong>Standard Delivery:</strong> 3–5 business days — Rs. 200</p>
              <p>⚡ <strong>Express Delivery:</strong> 1–2 business days — Rs. 500</p>
              <p>🎁 <strong>Free shipping</strong> on all orders above Rs. 5,000 across Pakistan.</p>
              <p>🔄 Easy 7-day returns. Items must be unworn with tags attached.</p>
            </div>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container mx-auto px-4 py-16 border-t border-border">
          <h2 className="font-display text-2xl md:text-3xl text-center mb-10">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
