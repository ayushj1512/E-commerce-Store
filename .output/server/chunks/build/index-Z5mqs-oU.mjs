import { ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { g as useRoute } from './server.mjs';
import { u as useProductStore } from './productStore-DCI7gRFL.mjs';
import { F as FilterSidebar } from './FilterSidebar-ehXnQ7Lv.mjs';
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

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useProductStore();
    const route = useRoute();
    const isFilterOpen = ref(false);
    const selectedCategories = ref([]);
    const priceRange = ref({ min: null, max: null });
    const selectedSort = ref("default");
    const sortOptions = [
      { label: "Price: Low to High", value: "lowtohigh" },
      { label: "Price: High to Low", value: "hightolow" },
      { label: "Newest", value: "latest" },
      { label: "Trending", value: "trending" },
      { label: "Rating", value: "rating" }
    ];
    const categories = ref([]);
    const slugify = (text) => text?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const categoryIdFromRoute = computed(() => {
      const subCategoryParam = route.params.child || "";
      const match = subCategoryParam.match(/(\d+)$/);
      return match ? match[1] : route.params.parent;
    });
    const productsForCategory = computed(
      () => store.getProductsByCategory(categoryIdFromRoute.value)
    );
    const filteredProducts = computed(() => {
      return productsForCategory.value.map((p, index) => {
        const parsedData = p.rawData?.product_data ? JSON.parse(p.rawData.product_data) : {};
        const firstData = parsedData["0"] || {};
        const images = parsedData.images || [];
        const imageUrl = images[0]?.img || p.images[0]?.img || "";
        const hoverImageUrl = images[1]?.img || images[0]?.img || null;
        const categoriesFromData = firstData.categories ? firstData.categories.split("^").map((c) => c.split("*")[0]) : p.displayCategories || [];
        const allSizes = (parsedData.shoeSize || []).map((s) => s.Size).filter(Boolean) || (p.product_all_sizes || []).filter(Boolean) || ["N/A"];
        return {
          ...p,
          id: p.id || p.product_id || firstData.id || `product-${index}`,
          displayName: firstData.name || p.displayName || "",
          displayPrice: Number(firstData.selling_price) || Number(p.displayPrice) || 0,
          displayDiscount: Number(firstData.discount_price) || Number(p.displayDiscount) || 0,
          displayCategories: categoriesFromData,
          imageUrl,
          hoverImageUrl,
          categorySlug: slugify(categoriesFromData[0] || "general"),
          productSlug: slugify(firstData.name || p.displayName || "item"),
          product_all_sizes: allSizes
        };
      }).filter(
        (p) => selectedCategories.value.length ? p.displayCategories.some((cat) => selectedCategories.value.includes(cat)) : true
      ).filter(
        (p) => (priceRange.value.min !== null ? p.displayPrice >= priceRange.value.min : true) && (priceRange.value.max !== null ? p.displayPrice <= priceRange.value.max : true)
      ).sort((a, b) => {
        switch (selectedSort.value) {
          case "lowtohigh":
            return a.displayPrice - b.displayPrice;
          case "hightolow":
            return b.displayPrice - a.displayPrice;
          case "latest":
            return new Date(b.rawData?.date_added) - new Date(a.rawData?.date_added);
          case "rating":
            return (b.rawData?.avg_rating ?? 0) - (a.rawData?.avg_rating ?? 0);
          case "trending":
            return (b.rawData?.sales ?? 0) - (a.rawData?.sales ?? 0);
          default:
            return 0;
        }
      });
    });
    const applyPriceFilter = () => {
    };
    const clearFilters = () => {
      selectedCategories.value = [];
      priceRange.value = { min: null, max: null };
      selectedSort.value = "default";
    };
    const fetchProductsFromRoute = async () => {
      await store.fetchProducts({
        categoryId: categoryIdFromRoute.value,
        page: 1,
        perPage: 100
      });
    };
    watch(() => [route.params.parent, route.params.child], fetchProductsFromRoute);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white text-black min-h-screen p-4 md:p-8" }, _attrs))}><div class="flex flex-col md:flex-row gap-6"><div class="md:w-1/5 flex-shrink-0"><button class="md:hidden mb-4 bg-black text-white px-5 py-2 rounded-full w-full"> Filters </button>`);
      if (isFilterOpen.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<aside class="${ssrRenderClass([
        isFilterOpen.value ? "translate-x-0" : "-translate-x-full",
        "fixed top-0 left-0 h-full w-10/12 sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto",
        "md:relative md:translate-x-0 md:shadow-none md:w-full md:h-auto md:transform-none"
      ])}"><div class="p-4 sm:p-6 flex flex-col h-full md:h-auto"><button class="md:hidden self-end text-gray-600 text-xl font-bold hover:text-gray-800 mb-4"> ✕ </button>`);
      _push(ssrRenderComponent(FilterSidebar, {
        categories: categories.value,
        selectedCategories: selectedCategories.value,
        priceRange: priceRange.value,
        onApplyPrice: applyPriceFilter,
        onClear: clearFilters
      }, null, _parent));
      _push(`</div></aside></div><div class="flex-1">`);
      if (unref(store).loading) {
        _push(`<div class="text-center py-10">Loading products...</div>`);
      } else if (unref(store).error) {
        _push(`<div class="text-center py-10 text-red-600">${ssrInterpolate(unref(store).error)}</div>`);
      } else {
        _push(`<div><div class="flex flex-wrap gap-2 mb-4 overflow-x-auto"><!--[-->`);
        ssrRenderList(sortOptions, (option) => {
          _push(`<button class="${ssrRenderClass([
            selectedSort.value === option.value ? "bg-black text-white scale-105 shadow-md" : "bg-gray-100 text-gray-800 hover:bg-gray-200",
            "px-3 py-1 rounded-full border text-sm whitespace-nowrap"
          ])}">${ssrInterpolate(option.label)}</button>`);
        });
        _push(`<!--]--></div><div${ssrRenderAttrs({
          name: "fade-slide",
          class: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        })}>`);
        ssrRenderList(filteredProducts.value, (product, index) => {
          _push(ssrRenderComponent(ProductCard, {
            key: product.id || `product-${index}`,
            id: product.id || `product-${index}`,
            title: product.displayName,
            image: product.imageUrl,
            hoverImage: product.hoverImageUrl,
            price: product.displayPrice,
            mrp: product.displayDiscount,
            showCartBtn: true,
            productUrl: `/${unref(route).params.parent || "products"}/${product.categorySlug}/${product.productSlug}/${product.id}`
          }, null, _parent));
        });
        _push(`</div>`);
        if (!filteredProducts.value.length) {
          _push(`<div class="text-center py-10 text-gray-500"> No products found. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[parent]/[child]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Z5mqs-oU.mjs.map
