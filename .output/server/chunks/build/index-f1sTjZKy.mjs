import { ref, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { useRouter, useRoute } from 'vue-router';
import { _ as _export_sfc, f as useCartStore } from './server.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-T9Q95HsO.mjs';
import { P as ProductCard } from './ProductCard-BPWj2ggi.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'pinia';
import 'lucide-vue-next';

const _sfc_main$1 = {
  __name: "CartEmptyCart",
  __ssrInlineRender: true,
  setup(__props) {
    const products = [
      {
        id: 1,
        name: "Dress 1",
        price: 2499,
        mrp: 2999,
        image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75",
        hoverImage: null,
        tags: ["New"]
      },
      {
        id: 2,
        name: "Top 1",
        price: 1299,
        mrp: 1599,
        image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75",
        hoverImage: null,
        tags: ["Trending"]
      },
      {
        id: 3,
        name: "Shirt 1",
        price: 1599,
        mrp: 1999,
        image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FTR166DGRY_2.jpg%3Fv%3D1726144103&w=1920&q=75",
        hoverImage: null,
        tags: ["Best Seller"]
      },
      {
        id: 4,
        name: "Blouse 1",
        price: 899,
        mrp: null,
        image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH424BLST_2.jpg%3Fv%3D1754030952&w=1920&q=75",
        hoverImage: null,
        tags: []
      }
    ];
    const sections = [
      { title: "You may also like", products },
      { title: "Trending Now", products: [...products].reverse() },
      { title: "Best Sellers", products }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-50 text-black min-h-screen p-6 sm:p-10" }, _attrs))}><div class="flex flex-col items-center text-center py-16 space-y-6"><div class="w-40 sm:w-56 md:w-64 animate-bounce-slow"><img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty Cart" class="w-full h-auto"></div><h2 class="text-3xl sm:text-4xl font-extrabold text-gray-800"> Your cart is empty </h2><p class="text-gray-600 max-w-md"> Looks like you haven’t added anything yet. Browse our products and find your perfect pick! </p>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="px-6 py-3 bg-black text-white rounded-full shadow-lg hover:scale-105 transform transition"${_scopeId}> Continue Shopping </button>`);
          } else {
            return [
              createVNode("button", { class: "px-6 py-3 bg-black text-white rounded-full shadow-lg hover:scale-105 transform transition" }, " Continue Shopping ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><!--[-->`);
      ssrRenderList(sections, (section, idx) => {
        _push(`<div class="mb-12"><div class="relative flex items-center justify-center mb-6" data-aos="fade-up"><div class="absolute inset-x-0 h-px bg-gray-300"></div><h2 class="relative bg-gray-50 px-6 text-lg sm:text-xl md:text-2xl font-bold text-gray-900">${ssrInterpolate(section.title)}</h2></div><div class="overflow-x-auto px-2 sm:px-4 pb-4 scrollbar-hide snap-x snap-mandatory"><div class="flex space-x-4 sm:space-x-6"><!--[-->`);
        ssrRenderList(section.products, (product) => {
          _push(ssrRenderComponent(ProductCard, {
            key: product.id,
            title: product.name,
            image: product.image,
            price: product.price,
            mrp: product.mrp,
            hoverImage: product.hoverImage,
            tags: product.tags,
            class: "flex-shrink-0 w-52 sm:w-60 md:w-64 lg:w-72 snap-start transform transition hover:scale-[1.02]"
          }, null, _parent));
        });
        _push(`<!--]--></div></div></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/EmptyCart.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const deliveryCharge = 40;
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useRoute();
    const cart = useCartStore();
    const couponCode = ref("");
    const discount = ref(0);
    const showModal = ref(false);
    const modalItem = ref(null);
    const showClearCartModal = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-50 min-h-screen p-4 md:p-8" }, _attrs))} data-v-2a9cb7e0><div class="flex flex-col md:flex-row gap-6" data-v-2a9cb7e0>`);
      if (unref(cart).items.length === 0) {
        _push(ssrRenderComponent(_sfc_main$1, { class: "w-full" }, null, _parent));
      } else {
        _push(`<!--[--><div class="w-full md:w-2/3 space-y-4" data-v-2a9cb7e0><!--[-->`);
        ssrRenderList(unref(cart).items, (item) => {
          _push(`<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded-2xl p-4 shadow-sm hover:shadow-lg transition bg-white" data-v-2a9cb7e0><div class="flex items-start sm:items-center space-x-4 mb-4 sm:mb-0 cursor-pointer flex-1" data-v-2a9cb7e0><img${ssrRenderAttr("src", item.image)} alt="Product" class="w-20 h-24 object-cover rounded-xl" data-v-2a9cb7e0><div data-v-2a9cb7e0><h2 class="font-semibold text-lg" data-v-2a9cb7e0>${ssrInterpolate(item.name)}</h2>`);
          if (item.size) {
            _push(`<p class="text-sm text-gray-500" data-v-2a9cb7e0> Size: ${ssrInterpolate(item.size)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<p class="font-bold mt-1" data-v-2a9cb7e0>₹${ssrInterpolate(item.price)}</p></div></div><div class="flex items-center space-x-3" data-v-2a9cb7e0><button class="px-2 py-1 border rounded-lg hover:bg-gray-200 transition" data-v-2a9cb7e0> - </button><span class="font-semibold" data-v-2a9cb7e0>${ssrInterpolate(item.quantity)}</span><button class="px-2 py-1 border rounded-lg hover:bg-gray-200 transition" data-v-2a9cb7e0> + </button><button class="ml-3 text-red-500 hover:underline text-sm" data-v-2a9cb7e0> Remove </button></div></div>`);
        });
        _push(`<!--]--></div><div class="w-full md:w-1/3 border rounded-2xl p-6 shadow-md bg-white md:sticky md:top-20 space-y-4" data-v-2a9cb7e0><h2 class="text-xl font-bold mb-4" data-v-2a9cb7e0>Order Summary</h2><div class="flex justify-between text-gray-700" data-v-2a9cb7e0><span data-v-2a9cb7e0>Subtotal</span><span data-v-2a9cb7e0>₹${ssrInterpolate(unref(cart).totalPrice)}</span></div><div class="flex justify-between text-gray-700" data-v-2a9cb7e0><span data-v-2a9cb7e0>Delivery</span><span data-v-2a9cb7e0>₹${ssrInterpolate(deliveryCharge)}</span></div><div class="flex justify-between text-gray-700" data-v-2a9cb7e0><span data-v-2a9cb7e0>Discount</span><span data-v-2a9cb7e0>-₹${ssrInterpolate(discount.value)}</span></div><div class="mt-4" data-v-2a9cb7e0><label class="block mb-2 font-medium" data-v-2a9cb7e0>Apply Coupon</label><div class="flex gap-2" data-v-2a9cb7e0><input${ssrRenderAttr("value", couponCode.value)} type="text" placeholder="Enter code" class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" data-v-2a9cb7e0><button class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm" data-v-2a9cb7e0> Apply </button></div></div><div class="flex justify-between font-bold text-lg mt-6 border-t pt-3" data-v-2a9cb7e0><span data-v-2a9cb7e0>Total</span><span data-v-2a9cb7e0>₹${ssrInterpolate(unref(cart).totalPrice + deliveryCharge - discount.value)}</span></div><button class="w-full bg-black text-white py-3 rounded-xl mt-6 hover:bg-gray-800 transition text-lg font-semibold" data-v-2a9cb7e0> Proceed to Checkout </button><button class="w-full bg-red-500 text-white py-3 rounded-xl mt-3 hover:bg-red-600 transition text-lg font-semibold" data-v-2a9cb7e0> Clear Cart </button></div><!--]-->`);
      }
      _push(`</div>`);
      if (showModal.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-v-2a9cb7e0><div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative transform scale-95 transition-all" data-v-2a9cb7e0><div class="text-red-500 text-center text-5xl mb-4" data-v-2a9cb7e0>⚠️</div><p class="text-lg font-semibold mb-6 text-center" data-v-2a9cb7e0> Are you sure you want to remove <span class="text-red-500" data-v-2a9cb7e0>&quot;${ssrInterpolate(modalItem.value?.name)}&quot;</span> from your cart? </p><div class="flex justify-center gap-4" data-v-2a9cb7e0><button class="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition" data-v-2a9cb7e0> Yes, Remove </button><button class="flex-1 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition" data-v-2a9cb7e0> Cancel </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showClearCartModal.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-v-2a9cb7e0><div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative transform scale-95 transition-all" data-v-2a9cb7e0><div class="text-red-500 text-center text-5xl mb-4" data-v-2a9cb7e0>🛒</div><p class="text-lg font-semibold mb-6 text-center" data-v-2a9cb7e0> Are you sure you want to <span class="text-red-500" data-v-2a9cb7e0>clear your entire cart</span>? </p><p class="text-sm text-gray-500 text-center mb-4" data-v-2a9cb7e0> This action cannot be undone. </p><div class="flex justify-center gap-4" data-v-2a9cb7e0><button class="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition" data-v-2a9cb7e0> Yes, Clear All </button><button class="flex-1 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition" data-v-2a9cb7e0> Cancel </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cart/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2a9cb7e0"]]);

export { index as default };
//# sourceMappingURL=index-f1sTjZKy.mjs.map
