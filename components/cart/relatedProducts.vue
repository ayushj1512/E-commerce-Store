<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-black px-4">You Might Also Like</h2>

    <!-- Horizontal scrollable products -->
    <div class="flex space-x-4 overflow-x-auto px-4 py-2 scrollbar-hide">
      <ProductCard
        v-for="(prod, idx) in products"
        :key="idx"
        v-bind="prod"
        class="flex-shrink-0 w-64 sm:w-56 md:w-48 lg:w-56"
      />
    </div>
  </div>
</template>

<script setup>
import ProductCard from '@/components/common/ProductCard.vue'

const products = [
  {
    name: 'Graphic Sweatshirt',
    price: 1500,
    mrp: 1800,
    image: 'https://i.pinimg.com/1200x/92/5b/56/925b565bd5756c511e9b40bf0133725a.jpg',
    hoverImage: null,
    tags: ['New'],
    slug: 'graphic-sweatshirt',
    parent: 'sweatshirts'
  },
  {
    name: 'Casual Hoodie',
    price: 1300,
    mrp: 1600,
    image: 'https://i.pinimg.com/736x/1d/46/0f/1d460fe2ae9c716373b205a3c6799500.jpg',
    hoverImage: null,
    tags: ['Popular'],
    slug: 'casual-hoodie',
    parent: 'hoodies'
  },
  {
    name: 'Letter Print Sweatshirt',
    price: 1700,
    mrp: 2000,
    image: 'https://kittenalarm.com/cdn/shop/products/Letter-Graphic-Drop-Shoulder-Sweatshirt-977_b7428ee5-04fc-4aac-abb1-640db011d5cf.jpg?v=1700297151&width=823',
    hoverImage: null,
    tags: ['Trending'],
    slug: 'letter-print-sweatshirt',
    parent: 'sweatshirts'
  },
  {
    name: 'Checked Shirt',
    price: 1100,
    mrp: 1400,
    image: 'https://i.pinimg.com/1200x/a9/48/44/a9484468215d4b58e0bf831157d73c34.jpg',
    hoverImage: null,
    tags: ['Hot'],
    slug: 'checked-shirt',
    parent: 'shirts'
  }
]
</script>

<style scoped>
/* Hide default scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
