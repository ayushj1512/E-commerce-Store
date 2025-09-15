import { ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { P as ProductCard } from './ProductCard-BPWj2ggi.mjs';
import { _ as _export_sfc } from './server.mjs';
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
import 'vue-router';
import 'lucide-vue-next';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const mounted = ref(false);
    const categories = ["All", "Jackets", "Dresses", "Footwear", "Jeans"];
    const selectedCategory = ref("All");
    const products = ref([]);
    const quotes = [
      "Fashion is the armor to survive the reality of everyday life.",
      "Style is a way to say who you are without having to speak.",
      "In order to be irreplaceable, one must always be different.",
      "Fashion is about dreaming and making other people dream.",
      "Elegance is not standing out, but being remembered."
    ];
    const randomQuote = ref(quotes[0]);
    const filteredProducts = computed(() => {
      return selectedCategory.value === "All" ? products.value : products.value.filter((p) => p.category === selectedCategory.value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-50 min-h-screen py-6 px-4 md:px-12 lg:px-20" }, _attrs))} data-v-cf0d93fa>`);
      if (mounted.value) {
        _push(`<div class="flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-white p-4 md:p-6 rounded-xl shadow-sm" data-v-cf0d93fa><h1 class="text-2xl md:text-3xl font-bold" data-v-cf0d93fa>My Wishlist</h1><p class="text-gray-600 italic text-sm md:text-base text-center" data-v-cf0d93fa>&quot;${ssrInterpolate(randomQuote.value)}&quot;</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (mounted.value) {
        _push(`<div class="bg-white p-4 flex flex-wrap gap-3 rounded-xl shadow-sm mt-4" data-v-cf0d93fa><!--[-->`);
        ssrRenderList(categories, (cat) => {
          _push(`<button class="${ssrRenderClass([selectedCategory.value === cat ? "bg-black text-white" : "bg-gray-100 text-gray-800", "px-4 py-1 rounded-full text-sm md:text-base font-semibold hover:bg-black hover:text-white transition"])}" data-v-cf0d93fa>${ssrInterpolate(cat)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (mounted.value && filteredProducts.value.length) {
        _push(`<div${ssrRenderAttrs({
          name: "fade-scale",
          class: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-4"
        })} data-v-cf0d93fa>`);
        ssrRenderList(filteredProducts.value, (p) => {
          _push(`<div class="relative" data-v-cf0d93fa>`);
          _push(ssrRenderComponent(ProductCard, {
            title: p.title,
            image: p.image,
            hoverImage: p.hoverImage,
            tags: p.tags,
            price: p.price,
            mrp: p.mrp,
            showCartBtn: true
          }, null, _parent));
          _push(`<button class="absolute top-1 right-1 bg-white bg-opacity-70 hover:bg-opacity-100 text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md transition" data-v-cf0d93fa>×</button></div>`);
        });
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (mounted.value && filteredProducts.value.length === 0) {
        _push(`<div class="text-center text-gray-500 py-10" data-v-cf0d93fa> No products found. </div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/wishlist/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cf0d93fa"]]);

export { index as default };
//# sourceMappingURL=index-e-XQrzQ0.mjs.map
