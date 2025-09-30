<template>
  <div v-if="recentProducts.length > 0" class="space-y-6">
    <!-- Heading -->
    <div class="w-full bg-black py-4 rounded-lg shadow-md">
      <h2 class="text-white text-center text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
        YOUR RECENT PICK AWAITS
      </h2>
    </div>

    <!-- Loading Shimmer -->
    <div v-if="loading" class="flex gap-5 overflow-x-auto px-1 hide-scrollbar py-2">
      <div
        v-for="n in 5"
        :key="n"
        class="flex-shrink-0 w-48 md:w-52 bg-gray-200 rounded-xl p-3 animate-pulse"
      >
        <div class="w-full h-44 md:h-48 bg-gray-300 rounded-lg mb-3"></div>
        <div class="h-4 bg-gray-300 rounded mb-2"></div>
        <div class="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Products Row -->
    <div v-else class="flex gap-5 overflow-x-auto px-1 hide-scrollbar py-2">
      <div
        v-for="(p, index) in displayedProducts"
        :key="index"
        class="flex-shrink-0 w-48 md:w-52 bg-white shadow-md rounded-xl p-3 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 transform relative"
        @click="p.viewAll ? goToViewAll() : goToProduct(p)"
      >
        <div class="w-full h-44 md:h-48 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
          <img
            v-if="!p.viewAll"
            :src="p.images[0]?.bigImg || p.images[0]?.img || ''"
            alt="Product"
            class="w-full h-full object-contain transition-transform duration-300"
            loading="lazy"
          />
          <div
            v-else
            class="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg font-semibold text-gray-700 text-center text-base md:text-lg"
          >
            View All
          </div>
        </div>
        <p v-if="!p.viewAll" class="text-sm md:text-base font-medium mt-3 truncate text-center">
          {{ p.name }}
        </p>
        <p v-if="!p.viewAll" class="text-sm md:text-base font-semibold mt-1 text-center">
          ₹{{ p.selling_price }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRecentlyViewStore } from "@/stores/recentlyViewStore";

const recentlyViewStore = useRecentlyViewStore();
recentlyViewStore.loadRecentlyViewed();

const recentProducts = ref([]);
const loading = ref(true);

// Fetch products from store
const fetchRecentProducts = async () => {
  loading.value = true;
  try {
    const products = await recentlyViewStore.getProducts();
    recentProducts.value = products || [];
  } catch (err) {
    recentProducts.value = [];
    console.error("Error fetching recently viewed products:", err);
  } finally {
    loading.value = false;
  }
};

// Display products + last "View All" card
const displayedProducts = computed(() =>
  recentProducts.value.length > 0 ? [...recentProducts.value, { viewAll: true }] : []
);

// Navigate to individual product
const goToProduct = (product) => {
  const slug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  window.location.href = `/parent/child/${slug}/${product.id}`;
};

// Navigate to view all page
const goToViewAll = () => {
  window.location.href = "/profile/recently-viewed";
};

// Watch for changes in recently viewed IDs
watch(() => recentlyViewStore.recentlyViewed, fetchRecentProducts, { deep: true });

// Fetch on mount
onMounted(fetchRecentProducts);
</script>

<style>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Shimmer animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>
