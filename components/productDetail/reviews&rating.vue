<template>
  <!-- Render only if mounted (client) -->
  <div v-if="mounted" class="mt-6 sm:mt-10 animate-fade-in delay-200">
    
    <div class="flex flex-col md:flex-row gap-4 sm:gap-8">
      <!-- Rating Summary -->
      <div
        v-if="!loading && reviews.length"
        class="w-full md:w-1/4 bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-6"
      >
        <div class="flex flex-col items-center sm:items-start">
          <span class="text-6xl font-extrabold text-black drop-shadow-sm">
            {{ avgRating.toFixed(1) }}
          </span>

          <!-- Star Display -->
          <div class="flex text-yellow-500 mt-1">
            <template v-for="i in 5" :key="i">
              <svg
                v-if="i <= Math.round(avgRating)"
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.538 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.783.57-1.838-.197-1.538-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.075 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.947z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.538 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.783.57-1.838-.197-1.538-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.075 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.947z"
                />
              </svg>
            </template>
          </div>

          <span class="text-gray-600 font-medium mt-1 text-sm">
            ({{ reviews.length }} reviews)
          </span>
        </div>

        <!-- Rating Chart -->
        <div class="flex-1 space-y-2 w-full mt-4 sm:mt-0">
          <div v-for="i in 5" :key="i" class="flex items-center gap-2">
            <span class="w-6 text-black">{{ 6 - i }}★</span>
            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-2 bg-black rounded-full transition-all duration-700 ease-out"
                :style="{ width: getPercentage(6 - i) + '%' }"
              ></div>
            </div>
            <span class="w-6 text-gray-700 text-right">
              {{ reviews.filter(r => r.rating === 6 - i).length }}
            </span>
          </div>
        </div>
      </div>

      <!-- Rating Summary Shimmer -->
      <div
        v-else-if="loading"
        class="w-full md:w-1/4 bg-gray-100 p-6 rounded-2xl border border-gray-200 shadow-sm animate-pulse flex flex-col gap-4"
      >
        <div class="h-12 w-20 bg-gray-300 rounded"></div>
        <div class="flex gap-1">
          <div v-for="i in 5" :key="i" class="h-6 w-6 bg-gray-300 rounded"></div>
        </div>
        <div v-for="i in 5" :key="'bar-' + i" class="h-3 bg-gray-300 rounded"></div>
      </div>

      <!-- Reviews List -->
      <div class="w-full md:w-3/4 flex gap-4 overflow-x-auto">
        <!-- Show shimmer if loading -->
        <template v-if="loading">
          <div
            v-for="n in 3"
            :key="n"
            class="flex flex-col gap-4 min-w-[300px] animate-pulse"
          >
            <div class="bg-gray-100 p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div class="flex justify-between mb-2">
                <div class="h-4 w-24 bg-gray-300 rounded"></div>
                <div class="h-4 w-16 bg-gray-300 rounded"></div>
              </div>
              <div class="h-3 w-full bg-gray-300 rounded mb-2"></div>
              <div class="h-3 w-2/3 bg-gray-300 rounded"></div>
              <div class="flex gap-2 mt-3">
                <div v-for="i in 2" :key="i" class="h-14 w-14 bg-gray-300 rounded-xl"></div>
              </div>
            </div>
          </div>
        </template>

        <!-- Real reviews -->
        <template v-else-if="reviews.length">
          <div
            class="flex flex-col gap-4 min-w-[300px]"
            v-for="(chunk, idx) in displayReviewChunks"
            :key="idx"
          >
            <div
              v-for="r in chunk"
              :key="r.id"
              class="bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div class="flex items-center justify-between mb-1 sm:mb-2">
                <span class="font-semibold text-black text-sm sm:text-base">
                  {{ r.customer_name || "Anonymous" }}
                </span>
                <span class="text-yellow-500 text-sm sm:text-base">
                  {{ '★'.repeat(r.rating) }}
                </span>
              </div>
              <p class="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3">
                {{ r.review_description || r.review_heading || "No review text provided." }}
              </p>

              <!-- Review Images -->
              <div v-if="r.review_images?.length" class="flex flex-wrap gap-2">
                <img
                  v-for="(p, i) in r.review_images"
                  :key="i"
                  :src="p"
                  class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-2xl border border-gray-300 shadow-sm transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  @click="openImage(p)"
                  @error="(e) => (e.target.src = placeholderImg)"
                />
              </div>
            </div>
          </div>
        </template>

        <!-- No reviews fallback -->
        <template v-else>
          <!-- <div class="text-center text-gray-500 w-full">
            No reviews available.
          </div> -->
        </template>
      </div>
    </div>

    <!-- Fullscreen Image Modal -->
    <Teleport to="body">
      <div
        v-if="showImage"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
        @click.self="closeImage"
      >
        <img
          :src="currentImage"
          class="max-h-screen max-w-screen object-contain rounded-xl shadow-lg"
        />
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ofetch } from 'ofetch'

const props = defineProps({
  productId: { type: [String, Number], required: true }
})

const mounted = ref(false)
const loading = ref(true)
const reviews = ref([])
const placeholderImg =
  'https://via.placeholder.com/100x100.png?text=Image'

onMounted(() => {
  mounted.value = true
})

const avgRating = computed(() =>
  reviews.value.length
    ? reviews.value.reduce((sum, r) => sum + r.rating, 0) / reviews.value.length
    : 0
)

const getPercentage = star =>
  reviews.value.length
    ? (reviews.value.filter(r => r.rating === star).length / reviews.value.length) * 100
    : 0

const sortedReviews = computed(() => {
  return [...reviews.value].sort((a, b) => {
    const aHasImage = a.review_images && a.review_images.length > 0
    const bHasImage = b.review_images && b.review_images.length > 0
    return aHasImage === bHasImage ? 0 : aHasImage ? -1 : 1
  })
})

const displayReviews = computed(() =>
  sortedReviews.value.filter(r => r.review_description || r.review_heading)
)

const displayReviewChunks = computed(() => {
  const chunks = []
  for (let i = 0; i < displayReviews.value.length; i += 2) {
    chunks.push(displayReviews.value.slice(i, i + 2))
  }
  return chunks
})

const BASE_URL =
  import.meta.env.VITE_COMMENTS_BASE_URL ||
  'https://services.streetstylestore.com/api/product/comments'

const fetchReviews = async () => {
  if (!props.productId) return
  loading.value = true
  try {
    const payload = {
      id_product: props.productId,
      site: 'sss',
      page: 1,
      per_page: 200,
      decider: 'getReviewList'
    }
    const res = await ofetch(BASE_URL, {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' }
    })
    reviews.value =
      res.hits?.map(hit => ({
        id: hit.document.id,
        customer_name: hit.document.customer_name,
        rating: hit.document.rating,
        review_description: hit.document.review_description,
        review_heading: hit.document.review_heading,
        review_images: hit.document.review_images || []
      })) || []
  } catch (err) {
    console.error('Failed to fetch reviews:', err)
    reviews.value = []
  } finally {
    loading.value = false
  }
}

watch(() => props.productId, fetchReviews, { immediate: true })

const showImage = ref(false)
const currentImage = ref('')
const openImage = src => {
  currentImage.value = src
  showImage.value = true
  document.body.style.overflow = 'hidden'
}
const closeImage = () => {
  showImage.value = false
  currentImage.value = ''
  document.body.style.overflow = 'auto'
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
