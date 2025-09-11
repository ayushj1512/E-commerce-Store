<template>
  <!-- Render only if mounted (client) and reviews exist -->
  <div v-if="mounted && product.reviews?.length" class="mt-6 sm:mt-10 animate-fade-in delay-200">
    <h2 class="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">Customer Reviews</h2>

    <div class="flex flex-col md:flex-row gap-4 sm:gap-8">

      <!-- Rating Summary -->
      <div class="md:w-1/2 bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div class="flex flex-col items-center sm:items-start">
          <span class="text-5xl sm:text-6xl font-extrabold text-black">{{ avgRating.toFixed(1) }}</span>
          <div class="flex text-yellow-500 mt-1">
            <template v-for="i in 5" :key="i">
              <svg v-if="i <= Math.round(avgRating)" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.538 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.783.57-1.838-.197-1.538-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.075 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.947z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.538 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.783.57-1.838-.197-1.538-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.075 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.947z"/>
              </svg>
            </template>
          </div>
          <span class="text-gray-600 font-medium mt-1 text-sm">({{ product.reviews.length }} reviews)</span>
        </div>

        <!-- Rating Chart -->
        <div class="flex-1 space-y-2 w-full">
          <div v-for="i in 5" :key="i" class="flex items-center gap-2">
            <span class="w-6 text-black">{{ 6-i }}★</span>
            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-2 bg-black rounded-full transition-all duration-700 ease-out" :style="{ width: getPercentage(6-i) + '%' }"></div>
            </div>
            <span class="w-6 text-gray-700 text-right">{{ product.reviews.filter(r => r.rating === 6-i).length }}</span>
          </div>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="md:w-1/2 flex gap-4 overflow-x-auto">
        <div class="flex flex-col gap-4 min-w-[300px]" v-for="(chunk, idx) in reviewChunks" :key="idx">
          <div v-for="r in chunk" :key="r.name" class="bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div class="flex items-center justify-between mb-1 sm:mb-2">
              <span class="font-semibold text-black text-sm sm:text-base">{{ r.name }}</span>
              <span class="text-yellow-500 text-sm sm:text-base">{{ '★'.repeat(r.rating) }}</span>
            </div>
            <p class="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3">{{ r.comment }}</p>
            <div v-if="r.photos?.length" class="flex flex-wrap gap-2">
              <img v-for="(p,i) in r.photos" :key="i" :src="p" class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-2xl border border-gray-300 shadow-sm transform hover:scale-105 transition-all duration-300"/>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Dummy product data
const product = ref({
  reviews: [
    { name:'Alice', rating:5, comment:'Great product!', photos:['/dummy1.jpg','/dummy2.jpg'] },
    { name:'Bob', rating:4, comment:'Good quality', photos:[] },
    { name:'Charlie', rating:3, comment:'Average', photos:['/dummy3.jpg'] },
    { name:'David', rating:5, comment:'Loved it!', photos:[] },
    { name:'Eve', rating:2, comment:'Not satisfied', photos:[] }
  ]
})

// SSR-safe rendering
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

// Computed average rating
const avgRating = computed(() =>
  product.value.reviews.length
    ? product.value.reviews.reduce((sum, r) => sum + r.rating, 0) / product.value.reviews.length
    : 0
)

// Compute percentage for rating bars
const getPercentage = (star) =>
  product.value.reviews.length
    ? (product.value.reviews.filter(r => r.rating === star).length / product.value.reviews.length) * 100
    : 0

// Split reviews into chunks of 2 (for layout)
const reviewChunks = computed(() => {
  const chunks = []
  const reviews = product.value.reviews || []
  for (let i = 0; i < reviews.length; i += 2) {
    chunks.push(reviews.slice(i, i + 2))
  }
  return chunks
})
</script>
