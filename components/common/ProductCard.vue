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
    <div v-if="tags && tags.length" class="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="bg-black text-white text-[10px] sm:text-xs px-2 py-0.5 font-semibold rounded"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Product info -->
    <div class="p-3 flex flex-col flex-1 justify-between gap-2">
      <div class="flex flex-col flex-1">
        <h3
          class="text-gray-900 font-medium text-xs sm:text-sm md:text-base break-words leading-snug"
          :title="title"
        >
          {{ title }}
        </h3>

        <div class="mt-1 flex items-center space-x-1 sm:space-x-2">
          <span v-if="mrp" class="text-gray-400 line-through text-[10px] sm:text-sm">₹{{ mrp }}</span>
          <span class="text-gray-900 font-semibold text-sm sm:text-base">₹{{ price }}</span>
        </div>
      </div>

      <!-- Sizes Dropdown -->
      <div v-if="sizes && sizes.length" class="mt-2">
        <select
          v-model="selectedSize"
          class="border rounded-sm px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option v-for="(s, idx) in sizes" :key="idx" :value="s">Size: {{ s }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "#app"
import { useToast } from "vue-toastification"
import { useCartStore } from "@/stores/cartStore"
import { useWishlistStore } from "@/stores/wishlist"   // ✅ Import Wishlist Store

const props = defineProps({
  id: { type: [String, Number], required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  hoverImage: { type: String, default: null },
  tags: { type: Array, default: () => [] },
  price: { type: Number, required: true },
  mrp: { type: Number, default: null },
  showCartBtn: { type: Boolean, default: true },
  productUrl: { type: String, required: true },
  sizes: { type: Array, default: () => [] },
})

const currentImage = ref(props.image)
const selectedSize = ref(props.sizes?.[0] ?? null)
const router = useRouter()
const cart = useCartStore()
const wishlist = useWishlistStore()   // ✅ Pinia Wishlist Store
let toast = null

// ✅ Reactive computed check (comes from store, not local state)
const isWishlisted = computed(() => wishlist.isFavorite(props.id))
const animating = ref(false)

onMounted(() => {
  toast = useToast()
})

// Navigate to product details
const goToDetail = () => {
  if (!props.productUrl) return
  if (props.productUrl.startsWith("/")) {
    router.push(props.productUrl).catch(() => {})
  } else {
    window.location.href = props.productUrl
  }
}

// Add product to cart
const addToCart = () => {
  const productToAdd = {
    id: props.id,
    name: props.title,
    price: props.price,
    quantity: 1,
    size: selectedSize.value,
    image: props.image,
  }

  cart.addToCart(productToAdd)

  toast?.success(`${props.title} has been added to your cart`, {
    timeout: 2000,
    icon: "🛒",
  })
}

// ✅ Toggle wishlist using store
const toggleWishlist = () => {
  wishlist.toggleFavorite(props.id)
  animating.value = true

  setTimeout(() => {
    animating.value = false
  }, 400)

  if (wishlist.isFavorite(props.id)) {
    toast?.success(`${props.title} added to Wishlist ❤️`, { timeout: 1500 })
  } else {
    toast?.info(`${props.title} removed from Wishlist`, { timeout: 1500 })
  }
}
</script>


<style scoped>
@keyframes pingonce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
.animate-pingonce {
  animation: pingonce 0.4s ease-in-out;
}
</style>
