import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatPKR } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Cart — Eastern Elegance" },
      { name: "description", content: "Review and check out the items in your shopping bag." },
      { property: "og:title", content: "Shopping Cart — Eastern Elegance" },
      { property: "og:description", content: "Review and check out your selections." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { resolvedCart, updateCartQty, removeFromCart, clearCart, cartSubtotal } = useStore();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(200);

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "SAVE20") {
      setDiscount(Math.round(cartSubtotal * 0.2));
      toast.success("Coupon applied — 20% off!");
    } else {
      toast.error("Invalid coupon code");
    }
  }

  const total = cartSubtotal + (cartSubtotal > 0 ? shipping : 0) - discount;

  if (resolvedCart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl mb-3">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Discover beautiful pieces waiting for you.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-ink transition-colors"
        >
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <p className="text-xs text-muted-foreground mb-2">
        <Link to="/" className="hover:text-primary">Home</Link> / Shopping Cart
      </p>
      <h1 className="font-display text-3xl md:text-4xl mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div>
          <div className="hidden md:grid grid-cols-[1fr_120px_140px_120px_60px] gap-4 pb-3 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <span>Product</span>
            <span className="text-center">Price</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Subtotal</span>
            <span></span>
          </div>

          {resolvedCart.map(({ item, product, lineTotal }) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="grid grid-cols-[80px_1fr] md:grid-cols-[1fr_120px_140px_120px_60px] gap-4 py-5 border-b border-border items-center"
            >
              <div className="md:col-span-1 col-span-2 flex gap-4 items-center">
                <Link to="/product/$slug" params={{ slug: product.slug }}>
                  <img src={product.image} alt={product.name} className="h-20 w-20 object-cover rounded-sm" />
                </Link>
                <div>
                  <Link to="/product/$slug" params={{ slug: product.slug }}>
                    <p className="font-display text-sm md:text-base hover:text-primary">{product.name}</p>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Size: {item.size} • Color: {item.color}
                  </p>
                  <p className="md:hidden mt-1 text-sm text-primary font-semibold">{formatPKR(product.price)}</p>
                </div>
              </div>
              <p className="hidden md:block text-center text-sm">{formatPKR(product.price)}</p>
              <div className="flex md:justify-center">
                <div className="inline-flex items-center border border-border rounded-sm">
                  <button
                    onClick={() => updateCartQty(item.productId, item.size, item.color, item.quantity - 1)}
                    className="h-9 w-9 flex items-center justify-center hover:bg-muted"
                    aria-label="Decrease"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQty(item.productId, item.size, item.color, item.quantity + 1)}
                    className="h-9 w-9 flex items-center justify-center hover:bg-muted"
                    aria-label="Increase"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <p className="text-right md:text-right text-sm font-semibold text-primary">
                {formatPKR(lineTotal)}
              </p>
              <button
                onClick={() => {
                  removeFromCart(item.productId, item.size, item.color);
                  toast.success("Item removed");
                }}
                aria-label="Remove"
                className="md:justify-self-end p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
            <Link to="/shop" className="text-sm text-primary hover:underline">
              ← Continue Shopping
            </Link>
            <button
              onClick={() => {
                clearCart();
                toast.success("Cart cleared");
              }}
              className="text-sm border border-border px-4 py-2 rounded-sm hover:bg-secondary"
            >
              Clear Cart
            </button>
          </div>

          <div className="mt-8 max-w-md">
            <p className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4 text-accent" /> Have a coupon code?
            </p>
            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Try SAVE20"
                className="flex-1 border border-border rounded-sm px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button
                onClick={applyCoupon}
                className="bg-ink text-cream px-5 text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-primary"
              >
                Apply
              </button>
            </div>
            {discount > 0 && (
              <p className="text-xs text-success mt-2">
                ✓ Coupon applied — you saved {formatPKR(discount)}
              </p>
            )}
          </div>
        </div>

        <aside className="bg-secondary/40 border border-border rounded-md p-6 h-fit lg:sticky lg:top-32">
          <h2 className="font-display text-xl mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm pb-5 border-b border-border">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPKR(cartSubtotal)}</span>
            </div>
            <div>
              <p className="text-muted-foreground mb-1.5">Shipping</p>
              {[
                { id: 200, label: "Standard (3–5 days)", price: 200 },
                { id: 500, label: "Express (1–2 days)", price: 500 },
              ].map((s) => (
                <label key={s.id} className="flex items-center justify-between py-1 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shipping === s.id}
                      onChange={() => setShipping(s.id)}
                      className="accent-primary"
                    />
                    {s.label}
                  </span>
                  <span>{formatPKR(s.price)}</span>
                </label>
              ))}
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{formatPKR(discount)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-baseline pt-5 mb-5">
            <span className="font-display text-lg">Total</span>
            <span className="font-display text-2xl text-primary font-bold">{formatPKR(total)}</span>
          </div>
          <button
            onClick={() => toast.success("Checkout coming soon — connect Lovable Cloud to enable orders")}
            className="w-full bg-primary text-primary-foreground py-4 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-ink transition-colors"
          >
            Proceed to Checkout
          </button>
          <Link
            to="/shop"
            className="block text-center text-xs text-muted-foreground mt-3 hover:text-primary"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
