import { ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, u as useRouter } from './server.mjs';
import { P as ProductCard } from './ProductCard-BPWj2ggi.mjs';
import { F as FilterSidebar } from './FilterSidebar-ehXnQ7Lv.mjs';

const _sfc_main = {
  __name: "CollectionPage",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const isFilterOpen = ref(false);
    const products = ref([
      { id: 1, name: "Classic White Shirt", slug: "classic-white-shirt", parent: "shirts", category: "Shirts", price: 1200, mrp: 1500, image: "https://i.pinimg.com/736x/32/a0/94/32a0944320c93cbf7d47d69f606925dd.jpg", hoverImage: null, tags: ["New", "Best Seller"] },
      { id: 2, name: "Black Denim Jeans", slug: "black-denim-jeans", parent: "jeans", category: "Jeans", price: 2200, mrp: 2500, image: "https://i.pinimg.com/736x/31/84/8c/31848cdd1e8a118cfc206b107139d244.jpg", hoverImage: null, tags: ["Trending"] },
      { id: 3, name: "Red T-Shirt", slug: "red-t-shirt", parent: "t-shirts", category: "T-Shirts", price: 800, mrp: 1e3, image: "https://i.pinimg.com/736x/a5/d7/11/a5d71185a01f926838790a5b254531cb.jpg", hoverImage: null, tags: ["Sale"] }
    ]);
    const categories = ref(["Shirts", "Jeans", "T-Shirts"]);
    const selectedCategories = ref([]);
    const priceRange = ref({ min: null, max: null });
    const selectedTags = ref([]);
    const selectedSort = ref({ value: "price_asc" });
    const sortOptions = [
      { label: "Price: Low to High", value: "price_asc" },
      { label: "Price: High to Low", value: "price_desc" },
      { label: "Newest", value: "newest" }
    ];
    const availableTags = computed(() => {
      const tags = /* @__PURE__ */ new Set();
      products.value.forEach((p) => p.tags.forEach((t) => tags.add(t)));
      return Array.from(tags);
    });
    const filteredProducts = computed(() => {
      return products.value.filter((p) => {
        const inCategory = selectedCategories.value.length === 0 || selectedCategories.value.includes(p.category);
        const inPrice = (!priceRange.value.min || p.price >= priceRange.value.min) && (!priceRange.value.max || p.price <= priceRange.value.max);
        const inTags = selectedTags.value.length === 0 || p.tags.some((t) => selectedTags.value.includes(t));
        return inCategory && inPrice && inTags;
      }).sort((a, b) => {
        if (selectedSort.value.value === "price_asc") return a.price - b.price;
        if (selectedSort.value.value === "price_desc") return b.price - a.price;
        return b.id - a.id;
      });
    });
    const applyPriceFilter = () => {
    };
    const clearFilters = () => {
      selectedCategories.value = [];
      priceRange.value = { min: null, max: null };
      selectedTags.value = [];
    };
    const goToProduct = (product) => {
      router.push(`/${product.parent}/${product.slug}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white text-black min-h-screen p-4 md:p-8" }, _attrs))} data-v-d0c9cf0d><div class="flex flex-col md:flex-row gap-6" data-v-d0c9cf0d><div class="md:w-1/5 flex-shrink-0" data-v-d0c9cf0d><button class="md:hidden mb-4 bg-black text-white px-5 py-2 rounded-full shadow hover:bg-gray-800 transition w-full sm:w-auto" data-v-d0c9cf0d> Filters </button>`);
      if (isFilterOpen.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" data-v-d0c9cf0d></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<aside class="${ssrRenderClass([
        "fixed top-0 left-0 h-full w-10/12 sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto md:relative md:h-auto md:w-full md:translate-x-0 md:shadow-none",
        isFilterOpen.value ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      ])}" data-v-d0c9cf0d><div class="p-4 sm:p-6 flex flex-col h-full" data-v-d0c9cf0d><button class="md:hidden self-end text-gray-600 text-xl font-bold hover:text-gray-800 transition mb-4" data-v-d0c9cf0d> ✕ </button>`);
      _push(ssrRenderComponent(FilterSidebar, {
        categories: categories.value,
        selectedCategories: selectedCategories.value,
        priceRange: priceRange.value,
        onApplyPrice: applyPriceFilter,
        onClear: clearFilters
      }, null, _parent));
      _push(`</div></aside></div><div class="flex-1" data-v-d0c9cf0d><div class="flex flex-wrap gap-2 mb-4 overflow-x-auto" data-v-d0c9cf0d><!--[-->`);
      ssrRenderList(availableTags.value, (tag) => {
        _push(`<button class="${ssrRenderClass([
          "px-3 py-1 rounded-full border text-sm whitespace-nowrap flex-shrink-0 transform transition-all duration-300",
          selectedTags.value.includes(tag) ? "bg-black text-white border-black scale-105 shadow-md" : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 hover:scale-105"
        ])}" data-v-d0c9cf0d>${ssrInterpolate(tag)}</button>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(sortOptions, (option) => {
        _push(`<button class="${ssrRenderClass([
          "px-3 py-1 rounded-full border text-sm whitespace-nowrap flex-shrink-0 transform transition-all duration-300",
          selectedSort.value.value === option.value ? "bg-black text-white border-black scale-105 shadow-md" : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 hover:scale-105"
        ])}" data-v-d0c9cf0d>${ssrInterpolate(option.label)}</button>`);
      });
      _push(`<!--]--></div><div${ssrRenderAttrs({
        name: "fade-slide",
        class: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      })} data-v-d0c9cf0d>`);
      ssrRenderList(filteredProducts.value, (product) => {
        _push(ssrRenderComponent(ProductCard, {
          key: product.id,
          title: product.name,
          image: product.image,
          hoverImage: product.hoverImage,
          tags: product.tags,
          price: product.price,
          mrp: product.mrp,
          showCartBtn: true,
          slug: product.slug,
          parent: product.parent,
          onClick: ($event) => goToProduct(product)
        }, null, _parent));
      });
      _push(`</div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/collection/collectionPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CollectionPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d0c9cf0d"]]);

export { CollectionPage as C };
//# sourceMappingURL=collectionPage-BDXYyG7u.mjs.map
