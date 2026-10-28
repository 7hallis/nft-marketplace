
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
}

type NewCartItem = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addToCart: (item: NewCartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const STORAGE_PREFIX = "kurio-cart";
const GUEST_KEY = `${STORAGE_PREFIX}:guest`;

const CartContext = createContext<CartContextType | undefined>(undefined);

function getStorageKey(userId: string | null): string {
  return userId
    ? `${STORAGE_PREFIX}:user:${encodeURIComponent(userId)}`
    : GUEST_KEY;
}

function loadCart(key: string): CartItem[] {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartItem =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        Number.isFinite(item.price) &&
        item.price >= 0 &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= 50 &&
        typeof item.image === "string" &&
        typeof item.alt === "string",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  const userId = user?.id ?? null;
  const storageKey = getStorageKey(userId);

  const [cartState, setCartState] = useState<{
    key: string;
    items: CartItem[];
  }>(() => ({
    key: storageKey,
    items: [],
  }));

  const isCurrentCart = cartState.key === storageKey;
  const items = isCurrentCart ? cartState.items : [];

  useEffect(() => {
    if (isLoading) return;

    setCartState((current) => {
      if (current.key === storageKey) return current;

      return {
        key: storageKey,
        items: loadCart(storageKey),
      };
    });
  }, [storageKey, isLoading]);

  useEffect(() => {
    if (isLoading || !isCurrentCart) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Mantém o carrinho em memória se o armazenamento falhar.
    }
  }, [items, storageKey, isLoading, isCurrentCart]);

  const addToCart = useCallback((item: NewCartItem) => {
    if (
      !item.id ||
      !item.name ||
      !Number.isFinite(item.price) ||
      item.price < 0
    ) {
      return;
    }

    const quantity = Math.min(
      50,
      Math.max(1, Math.floor(item.quantity ?? 1)),
    );

    setCartState((current) => {
      const existing = current.items.find(
        (product) => product.id === item.id,
      );

      const nextItems = existing
        ? current.items.map((product) =>
            product.id === item.id
              ? {
                  ...product,
                  quantity: Math.min(50, product.quantity + quantity),
                }
              : product,
          )
        : [...current.items, { ...item, quantity }];

      return { ...current, items: nextItems };
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartState((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (!Number.isFinite(quantity)) return;

    const nextQuantity = Math.min(50, Math.max(1, Math.floor(quantity)));

    setCartState((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item,
      ),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCartState((current) => ({ ...current, items: [] }));
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [items, itemCount, addToCart, removeFromCart, updateQuantity, clearCart],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider.");
  }

  return context;
}
