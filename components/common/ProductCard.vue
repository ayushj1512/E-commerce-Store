<template>
  <div
    class="relative cursor-pointer group overflow-hidden shadow-sm hover:shadow-md transform transition-all duration-300 bg-white rounded-lg flex flex-col"
    @click="goToDetail"
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

    <!-- Product Image -->
    <div class="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 flex-shrink-0 overflow-hidden">
      <img
        :src="currentImage"
        :alt="title"
        class="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        @mouseover="hoverImage && (currentImage = hoverImage)"
        @mouseleave="currentImage = image"
        loading="lazy"
      />

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
        class="absolute bottom-2 right-2 bg-yellow-400 text-black text-[10px] sm:text-xs font-semibold rounded-full shadow-sm flex items-center gap-1 opacity-0 animate-fade-in group-hover:scale-105 transition-transform duration-300 px-1.5 py-[2px]"
      >
        <Star class="h-3 w-3" />
        {{ avgRating.toFixed(1) }}
      </div>
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

        <!-- Voucher Badge above price -->
        <span
          v-if="voucher"
          class="inline-flex mt-1 mb-1 text-green-500 text-[10px] sm:text-[11px] font-bold rounded-full items-center gap-1 px-2 py-[2px] animate-discount-entry"
        >
          {{ voucher.category_name }}
        </span>

        <!-- Price Row -->
        <div class="mt-1 flex items-center justify-start space-x-2">
          <span v-if="mrp" class="text-gray-400 line-through text-[10px] sm:text-sm">₹{{ mrp }}</span>
          <span class="text-gray-900 font-semibold text-sm sm:text-base">₹{{ price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue"
import { useRouter } from "#app"
import { useWishlistStore } from "@/stores/wishlist"
import { useCartStore } from "@/stores/cartStore"
import { Heart, Star } from "lucide-vue-next"

// Props
const props = defineProps({
  id: { type: [String, Number], required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  hoverImage: { type: String, default: null },
  price: { type: Number, required: true },
  mrp: { type: Number, default: null },
  productUrl: { type: String, required: true },
  avgRating: { type: Number, default: 0 },
  categories: { type: Array, default: () => [] },
})

// Refs and stores
const currentImage = ref(props.image)
const router = useRouter()
const wishlist = useWishlistStore()
const cart = useCartStore()
const animating = ref(false)
const voucher = ref(null)

// Wishlist logic
const isWishlisted = computed(() => wishlist.isFavorite(props.id))

// Discount calculation
const discountPercent = computed(() => {
  if (props.mrp && props.mrp > props.price) {
    return Math.round(((props.mrp - props.price) / props.mrp) * 100)
  }
  return 0
})

// --- Voucher logic with reactive watchEffect ---
watchEffect(() => {
  if (!cart.vouchers.length) {
    console.log(`[Voucher] No vouchers loaded yet for product: ${props.title}`)
    voucher.value = null
    return
  }

  console.log(`[Voucher] Checking product "${props.title}" with categories:`, props.categories)
  // Convert both sides to numbers to avoid type mismatch
  const matched = cart.vouchers.find(v => props.categories.map(Number).includes(Number(v.id_category)))

  if (matched) {
    console.log(`[Voucher] MATCHED voucher for "${props.title}":`, matched.category_name)
    voucher.value = matched
  } else {
    console.log(`[Voucher] No voucher applicable for "${props.title}"`)
    voucher.value = null
  }
})

// Go to product detail
const goToDetail = () => {
  if (!props.productUrl) return
  if (props.productUrl.startsWith("/")) {
    router.push(props.productUrl).catch(() => {})
  } else {
    window.location.href = props.productUrl
  }
}

// Toggle wishlist
const toggleWishlist = () => {
  wishlist.toggleFavorite(props.id)
  animating.value = true
  setTimeout(() => (animating.value = false), 400)
}

// Debug: watch cart vouchers to see updates live
watchEffect(() => {
  console.log("[Voucher] Cart vouchers updated:", cart.vouchers)
})
</script>

<style scoped>
@keyframes pingonce {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
.animate-pingonce { animation: pingonce 0.4s ease-in-out; }

@keyframes discount-entry {
  0% { transform: scale(0.6) translateY(-5px); opacity: 0; }
  50% { transform: scale(1.1) translateY(0); opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
.animate-discount-entry { animation: discount-entry 0.6s ease-out forwards; }

@keyframes fade-in {
  0% { opacity: 0; transform: translateY(2px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
</style>
