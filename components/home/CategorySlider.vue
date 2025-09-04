<template>
  <section class="pt-6 sm:pt-8 bg-white">

    <!-- Horizontal scroll container -->
    <div class="flex justify-start sm:justify-center">
      <div class="flex space-x-3 overflow-x-auto px-4 sm:px-6 pb-4 scrollbar-hide snap-x snap-mandatory">
        <div
          v-for="(category, index) in categories"
          :key="index"
          @click="goToCollection"
          class="flex-shrink-0 w-32 sm:w-36 md:w-40 lg:w-44 xl:w-48 rounded-lg overflow-hidden shadow-md cursor-pointer transform hover:scale-105 transition-transform duration-300 bg-gray-50 snap-start"
        >
          <!-- Image -->
          <div class="relative">
            <img
              :src="category.image"
              :alt="category.name"
              class="w-full h-28 sm:h-32 md:h-36 lg:h-40 xl:h-44 object-cover rounded-t-lg"
            />
          </div>
          <!-- Label below image -->
          <div class="py-2 text-center">
            <h3 class="text-gray-900 font-semibold text-xs sm:text-sm md:text-base">
              {{ category.name }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const categories = [
  { name: "Tops & Shirts", image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2Ftops_27ae4357-df67-4215-a2de-e5b6d17d20d3.jpg%3Fv%3D1755858460&w=1920&q=75" },
  { name: "Dresses", image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2Fdress_d6d90a45-ecec-45bf-adf8-bdedbaf90b51.jpg%3Fv%3D1755858460&w=1920&q=75" },
  { name: "Tees", image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2Ftee_knits.jpg%3Fv%3D1755858460&w=1920&q=75" },
  { name: "Trousers", image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2Fskirts_0047415b-cac2-4a5a-8197-0f84d1bff8e7.jpg%3Fv%3D1755858460&w=1920&q=75" },
  { name: "Skirts & Shorts", image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2Fskirts_0047415b-cac2-4a5a-8197-0f84d1bff8e7.jpg%3Fv%3D1755858460&w=1920&q=75" },
  { name: "Denim", image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2Fskirts_0047415b-cac2-4a5a-8197-0f84d1bff8e7.jpg%3Fv%3D1755858460&w=1920&q=75" },
]

const goToCollection = () => {
  router.push('/collection')
}
</script>

<style scoped>
/* Smooth hover image effect */
.flex-shrink-0 img {
  transition: transform 0.3s ease;
}
.flex-shrink-0:hover img {
  transform: scale(1.07);
}

/* Hide scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
