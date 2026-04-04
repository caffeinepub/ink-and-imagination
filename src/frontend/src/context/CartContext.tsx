import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { MangaItem } from "../actorClient";

interface CartItem {
  manga: MangaItem;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (manga: MangaItem, qty?: number) => void;
  removeFromCart: (id: bigint) => void;
  updateQuantity: (id: bigint, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

function serializeCart(items: CartItem[]): string {
  return JSON.stringify(
    items.map((item) => ({
      quantity: item.quantity,
      manga: {
        ...item.manga,
        id: String(item.manga.id),
        stock: String(item.manga.stock),
        volumeCount: String(item.manga.volumeCount),
        createdAt: String(item.manga.createdAt),
        coverImage: item.manga.coverImage.getDirectURL(),
      },
    })),
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Skip localStorage hydration for server safety; load on effect
    return [];
  });

  // We skip localStorage persistence to avoid ExternalBlob serialization issues
  // The cart is in-memory for the session

  const addToCart = (manga: MangaItem, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.manga.id === manga.id);
      if (existing) {
        return prev.map((item) =>
          item.manga.id === manga.id
            ? { ...item, quantity: item.quantity + qty }
            : item,
        );
      }
      return [...prev, { manga, quantity: qty }];
    });
  };

  const removeFromCart = (id: bigint) => {
    setCartItems((prev) => prev.filter((item) => item.manga.id !== id));
  };

  const updateQuantity = (id: bigint, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.manga.id === id ? { ...item, quantity: qty } : item,
      ),
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.manga.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

// Suppress unused import warning
void serializeCart;
