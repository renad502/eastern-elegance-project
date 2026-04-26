import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Plus, X, Search } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { CATEGORIES, SUBCATEGORIES, BRANDS, type Product, type Category } from "@/data/products";
import { formatPKR } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  component: ProductsAdmin,
});

const blank: Product = {
  id: "",
  slug: "",
  name: "",
  category: "women",
  subCategory: "Casual Wear",
  brand: "Eastern Elegance Signature",
  price: 0,
  image: "",
  gallery: [],
  rating: 4.5,
  reviewCount: 0,
  description: "",
  fabric: "",
  sizes: ["S", "M", "L"],
  colors: [{ name: "Cream", hex: "#F5EBD7" }],
  stock: 0,
  sku: "",
};

function ProductsAdmin() {
  const { products, upsertProduct, deleteProduct } = useAdmin();
  const [editing, setEditing] = useState<Product | null>(null);
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) =>
    [p.name, p.sku, p.brand, p.category].join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-logo text-xs text-accent tracking-[0.35em] mb-2">Catalog</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add, edit, and remove items from your store catalog.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...blank, id: `p_${Date.now()}` })}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-ink transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </header>

      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, SKU, brand…"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Product</th>
                <th className="text-left px-4 py-3 font-semibold">Category</th>
                <th className="text-right px-4 py-3 font-semibold">Price</th>
                <th className="text-right px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {p.image && (
                        <img src={p.image} alt="" className="h-12 w-12 rounded object-cover" />
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{p.category}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatPKR(p.price)}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        p.stock < 5
                          ? "bg-destructive/15 text-destructive"
                          : "bg-success/15 text-success"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditing(p)}
                        className="p-2 hover:bg-primary/10 rounded text-primary"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${p.name}"?`)) {
                            deleteProduct(p.id);
                            toast.success("Product deleted");
                          }
                        }}
                        className="p-2 hover:bg-destructive/10 rounded text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-muted-foreground">
                    No products match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <ProductDialog
          product={editing}
          onClose={() => setEditing(null)}
          onSave={(p) => {
            upsertProduct(p);
            toast.success("Product saved");
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ProductDialog({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [draft, setDraft] = useState<Product>(product);

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim() || !draft.image.trim()) {
      toast.error("Name and image URL are required");
      return;
    }
    const slug = draft.slug || draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const sku = draft.sku || `EE-${Date.now()}`;
    onSave({ ...draft, slug, sku, gallery: draft.gallery.length ? draft.gallery : [draft.image] });
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/60 flex items-start md:items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-background rounded-lg w-full max-w-2xl my-8 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-xl font-semibold">
            {product.name ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <Field label="Product Name *">
            <input
              required
              value={draft.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full border border-border bg-background rounded-sm px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category">
              <select
                value={draft.category}
                onChange={(e) => {
                  const cat = e.target.value as Category;
                  update("category", cat);
                  update("subCategory", SUBCATEGORIES[cat][0]);
                }}
                className="w-full border border-border bg-background rounded-sm px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Sub-category">
              <select
                value={draft.subCategory}
                onChange={(e) => update("subCategory", e.target.value)}
                className="w-full border border-border bg-background rounded-sm px-3 py-2 text-sm"
              >
                {SUBCATEGORIES[draft.category].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Price (PKR) *">
              <input
                required
                type="number"
                min={0}
                value={draft.price}
                onChange={(e) => update("price", Number(e.target.value))}
                className="w-full border border-border bg-background rounded-sm px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Original price">
              <input
                type="number"
                min={0}
                value={draft.originalPrice ?? ""}
                onChange={(e) =>
                  update("originalPrice", e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full border border-border bg-background rounded-sm px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Stock">
              <input
                type="number"
                min={0}
                value={draft.stock}
                onChange={(e) => update("stock", Number(e.target.value))}
                className="w-full border border-border bg-background rounded-sm px-3 py-2 text-sm"
              />
            </Field>
          </div>

          <Field label="Brand">
            <select
              value={draft.brand}
              onChange={(e) => update("brand", e.target.value)}
              className="w-full border border-border bg-background rounded-sm px-3 py-2 text-sm"
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Image URL *" hint="A direct image URL (use existing assets or external URLs).">
            <input
              required
              value={draft.image}
              onChange={(e) => update("image", e.target.value)}
              placeholder="/src/assets/p1.jpg or https://…"
              className="w-full border border-border bg-background rounded-sm px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={3}
              value={draft.description}
              onChange={(e) => update("description", e.target.value)}
              className="w-full border border-border bg-background rounded-sm px-3 py-2 text-sm resize-none"
            />
          </Field>

          <Field label="Fabric">
            <input
              value={draft.fabric}
              onChange={(e) => update("fabric", e.target.value)}
              className="w-full border border-border bg-background rounded-sm px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Sizes" hint="Comma-separated list, e.g. S, M, L, XL">
            <input
              value={draft.sizes.join(", ")}
              onChange={(e) =>
                update(
                  "sizes",
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                )
              }
              className="w-full border border-border bg-background rounded-sm px-3 py-2 text-sm"
            />
          </Field>

          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold border border-border rounded-sm hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-sm hover:bg-ink"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="block mt-1 text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}
