<template>
  <section class="pt-2 bg-white">
    <!-- Section Header -->
    <div class=" py-4">
      <Headline />
    </div>

    <!-- Loading State -->
    <div v-if="productStore.trendingLoading" class="text-center py-10 text-gray-600">
      Loading trending products...
    </div>

    <!-- Empty State -->
    <div v-else-if="!productStore.trendingProducts.length" class="text-center text-gray-500 py-10">
      No trending products available right now.
    </div>

    <!-- Products Scroll -->
    <div v-else class="overflow-x-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-4 scrollbar-hide">
      <div class="flex space-x-3 sm:space-x-4 md:space-x-5 lg:space-x-6 snap-x snap-mandatory touch-pan-x">
        <ProductCard v-for="product in productStore.trendingProducts" :key="product.id" :id="product.id"
          :title="product.name" :image="product.img" :hoverImage="product.hover_img || null"
          :price="product.displayPrice" :mrp="product.mrp" :productUrl="product.product_url" :showCartBtn="true"
          class="flex-shrink-0 w-36 sm:w-44 md:w-52 lg:w-60 xl:w-64 snap-start transition-transform hover:-translate-y-1 hover:scale-[1.03]"
          @click="goToDetail(product.product_url)" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import ProductCard from "@/components/common/ProductCard.vue";
import { useProductStore } from "@/stores/productStore";
import Headline from "./Headline.vue";
const router = useRouter();
const productStore = useProductStore();

// Navigate to product detail page
const goToDetail = (url) => {
  if (!url) return;
  if (url.startsWith("/")) router.push(url).catch(() => {});
  else window.location.href = url;
};

// Fetch trending products once
onMounted(async () => {
  if (!productStore.trendingProducts.length) {
    await productStore.fetchTrendingProducts();
    console.log("Trending Products:", productStore.trendingProducts);
  }
});
</script>

<style scoped>
/* Hide scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Smooth scroll */
.overflow-x-auto {
  scroll-behavior: smooth;
}

/* Tighter gap for smaller screens */
@media (max-width: 640px) {
  .flex {
    gap: 0.5rem;
  }
}
</style>
