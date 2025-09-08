<template>
  <div class="bg-white text-black min-h-screen p-4 md:p-8">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Sidebar -->
      <div class="md:w-1/5 flex-shrink-0">
        <button 
          @click="isFilterOpen = true" 
          class="md:hidden mb-4 bg-black text-white px-5 py-2 rounded-full w-full"
        >
          Filters
        </button>
        <div 
          v-if="isFilterOpen" 
          class="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" 
          @click="isFilterOpen = false"
        ></div>
        <aside 
          :class="[isFilterOpen ? 'translate-x-0' : '-translate-x-full', 'fixed top-0 left-0 h-full w-10/12 sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto md:relative md:h-auto md:w-full md:translate-x-0 md:shadow-none']"
        >
          <div class="p-4 sm:p-6 flex flex-col h-full">
            <button 
              class="md:hidden self-end text-gray-600 text-xl font-bold hover:text-gray-800 mb-4" 
              @click="isFilterOpen = false"
            >
              ✕
            </button>
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
          <!-- Sorting only -->
          <div class="flex flex-wrap gap-2 mb-4 overflow-x-auto">
            <button 
              v-for="option in sortOptions" 
              :key="option.value" 
              @click="applySort(option)" 
              :class="[selectedSort === option.value ? 'bg-black text-white scale-105 shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200','px-3 py-1 rounded-full border text-sm whitespace-nowrap']"
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
              :key="product.id || index"
              :title="product.displayName"
              :image="product.imageUrl"
              :hoverImage="product.hoverImageUrl || null"
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
import { useRoute, useRouter } from "#app";
import { useProductStore } from "@/stores/productStore.js";
import FilterSidebar from "@/components/collection/FilterSidebar.vue";
import ProductCard from "@/components/common/ProductCard.vue"; // <-- new product card

const store = useProductStore();
const route = useRoute();
const router = useRouter();

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
const slugify = (text) => text.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Filtered products
const filteredProducts = computed(() => {
  let prods = [...store.products];

  prods = prods.map(p => {
    let parsedData = {};
    try {
      parsedData = p.product_data ? JSON.parse(p.product_data) : {};
    } catch (e) {
      console.warn("Failed to parse product_data for", p.id);
    }

    const firstData = parsedData["0"] || {};
    const imageUrl = parsedData.images?.[0]?.img || "";
    const hoverImageUrl = parsedData.images?.[1]?.img || null;

    const categoriesFromData = firstData.categories
      ? firstData.categories.split("^")
      : p.categories?.map(c => c.toString()) || [];

    return {
      ...p,
      displayName: p.name || firstData.name || "",
      displayPrice: (p.real_selling_price ?? p.selling_price ?? parseFloat(firstData.selling_price)) || 0,
      displayDiscount: (p.discount_price ?? parseFloat(firstData.discount_price)) || 0,
      displayCategories: categoriesFromData,
      imageUrl,
      hoverImageUrl,
      categorySlug: slugify(categoriesFromData[0] || "general"),
      productSlug: slugify(p.name || firstData.name || "item")
    };
  });

  // Filter by selected categories
  if (selectedCategories.value.length) {
    prods = prods.filter(p =>
      p.displayCategories.some(cat => selectedCategories.value.includes(cat))
    );
  }

  // Filter by price
  if (priceRange.value.min !== null) prods = prods.filter(p => p.displayPrice >= priceRange.value.min);
  if (priceRange.value.max !== null) prods = prods.filter(p => p.displayPrice <= priceRange.value.max);

  // Sorting
  switch (selectedSort.value) {
    case "lowtohigh": prods.sort((a, b) => a.displayPrice - b.displayPrice); break;
    case "hightolow": prods.sort((a, b) => b.displayPrice - a.displayPrice); break;
    case "latest": prods.sort((a, b) => new Date(b.date_added) - new Date(a.date_added)); break;
    case "rating": prods.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0)); break;
    case "trending": prods.sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0)); break;
  }

  return prods;
});

// Apply sorting
const applySort = (option) => selectedSort.value = option.value;

// Price filter & clear filters
const applyPriceFilter = () => {};
const clearFilters = () => {
  selectedCategories.value = [];
  priceRange.value = { min: null, max: null };
  selectedSort.value = "default";
};

// Fetch products from route
const fetchProductsFromRoute = async () => {
  const subCategoryParam = route.params.child || "";
  const match = subCategoryParam.match(/(\d+)$/);
  const categoryIdFromRoute = match ? match[1] : route.params.parent;

  await store.fetchProducts({
    categoryId: categoryIdFromRoute,
    page: 1,
    perPage: 16
  });
};

onMounted(fetchProductsFromRoute);
watch(() => [route.params.parent, route.params.child], fetchProductsFromRoute);
</script>

<style>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
