<template>
  <section class="py-8 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Mobile: horizontal scroll, Desktop: grid -->
      <div
        class="flex gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-4"
      >
        <div
          v-for="fit in fits"
          :key="fit.name"
          class="relative min-w-[180px] sm:min-w-[220px] md:flex-1 snap-start overflow-hidden cursor-pointer group shadow-md rounded-lg transform hover:scale-105 transition-transform duration-300"
        >
          <!-- Image -->
          <div class="w-full aspect-[9/16] overflow-hidden">
            <img
              :src="fit.image"
              :alt="fit.name"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const fits = [
  {
    name: "Party Fits",
    image:
      "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2F2_026d1454-b136-4a7d-b8c3-5acc29672841.jpg%3Fv%3D1755860527&w=1920&q=75"
  },
  {
    name: "Street Fits",
    image:
      "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2F3_7ba67398-dea6-4bc1-a32d-8ac79214b3d1.jpg%3Fv%3D1755860525&w=1920&q=75"
  },
  {
    name: "Ethnic Fits",
    image:
      "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2F1_1_85bf2f28-45b2-43ce-a44a-d7d3dfa3c5f8.jpg%3Fv%3D1756194243&w=1920&q=75"
  }
];
</script>

<style scoped>
/* Hover scale effect for images */
.group:hover img {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

/* Rounded corners for image */
img {
  border-radius: 0.5rem;
}

/* Hide scrollbar but keep scroll functionality */
.flex::-webkit-scrollbar {
  display: none;
}
.flex {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
