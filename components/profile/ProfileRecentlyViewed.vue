<template>
  <section class="space-y-6">
    <!-- Header with Show All button -->
    <div class="flex justify-between items-center pt-4 ">
      <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-black">
        Your Recently Viewed
      </h2>
      <router-link
        to="/profile/recently-viewed"
        class="bg-black text-white px-4 py-2 rounded-lg shadow-md transition hover:bg-gray-900"
      >
        Show All
      </router-link>
    </div>

    <!-- Loading Shimmer -->
    <div v-if="loading" class="flex gap-4 overflow-x-auto px-1 hide-scrollbar py-2">
      <div
        v-for="n in 5"
        :key="n"
        class="flex-shrink-0 w-44 sm:w-48 md:w-52 bg-gray-200 rounded-xl p-3 animate-pulse"
      >
        <div class="w-full h-36 sm:h-44 md:h-48 bg-gray-300 rounded-lg mb-3"></div>
        <div class="h-4 bg-gray-300 rounded mb-2"></div>
        <div class="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Recently Viewed Products Row -->
    <div v-else-if="recentProducts.length > 0" class="flex gap-3 overflow-x-auto px-1 hide-scrollbar ">
      <div
        v-for="(p, index) in recentProducts"
        :key="index"
        class="flex-shrink-0 w-44 sm:w-48 md:w-52 bg-white shadow-md rounded-xl p-3 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 transform relative"
        @click="goToProduct(p)"
      >
        <div class="w-full h-36 sm:h-44 md:h-48 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
          <img
            :src="p.images[0]?.bigImg || p.images[0]?.img || ''"
            alt="Product"
            class="w-full h-full object-contain transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <p class="text-sm md:text-base font-medium mt-2 truncate text-center">
          {{ p.name }}
        </p>
        <p class="text-sm md:text-base font-semibold mt-1 text-center">
          ₹{{ p.selling_price }}
        </p>
      </div>
    </div>

    <!-- No Recently Viewed -->
    <div v-else class="text-center py-6">
      <p class="text-gray-600 text-sm sm:text-base">You have no recently viewed products.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRecentlyViewStore } from "@/stores/recentlyViewStore";

const recentlyViewStore = useRecentlyViewStore();
recentlyViewStore.loadRecentlyViewed();

const recentProducts = ref([]);
const loading = ref(true);

// Fetch recently viewed products from store
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

// Navigate to individual product
const goToProduct = (product) => {
  const slug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  window.location.href = `/parent/child/${slug}/${product.id}`;
};

// Watch for changes in recently viewed products
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
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>
