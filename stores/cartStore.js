// stores/cartStore.js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [], // Each item: { id, name, price, quantity, size?, image?, _key }
  }),

  getters: {
    // Total number of items in cart
    totalQuantity: (state) =>
      Array.isArray(state.items)
        ? state.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
        : 0,

    // Total price of cart
    totalPrice: (state) =>
      Array.isArray(state.items)
        ? state.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
        : 0,
  },

  actions: {
    // Generate a unique key for product + size
    generateKey(product) {
      return `${product.id}-${product.size ?? ""}`;
    },

    // Add product to cart
    addToCart(product) {
      if (!product) return;

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

    // Remove product from cart
    removeFromCart(product) {
      if (!product) return;
      const key = this.generateKey(product);
      this.items = this.items.filter((item) => item._key !== key);
      this.saveCart();
    },

    // Update product quantity
    updateQuantity(product, quantity, size) {
      if (!product) return;
      const key = this.generateKey({ ...product, size });
      const item = this.items.find((i) => i._key === key);

      if (item) {
        if (quantity <= 0) this.removeFromCart(product);
        else item.quantity = quantity;
      }

      this.saveCart();
    },

    // Clear entire cart
    clearCart() {
      this.items = [];
      this.saveCart();
    },

    // Persist cart to localStorage safely
    saveCart() {
      if (process.client) {
        try {
          localStorage.setItem("cart", JSON.stringify(this.items));
        } catch (err) {
          console.error("[CartStore] Failed to save cart", err);
        }
      }
    },

    // Load cart from localStorage safely (client only)
    loadCart() {
      if (process.client) {
        const saved = localStorage.getItem("cart");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            this.items = Array.isArray(parsed) ? parsed : [];
          } catch (err) {
            console.error("[CartStore] Failed to parse cart", err);
            this.items = [];
          }
        }
      }
    },

    // Helper to get total items (for computed in components)
    getTotalItems() {
      return Array.isArray(this.items)
        ? this.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
        : 0;
    },

    // Helper to get subtotal (for computed in components)
    getSubtotal() {
      return Array.isArray(this.items)
        ? this.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
        : 0;
    },
  },

  // Pinia persist disabled because we handle it manually
  persist: { enabled: false },
});
