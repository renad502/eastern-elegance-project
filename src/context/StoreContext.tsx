import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getAllProducts, type Product } from "@/data/products";

export interface CartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (item: CartItem) => void;
  updateCartQty: (productId: string, size: string, color: string, qty: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartCount: number;
  cartSubtotal: number;
  wishlistCount: number;
  resolvedCart: { item: CartItem; product: Product; lineTotal: number }[];
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const CART_KEY = "ee_cart_v1";
const WL_KEY = "ee_wishlist_v1";

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(readLS<CartItem[]>(CART_KEY, []));
    setWishlist(readLS<string[]>(WL_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(WL_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (i) => i.productId === item.productId && i.size === item.size && i.color === item.color,
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
        return next;
      }
      return [...prev, item];
    });
  }, []);

  const updateCartQty = useCallback(
    (productId: string, size: string, color: string, qty: number) => {
      setCart((prev) =>
        prev
          .map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity: Math.max(1, qty) }
              : i,
          )
          .filter((i) => i.quantity > 0),
      );
    },
    [],
  );

  const removeFromCart = useCallback((productId: string, size: string, color: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size && i.color === color)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  );

  const resolvedCart = useMemo(
    () =>
      cart
        .map((item) => {
          const product = getAllProducts().find((p) => p.id === item.productId);
          if (!product) return null;
          return { item, product, lineTotal: product.price * item.quantity };
        })
        .filter((x): x is { item: CartItem; product: Product; lineTotal: number } => x !== null),
    [cart],
  );

  const value: StoreContextValue = {
    cart,
    wishlist,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isInWishlist,
    cartCount: cart.reduce((sum, i) => sum + i.quantity, 0),
    cartSubtotal: resolvedCart.reduce((sum, r) => sum + r.lineTotal, 0),
    wishlistCount: wishlist.length,
    resolvedCart,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
