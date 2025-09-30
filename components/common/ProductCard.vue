<template>
  <div
    class="relative cursor-pointer group overflow-hidden shadow-sm hover:shadow-md transform transition-all duration-300 bg-white rounded-lg flex flex-col"
    @click="goToDetail"
  >
    <!-- Wishlist Button -->
    <button
      class="absolute top-2 right-2 z-20 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow hover:scale-110 transition"
      @click.stop="toggleWishlist"
    >
      <svg
        v-if="isWishlisted"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        class="w-5 h-5 text-red-500 transition-transform transform"
        :class="{ 'scale-125 animate-pingonce': animating }"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
             5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 
             2.09C13.09 3.81 14.76 3 16.5 
             3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
             6.86-8.55 11.54L12 21.35z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        class="w-5 h-5 text-gray-600"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4.318 6.318a4.5 4.5 0 000 
             6.364L12 20.364l7.682-7.682a4.5 
             4.5 0 00-6.364-6.364L12 
             7.636l-1.318-1.318a4.5 4.5 
             0 00-6.364 0z"
        />
      </svg>
    </button>

    <!-- Product Image -->
    <div class="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 flex-shrink-0 overflow-hidden">
      <img
        :src="currentImage"
        :alt="title"
        class="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        @mouseover="hoverImage && (currentImage = hoverImage)"
        @mouseleave="currentImage = image"
      />
    </div>

    <!-- Tags -->
    <div v-if="tags && tags.length" class="absolute top-10 left-2 flex flex-wrap gap-1 z-10">
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="bg-black text-white text-[10px] sm:text-xs px-2 py-0.5 font-semibold rounded"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Product info -->
    <div class="p-3 flex flex-col flex-1 justify-between gap-2 relative">
      <div class="flex flex-col flex-1">
        <h3
          class="text-gray-900 font-medium text-xs sm:text-sm md:text-base break-words leading-snug"
          :title="title"
        >
          {{ title }}
        </h3>

        <!-- Price + Rating Row -->
        <div class="mt-1 flex items-center justify-between">
          <div class="flex items-center space-x-1 sm:space-x-2">
            <span v-if="mrp" class="text-gray-400 line-through text-[10px] sm:text-sm">₹{{ mrp }}</span>
            <span class="text-gray-900 font-semibold text-sm sm:text-base">₹{{ price }}</span>
          </div>

          <!-- Rating badge -->
          <div v-if="avgRating > 0" class="bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded shadow flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.946c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.285-3.946a1 1 0 00-.364-1.118l-3.36-2.44c-.784-.57-.38-1.81.588-1.81h4.148a1 1 0 00.951-.69l1.285-3.946z" />
            </svg>
            {{ avgRating.toFixed(1) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "#app"
import { useCartStore } from "@/stores/cartStore"
import { useWishlistStore } from "@/stores/wishlist"
import { addToast } from "@/components/common/GlobalToast.vue"

const props = defineProps({
  id: { type: [String, Number], required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  hoverImage: { type: String, default: null },
  tags: { type: Array, default: () => [] },
  price: { type: Number, required: true },
  mrp: { type: Number, default: null },
  productUrl: { type: String, required: true },
  avgRating: { type: Number, default: 0 }
})

const currentImage = ref(props.image)
const router = useRouter()
const cart = useCartStore()
const wishlist = useWishlistStore()
const animating = ref(false)

const isWishlisted = computed(() => wishlist.isFavorite(props.id))

const goToDetail = () => {
  if (!props.productUrl) return
  if (props.productUrl.startsWith("/")) {
    router.push(props.productUrl).catch(() => {})
  } else {
    window.location.href = props.productUrl
  }
}

const addToCart = () => {
  const productToAdd = {
    id: props.id,
    name: props.title,
    price: props.price,
    quantity: 1,
    image: props.image,
  }
  cart.addToCart(productToAdd)
  addToast('product-added', `${props.title} added to cart 🛒`)
}

const toggleWishlist = () => {
  wishlist.toggleFavorite(props.id)
  animating.value = true
  setTimeout(() => (animating.value = false), 400)
  if (wishlist.isFavorite(props.id)) {
    addToast('success', `${props.title} added to Wishlist ❤️`)
  } else {
    addToast('product-removed', `${props.title} removed from Wishlist ❌`)
  }
}
</script>

<style scoped>
@keyframes pingonce {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
.animate-pingonce { animation: pingonce 0.4s ease-in-out; }
</style>
