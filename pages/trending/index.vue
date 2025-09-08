<template>
  <div class="bg-white text-black min-h-screen p-4 md:p-10 font-sans">
    <!-- Shimmer Loader -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="n in 8" :key="n" class="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="trendingProducts.length === 0" class="flex justify-center items-center py-20 text-gray-500">
      No trending products found.
    </div>

    <!-- Product Grid -->
    <div v-else class="px-2 mt-2 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-2 xl:gap-2">
      <ProductCard
        v-for="(product, index) in trendingProducts"
        :key="index"
        :title="product.displayName"
        :image="product.parsedData.images?.[0]?.img || product.image"
        :hoverImage="product.parsedData.images?.[1]?.img || null"
        :price="product.displayPrice"
        :mrp="product.displayDiscount"
        :showCartBtn="true"
        :productUrl="product.productUrl || `/category/${product.slug}/${product.id}`"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useProductStore } from "@/stores/productStore";
import ProductCard from "@/components/common/ProductCard.vue";

// Initialize product store
const productStore = useProductStore();
const loading = computed(() => productStore.loading);

// Fetch trending products on mount
onMounted(async () => {
  await productStore.fetchProducts({ categoryId: 93, page: 1, perPage: 30 });
});

// Filter products for trending category
const trendingProducts = computed(() => {
  return productStore.products.filter(
    (p) =>
      p.displayCategories?.includes("93") ||
      p.displayCategories?.includes(93) ||
      p.categories?.includes(93)
  );
});

// Compute category name from the first product
const categoryName = computed(() => {
  if (trendingProducts.value.length === 0) return "Trending";
  const firstProduct = trendingProducts.value[0];
  return firstProduct.displayCategories?.[0] || "Trending";
});
</script>

<style scoped>
/* Shimmer animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse {
  animation: pulse 1.5s infinite;
}
</style>
