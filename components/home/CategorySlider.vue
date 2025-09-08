<template>
  <section class="pt-6 sm:pt-8 bg-white">
    <!-- Horizontal scroll container -->
    <div class="flex justify-start sm:justify-center">
      <div class="flex space-x-3 overflow-x-auto px-4 sm:px-6 pb-4 scrollbar-hide snap-x snap-mandatory">
        <div
          v-for="(category, index) in categories"
          :key="index"
          @click="goToLink(category.link)"
          class="flex-shrink-0 w-32 sm:w-36 md:w-40 lg:w-44 xl:w-48 rounded-lg overflow-hidden shadow-md cursor-pointer transform hover:scale-105 transition-transform duration-300 bg-gray-50 snap-start"
        >
          <!-- Image -->
          <div class="relative">
            <img
              :src="category.img"
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
import { useRouter } from '#app'

const router = useRouter()

const categories = [
  { name: 'Livin', img: 'https://cdn.shopify.com/s/files/1/0486/0634/7416/files/livin_547c91cc-4810-4333-b960-d23287e6b5ef.jpg?v=1755858460', link: '/' },
  { name: 'Tops', img: 'https://cdn.shopify.com/s/files/1/0486/0634/7416/files/tops_27ae4357-df67-4215-a2de-e5b6d17d20d3.jpg?v=1755858460', link: '/collection/tops' },
  { name: 'Dresses', img: 'https://cdn.shopify.com/s/files/1/0486/0634/7416/files/dress_d6d90a45-ecec-45bf-adf8-bdedbaf90b51.jpg?v=1755858460', link: '/collection/dresses' },
  { name: 'Shirts', img: 'https://cdn.shopify.com/s/files/1/0486/0634/7416/files/shirts_3b699e77-d001-4553-9cdc-19ab53863c80.jpg?v=1755858460', link: '/collection/shirts' },
  { name: 'Tee Knits', img: 'https://cdn.shopify.com/s/files/1/0486/0634/7416/files/tee_knits.jpg?v=1755858460', link: '/collection/tee-knits' },
  { name: 'Skirts', img: 'https://cdn.shopify.com/s/files/1/0486/0634/7416/files/skirts_0047415b-cac2-4a5a-8197-0f84d1bff8e7.jpg?v=1755858460', link: '/collection/skirts' },
  { name: 'Blazer', img: 'https://cdn.shopify.com/s/files/1/0486/0634/7416/files/blazer_1affb265-815a-4b2b-aa0d-ef60e0afd387.jpg?v=1755858460', link: '/collection/blazer' },
  { name: 'Coord', img: 'https://cdn.shopify.com/s/files/1/0486/0634/7416/files/coord.jpg?v=1755858460', link: '/collection/coord' },
]

const goToLink = (link) => {
  if (!link) return
  if (link.startsWith('/')) router.push(link)
  else window.location.href = link
}
</script>

<style scoped>
.flex-shrink-0 img {
  transition: transform 0.3s ease;
}
.flex-shrink-0:hover img {
  transform: scale(1.07);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
