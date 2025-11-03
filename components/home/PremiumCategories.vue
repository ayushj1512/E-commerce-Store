<template>
  <section class="pb-0 bg-white">
    <!-- Desktop Grid -->
    <div
      class="hidden md:grid max-w-7xl mx-auto grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4"
    >
      <div
        v-for="(category, index) in premiumCategories"
        :key="index"
        class="relative cursor-pointer group overflow-hidden rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
      >
        <img
          :src="category.image"
          :alt="category.name"
          class="w-full h-56 sm:h-60 md:h-64 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
        />
        <div
          class="absolute bottom-0 left-0 w-full bg-black bg-opacity-40 text-white text-center py-3 font-semibold text-lg transition-all group-hover:bg-opacity-60"
        >
          {{ category.name }}
        </div>
      </div>
    </div>

    <!-- Mobile Horizontal Scroll -->
    <div
      class="md:hidden flex space-x-3 overflow-x-auto px-3 pb-3 scrollbar-hide"
    >
      <div
        v-for="(category, index) in premiumCategories"
        :key="index"
        class="flex-shrink-0 w-36 sm:w-40 cursor-pointer group overflow-hidden rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105"
      >
        <img
          :src="category.image"
          :alt="category.name"
          class="w-full h-36 sm:h-40 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
        />
        <div
          class="mt-1 text-center font-semibold text-gray-900 text-xs sm:text-sm"
        >
          {{ category.name }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const premiumCategories = [
  {
    name: "Dress",
    image:
      "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2F3_e84a5de7-dbe6-4be6-94bd-cde74c1b0323.jpg%3Fv%3D1755859633&w=1920&q=75",
  },
  {
    name: "Gowns",
    image:
      "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2F4_40edf0ac-b565-4529-843a-f804f91f91cd.jpg%3Fv%3D1756187367&w=1920&q=75",
  },
  {
    name: "Heels",
    image:
      "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2F1_4217b0e5-ebac-4f61-94dc-5c82c8e2fc35.jpg%3Fv%3D1755939489&w=1920&q=75",
  },
  {
    name: "Bags",
    image:
      "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2F2_0136d282-0be9-4a57-a2b7-5af503160a48.jpg%3Fv%3D1755859633&w=1920&q=75",
  },
];
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
</style>
