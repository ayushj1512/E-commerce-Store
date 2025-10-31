<template>
  <div v-if="recentProducts.length > 0" class="space-y-4 sm:space-y-6 ">
    <!-- Heading -->
   <div class="w-full bg-black py-3 mb-3 sm:mb-4">
      <h2 class="text-white text-center text-base sm:text-lg md:text-xl font-bold">
        YOUR RECENT PICKS AWAIT'S YOU
      </h2>
    </div>

    <!-- Loading Shimmer -->
    <div v-if="loading" class="flex gap-3 sm:gap-4 overflow-x-auto px-1 hide-scrollbar py-2">
      <div v-for="n in 5" :key="n"
        class="flex-shrink-0 w-36 sm:w-44 md:w-48 bg-gray-200 rounded-xl p-2 sm:p-3 animate-pulse">
        <div class="w-full h-36 sm:h-40 md:h-44 bg-gray-300 rounded-lg mb-2 sm:mb-3"></div>
        <div class="h-3 sm:h-4 bg-gray-300 rounded mb-1 sm:mb-2"></div>
        <div class="h-3 sm:h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Products Row -->
    <div v-else class="flex gap-3 sm:gap-4 overflow-x-auto px-1 hide-scrollbar py-2">
      <div v-for="(p, index) in displayedProducts" :key="index"
        class="flex-shrink-0 w-36 sm:w-44 md:w-48 bg-white shadow-md rounded-xl p-2 sm:p-3 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 transform relative"
        @click="p.viewAll ? goToViewAll() : goToProduct(p)">
        <div
          class="w-full h-36 sm:h-40 md:h-44 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
          <img v-if="!p.viewAll" :src="p.images[0]?.bigImg || p.images[0]?.img || '/fallback.jpg'" alt="Product"
            class="w-full h-full object-contain transition-transform duration-300" loading="lazy" />
          <div v-else
            class="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg font-semibold text-gray-700 text-center text-sm sm:text-base md:text-lg">
            View All
          </div>
        </div>
        <p v-if="!p.viewAll" class="text-xs sm:text-sm md:text-base font-medium mt-2 sm:mt-3 truncate text-center">
          {{ p.name }}
        </p>
        <p v-if="!p.viewAll" class="text-xs sm:text-sm md:text-base font-semibold mt-1 text-center">
          ₹{{ p.selling_price }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRecentlyViewStore } from "@/stores/recentlyViewStore";

const recentlyViewStore = useRecentlyViewStore();
recentlyViewStore.loadRecentlyViewed();

const recentProducts = ref([]);
const loading = ref(true);

// Fetch products from store
const fetchRecentProducts = async () => {
  loading.value = true;
  try {
    await recentlyViewStore.fetchProducts(); // fetch from store (SSR compatible)
    recentProducts.value = recentlyViewStore.products || [];
  } catch (err) {
    recentProducts.value = [];
    console.error("Error fetching recently viewed products:", err);
  } finally {
    loading.value = false;
  }
};

// Display products + last "View All" card if 8 or more products
const displayedProducts = computed(() => {
  if (recentProducts.value.length >= 8) {
    return [...recentProducts.value, { viewAll: true }];
  }
  return [...recentProducts.value];
});

// Navigate to individual product using productUrl
const goToProduct = (product) => {
  if (product.productUrl) {
    window.location.href = product.productUrl;
  }
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

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Shimmer animation */
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>
