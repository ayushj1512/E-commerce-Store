// stores/cartStore.js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [], // Each item: { id, name, price, quantity, size?, image?, _key }
  }),

  getters: {
    totalQuantity: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),

    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },

  actions: {
    generateKey(product) {
      return `${product.id}-${product.size ?? ""}`;
    },

    addToCart(product) {
      const key = this.generateKey(product);
      const existingItem = this.items.find((item) => item._key === key);

      if (existingItem) {
        existingItem.quantity += product.quantity || 1;
      } else {
        this.items.push({
          ...product,
          quantity: product.quantity || 1,
          _key: key,
        });
      }

      this.saveCart();
    },

    removeFromCart(product) {
      const key = this.generateKey(product);
      this.items = this.items.filter((item) => item._key !== key);
      this.saveCart();
    },

    updateQuantity(product, quantity, size) {
      const key = this.generateKey({ ...product, size });
      const item = this.items.find((i) => i._key === key);

      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(product);
        } else {
          item.quantity = quantity;
        }
      }

      this.saveCart();
    },

    clearCart() {
      this.items = [];
      this.saveCart();
    },

    /** -------------------------------
     * 🔄 Persist cart to localStorage safely
     * ------------------------------- */
    saveCart() {
      if (process.client) {
        try {
          localStorage.setItem("cart", JSON.stringify(this.items));
          console.log("[CartStore] ✅ Cart saved to localStorage", this.items);
        } catch (err) {
          console.error("[CartStore] ❌ Failed to save cart to localStorage", err);
        }
      }
    },

    /** -------------------------------
     * 🔄 Load cart from localStorage safely
     * ------------------------------- */
    loadCart() {
      if (process.client) {
        const saved = localStorage.getItem("cart");
        if (saved) {
          try {
            this.items = JSON.parse(saved);
            console.log("[CartStore] 🔄 Cart loaded from localStorage", this.items);
          } catch (err) {
            console.error("[CartStore] ❌ Failed to parse cart from localStorage", err);
          }
        }
      }
    },
  },

  // 🔑 Pinia Persist Config (optional if you want auto persistence)
  persist: {
    enabled: false, // disabled because we handle persistence manually
  },
});
