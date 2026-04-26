import { createFileRoute } from "@tanstack/react-router";
import { useAdmin } from "@/context/AdminContext";
import { CATEGORIES, SUBCATEGORIES } from "@/data/products";
import { Layers } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesAdmin,
});

function CategoriesAdmin() {
  const { products } = useAdmin();

  const counts = (categoryId: string) =>
    products.filter((p) => p.category === categoryId).length;

  return (
    <div className="space-y-6">
      <header>
        <p className="font-logo text-xs text-accent tracking-[0.35em] mb-2">Taxonomy</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold">Categories</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-xl">
          Eastern Elegance currently sells in two top-level categories. Sub-categories define how
          products are organised on the storefront and in shop filters.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-5">
        {CATEGORIES.map((c) => (
          <div key={c.id} className="bg-background border border-border rounded-lg overflow-hidden">
            <div className="relative h-32">
              <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
              <div className="absolute bottom-3 left-4 text-cream">
                <p className="font-display text-xl font-semibold">{c.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-accent">{c.tagline}</p>
              </div>
              <span className="absolute top-3 right-3 bg-cream/90 text-ink text-xs font-bold px-2.5 py-1 rounded-full">
                {counts(c.id)} products
              </span>
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 inline-flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" /> Sub-categories
              </p>
              <div className="flex flex-wrap gap-2">
                {SUBCATEGORIES[c.id].map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-secondary border border-border px-3 py-1.5 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-secondary/40 border border-border rounded-md p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Note:</strong> The Kids' Wear and Accessories
        categories were retired. Products under those categories are no longer available on the
        storefront.
      </div>
    </div>
  );
}
