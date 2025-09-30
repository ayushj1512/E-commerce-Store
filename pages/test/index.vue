<template>
  <div>
    <!-- Sort By Dropdown -->
    <div class="mb-4 flex justify-end px-5 py-6">
      <label class="mr-2 font-medium text-gray-700">Sort by:</label>
      <select v-model="sortBy" class="border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-black">
        <option value="default">Default</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="ratingDesc">Rating: High to Low</option>
      </select>
    </div>

    <!-- Product Grid with Transition -->
    <transition-group
      name="fade-scale"
      tag="div"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <ProductCard
        v-for="product in sortedProducts"
        :key="product.id"
        :id="product.id"
        :title="product.title"
        :image="product.image"
        :price="product.price"
        :mrp="product.mrp"
        :tags="product.tags"
        :sizes="product.sizes"
        :avgRating="Number(product.avgRating)"
        :productUrl="product.productUrl"
      />
    </transition-group>

    <!-- Pagination Controls -->
    <div class="mt-4 flex justify-center">
      <button
        @click="currentPage = Math.max(currentPage - 1, 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-300 rounded-l disabled:opacity-50"
      >
        Prev
      </button>
      <span class="px-4 py-2 bg-gray-100">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        @click="currentPage = Math.min(currentPage + 1, totalPages)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-300 rounded-r disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProductCard from '@/components/common/ProductCard.vue'; // Adjust the path as necessary

const products = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Product ${i + 1}`,
  image: i % 3 === 0
    ? 'https://i.pinimg.com/736x/67/9e/b7/679eb7580d6c6df14f3c6319719897ab.jpg'
    : i % 3 === 1
      ? 'https://i.pinimg.com/736x/17/ff/9b/17ff9bc6971f2c74c1c176a94e8811b3.jpg'
      : 'https://i.pinimg.com/736x/bd/d4/21/bdd42190568e47444a35baf5c3ea7670.jpg',
  price: (i + 1) * 100,
  mrp: (i + 1) * 120,
  tags: ['New', 'Sale'],
  sizes: ['S', 'M', 'L'],
  avgRating: Number((Math.random() * 5).toFixed(1)),
  productUrl: `/product/${i + 1}`,
}));

const itemsPerPage = 8;
const currentPage = ref(1);
const sortBy = ref('default');

// Pagination
const totalPages = computed(() => Math.ceil(products.length / itemsPerPage));
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return products.slice(start, end);
});

// Sorting
const sortedProducts = computed(() => {
  let sorted = [...paginatedProducts.value];
  if (sortBy.value === 'priceAsc') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'priceDesc') {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sortBy.value === 'ratingDesc') {
    sorted.sort((a, b) => b.avgRating - a.avgRating);
  }
  return sorted;
});
</script>

<style scoped>
/* Transition-group animations */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
