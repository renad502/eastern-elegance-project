import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS, type Product } from "@/data/products";

const PRODUCTS_KEY = "ee_admin_products_v1";
const ORDERS_KEY = "ee_admin_orders_v1";
const MESSAGES_KEY = "ee_admin_messages_v1";
const SESSION_KEY = "ee_admin_session_v1";

export interface AdminOrder {
  id: string;
  customerName: string;
  email: string;
  total: number;
  itemCount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "new" | "read" | "replied";
}

interface AdminContextValue {
  isAuthed: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  products: Product[];
  setProducts: (p: Product[]) => void;
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;

  orders: AdminOrder[];
  setOrderStatus: (id: string, status: AdminOrder["status"]) => void;
  deleteOrder: (id: string) => void;

  messages: AdminMessage[];
  markMessage: (id: string, status: AdminMessage["status"]) => void;
  deleteMessage: (id: string) => void;

  refresh: () => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function seedOrdersIfNeeded(): AdminOrder[] {
  const existing = readLS<AdminOrder[] | null>(ORDERS_KEY, null);
  if (existing && existing.length) return existing;
  const seed: AdminOrder[] = [
    {
      id: "ORD-1042",
      customerName: "Ayesha Khan",
      email: "ayesha@example.com",
      total: 18999,
      itemCount: 2,
      status: "processing",
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: "ORD-1041",
      customerName: "Hassan Ali",
      email: "hassan@example.com",
      total: 24999,
      itemCount: 1,
      status: "shipped",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "ORD-1040",
      customerName: "Fatima R.",
      email: "fatima@example.com",
      total: 6299,
      itemCount: 1,
      status: "delivered",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "ORD-1039",
      customerName: "Sana Malik",
      email: "sana@example.com",
      total: 12999,
      itemCount: 1,
      status: "pending",
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
  ];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(seed));
  }
  return seed;
}

function seedProductsIfNeeded(): Product[] {
  const existing = readLS<Product[] | null>(PRODUCTS_KEY, null);
  if (existing && existing.length) return existing;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(PRODUCTS));
  }
  return PRODUCTS;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setAuthed] = useState(false);
  const [products, setProductsState] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);

  const refresh = useCallback(() => {
    setProductsState(seedProductsIfNeeded());
    setOrders(seedOrdersIfNeeded());
    setMessages(readLS<AdminMessage[]>(MESSAGES_KEY, []));
    setAuthed(readLS<boolean>(SESSION_KEY, false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback((username: string, password: string) => {
    if (username.trim().toLowerCase() === "admin" && password === "admin123") {
      window.localStorage.setItem(SESSION_KEY, "true");
      setAuthed(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }, []);

  const setProducts = useCallback((p: Product[]) => {
    setProductsState(p);
    window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(p));
  }, []);

  const upsertProduct = useCallback(
    (p: Product) => {
      setProductsState((prev) => {
        const idx = prev.findIndex((x) => x.id === p.id);
        const next = idx >= 0 ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev];
        window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const deleteProduct = useCallback((id: string) => {
    setProductsState((prev) => {
      const next = prev.filter((p) => p.id !== id);
      window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setOrderStatus = useCallback((id: string, status: AdminOrder["status"]) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, status } : o));
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders((prev) => {
      const next = prev.filter((o) => o.id !== id);
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const markMessage = useCallback((id: string, status: AdminMessage["status"]) => {
    setMessages((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, status } : m));
      window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => {
      const next = prev.filter((m) => m.id !== id);
      window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value: AdminContextValue = useMemo(
    () => ({
      isAuthed,
      login,
      logout,
      products,
      setProducts,
      upsertProduct,
      deleteProduct,
      orders,
      setOrderStatus,
      deleteOrder,
      messages,
      markMessage,
      deleteMessage,
      refresh,
    }),
    [
      isAuthed,
      login,
      logout,
      products,
      setProducts,
      upsertProduct,
      deleteProduct,
      orders,
      setOrderStatus,
      deleteOrder,
      messages,
      markMessage,
      deleteMessage,
      refresh,
    ],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
