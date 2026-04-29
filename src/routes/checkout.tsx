import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Truck, ShieldCheck, Banknote, ArrowRight } from "lucide-react";
import { z } from "zod";
import { useStore } from "@/context/StoreContext";
import { formatPKR } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Eastern Elegance" },
      { name: "description", content: "Complete your order with Cash on Delivery." },
      { property: "og:title", content: "Checkout — Eastern Elegance" },
      { property: "og:description", content: "Secure checkout with Cash on Delivery across Pakistan." },
    ],
  }),
  component: CheckoutPage,
});

const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(80, "Name too long"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+92|0)?3\d{9}$/, "Enter a valid Pakistani phone (e.g. 03001234567)"),
  street: z.string().trim().min(5, "Street address is required").max(200),
  city: z.string().trim().min(2, "City is required").max(60),
  postalCode: z.string().trim().regex(/^\d{4,6}$/, "Enter a valid postal code"),
  email: z
    .string()
    .trim()
    .max(255)
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  codConfirmed: z.literal(true, {
    errorMap: () => ({ message: "Please confirm Cash on Delivery to continue" }),
  }),
});

type FormState = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  email: string;
  notes: string;
  codConfirmed: boolean;
};

type Errors = Partial<Record<keyof FormState, string>>;

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EE-${ts}-${rand}`;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { resolvedCart, cartSubtotal, clearCart } = useStore();
  const [form, setForm] = useState<FormState>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    email: "",
    notes: "",
    codConfirmed: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<null | {
    orderNumber: string;
    name: string;
    address: string;
    total: number;
    eta: string;
  }>(null);

  const shipping = cartSubtotal >= 5000 ? 0 : 200;
  const total = cartSubtotal + shipping;

  const etaText = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() + 3);
    const end = new Date();
    end.setDate(end.getDate() + 5);
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-PK", { weekday: "short", month: "short", day: "numeric" });
    return `${fmt(start)} – ${fmt(end)}`;
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof FormState;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const orderNumber = generateOrderNumber();
      setConfirmation({
        orderNumber,
        name: form.fullName,
        address: `${form.street}, ${form.city} ${form.postalCode}`,
        total,
        eta: etaText,
      });
      clearCart();
      setSubmitting(false);
      toast.success("Order placed successfully!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);
  }

  if (confirmation) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-20 rounded-full bg-success/10 flex items-center justify-center mb-5">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl mb-2">Thank you, {confirmation.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">Your order has been placed successfully.</p>
        </div>

        <div className="border border-border rounded-md p-6 bg-secondary/30 space-y-4">
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-sm text-muted-foreground">Order Number</span>
            <span className="font-mono font-semibold text-primary">{confirmation.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="font-display text-lg font-bold">{formatPKR(confirmation.total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Payment Method</span>
            <span className="text-sm font-semibold">Cash on Delivery</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-muted-foreground shrink-0">Delivery Address</span>
            <span className="text-sm text-right">{confirmation.address}</span>
          </div>
          <div className="flex justify-between items-center bg-accent/10 -mx-6 -mb-6 px-6 py-4 rounded-b-md mt-4">
            <span className="text-sm flex items-center gap-2 font-semibold">
              <Truck className="h-4 w-4 text-accent" /> Estimated Delivery
            </span>
            <span className="text-sm font-semibold text-accent">{confirmation.eta}</span>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          A confirmation will be shared via SMS/WhatsApp on your provided number.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-ink transition-colors"
          >
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold uppercase tracking-[0.2em] rounded-sm border border-border hover:bg-secondary transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (resolvedCart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl mb-3">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add items to your cart before checking out.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-ink transition-colors"
        >
          Browse Shop <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <p className="text-xs text-muted-foreground mb-2">
        <Link to="/" className="hover:text-primary">Home</Link> /{" "}
        <Link to="/cart" className="hover:text-primary">Cart</Link> / Checkout
      </p>
      <h1 className="font-display text-3xl md:text-4xl mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
        <div className="space-y-8">
          {/* Contact + Shipping */}
          <section className="border border-border rounded-md p-6">
            <h2 className="font-display text-xl mb-5">Shipping Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" required error={errors.fullName}>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  className={inputCls(!!errors.fullName)}
                  placeholder="Ayesha Khan"
                  maxLength={80}
                />
              </Field>
              <Field label="Phone Number" required error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputCls(!!errors.phone)}
                  placeholder="03001234567"
                  maxLength={14}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Street Address" required error={errors.street}>
                  <input
                    type="text"
                    value={form.street}
                    onChange={(e) => update("street", e.target.value)}
                    className={inputCls(!!errors.street)}
                    placeholder="House #, Street, Area"
                    maxLength={200}
                  />
                </Field>
              </div>
              <Field label="City" required error={errors.city}>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className={inputCls(!!errors.city)}
                  placeholder="Lahore"
                  maxLength={60}
                />
              </Field>
              <Field label="Postal Code" required error={errors.postalCode}>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => update("postalCode", e.target.value)}
                  className={inputCls(!!errors.postalCode)}
                  placeholder="54000"
                  maxLength={6}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Email Address" optional error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputCls(!!errors.email)}
                    placeholder="you@example.com"
                    maxLength={255}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Order Notes / Special Instructions" optional error={errors.notes}>
                  <textarea
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    rows={3}
                    className={inputCls(!!errors.notes) + " resize-none"}
                    placeholder="Anything we should know about your delivery?"
                    maxLength={500}
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="border border-border rounded-md p-6">
            <h2 className="font-display text-xl mb-5">Payment Method</h2>
            <label
              className={`flex items-start gap-4 p-4 rounded-md border cursor-pointer transition-colors ${
                form.codConfirmed ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/40"
              }`}
            >
              <input
                type="radio"
                checked={form.codConfirmed}
                onChange={() => update("codConfirmed", true)}
                className="mt-1 accent-primary h-4 w-4"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Banknote className="h-5 w-5 text-accent" />
                  <span className="font-semibold">Cash on Delivery (COD)</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Payment will be collected when your order is delivered.
                </p>
              </div>
            </label>
            {errors.codConfirmed && (
              <p className="text-xs text-destructive mt-2">{errors.codConfirmed}</p>
            )}
            <p className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
              <ShieldCheck className="h-4 w-4 text-success" />
              Secure & verified — no advance payment required.
            </p>
          </section>
        </div>

        {/* Order Summary */}
        <aside className="bg-secondary/40 border border-border rounded-md p-6 lg:sticky lg:top-32">
          <h2 className="font-display text-xl mb-5">Order Summary</h2>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-1 mb-5">
            {resolvedCart.map(({ item, product, lineTotal }) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-3 items-start"
              >
                <div className="relative shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 object-cover rounded-sm border border-border"
                  />
                  <span className="absolute -top-2 -right-2 h-5 w-5 text-[10px] font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.size} • {item.color}
                  </p>
                </div>
                <p className="text-sm font-semibold whitespace-nowrap">{formatPKR(lineTotal)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm py-4 border-y border-border">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPKR(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span className="font-semibold">
                {shipping === 0 ? <span className="text-success">FREE</span> : formatPKR(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-muted-foreground">
                Free delivery on orders above {formatPKR(5000)}
              </p>
            )}
          </div>

          <div className="flex justify-between items-baseline pt-4 mb-5">
            <span className="font-display text-lg">Total</span>
            <span className="font-display text-2xl text-primary font-bold">{formatPKR(total)}</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-4 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/cart" })}
            className="w-full text-center text-xs text-muted-foreground mt-3 hover:text-primary"
          >
            ← Back to Cart
          </button>
        </aside>
      </form>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full border rounded-sm px-3 py-2.5 text-sm outline-none transition-colors bg-background ${
    hasError ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
  }`;
}

function Field({
  label,
  required,
  optional,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
        {optional && <span className="text-muted-foreground/70 ml-1 normal-case font-normal">(optional)</span>}
      </span>
      {children}
      {error && <span className="block text-xs text-destructive mt-1">{error}</span>}
    </label>
  );
}
