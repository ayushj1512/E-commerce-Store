<template>
  <div class="w-full">
    <!-- Optional section heading -->
    <h2 v-if="title" class="text-lg sm:text-xl font-semibold mb-4 px-1">
      {{ title }}
    </h2>

    <!-- Horizontal scroll container -->
    <div class="flex gap-4 overflow-x-auto no-scrollbar pb-2">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :id="product.id"
        :title="product.title"
        :image="product.image"
        :hoverImage="product.hoverImage"
        :tags="product.tags"
        :price="product.price"
        :mrp="product.mrp"
        :showCartBtn="showCartBtn"
        :productUrl="product.productUrl"
        :sizes="product.sizes"
        class="flex-shrink-0 w-56 sm:w-64"
      />
    </div>
  </div>
</template>

<script setup>
import ProductCard from "@/components/ProductCard.vue"

const props = defineProps({
  title: { type: String, default: "" }, // Section title
  products: { type: Array, required: true }, // Array of products
  showCartBtn: { type: Boolean, default: true }, // Pass down to cards
})
</script>

<style scoped>
/* Hide scrollbar but allow scrolling */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
