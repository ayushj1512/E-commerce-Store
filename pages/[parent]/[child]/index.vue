<template>
  <div class="bg-white text-black min-h-screen p-4 md:p-8">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Sidebar -->
      <div class="md:w-1/5 flex-shrink-0">
        <!-- Mobile toggle button -->
        <button 
          @click="isFilterOpen = true" 
          class="md:hidden mb-4 bg-black text-white px-5 py-2 rounded-full w-full"
        >
          Filters
        </button>

        <!-- Mobile overlay -->
        <div 
          v-if="isFilterOpen" 
          class="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          @click="isFilterOpen = false"
        ></div>

        <!-- Sidebar -->
        <aside 
          :class="[
            isFilterOpen ? 'translate-x-0' : '-translate-x-full',
            'fixed top-0 left-0 h-full w-10/12 sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto',
            'md:relative md:translate-x-0 md:shadow-none md:w-full md:h-auto md:transform-none'
          ]"
        >
          <div class="p-4 sm:p-6 flex flex-col h-full md:h-auto">
            <!-- Close button for mobile -->
            <button 
              class="md:hidden self-end text-gray-600 text-xl font-bold hover:text-gray-800 mb-4"
              @click="isFilterOpen = false"
            >
              ✕
            </button>

            <!-- Filter Sidebar Component -->
            <FilterSidebar 
              :categories="categories" 
              :selectedCategories="selectedCategories" 
              :priceRange="priceRange"
              @applyPrice="applyPriceFilter" 
              @clear="clearFilters" 
            />
          </div>
        </aside>
      </div>

      <!-- Products Grid -->
      <div class="flex-1">
        <div v-if="store.loading" class="text-center py-10">Loading products...</div>
        <div v-else-if="store.error" class="text-center py-10 text-red-600">{{ store.error }}</div>
        <div v-else>
          <!-- Sorting -->
          <div class="flex flex-wrap gap-2 mb-4 overflow-x-auto">
            <button 
              v-for="option in sortOptions" 
              :key="option.value" 
              @click="applySort(option)"
              :class="[
                selectedSort === option.value 
                  ? 'bg-black text-white scale-105 shadow-md' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200', 
                'px-3 py-1 rounded-full border text-sm whitespace-nowrap'
              ]"
            >
              {{ option.label }}
            </button>
          </div>

          <!-- Products Grid -->
          <transition-group 
            name="fade-slide" 
            tag="div"
            class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <ProductCard 
              v-for="(product, index) in filteredProducts" 
              :key="product.id || `product-${index}`"
              :id="product.id || `product-${index}`" 
              :title="product.displayName" 
              :image="product.imageUrl"
              :hoverImage="product.hoverImageUrl" 
              :price="product.displayPrice" 
              :mrp="product.displayDiscount"
              :showCartBtn="true"
              :productUrl="`/${route.params.parent || 'products'}/${product.categorySlug}/${product.productSlug}/${product.id}`" 
            />
          </transition-group>

          <div v-if="!filteredProducts.length" class="text-center py-10 text-gray-500">
            No products found.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "#app";
import { useProductStore } from "@/stores/productStore.js";
import FilterSidebar from "@/components/collection/FilterSidebar.vue";
import ProductCard from "@/components/common/ProductCard.vue";

const store = useProductStore();
const route = useRoute();

// UI State
const isFilterOpen = ref(false);
const selectedCategories = ref([]);
const priceRange = ref({ min: null, max: null });
const selectedSort = ref("default");

// Sorting options
const sortOptions = [
  { label: "Price: Low to High", value: "lowtohigh" },
  { label: "Price: High to Low", value: "hightolow" },
  { label: "Newest", value: "latest" },
  { label: "Trending", value: "trending" },
  { label: "Rating", value: "rating" },
];

// Categories (dynamic)
const categories = ref([]);

// Slugify Helper
const slugify = (text) =>
  text?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

// --- Products for current route/category ---
const categoryIdFromRoute = computed(() => {
  const subCategoryParam = route.params.child || "";
  const match = subCategoryParam.match(/(\d+)$/);
  return match ? match[1] : route.params.parent;
});

const productsForCategory = computed(() =>
  store.getProductsByCategory(categoryIdFromRoute.value)
);

// Filtered products
const filteredProducts = computed(() => {
  return productsForCategory.value
    .map((p, index) => {
      const parsedData = p.rawData?.product_data ? JSON.parse(p.rawData.product_data) : {};
      const firstData = parsedData["0"] || {};

      const images = parsedData.images || [];
      const imageUrl = images[0]?.img || p.images[0]?.img || "";
      const hoverImageUrl = images[1]?.img || images[0]?.img || null;

      const categoriesFromData = firstData.categories
        ? firstData.categories.split("^").map((c) => c.split("*")[0])
        : p.displayCategories || [];

      const allSizes =
        (parsedData.shoeSize || []).map((s) => s.Size).filter(Boolean) ||
        (p.product_all_sizes || []).filter(Boolean) ||
        ["N/A"];

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
        product_all_sizes: allSizes,
      };
    })
    .filter((p) =>
      selectedCategories.value.length
        ? p.displayCategories.some((cat) => selectedCategories.value.includes(cat))
        : true
    )
    .filter((p) =>
      (priceRange.value.min !== null ? p.displayPrice >= priceRange.value.min : true) &&
      (priceRange.value.max !== null ? p.displayPrice <= priceRange.value.max : true)
    )
    .sort((a, b) => {
      switch (selectedSort.value) {
        case "lowtohigh": return a.displayPrice - b.displayPrice;
        case "hightolow": return b.displayPrice - a.displayPrice;
        case "latest": return (new Date(b.rawData?.date_added)) - (new Date(a.rawData?.date_added));
        case "rating": return (b.rawData?.avg_rating ?? 0) - (a.rawData?.avg_rating ?? 0);
        case "trending": return (b.rawData?.sales ?? 0) - (a.rawData?.sales ?? 0);
        default: return 0;
      }
    });
});

const applySort = (option) => (selectedSort.value = option.value);

const applyPriceFilter = () => {};
const clearFilters = () => {
  selectedCategories.value = [];
  priceRange.value = { min: null, max: null };
  selectedSort.value = "default";
};

// --- Fetch products for route/category ---
const fetchProductsFromRoute = async () => {
  await store.fetchProducts({
    categoryId: categoryIdFromRoute.value,
    page: 1,
    perPage: 100,
  });
};

onMounted(fetchProductsFromRoute);
watch(() => [route.params.parent, route.params.child], fetchProductsFromRoute);
</script>

<style>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
