import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cartStore";

/* -------------------------------------------------------------------------- */
/* 🧩 Helper: Load external Wigzo script safely                                */
/* -------------------------------------------------------------------------- */
function loadScript(src: string, opts: { id?: string } = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(opts.id || "")) return resolve();
    const script = document.createElement("script");
    script.id = opts.id || "";
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

/* -------------------------------------------------------------------------- */
/* 🔧 Ensure Wigzo global object exists                                       */
/* -------------------------------------------------------------------------- */
function ensureWigzoGlobal() {
  if (typeof window === "undefined") return;
  if (!window.WigzoObject) window.WigzoObject = "wigzo";
  const o = window.WigzoObject;
  (window as any)[o] =
    (window as any)[o] ||
    function () {
      ((window as any)[o].q = (window as any)[o].q || []).push(arguments);
    };
  (window as any)[o].l = +new Date();
  (window as any)[o].h = "//app.wigzo.com/wigzo.compressed.js";
}

/* -------------------------------------------------------------------------- */
/* ⚙️ Main Plugin                                                            */
/* -------------------------------------------------------------------------- */
export default defineNuxtPlugin((nuxtApp) => {
  const { $cookies } = nuxtApp as any;
  const authStore = useAuthStore();
  const cartStore = useCartStore();

  let wigzoReady = false;

  /** 🔹 Load Wigzo script once */
  async function loadWigzoOnce(token: string, src = "//app.wigzo.com/wigzo.compressed.js") {
    if (wigzoReady) return true;
    ensureWigzoGlobal();
    await loadScript(src, { id: "wigzo-sdk" });
    (window as any).wigzo("configure", token);
    wigzoReady = true;
    console.log("[Shiprocket360] Wigzo initialized ✅");
    return true;
  }

  /** 🔹 Fetch config and load Wigzo (Direct API call) */
  const wigzoLoad = async (opts: { forced?: boolean; token?: string; src?: string } = {}) => {
    if (wigzoReady) return true;

    // If forced manual load
    if (opts.forced && opts.token)
      return loadWigzoOnce(opts.token, opts.src || "//app.wigzo.com/wigzo.compressed.js");

    try {
      const response = await fetch(
        "https://api.streetstylestore.com/collections/sss_config/documents/sss-ship-rocket-360?a=1",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-typesense-api-key": "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx",
          },
        }
      );

      if (!response.ok) {
        console.warn("[Shiprocket360] Wigzo config fetch failed:", response.statusText);
        return false;
      }

      const res = await response.json();
      const data = JSON.parse(decodeURIComponent(res.data));

      if (!data || !data.enabled || !data.token) {
        console.warn("[Shiprocket360] Wigzo disabled or missing token");
        return false;
      }

      return loadWigzoOnce(data.token, data.src || "//app.wigzo.com/wigzo.compressed.js");
    } catch (e) {
      console.warn("[Shiprocket360] Wigzo config fetch failed", e);
      return false;
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🧩 Track Events                                                           */
  /* -------------------------------------------------------------------------- */

  /** 🛍️ Product View */
  const wigzoViewItem = (itemsData: any[], eventName: string, pageUrl: string) => {
    if (!wigzoReady) return false;

    let product = {
      id: "",
      price: 0,
      discount: 0,
      category: "",
      img: "",
    };

    itemsData.forEach((item) => {
      product.id = item.item_id;
      product.price = parseFloat(item.price);
      product.discount = parseFloat(item.discount);
      product.category = item.item_category;
      product.img = item.item_img;
    });

    const productPrice = product.price - product.discount;

    (window as any).wigzo("track", eventName, {
      canonicalURL: pageUrl,
      productUrl: pageUrl,
      title: document.title,
      price: productPrice,
      previousPrice: product.price,
      image: product.img,
      productId: product.id,
      category: product.category,
      author: "SSS",
      language: "en",
    });
  };

  /** 🗂️ Category View */
  const wigzoViewCategory = (data: any) => {
    if (!wigzoReady) return false;

    (window as any).wigzo("track", "categoryview", {
      canonicalURL: window.location.origin + data.page_url,
      categoryUrl: window.location.origin + data.page_url,
      image: "",
      title: data.page_title,
    });
  };

  /** 💳 Checkout Started */
  const wigzoViewCheckOut = (src: any) => {
    if (!wigzoReady) return false;

    const parseItemString = (s: string) => {
      const obj: any = {};
      s.split("~").forEach((pair) => {
        const idx = pair.indexOf(":");
        if (idx === -1) return;
        const k = pair.slice(0, idx).trim();
        const v = pair.slice(idx + 1).trim();
        obj[k] = v;
      });
      ["quantity", "price", "discount", "item_id"].forEach((k) => {
        if (obj[k] != null) obj[k] = Number(obj[k]);
      });
      return obj;
    };

    const items = Object.keys(src)
      .filter((k) => /^item\[\d+\]$/.test(k))
      .map((k) => parseItemString(src[k]));

    const itemsArr = items.map((item: any) => ({
      checkout_id: authStore.cart_id,
      product_id: item.item_id,
      quantity: item.quantity,
      sku: item.item_id,
      title: item.item_name,
      price: item.price - item.discount,
      vendor: "SSS",
    }));

    const now = new Date().toISOString();

    const payload = {
      completed_at: now,
      created_at: now,
      currency: "INR",
      source_identifier: $cookies.get("sss_campaign") || "",
      total_discounts: src.discount,
      total_price: src.sub_total,
      total_line_items_price: src.total,
      line_items: itemsArr,
      abandoned_checkout_url: `${window.location.origin}/checkout?id_cart=${authStore.cart_id}`,
    };

    (window as any).wigzo("track", "checkoutstarted", payload);
  };

  /** ✅ Order Confirmation */
  const wigzoOrderConfirmation = (src: any) => {
    if (!wigzoReady) return false;

    const now = new Date().toISOString();
    const userInfo = src.user_info.split("~");

    const parseItemString = (s: string) => {
      const obj: any = {};
      s.split("~").forEach((pair) => {
        const idx = pair.indexOf(":");
        if (idx === -1) return;
        const k = pair.slice(0, idx).trim();
        const v = pair.slice(idx + 1).trim();
        obj[k] = v;
      });
      ["quantity", "price", "discount", "item_id"].forEach((k) => {
        if (obj[k] != null) obj[k] = Number(obj[k]);
      });
      return obj;
    };

    const items = Object.keys(src)
      .filter((k) => /^item\[\d+\]$/.test(k))
      .map((k) => parseItemString(src[k]));

    const lineItems = items.map((item: any, index: number) => ({
      line_item_id: index,
      product_id: item.item_id,
      quantity: item.quantity,
      price: item.price,
      product_discount: item.discount,
      categories: item.item_category,
    }));

    const payload = {
      orderId: src.id_order,
      customer_id: authStore.id_customer,
      phone: "+91" + userInfo[3],
      fullName: `${userInfo[1]} ${userInfo[2]}`,
      email: userInfo[4],
      total_price: src.sub_total,
      total_line_items_price: src.total,
      total_discounts: src.discount,
      cart_token: authStore.cart_id,
      created_at: now,
      city: src.city,
      state: src.state_name,
      country: "India",
      zip: src.pin_code,
      financial_status: src.payment_type,
      taxes_included: true,
      line_items: lineItems,
    };

    (window as any).wigzo("track", "order", payload);
  };

  /* -------------------------------------------------------------------------- */
  /* 🧠 Inject globally                                                        */
  /* -------------------------------------------------------------------------- */
  nuxtApp.provide("wigzoLoad", wigzoLoad);
  nuxtApp.provide("wigzoViewItem", wigzoViewItem);
  nuxtApp.provide("wigzoViewCategory", wigzoViewCategory);
  nuxtApp.provide("wigzoViewCheckOut", wigzoViewCheckOut);
  nuxtApp.provide("wigzoOrderConfirmation", wigzoOrderConfirmation);
});
