<template>
  <div class="bg-gray-50 min-h-screen py-6 px-4 md:px-12 lg:px-20">
    <div class="mx-auto space-y-6">
      <!-- Header with Quote -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h1 class="text-2xl md:text-3xl font-bold text-black">My Wishlist</h1>
        <p class="text-gray-600 italic text-sm md:text-base text-center md:text-left">"{{ randomQuote }}"</p>
      </div>

      <!-- Quick Filters -->
      <div class="bg-white p-4 flex flex-wrap gap-3 justify-start rounded-xl shadow-sm">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="selectedCategory === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'"
          class="px-4 py-1 rounded-full text-sm md:text-base font-semibold hover:bg-black hover:text-white transition-colors duration-300"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Products Grid with Animation -->
      <transition-group
        name="fade-scale"
        tag="div"
        class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :title="product.title"
          :image="product.image"
          :hoverImage="product.hoverImage"
          :tags="product.tags"
          :price="product.price"
          :mrp="product.mrp"
          :showCartBtn="true"
        />
      </transition-group>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="text-center text-gray-500 py-10">
        No products found in this category.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ProductCard from "~/components/common/ProductCard.vue";

const images = [
  "https://i.pinimg.com/1200x/a9/48/44/a9484468215d4b58e0bf831157d73c34.jpg",
  "https://i.pinimg.com/736x/fc/84/43/fc8443ac393cd90b56c6c89ee3087a84.jpg",
  "https://i.pinimg.com/1200x/08/a8/a7/08a8a74d3ab1d980c95a4295674e5850.jpg",
  "https://i.pinimg.com/736x/80/69/d3/8069d3fb5c7ac4322dfa48bfac8bf9ce.jpg",
  "https://i.pinimg.com/1200x/c5/22/96/c522961ccb0c8b7bc8df0f348b3c6b29.jpg",
  "https://i.pinimg.com/736x/f0/97/28/f09728e53d1bd74930f647b72a8fc1b2.jpg"
];

const categories = ["All", "Jackets", "Dresses", "Footwear", "Jeans"];
const selectedCategory = ref("All");

const products = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Product ${i + 1}`,
    image: images[i % images.length],
    hoverImage: images[(i + 1) % images.length],
    tags: ["New", "Trending"],
    price: Math.floor(Math.random() * 5000 + 1000),
    mrp: Math.floor(Math.random() * 6000 + 1500),
    category: categories[i % categories.length]
  }))
);

const quotes = [
  "Fashion is the armor to survive the reality of everyday life.",
  "Style is a way to say who you are without having to speak.",
  "In order to be irreplaceable, one must always be different.",
  "Fashion is about dreaming and making other people dream.",
  "Elegance is not standing out, but being remembered.",
];
const randomQuote = computed(() => quotes[Math.floor(Math.random() * quotes.length)]);

const filteredProducts = computed(() => {
  if (selectedCategory.value === "All") return products.value;
  return products.value.filter(p => p.category === selectedCategory.value);
});
</script>

<style scoped>
/* Fade + Scale Animation */
.fade-scale-enter-active, .fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.fade-scale-enter-to, .fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
