import { computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { u as useProductStore } from './productStore-DCI7gRFL.mjs';
import { P as ProductCard } from './ProductCard-BPWj2ggi.mjs';
import { _ as _export_sfc } from './server.mjs';
import 'pinia';
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
import 'vue-router';
import 'lucide-vue-next';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const productStore = useProductStore();
    const loading = computed(() => productStore.loading);
    const trendingProducts = computed(() => {
      return productStore.products.filter(
        (p) => p.displayCategories?.includes("93") || p.displayCategories?.includes(93) || p.categories?.includes(93)
      );
    });
    computed(() => {
      if (trendingProducts.value.length === 0) return "Trending";
      const firstProduct = trendingProducts.value[0];
      return firstProduct.displayCategories?.[0] || "Trending";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white text-black min-h-screen p-4 md:p-10 font-sans" }, _attrs))} data-v-9e6f97a6>`);
      if (loading.value) {
        _push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4" data-v-9e6f97a6><!--[-->`);
        ssrRenderList(8, (n) => {
          _push(`<div class="h-64 bg-gray-200 rounded-lg animate-pulse" data-v-9e6f97a6></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (trendingProducts.value.length === 0) {
        _push(`<div class="flex justify-center items-center py-20 text-gray-500" data-v-9e6f97a6> No trending products found. </div>`);
      } else {
        _push(`<div class="px-2 mt-2 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-2 xl:gap-2" data-v-9e6f97a6><!--[-->`);
        ssrRenderList(trendingProducts.value, (product, index2) => {
          _push(ssrRenderComponent(ProductCard, {
            key: index2,
            title: product.displayName,
            image: product.parsedData.images?.[0]?.img || product.image,
            hoverImage: product.parsedData.images?.[1]?.img || null,
            price: product.displayPrice,
            mrp: product.displayDiscount,
            showCartBtn: true,
            productUrl: product.productUrl || `/category/${product.slug}/${product.id}`
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/trending/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9e6f97a6"]]);

export { index as default };
//# sourceMappingURL=index-D-UJSkQp.mjs.map
