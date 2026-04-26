import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";

export type Category = "women" | "men";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  subCategory: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  badge?: "new" | "sale" | "bestseller";
  description: string;
  fabric: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  sku: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "luxury-embroidered-formal-kurti",
    name: "Luxury Embroidered Formal Kurti",
    category: "women",
    subCategory: "Formal Wear",
    brand: "Eastern Elegance Signature",
    price: 6299,
    originalPrice: 8999,
    image: p1,
    hoverImage: p2,
    gallery: [p1, p2, p4],
    rating: 4.7,
    reviewCount: 125,
    badge: "sale",
    description:
      "An elegant formal kurti with intricate gold zardozi embroidery on luxurious cream fabric. Perfectly tailored for weddings, formal gatherings, and festive occasions.",
    fabric: "Premium silk blend with hand embroidery",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Cream", hex: "#F5EBD7" },
      { name: "Gold", hex: "#DAA520" },
      { name: "Maroon", hex: "#7B1F2B" },
    ],
    stock: 12,
    sku: "EE-2024-001",
  },
  {
    id: "2",
    slug: "emerald-anarkali-gown",
    name: "Emerald Anarkali Gown",
    category: "women",
    subCategory: "Party Wear",
    brand: "Eastern Elegance Signature",
    price: 12999,
    originalPrice: 16999,
    image: p2,
    hoverImage: p1,
    gallery: [p2, p1, p4],
    rating: 4.9,
    reviewCount: 218,
    badge: "bestseller",
    description:
      "A regal emerald anarkali gown with cascading gold embroidery and matching dupatta. Crafted to make every entrance unforgettable.",
    fabric: "Pure silk with chiffon dupatta",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Emerald", hex: "#1E6F45" },
      { name: "Royal Blue", hex: "#2A4D9E" },
      { name: "Wine", hex: "#5B1A2A" },
    ],
    stock: 7,
    sku: "EE-2024-002",
  },
  {
    id: "3",
    slug: "royal-sherwani-blue",
    name: "Royal Blue Embellished Sherwani",
    category: "men",
    subCategory: "Sherwanis",
    brand: "Premium Line",
    price: 24999,
    originalPrice: 29999,
    image: p3,
    hoverImage: p7,
    gallery: [p3, p7, p6],
    rating: 4.8,
    reviewCount: 96,
    badge: "new",
    description:
      "A statement royal blue sherwani featuring antique gold buttons and a finely embroidered collar — built for grooms and grand evenings.",
    fabric: "Jamawar silk with brocade collar",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Royal Blue", hex: "#1F3F8B" },
      { name: "Maroon", hex: "#6B1A2A" },
      { name: "Black", hex: "#101010" },
    ],
    stock: 4,
    sku: "EE-2024-003",
  },
  {
    id: "4",
    slug: "bridal-lehenga-burgundy",
    name: "Burgundy Bridal Lehenga",
    category: "women",
    subCategory: "Bridal Collection",
    brand: "Eastern Elegance Signature",
    price: 49999,
    originalPrice: 64999,
    image: p4,
    hoverImage: p2,
    gallery: [p4, p2, p1],
    rating: 5.0,
    reviewCount: 64,
    badge: "bestseller",
    description:
      "A heritage burgundy bridal lehenga with intricate zardozi work, sequins, and a flowing dupatta — a centerpiece for your most cherished day.",
    fabric: "Velvet base with hand zardozi embroidery",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Burgundy", hex: "#5B1A2A" },
      { name: "Crimson", hex: "#9C1B2D" },
    ],
    stock: 3,
    sku: "EE-2024-004",
  },
  {
    id: "6",
    slug: "midnight-waistcoat",
    name: "Midnight Embroidered Waistcoat",
    category: "men",
    subCategory: "Waistcoats",
    brand: "Premium Line",
    price: 4999,
    originalPrice: 6999,
    image: p6,
    hoverImage: p3,
    gallery: [p6, p3, p7],
    rating: 4.5,
    reviewCount: 71,
    description:
      "A sharply tailored black waistcoat with subtle tonal embroidery — pair it with a crisp kurta for an effortlessly polished look.",
    fabric: "Wool blend with silk lining",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#0E0E0E" },
      { name: "Charcoal", hex: "#3B3B3B" },
      { name: "Beige", hex: "#D2BFA0" },
    ],
    stock: 18,
    sku: "EE-2024-006",
  },
  {
    id: "7",
    slug: "classic-cotton-kurta",
    name: "Classic Beige Cotton Kurta",
    category: "men",
    subCategory: "Kurtas",
    brand: "Casual Line",
    price: 3499,
    image: p7,
    hoverImage: p3,
    gallery: [p7, p3, p6],
    rating: 4.4,
    reviewCount: 142,
    badge: "new",
    description:
      "A breathable everyday kurta in warm beige cotton, finished with a clean placket and side slits for an easy modern silhouette.",
    fabric: "Pure cotton, garment dyed",
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "Beige", hex: "#D9C4A3" },
      { name: "White", hex: "#F7F2EA" },
      { name: "Olive", hex: "#7C7A4A" },
    ],
    stock: 35,
    sku: "EE-2024-007",
  },
  {
    id: "8",
    slug: "violet-party-kurti",
    name: "Violet Festive Party Kurti",
    category: "women",
    subCategory: "Party Wear",
    brand: "Premium Line",
    price: 5499,
    originalPrice: 7999,
    image: p8,
    hoverImage: p2,
    gallery: [p8, p2, p1],
    rating: 4.6,
    reviewCount: 109,
    badge: "sale",
    description:
      "A vibrant violet kurti featuring sequin embellishments and metallic embroidery — pure festive energy.",
    fabric: "Silk blend with sequin work",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Violet", hex: "#7C3AA0" },
      { name: "Pink", hex: "#D85A8C" },
      { name: "Teal", hex: "#1F7C7A" },
    ],
    stock: 14,
    sku: "EE-2024-008",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  const all = getAllProducts();
  return all.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return getAllProducts()
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

/**
 * Returns products including any admin-added/edited overrides from localStorage.
 * Falls back to seed data on the server / first paint.
 */
export function getAllProducts(): Product[] {
  if (typeof window === "undefined") return PRODUCTS;
  try {
    const raw = window.localStorage.getItem("ee_admin_products_v1");
    if (!raw) return PRODUCTS;
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : PRODUCTS;
  } catch {
    return PRODUCTS;
  }
}

export const CATEGORIES: { id: Category; name: string; image: string; tagline: string }[] = [
  { id: "women", name: "Women's Collection", image: p1, tagline: "Grace in every thread" },
  { id: "men", name: "Men's Collection", image: p3, tagline: "Tailored for tradition" },
];

export const SUBCATEGORIES: Record<Category, string[]> = {
  women: ["Casual Wear", "Formal Wear", "Party Wear", "Bridal Collection"],
  men: ["Kurtas", "Shalwar Kameez", "Waistcoats", "Sherwanis"],
};

export const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

export const ALL_COLORS = [
  { name: "Red", hex: "#C72828" },
  { name: "Blue", hex: "#1F3F8B" },
  { name: "Green", hex: "#1E6F45" },
  { name: "Yellow", hex: "#E8A22A" },
  { name: "Black", hex: "#101010" },
  { name: "White", hex: "#F7F2EA" },
  { name: "Pink", hex: "#E68FAE" },
  { name: "Purple", hex: "#7C3AA0" },
  { name: "Beige", hex: "#D9C4A3" },
  { name: "Gold", hex: "#D4A84B" },
];

export const BRANDS = ["Eastern Elegance Signature", "Premium Line", "Casual Line"];
