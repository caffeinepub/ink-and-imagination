import { type ReactNode, createContext, useContext, useState } from "react";
import type { Manga } from "../backend";

interface CartItem {
  manga: Manga;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (manga: Manga, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (manga: Manga, qty = 1) => {
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

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.manga.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
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
