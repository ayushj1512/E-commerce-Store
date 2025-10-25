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
        .reduce((sum, i) => sum + (i.MRP_price || 0) * (i.quantity || 0), 0)
        .toFixed(2),

    // total after discounts (and COD if selected)
    total: (state) => {
      const baseTotal = state.items.reduce(
        (sum, i) => sum + (i.finalPrice || i.MRP_price * i.quantity),
        0
      );
      const withCOD = state.codSelected
        ? baseTotal + state.COD_CHARGE
        : baseTotal;
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
    MRP_price: +product.MRP_price || 0,             // use actual field from payload
    discountPrice: +product.discountPerItem || 0,  // per-item discount
    categories: (product.categories || []).map(Number),
    size: product.size || null,
    color: product.color || null,
    image: product.image || "",
    quantity: product.quantity || 1,
    _key: key,
    discountApplied: product.discountApplied || false,
    discountQty: product.discountQty || 0,
    discountPerItem: product.discountPerItem || 0,
    finalPrice: +product.finalPrice || +product.MRP_price || 0, // total line price

    // Checkout payload
    attributes: product.attributes || [],
    item_list_id: product.item_list_id || "",
    item_list_name: product.item_list_name || "",
    product_payload: {
      product: {
        product_id: product.id.toString(),
        name: product.name,
        selling_price: +product.MRP_price || 0,           // per-unit price
        discount_price: +product.discountPerItem || 0,    // per-unit discount
        size: product.size || null,
        color: product.color || null,
      },
    },
  };

  console.log("🛍️ addToCart called with product:", {
    id: product.id,
    name: product.name,
    size: product.size,
    color: product.color,
    qty: product.quantity,
    MRP_price: cartItem.MRP_price,
    discount: cartItem.discountPrice,
    categories: product.categories,
  });

  if (existing) {
    console.log("🔁 Existing item found in cart, merging quantities...");
    console.log("Before merge:", {
      existingQty: existing.quantity,
      addedQty: cartItem.quantity,
    });

    // Merge quantities
    existing.quantity += cartItem.quantity;

    // Update attributes & payload
    existing.attributes = cartItem.attributes;
    existing.item_list_id = cartItem.item_list_id;
    existing.item_list_name = cartItem.item_list_name;
    existing.product_payload = cartItem.product_payload;

    // Recalculate line total if needed
    existing.finalPrice = +cartItem.MRP_price * existing.quantity;

    console.log("After merge (before discount recalculation):", existing);
  } else {
    console.log("🆕 New product added to cart:", cartItem);
    this.items.push(cartItem);
  }

  // Recalculate discounts for all items
  this.computeDiscounts();

  console.log(
    "🧾 Updated Cart Items:",
    this.items.map((i) => ({
      id: i.id,
      name: i.name,
      qty: i.quantity,
      size: i.size,
      color: i.color,
      MRP_price: i.MRP_price,
      finalPrice: i.finalPrice,
      discountQty: i.discountQty,
      discountPerItem: i.discountPerItem,
    }))
  );

  this.saveCart();
  console.log("💾 Cart saved to local storage.");
  console.log("💸 Discounts recalculated.");
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
    // Ensure unique key for each cart item
    if (!item._key)
      item._key = `${item.id}-${item.size || "default"}-${index}`;

    // Ensure categories is an array of numbers
    if (!Array.isArray(item.categories))
      item.categories = [Number(item.categoryId || 0)];
    item.categories = item.categories.map(Number);

    // Ensure MRP_price exists
    if (!item.MRP_price) item.MRP_price = 0;

    // Ensure finalPrice is calculated from MRP_price and quantity
    if (!item.finalPrice) item.finalPrice = item.MRP_price * (item.quantity || 1);

    // Optional: ensure quantity is at least 1
    if (!item.quantity || item.quantity <= 0) item.quantity = 1;
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
          qtyToDiscount * (item.MRP_price - v.discount) +
          (item.quantity - qtyToDiscount) * item.MRP_price
        ).toFixed(2);
        remainingDiscountQty -= qtyToDiscount;
        remainingPerItem[item._key] =
          item.quantity > qtyToDiscount ? remainingToUnlock : 0;
      } else {
        item.discountQty = 0;
        item.discountPerItem = 0;
        item.discountApplied = false;
        item.finalPrice = +(item.MRP_price * item.quantity).toFixed(2);
        remainingPerItem[item._key] = remainingToUnlock;
      }
    });

    this.discount += itemsInCat.reduce(
      (sum, i) => sum + i.discountQty * (i.discountPerItem || 0),
      0
    );
    this.applicableVouchers.push({ ...v, remainingPerItem });
  });
}
,

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
    ? (item.finalPrice || item.MRP_price * item.quantity) / item.quantity
    : item.MRP_price;
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
          product_price: item.MRP_price || 0,               // use MRP_price
          discount_price: item.discountPerItem || 0,
          discount_percent:
            item.discountQty && item.discountPerItem
              ? ((item.discountPerItem / item.MRP_price) * 100).toFixed(0)
              : "0",
          categories: item.categories || [],
          attribute: item.attributes || [],                // expects [{ attr, val }]
          item_list_id: item.item_list_id || "",
          item_list_name: item.item_list_name || "",
          product_img: item.image || "",
          product_payload: {
            product: {
              product_id: item.id.toString(),
              name: item.name,
              selling_price: item.MRP_price,               // use MRP_price
              discount_price: item.discountPerItem || 0,
            },
          },
        },
      })),
      checkout: "new",
      deal_city: "", // optionally from config store
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
