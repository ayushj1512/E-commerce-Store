<template>
  <section class="pt-6 sm:pt-8 bg-white">

    <!-- Horizontal scroll container -->
    <div class="flex justify-start sm:justify-center">
      <div class="flex space-x-3 overflow-x-auto px-4 sm:px-6 pb-4 scrollbar-hide snap-x snap-mandatory">
        <div
          v-for="(category, index) in apiStore.sliderList"
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
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApiStore } from '~/stores/apiStore'

const router = useRouter()
const apiStore = useApiStore()

// Fetch only top_menu data on mounted
onMounted(() => {
  apiStore.fetchSlider('top_menu')
})

// Navigate to the link of the category
const goToLink = (link) => {
  if (link.startsWith('/')) {
    router.push(link)
  } else {
    window.location.href = link
  }
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
