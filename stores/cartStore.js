// stores/cartStore.js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [], // Each item: { id, name, price, realPrice, discountPrice, quantity, size?, image?, categories?, _key }
  }),

  getters: {
    totalQuantity: (state) =>
      state.items.reduce((sum, i) => sum + (i.quantity || 0), 0),
    totalPrice: (state) =>
      state.items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0),
  },

  actions: {
    generateKey(product) {
      return `${product.id}-${product.size ?? ""}`;
    },

    addToCart(product) {
      if (!product) return;

      const key = this.generateKey(product);
      const existing = this.items.find((i) => i._key === key);

      const cartItem = {
        id: product.id,
        name: product.name,
        price: +product.real_selling_price || +product.price || 0,
        realPrice: +product.selling_price || +product.real_selling_price || 0,
        discountPrice: +product.discount_price || 0,
        categories: product.categories || [],
        size: product.size || null,
        image: product.image || "",
        quantity: product.quantity || 1,
        _key: key,
      };

      if (existing) existing.quantity += cartItem.quantity;
      else this.items.push(cartItem);

      this.saveCart();
      console.log("[CartStore] Added:", cartItem);
    },

    removeFromCart(product) {
      if (!product) return;
      const key = this.generateKey(product);
      this.items = this.items.filter((i) => i._key !== key);
      this.saveCart();
      console.log("[CartStore] Removed:", key);
    },

    updateQuantity(product, quantity, size) {
      if (!product) return;
      const key = this.generateKey({ ...product, size: size ?? product.size });
      const item = this.items.find((i) => i._key === key);

      if (item) {
        if (quantity <= 0) this.removeFromCart(product);
        else item.quantity = quantity;
        this.saveCart();
        console.log("[CartStore] Updated:", item);
      }
    },

    clearCart() {
      this.items = [];
      this.saveCart();
      console.log("[CartStore] Cleared cart");
    },

    saveCart() {
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(this.items));
      }
    },

    loadCart() {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("cart");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            this.items = Array.isArray(parsed) ? parsed : [];
            console.log("[CartStore] Loaded cart:", this.items);
          } catch (err) {
            console.error("[CartStore] Failed to parse cart", err);
            this.items = [];
          }
        }
      }
    },

    applyVoucher(voucher) {
      if (!voucher || !voucher.id_category) return;
      const catId = String(voucher.id_category);

      this.items.forEach((item) => {
        const match = (item.categories || []).map(String).includes(catId);
        if (match) {
          if (voucher.discount_type === "percent") {
            item.price = Math.round(item.realPrice * (1 - (voucher.discount || 0) / 100));
          } else if (voucher.discount_type === "fixed") {
            item.price = Math.max(item.realPrice - (voucher.discount || 0), 0);
          }
          item.voucherApplied = true;
          item.voucherId = voucher.id;
        }
      });

      this.saveCart();
      console.log("[CartStore] Voucher applied:", voucher);
    },

    getSubtotal() {
      return this.items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0);
    },

    getTotalItems() {
      return this.items.reduce((sum, i) => sum + (i.quantity || 0), 0);
    },
  },
});
