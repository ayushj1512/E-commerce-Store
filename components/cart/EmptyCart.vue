<template>
  <div class="bg-gray-50 text-black min-h-screen p-6 sm:p-10">
    <!-- Empty Cart State -->
        <div class="flex flex-col items-center text-center py-16 space-y-6">
      <!-- Illustration -->
      <div class="w-40 sm:w-56 md:w-64 animate-bounce-slow">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          alt="Empty Cart"
          class="w-full h-auto"
        />
      </div>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-800">
        Your cart is empty 
      </h2>
      <p class="text-gray-600 max-w-md">
        Looks like you haven’t added anything yet. Browse our products and find your perfect pick!
      </p>
      <NuxtLink to="/"><button
        class="px-6 py-3 bg-black text-white rounded-full shadow-lg hover:scale-105 transform transition"
      >
        Continue Shopping
      </button></NuxtLink>
      
    </div>

    <!-- Product Suggestions -->
    <div v-for="(section, idx) in sections" :key="idx" class="mb-12">
      <!-- Section Heading -->
      <div
        class="relative flex items-center justify-center mb-6"
        data-aos="fade-up"
      >
        <div class="absolute inset-x-0 h-px bg-gray-300"></div>
        <h2
          class="relative bg-gray-50 px-6 text-lg sm:text-xl md:text-2xl font-bold text-gray-900"
        >
          {{ section.title }}
        </h2>
      </div>

      <!-- Horizontal Scroll -->
      <div
        class="overflow-x-auto px-2 sm:px-4 pb-4 scrollbar-hide snap-x snap-mandatory"
      >
        <div class="flex space-x-4 sm:space-x-6">
          <ProductCard
            v-for="product in section.products"
            :key="product.id"
            :title="product.name"
            :image="product.image"
            :price="product.price"
            :mrp="product.mrp"
            :hoverImage="product.hoverImage"
            :tags="product.tags"
            class="flex-shrink-0 w-52 sm:w-60 md:w-64 lg:w-72 snap-start transform transition hover:scale-[1.02]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductCard from "@/components/common/ProductCard.vue";

const products = [
  {
    id: 1,
    name: "Dress 1",
    price: 2499,
    mrp: 2999,
    image:
      "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75",
    hoverImage: null,
    tags: ["New"],
  },
  {
    id: 2,
    name: "Top 1",
    price: 1299,
    mrp: 1599,
    image:
      "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75",
    hoverImage: null,
    tags: ["Trending"],
  },
  {
    id: 3,
    name: "Shirt 1",
    price: 1599,
    mrp: 1999,
    image:
      "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FTR166DGRY_2.jpg%3Fv%3D1726144103&w=1920&q=75",
    hoverImage: null,
    tags: ["Best Seller"],
  },
  {
    id: 4,
    name: "Blouse 1",
    price: 899,
    mrp: null,
    image:
      "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH424BLST_2.jpg%3Fv%3D1754030952&w=1920&q=75",
    hoverImage: null,
    tags: [],
  },
];

const sections = [
  { title: "You may also like", products },
  { title: "Trending Now", products: [...products].reverse() },
  { title: "Best Sellers", products },
];
</script>

<style>
/* Hide scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
