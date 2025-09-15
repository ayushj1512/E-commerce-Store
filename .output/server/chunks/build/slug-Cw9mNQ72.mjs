import { ref, watch, mergeProps, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, g as useRoute } from './server.mjs';
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
import 'vue-router';
import 'lucide-vue-next';

const _sfc_main$2 = {
  __name: "CartRelatedProducts",
  __ssrInlineRender: true,
  setup(__props) {
    const products = [
      {
        name: "Graphic Sweatshirt",
        price: 1500,
        mrp: 1800,
        image: "https://i.pinimg.com/1200x/92/5b/56/925b565bd5756c511e9b40bf0133725a.jpg",
        hoverImage: null,
        tags: ["New"],
        slug: "graphic-sweatshirt",
        parent: "sweatshirts"
      },
      {
        name: "Casual Hoodie",
        price: 1300,
        mrp: 1600,
        image: "https://i.pinimg.com/736x/1d/46/0f/1d460fe2ae9c716373b205a3c6799500.jpg",
        hoverImage: null,
        tags: ["Popular"],
        slug: "casual-hoodie",
        parent: "hoodies"
      },
      {
        name: "Letter Print Sweatshirt",
        price: 1700,
        mrp: 2e3,
        image: "https://kittenalarm.com/cdn/shop/products/Letter-Graphic-Drop-Shoulder-Sweatshirt-977_b7428ee5-04fc-4aac-abb1-640db011d5cf.jpg?v=1700297151&width=823",
        hoverImage: null,
        tags: ["Trending"],
        slug: "letter-print-sweatshirt",
        parent: "sweatshirts"
      },
      {
        name: "Checked Shirt",
        price: 1100,
        mrp: 1400,
        image: "https://i.pinimg.com/1200x/a9/48/44/a9484468215d4b58e0bf831157d73c34.jpg",
        hoverImage: null,
        tags: ["Hot"],
        slug: "checked-shirt",
        parent: "shirts"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-c4a44096><h2 class="text-2xl font-bold text-black px-4" data-v-c4a44096>You Might Also Like</h2><div class="flex space-x-4 overflow-x-auto px-4 py-2 scrollbar-hide" data-v-c4a44096><!--[-->`);
      ssrRenderList(products, (prod, idx) => {
        _push(ssrRenderComponent(ProductCard, mergeProps({ key: idx }, { ref_for: true }, prod, { class: "flex-shrink-0 w-64 sm:w-56 md:w-48 lg:w-56" }), null, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/relatedProducts.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const relatedProducts = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-c4a44096"]]);
const _sfc_main$1 = {
  __name: "ProductDetailReviews&rating",
  __ssrInlineRender: true,
  setup(__props) {
    const product = ref({
      reviews: [
        { name: "Alice", rating: 5, comment: "Great product!", photos: ["/dummy1.jpg", "/dummy2.jpg"] },
        { name: "Bob", rating: 4, comment: "Good quality", photos: [] },
        { name: "Charlie", rating: 3, comment: "Average", photos: ["/dummy3.jpg"] },
        { name: "David", rating: 5, comment: "Loved it!", photos: [] },
        { name: "Eve", rating: 2, comment: "Not satisfied", photos: [] }
      ]
    });
    const mounted = ref(false);
    const avgRating = computed(
      () => product.value.reviews.length ? product.value.reviews.reduce((sum, r) => sum + r.rating, 0) / product.value.reviews.length : 0
    );
    const getPercentage = (star) => product.value.reviews.length ? product.value.reviews.filter((r) => r.rating === star).length / product.value.reviews.length * 100 : 0;
    const reviewChunks = computed(() => {
      const chunks = [];
      const reviews = product.value.reviews || [];
      for (let i = 0; i < reviews.length; i += 2) {
        chunks.push(reviews.slice(i, i + 2));
      }
      return chunks;
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (mounted.value && product.value.reviews?.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-6 sm:mt-10 animate-fade-in delay-200" }, _attrs))}><h2 class="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">Customer Reviews</h2><div class="flex flex-col md:flex-row gap-4 sm:gap-8"><div class="md:w-1/2 bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-6"><div class="flex flex-col items-center sm:items-start"><span class="text-5xl sm:text-6xl font-extrabold text-black">${ssrInterpolate(avgRating.value.toFixed(1))}</span><div class="flex text-yellow-500 mt-1"><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<!--[-->`);
          if (i <= Math.round(avgRating.value)) {
            _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.538 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.783.57-1.838-.197-1.538-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.075 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.947z"></path></svg>`);
          } else {
            _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.538 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.783.57-1.838-.197-1.538-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.075 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.947z"></path></svg>`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></div><span class="text-gray-600 font-medium mt-1 text-sm">(${ssrInterpolate(product.value.reviews.length)} reviews)</span></div><div class="flex-1 space-y-2 w-full"><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<div class="flex items-center gap-2"><span class="w-6 text-black">${ssrInterpolate(6 - i)}★</span><div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"><div class="h-2 bg-black rounded-full transition-all duration-700 ease-out" style="${ssrRenderStyle({ width: getPercentage(6 - i) + "%" })}"></div></div><span class="w-6 text-gray-700 text-right">${ssrInterpolate(product.value.reviews.filter((r) => r.rating === 6 - i).length)}</span></div>`);
        });
        _push(`<!--]--></div></div><div class="md:w-1/2 flex gap-4 overflow-x-auto"><!--[-->`);
        ssrRenderList(reviewChunks.value, (chunk, idx) => {
          _push(`<div class="flex flex-col gap-4 min-w-[300px]"><!--[-->`);
          ssrRenderList(chunk, (r) => {
            _push(`<div class="bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"><div class="flex items-center justify-between mb-1 sm:mb-2"><span class="font-semibold text-black text-sm sm:text-base">${ssrInterpolate(r.name)}</span><span class="text-yellow-500 text-sm sm:text-base">${ssrInterpolate("★".repeat(r.rating))}</span></div><p class="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3">${ssrInterpolate(r.comment)}</p>`);
            if (r.photos?.length) {
              _push(`<div class="flex flex-wrap gap-2"><!--[-->`);
              ssrRenderList(r.photos, (p, i) => {
                _push(`<img${ssrRenderAttr("src", p)} class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-2xl border border-gray-300 shadow-sm transform hover:scale-105 transition-all duration-300">`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/productDetail/reviews&rating.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const fallbackImage = "https://via.placeholder.com/400x400?text=No+Image";
const _sfc_main = {
  __name: "slug",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const loading = ref(true);
    const product = ref(null);
    const selectedImage = ref("");
    const selectedSize = ref("M");
    const allProducts = [
      {
        slug: "classic-white-shirt",
        parent: "shirts",
        name: "Classic White Shirt",
        price: 1200,
        mrp: 1500,
        offer: "20% off",
        description: "<p>Elegant classic white shirt perfect for formal and casual wear.</p>",
        images: [
          "https://cdn.streetstylestore.com/3/0/3/2/8/8/303288-sss_vertical.webp",
          "https://cdn.streetstylestore.com/3/0/3/2/8/6/303286-sss_vertical.webp",
          "https://cdn.streetstylestore.com/3/0/3/2/8/7/303287-sss_vertical.webp",
          "https://cdn.streetstylestore.com/3/0/3/2/8/8/303288-sss_vertical.webp",
          "https://cdn.streetstylestore.com/3/0/3/2/8/6/303286-sss_vertical.webp",
          "https://cdn.streetstylestore.com/3/0/3/2/8/7/303287-sss_vertical.webp"
        ],
        reviews: [
          { name: "Alice", rating: 5, comment: "Loved it! Great quality.", photos: ["https://randomuser.me/api/portraits/women/65.jpg", "https://randomuser.me/api/portraits/women/66.jpg"] },
          { name: "Bob", rating: 4, comment: "Good fit, nice fabric.", photos: ["https://randomuser.me/api/portraits/men/65.jpg"] }
        ]
      }
    ];
    const fetchProduct = async (parentSlug, childSlug) => {
      loading.value = true;
      await new Promise((res) => setTimeout(res, 300));
      product.value = allProducts.find((p) => p.slug === childSlug && p.parent === parentSlug) || allProducts[0];
      selectedImage.value = product.value?.images?.[0] || fallbackImage;
      loading.value = false;
    };
    watch(() => route.params, ({ parent, slug: slug2 }) => {
      if (parent && slug2) fetchProduct(parent, slug2);
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white text-black px-4 md:px-10" }, _attrs))} data-v-078ca1a7>`);
      if (loading.value) {
        _push(`<div class="flex flex-col justify-center items-center h-screen" data-v-078ca1a7><div class="loader border-black border-t-gray-300" data-v-078ca1a7></div><p class="text-gray-700 mt-3 font-medium text-lg animate-pulse" data-v-078ca1a7>Loading product...</p></div>`);
      } else if (product.value) {
        _push(`<div class="mx-auto rounded-2xl sm:p-6 md:p-10 space-y-8 animate-fade-in" data-v-078ca1a7><h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black tracking-tight animate-slide-up" data-v-078ca1a7>${ssrInterpolate(product.value.name)}</h1><div class="flex flex-col md:flex-row" data-v-078ca1a7><div class="w-full md:w-1/2 relative flex flex-col items-center md:items-start" data-v-078ca1a7><div class="w-full max-w-[350px] md:max-w-[300px] lg:max-w-[350px] xl:max-w-[400px] border border-gray-200 rounded-2xl shadow-xl overflow-hidden relative hover:shadow-lg transition-shadow duration-300" style="${ssrRenderStyle({ "aspect-ratio": "9/16", "max-height": "500px" })}" data-v-078ca1a7><img${ssrRenderAttr("src", selectedImage.value)} alt="Product Image" class="w-full h-full object-contain transition-transform duration-500 hover:scale-105" data-v-078ca1a7><button class="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all hover:scale-110" data-v-078ca1a7><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-078ca1a7><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-078ca1a7></path></svg></button><button class="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all hover:scale-110" data-v-078ca1a7><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-078ca1a7><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-078ca1a7></path></svg></button></div><div class="mt-3 sm:mt-4" data-v-078ca1a7><div class="flex md:flex-wrap flex-nowrap gap-2 sm:gap-3 justify-start overflow-x-auto md:overflow-x-visible scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" data-v-078ca1a7><!--[-->`);
        ssrRenderList(product.value.images || [], (img, idx) => {
          _push(`<img${ssrRenderAttr("src", img || fallbackImage)} class="${ssrRenderClass([
            "w-16 sm:w-20 h-28 sm:h-36 object-contain rounded-lg cursor-pointer border-2 transition-all duration-300 transform flex-shrink-0",
            selectedImage.value === img ? "border-black scale-105 shadow-lg animate-pulse" : "border-gray-300 hover:border-black hover:scale-105"
          ])}" data-v-078ca1a7>`);
        });
        _push(`<!--]--></div></div></div><div class="flex-1 flex flex-col justify-start space-y-4 sm:space-y-5 animate-slide-up delay-150" data-v-078ca1a7><div class="flex flex-wrap items-center gap-3 sm:gap-4" data-v-078ca1a7><span class="text-xl sm:text-2xl font-bold text-black" data-v-078ca1a7>₹ ${ssrInterpolate(product.value.price)}</span>`);
        if (product.value.mrp) {
          _push(`<span class="line-through text-gray-400 text-sm sm:text-base" data-v-078ca1a7>₹ ${ssrInterpolate(product.value.mrp)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (product.value.offer) {
          _push(`<span class="text-xs sm:text-sm text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded animate-bounce-offer" data-v-078ca1a7>${ssrInterpolate(product.value.offer)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex flex-wrap gap-2 sm:gap-3" data-v-078ca1a7><!--[-->`);
        ssrRenderList(["XS", "S", "M", "L", "XL"], (size) => {
          _push(`<button class="${ssrRenderClass([
            "py-1 sm:py-2 px-3 sm:px-4 border rounded-lg font-semibold cursor-pointer transition-transform duration-200 text-sm sm:text-base",
            selectedSize.value === size ? "bg-black text-white border-black shadow-lg scale-105" : "bg-white text-black border-gray-400 hover:bg-gray-50 hover:scale-105"
          ])}" data-v-078ca1a7>${ssrInterpolate(size)}</button>`);
        });
        _push(`<!--]--></div><div class="flex flex-wrap gap-2 sm:gap-4 mt-2" data-v-078ca1a7><button class="bg-black text-white font-semibold py-2 px-4 sm:py-2 sm:px-6 rounded-lg hover:bg-gray-800 transition-all shadow-md transform hover:scale-105" data-v-078ca1a7> Add to Cart </button><button class="bg-white border border-black text-black font-semibold py-2 px-4 sm:py-2 sm:px-6 rounded-lg hover:bg-black hover:text-white transition-all shadow-md transform hover:scale-105" data-v-078ca1a7> Buy Now </button></div><div class="text-gray-800 leading-relaxed mt-3 sm:mt-4 text-sm sm:text-base" data-v-078ca1a7>${product.value.description ?? ""}</div><div class="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base" data-v-078ca1a7><h3 class="font-semibold text-black text-base sm:text-lg" data-v-078ca1a7>Delivery Information</h3><p data-v-078ca1a7>Products are generally dispatched in 3-21 days depending upon the product you have ordered. We guarantee our products are worth the wait with premium quality and designs.</p><h3 class="font-semibold text-black text-base sm:text-lg mt-2" data-v-078ca1a7>Returns &amp; Exchange</h3><p data-v-078ca1a7>Size exchange is free. Rs 100 fee applies for product exchange. <a href="#" class="underline text-black hover:text-gray-600" data-v-078ca1a7>Click here for details</a>.</p></div></div></div>`);
        _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
        _push(ssrRenderComponent(relatedProducts, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="flex justify-center items-center h-60" data-v-078ca1a7><p class="text-gray-500 text-lg font-medium" data-v-078ca1a7>Product not found.</p></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[parent]/slug.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const slug = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-078ca1a7"]]);

export { slug as default };
//# sourceMappingURL=slug-Cw9mNQ72.mjs.map
