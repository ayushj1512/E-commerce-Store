<template>
  <section class="pt-2 bg-white">
    <h2 class="text-xl md:text-2xl font-bold px-3 sm:px-4 md:px-6 lg:px-8 mb-3">
      🔥 Trending Products
    </h2>

    <!-- Loading State -->
    <div v-if="productStore.trendingLoading" class="text-center py-10">
      Loading trending products...
    </div>

    <!-- Empty State -->
    <div v-else-if="!productStore.trendingProducts.length" class="text-center text-gray-500 py-10">
      No trending products available right now.
    </div>

    <!-- Products Horizontal Scroll -->
    <div v-else class="overflow-x-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-3 scrollbar-hide">
      <div class="flex space-x-3 sm:space-x-4 md:space-x-5 lg:space-x-6 snap-x snap-mandatory touch-pan-x">
        <ProductCard
          v-for="product in productStore.trendingProducts"
          :key="product.id"
          :id="product.id"
          :title="product.name"
          :image="product.img"
          :hoverImage="null"
          :price="product.price"
          :mrp="product.mrp"
          :productUrl="product.product_url"
          :showCartBtn="true"
          class="flex-shrink-0 w-36 sm:w-44 md:w-52 lg:w-60 xl:w-64 snap-start"
          @click="goToDetail(product.product_url)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import ProductCard from "@/components/common/ProductCard.vue";
import { useProductStore } from "@/stores/productStore";

const router = useRouter();
const productStore = useProductStore();

// Navigate to product detail
const goToDetail = (url) => {
  if (!url) return;
  if (url.startsWith("/")) router.push(url).catch(() => {});
  else window.location.href = url;
};

// Fetch trending products if not already fetched
onMounted(async () => {
  if (!productStore.trendingProducts.length) {
    await productStore.fetchTrendingProducts();
  }
});
</script>

<style scoped>
/* Hide horizontal scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Smooth horizontal scroll */
.overflow-x-auto {
  scroll-behavior: smooth;
}
</style>
