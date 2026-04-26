import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal, X, Grid3x3, List } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import {
  getAllProducts,
  CATEGORIES,
  ALL_SIZES,
  ALL_COLORS,
  BRANDS,
  SUBCATEGORIES,
  type Category,
} from "@/data/products";
import { z } from "zod";

const searchSchema = z.object({
  category: z.enum(["women", "men"]).optional(),
  sale: z.boolean().optional(),
  sort: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop — Eastern Elegance" },
      {
        name: "description",
        content:
          "Browse our full collection of premium eastern wear: kurtis, sherwanis, lehengas, accessories and more.",
      },
      { property: "og:title", content: "Shop — Eastern Elegance" },
      { property: "og:description", content: "Premium eastern fashion for every occasion." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const search = Route.useSearch();
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    search.category ?? "all",
  );
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minDiscount, setMinDiscount] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState(search.sort ?? "featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const filtered = useMemo(() => {
    let list = getAllProducts().filter((p) => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (selectedSubs.length > 0 && !selectedSubs.includes(p.subCategory)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (selectedSizes.length > 0 && !p.sizes.some((s) => selectedSizes.includes(s))) return false;
      if (selectedColors.length > 0 && !p.colors.some((c) => selectedColors.includes(c.name)))
        return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
      if (search.sale && !p.originalPrice) return false;
      if (minDiscount > 0) {
        const d = p.originalPrice ? ((p.originalPrice - p.price) / p.originalPrice) * 100 : 0;
        if (d < minDiscount) return false;
      }
      if (minRating > 0 && p.rating < minRating) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "new":
        list = [...list].sort((a, b) => (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0));
        break;
      case "best":
        list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "top":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [
    selectedCategory,
    selectedSubs,
    priceRange,
    selectedSizes,
    selectedColors,
    selectedBrands,
    minDiscount,
    minRating,
    sort,
    search.sale,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  function clearAll() {
    setSelectedCategory("all");
    setSelectedSubs([]);
    setPriceRange([0, 50000]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setMinDiscount(0);
    setMinRating(0);
  }

  return (
    <>
      {/* Hero strip */}
      <div className="bg-secondary/40 border-b border-border">
        <div className="container mx-auto px-4 py-10">
          <p className="text-xs text-muted-foreground mb-2">
            <Link to="/" className="hover:text-primary">Home</Link> / Shop
          </p>
          <h1 className="font-display text-3xl md:text-4xl">Shop the Collection</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-[280px_1fr] gap-10">
        {/* Sidebar */}
        <aside className={`${filterOpen ? "fixed inset-0 z-50 lg:static" : "hidden"} lg:block`}>
          {filterOpen && (
            <div className="absolute inset-0 bg-ink/60 lg:hidden" onClick={() => setFilterOpen(false)} />
          )}
          <div className="bg-background relative h-full lg:h-auto w-80 max-w-[85vw] lg:w-auto lg:max-w-none p-6 lg:p-0 overflow-y-auto">
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h3 className="font-display text-xl">Filters</h3>
              <button onClick={() => setFilterOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <FilterGroup title="Category" defaultOpen>
              <button
                onClick={() => setSelectedCategory("all")}
                className={`block text-left text-sm py-1.5 w-full ${selectedCategory === "all" ? "text-primary font-semibold" : "text-foreground/80 hover:text-primary"}`}
              >
                All Categories
              </button>
              {CATEGORIES.map((c) => (
                <div key={c.id}>
                  <button
                    onClick={() => setSelectedCategory(c.id)}
                    className={`block text-left text-sm py-1.5 w-full ${selectedCategory === c.id ? "text-primary font-semibold" : "text-foreground/80 hover:text-primary"}`}
                  >
                    {c.name}
                  </button>
                  {selectedCategory === c.id && SUBCATEGORIES[c.id] && (
                    <div className="pl-4 border-l border-accent/40 ml-1 mt-1 mb-2">
                      {SUBCATEGORIES[c.id].map((s) => (
                        <label key={s} className="flex items-center gap-2 py-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                          <input
                            type="checkbox"
                            checked={selectedSubs.includes(s)}
                            onChange={() =>
                              setSelectedSubs((prev) =>
                                prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
                              )
                            }
                            className="accent-primary"
                          />
                          {s}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </FilterGroup>

            <FilterGroup title="Price Range">
              <div className="space-y-3">
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={500}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-primary"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full text-sm border border-border rounded-sm px-2 py-1.5"
                  />
                  <span className="text-muted-foreground">—</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full text-sm border border-border rounded-sm px-2 py-1.5"
                  />
                </div>
              </div>
            </FilterGroup>

            <FilterGroup title="Sizes">
              <div className="flex flex-wrap gap-1.5">
                {ALL_SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setSelectedSizes((prev) =>
                        prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
                      )
                    }
                    className={`min-w-10 h-9 px-2 text-xs font-semibold border rounded-sm transition-all ${selectedSizes.includes(s) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Colors">
              <div className="flex flex-wrap gap-2">
                {ALL_COLORS.map((c) => {
                  const active = selectedColors.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      title={c.name}
                      onClick={() =>
                        setSelectedColors((prev) =>
                          prev.includes(c.name) ? prev.filter((x) => x !== c.name) : [...prev, c.name],
                        )
                      }
                      className={`h-8 w-8 rounded-full border-2 transition-all ${active ? "border-primary scale-110" : "border-border"}`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {active && <span className="text-cream text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            </FilterGroup>

            <FilterGroup title="Brand">
              {BRANDS.map((b) => (
                <label key={b} className="flex items-center gap-2 py-1.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() =>
                      setSelectedBrands((prev) =>
                        prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b],
                      )
                    }
                    className="accent-primary"
                  />
                  {b}
                </label>
              ))}
            </FilterGroup>

            <FilterGroup title="Discount">
              {[10, 20, 30, 50].map((d) => (
                <label key={d} className="flex items-center gap-2 py-1.5 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="discount"
                    checked={minDiscount === d}
                    onChange={() => setMinDiscount(d)}
                    className="accent-primary"
                  />
                  {d}% & Above
                </label>
              ))}
            </FilterGroup>

            <FilterGroup title="Rating">
              {[4, 3].map((r) => (
                <label key={r} className="flex items-center gap-2 py-1.5 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === r}
                    onChange={() => setMinRating(r)}
                    className="accent-primary"
                  />
                  {r}★ & Above
                </label>
              ))}
            </FilterGroup>

            <button
              onClick={clearAll}
              className="w-full mt-6 border border-border text-sm font-semibold uppercase tracking-wider py-2.5 rounded-sm hover:bg-secondary transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Products */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
            <p className="text-sm text-muted-foreground">
              Showing <strong className="text-foreground">{pageItems.length}</strong> of{" "}
              <strong className="text-foreground">{filtered.length}</strong> products
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm border border-border px-3 py-2 rounded-sm"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm border border-border bg-background rounded-sm px-3 py-2"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="new">Newest</option>
                <option value="best">Best Selling</option>
                <option value="top">Top Rated</option>
              </select>
              <div className="hidden md:flex border border-border rounded-sm">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 ${view === "grid" ? "bg-primary text-primary-foreground" : ""}`}
                  aria-label="Grid view"
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 ${view === "list" ? "bg-primary text-primary-foreground" : ""}`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {pageItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No products match your filters.</p>
              <button onClick={clearAll} className="text-primary underline">Clear filters</button>
            </div>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10"
                  : "flex flex-col gap-6"
              }
            >
              {pageItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 text-sm border border-border rounded-sm disabled:opacity-30"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 text-sm rounded-sm ${page === i + 1 ? "bg-primary text-primary-foreground" : "border border-border"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 text-sm border border-border rounded-sm disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function FilterGroup({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full font-display text-base mb-2"
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pt-2">{children}</div>}
    </div>
  );
}
