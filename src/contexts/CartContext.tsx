
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

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

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addToCart(item: NewCartItem) {
    setItems((current) => {
      const existing = current.find((product) => product.id === item.id);

      if (existing) {
        return current.map((product) =>
          product.id === item.id
            ? {
                ...product,
                quantity: Math.min(
                  50,
                  product.quantity + (item.quantity ?? 1),
                ),
              }
            : product,
        );
      }

      return [
        ...current,
        {
          ...item,
          quantity: Math.min(50, Math.max(1, item.quantity ?? 1)),
        },
      ];
    });
  }

  function removeFromCart(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(50, quantity)) }
          : item,
      ),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
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
