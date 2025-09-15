import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { _ as _export_sfc, u as useRouter, f as useCartStore } from './server.mjs';

const _sfc_main = {
  __name: "CommonProductCard",
  __ssrInlineRender: true,
  props: {
    id: { type: [String, Number], required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    hoverImage: { type: String, default: null },
    tags: { type: Array, default: () => [] },
    price: { type: Number, required: true },
    mrp: { type: Number, default: null },
    showCartBtn: { type: Boolean, default: true },
    productUrl: { type: String, required: true },
    sizes: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const currentImage = ref(props.image);
    const selectedSize = ref(props.sizes?.[0] ?? null);
    useRouter();
    useCartStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative cursor-pointer group overflow-hidden shadow-sm hover:shadow-md transform transition-all duration-300 bg-white rounded-lg flex flex-col" }, _attrs))} data-v-ef3f9c10><div class="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 flex-shrink-0 overflow-hidden" data-v-ef3f9c10><img${ssrRenderAttr("src", currentImage.value)}${ssrRenderAttr("alt", __props.title)} class="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" data-v-ef3f9c10></div>`);
      if (__props.tags && __props.tags.length) {
        _push(`<div class="absolute top-2 left-2 flex flex-wrap gap-1 z-10" data-v-ef3f9c10><!--[-->`);
        ssrRenderList(__props.tags, (tag, index) => {
          _push(`<span class="bg-black text-white text-[10px] sm:text-xs px-2 py-0.5 font-semibold rounded" data-v-ef3f9c10>${ssrInterpolate(tag)}</span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="p-3 flex flex-col flex-1 justify-between gap-2" data-v-ef3f9c10><div class="flex flex-col flex-1" data-v-ef3f9c10><h3 class="text-gray-900 font-medium text-sm sm:text-base md:text-base break-words leading-snug"${ssrRenderAttr("title", __props.title)} data-v-ef3f9c10>${ssrInterpolate(__props.title)}</h3><div class="mt-1 flex items-center space-x-1 sm:space-x-2" data-v-ef3f9c10>`);
      if (__props.mrp) {
        _push(`<span class="text-gray-400 line-through text-[10px] sm:text-sm" data-v-ef3f9c10>₹${ssrInterpolate(__props.mrp)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="text-gray-900 font-semibold text-sm sm:text-base" data-v-ef3f9c10>₹${ssrInterpolate(__props.price)}</span></div></div>`);
      if (__props.sizes && __props.sizes.length) {
        _push(`<div class="mt-2" data-v-ef3f9c10><select class="border rounded-sm px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-black" data-v-ef3f9c10><!--[-->`);
        ssrRenderList(__props.sizes, (s, idx) => {
          _push(`<option${ssrRenderAttr("value", s)} data-v-ef3f9c10${ssrIncludeBooleanAttr(Array.isArray(selectedSize.value) ? ssrLooseContain(selectedSize.value, s) : ssrLooseEqual(selectedSize.value, s)) ? " selected" : ""}>Size: ${ssrInterpolate(s)}</option>`);
        });
        _push(`<!--]--></select></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.showCartBtn) {
        _push(`<button class="w-full sm:w-auto mt-2 sm:mt-3 px-4 py-1.5 bg-black text-white rounded-sm text-xs sm:text-sm hover:bg-gray-800 transition-colors duration-300" data-v-ef3f9c10> Add to Cart </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/ProductCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductCard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ef3f9c10"]]);

export { ProductCard as P };
//# sourceMappingURL=ProductCard-BPWj2ggi.mjs.map
