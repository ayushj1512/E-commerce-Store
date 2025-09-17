<template>
  <div class="bg-white text-black min-h-screen p-4 md:p-8">
    <!-- Top bar: Filters + Sorting Tags -->
    <div class="flex flex-wrap gap-2 mb-4 items-center">
      <!-- Filters Drawer (left side) -->
      <FilterDrawer />

      <!-- Sorting tags (next to filters) -->
      <div class="flex flex-wrap gap-2 overflow-x-auto flex-1">
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
    </div>

    <!-- Products Grid -->
    <transition-group 
      name="fade-slide" 
      tag="div"
      :class="[ 
        'grid gap-6',
        'grid-cols-2 sm:grid-cols-2',   // mobile always 2
        'md:grid-cols-5 lg:grid-cols-5' // desktop always 5
      ]"
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "#app";
import { useProductStore } from "@/stores/productStore.js";
import ProductCard from "@/components/common/ProductCard.vue";
import FilterDrawer from "@/components/collection/FilterDrawer.vue"; // 👈 import drawer

const store = useProductStore();
const route = useRoute();

// Sorting
const selectedSort = ref("default");
const sortOptions = [
  { label: "Price: Low to High", value: "lowtohigh" },
  { label: "Price: High to Low", value: "hightolow" },
  { label: "Newest", value: "latest" },
  { label: "Trending", value: "trending" },
  { label: "Rating", value: "rating" },
];

// Helper
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
