// stores/cartStore.js
import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [], // cart items
    vouchers: [], // all available vouchers
    applicableVouchers: [], // vouchers applied to current cart
    discount: 0, // total discount
    codSelected: false,
    COD_CHARGE: 99,
  }),

  getters: {
    // total items count
    totalQuantity: (state) =>
      state.items.reduce((sum, i) => sum + (i.quantity || 0), 0),

    // subtotal before discounts
    subtotal: (state) =>
      state.items
        .reduce((sum, i) => sum + (i.realPrice || 0) * (i.quantity || 0), 0)
        .toFixed(2),

    // total after discounts (and COD if selected)
    total: (state) => {
      const baseTotal = state.items.reduce(
        (sum, i) => sum + (i.finalPrice || i.price * i.quantity),
        0
      );
      const withCOD = state.codSelected ? baseTotal + state.COD_CHARGE : baseTotal;
      return Number(withCOD.toFixed(2));
    },
  },

  actions: {
    setCOD(selected) {
      this.codSelected = selected;
    },

    generateKey(product) {
      return `${product.id}-${product.size ?? ""}-${product.color?.hex ?? ""}`;
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
    categories: (product.categories || []).map(Number),
    size: product.size || null,
    color: product.color || null,
    image: product.image || "",
    quantity: product.quantity || 1,
    _key: key,
    discountApplied: false,
    discountQty: 0,
    discountPerItem: 0,
    finalPrice: +product.real_selling_price || +product.price || 0, // total for this item row

    // New fields for checkout payload
    attributes: product.attributes || [],       // expects [{ attr, val }]
    item_list_id: product.item_list_id || "",
    item_list_name: product.item_list_name || "",
    product_payload: {
      product: {
        product_id: product.id.toString(),
        name: product.name,
        selling_price: +product.price || 0,
        discount_price: +product.discount_price || 0,
      },
    },
  };

  if (existing) {
    // Merge quantities and attributes if item exists
    existing.quantity += cartItem.quantity;

    // Optionally update other fields if needed
    existing.discountApplied = cartItem.discountApplied;
    existing.discountQty = cartItem.discountQty;
    existing.discountPerItem = cartItem.discountPerItem;
    existing.finalPrice = cartItem.finalPrice;
    existing.attributes = cartItem.attributes;
    existing.item_list_id = cartItem.item_list_id;
    existing.item_list_name = cartItem.item_list_name;
    existing.product_payload = cartItem.product_payload;
  } else {
    this.items.push(cartItem);
  }

  this.saveCart();
  this.computeDiscounts();
},


    removeFromCart(product) {
      if (!product) return;
      const key = this.generateKey(product);
      this.items = this.items.filter((i) => i._key !== key);
      this.saveCart();
      this.computeDiscounts();
    },

    updateQuantity(product, quantity, size) {
      if (!product) return;
      const key = this.generateKey({ ...product, size: size ?? product.size });
      const item = this.items.find((i) => i._key === key);

      if (item) {
        if (quantity <= 0) this.removeFromCart(product);
        else {
          const updated = { ...item, quantity };
          const idx = this.items.findIndex((i) => i._key === key);
          if (idx !== -1) this.items.splice(idx, 1, updated);
        }
        this.saveCart();
        this.computeDiscounts();
      }
    },

    clearCart() {
      this.items = [];
      this.discount = 0;
      this.applicableVouchers = [];
      this.codSelected = false;
      this.saveCart();
    },

    saveCart() {
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(this.items));
        localStorage.setItem("cartCOD", JSON.stringify(this.codSelected));
      }
    },

    loadCart() {
      if (typeof window !== "undefined") {
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

        const savedCOD = localStorage.getItem("cartCOD");
        this.codSelected = savedCOD === "true";
      }
      this.computeDiscounts();
    },

    async fetchVouchers() {
      try {
        const res = await axios.get(
          "https://api.streetstylestore.com/collections/sss_config/documents/voucher-listing?a=1&x-typesense-api-key=F5gdSFxpg6bi8ZXfuybIsQy074HtBDkC"
        );
        const data = JSON.parse(res.data.data || "[]");
        this.vouchers = data.map((v) => ({
          code: v.code || v.id_cart_rule,
          id_cart_rule: v.id_cart_rule,
          categoryId: Number(v.id_category),
          discount: parseFloat(v.discount_per_item || 0),
          minQty: parseInt(v.quantity || 1),
          category_name: v.category_name,
          link: v.link,
        }));
        this.computeDiscounts();
      } catch (err) {
        console.error("Failed to load vouchers:", err);
      }
    },

    normalizeCartItems() {
      this.items.forEach((item, index) => {
        if (!item._key)
          item._key = `${item.id}-${item.size || "default"}-${index}`;
        if (!Array.isArray(item.categories))
          item.categories = [Number(item.categoryId || 0)];
        item.categories = item.categories.map(Number);
        if (!item.realPrice) item.realPrice = item.price;
        if (!item.finalPrice) item.finalPrice = item.price * item.quantity;
      });
    },

    computeDiscounts() {
      if (!Array.isArray(this.items)) return;
      this.discount = 0;
      this.applicableVouchers = [];
      this.normalizeCartItems();

      const categoryGroups = {};
      this.items.forEach((item) => {
        item.categories.forEach((catId) => {
          if (!categoryGroups[catId]) categoryGroups[catId] = [];
          categoryGroups[catId].push(item);
        });
      });

      this.vouchers.forEach((v) => {
        const itemsInCat = categoryGroups[v.categoryId] || [];
        if (!itemsInCat.length) return;

        let totalQty = itemsInCat.reduce((sum, i) => sum + i.quantity, 0);
        const fullGroups = Math.floor(totalQty / v.minQty);
        const discountedQty = fullGroups * v.minQty;
        const leftoverQty = totalQty - discountedQty;
        const remainingToUnlock = leftoverQty > 0 ? v.minQty - leftoverQty : 0;

        let remainingDiscountQty = discountedQty;
        const remainingPerItem = {};

        itemsInCat.forEach((item) => {
          if (remainingDiscountQty > 0) {
            const qtyToDiscount = Math.min(item.quantity, remainingDiscountQty);
            item.discountQty = qtyToDiscount;
            item.discountPerItem = v.discount;
            item.discountApplied = qtyToDiscount > 0;
            item.finalPrice = +(
              qtyToDiscount * (item.price - v.discount) +
              (item.quantity - qtyToDiscount) * item.price
            ).toFixed(2);
            remainingDiscountQty -= qtyToDiscount;
            remainingPerItem[item._key] =
              item.quantity > qtyToDiscount ? remainingToUnlock : 0;
          } else {
            item.discountQty = 0;
            item.discountPerItem = 0;
            item.discountApplied = false;
            item.finalPrice = +(item.price * item.quantity).toFixed(2);
            remainingPerItem[item._key] = remainingToUnlock;
          }
        });

        this.discount += itemsInCat.reduce(
          (sum, i) => sum + i.discountQty * (i.discountPerItem || 0),
          0
        );
        this.applicableVouchers.push({ ...v, remainingPerItem });
      });
    },

    getItemVouchers(item) {
      return this.applicableVouchers.filter((v) =>
        item.categories.includes(v.categoryId)
      );
    },

    filteredItemVouchers(item) {
      return this.getItemVouchers(item).filter(
        (v) => v.remainingPerItem[item._key] >= 0
      );
    },

    isVoucherApplied(item) {
      return this.getItemVouchers(item).some(
        (v) => v.remainingPerItem[item._key] === 0
      );
    },

    // returns per-unit price for display
    getFinalPrice(item) {
      return item.quantity > 0
        ? (item.finalPrice || item.price * item.quantity) / item.quantity
        : item.price;
    },

    async fetchCartCheckout() {
  if (!this.items.length) return;

  this.loadingCheckout = true;
  this.checkoutError = null;

  try {
    const authStore = useAuthStore();

    // Build payload with full item details
    const payload = {
      gateway_action: "order/buyNowSSS",
      cart_items: this.items.map((item) => ({
        cartItems: {
          product_id: item.id.toString(),
          product_name: item.name,
          quantity: item.quantity,
          product_price: item.price || item.realPrice || 0,
          discount_price: item.discountPerItem || 0,
          discount_percent: item.discountQty && item.discountPerItem
            ? ((item.discountPerItem / item.price) * 100).toFixed(0)
            : "0",
          categories: item.categories || [],
          attribute: item.attributes || [], // expects [{ attr, val }]
          item_list_id: item.item_list_id || "",
          item_list_name: item.item_list_name || "",
          product_img: item.image || "",
          product_payload: {
            product: {
              product_id: item.id.toString(),
              name: item.name,
              selling_price: item.price,
              discount_price: item.discountPerItem || 0,
            },
          },
        },
      })),
      checkout: "new",
      deal_city: "",                 // optionally from config store
      id_cart: authStore.cart_id,
      id_customer: authStore.id_customer,
      site: "sss",
      user_hash_key: authStore.key,
      version: "1",
    };

    const { data } = await axios.post(
      "https://gateway.streetstylestore.com/gateway/v1/",
      payload
    );

    if (data.success) {
      this.cartData = data; // save API response
    } else {
      this.checkoutError = data.errors || "Unknown error from gateway";
    }
  } catch (err) {
    this.checkoutError = err.message || "Failed to fetch cart checkout";
  } finally {
    this.loadingCheckout = false;
  }
}

  },
});
