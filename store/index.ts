import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

type CartItem = Product & {
  quantity: number;
};

type CartState = {
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, qty: number) => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product, qty = 1) => {
        const cart = [...get().cart];
        const index = cart.findIndex((item) => item.id === product.id);
        if (index > -1) {
          cart[index].quantity += qty;
        } else {
          cart.push({ ...product, quantity: qty });
        }
        set({ cart });
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) });
      },

      clearCart: () => set({ cart: [] }),

      updateQuantity: (productId, qty) => {
        const cart = [...get().cart];
        const index = cart.findIndex((item) => item.id === productId);
        if (index > -1) {
          cart[index].quantity = qty;
        }
        set({ cart });
      },

      totalItems: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),

      totalPrice: () =>
        get().cart.reduce((acc, item) => {
          const price = item.discount_status ? item.price * (1 - item.discount / 100) : item.price;
          return acc + price * item.quantity;
        }, 0),
    }),
    {
      name: "cart-storage", // localStorage key
    }
  )
);
