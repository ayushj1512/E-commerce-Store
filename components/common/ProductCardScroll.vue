<template>
  <div
    class="relative cursor-pointer group overflow-hidden shadow-sm hover:shadow-md transform transition-all duration-300 bg-white rounded-lg flex flex-col"
    @click="goToDetail"
    ref="cardRef"
  >
    <!-- Wishlist Button -->
    <button
      class="absolute top-2 right-2 z-20 p-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200"
      @click.stop="toggleWishlist"
    >
      <Heart
        v-if="isWishlisted"
        class="w-5 h-5 text-red-500 transition-transform transform"
        :class="{ 'scale-125 animate-pingonce': animating }"
        fill="currentColor"
      />
      <Heart
        v-else
        class="w-5 h-5 text-gray-600"
        stroke="currentColor"
      />
    </button>

    <!-- Horizontally Scrollable Carousel -->
    <div
      ref="scrollContainer"
      class="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 flex-shrink-0 overflow-x-auto overflow-y-hidden flex snap-x snap-mandatory scroll-smooth no-scrollbar"
    >
      <template v-if="loaded">
        <img
          v-for="(img, idx) in loopedImages"
          :key="idx"
          :src="img"
          :alt="title"
          class="w-full h-full object-cover flex-shrink-0 snap-start"
          loading="lazy"
        />
      </template>
      <div v-else class="w-full h-full bg-gray-200 animate-pulse"></div>

      <!-- Discount Badge -->
      <span
        v-if="discountPercent > 0"
        class="absolute top-2 left-2 bg-red-100 text-red-600 text-[10px] sm:text-[11px] font-medium px-2 py-[2px] rounded-full leading-none"
      >
        {{ discountPercent }}% OFF
      </span>

      <!-- Rating Badge -->
      <div
        v-if="avgRating > 0"
        class="absolute bottom-2 right-2 bg-yellow-400 text-black text-[10px] sm:text-xs font-semibold rounded-full shadow-sm flex items-center gap-1 transition-transform duration-300 px-1.5 py-[2px]"
      >
        <Star class="h-3 w-3" />
        {{ avgRating.toFixed(1) }}
      </div>
    </div>

    <!-- Dots -->
    <div
      v-if="images.length > 1"
      class="flex justify-center items-center gap-1 mt-2 absolute bottom-3 left-0 right-0 z-10"
    >
      <span
        v-for="(img, i) in images"
        :key="'dot-' + i"
        class="h-1.5 w-1.5 rounded-full"
        :class="i === currentIndex ? 'bg-gray-800' : 'bg-gray-300'"
      ></span>
    </div>

    <!-- Product Info -->
    <div class="p-3 flex flex-col flex-1 justify-between gap-2 relative">
      <div class="flex flex-col flex-1">
        <h3
          class="text-gray-900 font-medium text-xs sm:text-sm md:text-base break-words leading-snug"
          :title="title"
        >
          {{ title }}
        </h3>
        <div class="mt-1 flex items-center justify-start space-x-2">
          <span v-if="mrp" class="text-gray-400 line-through text-[10px] sm:text-sm">₹{{ mrp }}</span>
          <span class="text-gray-900 font-semibold text-sm sm:text-base">₹{{ price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watchEffect } from 'vue'
import { useRouter } from '#app'
import { Heart, Star } from 'lucide-vue-next'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cartStore'

// Props
const props = defineProps({
  id: { type: [String, Number], required: true },
  title: { type: String, required: true },
  images: { type: Array, required: true }, // Array of all images from API
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  productUrl: { type: String, required: true },
  avgRating: { type: Number, required: true },
  categories: { type: Array, required: true },
})

// Refs & stores
const router = useRouter()
const wishlist = useWishlistStore()
const cart = useCartStore()
const animating = ref(false)
const loaded = ref(false)
const cardRef = ref(null)
const scrollContainer = ref(null)
const currentIndex = ref(0)

// Wishlist
const isWishlisted = computed(() => wishlist.isFavorite(props.id))

// Discount
const discountPercent = computed(() =>
  props.mrp > props.price ? Math.round(((props.mrp - props.price) / props.mrp) * 100) : 0
)

// Loop images for infinite scroll
const loopedImages = computed(() => [...props.images, ...props.images]) // duplicate for loop

// Lazy load
let observer
const observeImage = () => {
  if (!cardRef.value) return
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      loaded.value = true
      props.images.forEach(src => new Image().src = src)
      observer.disconnect()
    }
  }, { threshold: 0.1 })
  observer.observe(cardRef.value)
}

// Scroll handling
const onScroll = () => {
  if (!scrollContainer.value) return
  const width = scrollContainer.value.clientWidth
  const scrollLeft = scrollContainer.value.scrollLeft
  const total = props.images.length
  currentIndex.value = Math.floor((scrollLeft / width) % total)
}

onMounted(() => {
  observeImage()
  if (scrollContainer.value) scrollContainer.value.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
  if (scrollContainer.value) scrollContainer.value.removeEventListener('scroll', onScroll)
})

// Go to product detail
const goToDetail = () => {
  if (!props.productUrl) return
  if (props.productUrl.startsWith('/')) router.push(props.productUrl).catch(() => {})
  else window.location.href = props.productUrl
}

// Wishlist toggle
const toggleWishlist = () => {
  wishlist.toggleFavorite(props.id)
  animating.value = true
  setTimeout(() => (animating.value = false), 400)
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes pingonce {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
.animate-pingonce { animation: pingonce 0.4s ease-in-out; }
</style>
