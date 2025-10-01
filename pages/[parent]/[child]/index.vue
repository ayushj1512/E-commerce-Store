<template>
  <div class="bg-white text-black min-h-screen p-4 md:p-8">
    <!-- Top bar: Filters Drawer + Sorting Tags + Results count -->
    <div class="flex flex-wrap gap-2 mb-4 items-center">
      <!-- Filters Drawer -->
      <div class="flex items-center">
        <button
          @click="toggleDrawer"
          class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Filters
        </button>
      </div>

      <!-- Sorting tags -->
      <div class="flex flex-wrap gap-2 overflow-x-auto flex-1 items-center">
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

        <span class="ml-auto text-gray-700 text-sm">
          Results found: {{ filteredProducts.length }}
        </span>
      </div>
    </div>

    <!-- Drawer Overlay -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/40 z-40"
        @click="closeDrawer"
      ></div>
    </transition>

    <transition name="slide-left">
      <FilterSidebar
        v-if="isOpen"
        :items="allProducts"
        v-model:selectedCategories="selectedCategories"
        v-model:selectedTags="selectedTags"
        v-model:selectedSizes="selectedSizes"
        @applyFilters="applyFilters"
        @close="closeDrawer"
        class="fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 overflow-y-auto"
      />
    </transition>

    <!-- AVAILABLE VOUCHER COMPONENT -->
    <AvailableVoucher :category-id="categoryIdFromRoute" class="mb-6" />

    <!-- Products Grid -->
    <transition-group
      name="fade-slide"
      tag="div"
      class="grid gap-6 mt-10 grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5"
    >
      <ProductCard
        v-for="(product, index) in filteredProducts"
        :key="product.id || `product-${index}`"
        :id="product.id || `product-${index}`"
        :title="product.displayName || 'Product'"
        :image="product.imageUrl || ''"
        :hoverImage="product.hoverImageUrl || ''"
        :price="product.displayPrice || 0"
        :mrp="(product.displayDiscount || 0) + (product.displayPrice || 0)"
        :showCartBtn="true"
        :avgRating="product.avgRating"
        :productUrl="`/${route.params.parent || 'products'}/${product.displayCategories?.[0] || 'category'}/${product.slug}/${product.id}`"
      />
    </transition-group>

    <div
      v-if="!filteredProducts.length"
      class="text-center py-10 text-gray-500"
    >
      No products found.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRoute } from "#app";
import { useProductStore } from "@/stores/productStore.js";
import ProductCard from "@/components/common/ProductCard.vue";
import AvailableVoucher from "@/components/collection/AvailableVoucher.vue";
import FilterSidebar from "@/components/collection/FilterSidebar.vue";

const store = useProductStore();
const route = useRoute();

// --- Drawer ---
const isOpen = ref(false);
const toggleDrawer = () => { isOpen.value = !isOpen.value; };
const closeDrawer = () => { isOpen.value = false; };

// --- Sorting ---
const selectedSort = ref("default");
const sortOptions = [
  { label: "Price: Low to High", value: "lowtohigh" },
  { label: "Price: High to Low", value: "hightolow" },
  { label: "Newest", value: "latest" },
  { label: "Trending", value: "trending" },
  { label: "Rating", value: "rating" },
];
const applySort = (option) => { selectedSort.value = option.value; };

// --- Category ID ---
const categoryIdFromRoute = computed(() => {
  const subCategoryParam = route.params.child || "";
  const match = subCategoryParam?.match(/(\d+)$/);
  return match ? match[1] : route.params.parent;
});

// --- Filters ---
const selectedCategories = ref([]);
const selectedTags = ref([]);
const selectedSizes = ref([]);

// --- Fetch Products ---
const allProducts = ref([]);
const fetchProducts = async () => {
  const catId = categoryIdFromRoute.value;
  if (!catId) return;

  try {
    await store.fetchProducts({ categoryId: catId, page: 1, perPage: 250 });
    allProducts.value = store.productLists[catId]?.products || [];
  } catch (err) {
    console.error("Error fetching products:", err);
  }
  await nextTick();
};

// --- Real-time filtering ---
const filteredProducts = computed(() => {
  return allProducts.value
    .map((p) => ({
      ...p,
      imageUrl: p.images?.[0]?.img || "",
      hoverImageUrl: p.images?.[1]?.img || p.images?.[0]?.img || "",
      slug: p.slug || `product-${p.id}`,
      displayCategories: p.displayCategories || ["category"],
      tags: Array.isArray(p.tags) ? p.tags : [],
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
      displayPrice: Number(p.displayPrice ?? p.price ?? 0),
      displayDiscount: Number(p.displayDiscount ?? 0),
      avgRating: Number(p.avgRating ?? p.rawData?.avg_rating ?? p.rawData?.rating?.avg ?? 0),
    }))
    .filter((p) => {
      if (selectedCategories.value.length && !p.displayCategories.some(c => selectedCategories.value.includes(c))) return false;
      if (selectedTags.value.length && !p.tags.some(t => selectedTags.value.includes(t))) return false;
      if (selectedSizes.value.length && !p.sizes.some(s => selectedSizes.value.includes(s))) return false;
      return true;
    })
    .sort((a, b) => {
      switch (selectedSort.value) {
        case "lowtohigh": return a.displayPrice - b.displayPrice;
        case "hightolow": return b.displayPrice - a.displayPrice;
        case "latest": return new Date(b.rawData?.date_added) - new Date(a.rawData?.date_added);
        case "rating": return (b.avgRating ?? 0) - (a.avgRating ?? 0);
        case "trending": return (b.rawData?.sales ?? 0) - (a.rawData?.sales ?? 0);
        default: return 0;
      }
    });
});

// --- Watchers ---
watch([() => route.params.parent, () => route.params.child], fetchProducts);

// --- Lifecycle ---
onMounted(fetchProducts);

// --- Apply Filters ---
const applyFilters = async () => {
  closeDrawer();
};
</script>
