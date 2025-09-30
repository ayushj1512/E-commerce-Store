<template>
  <button
    @click="goToWishlist"
    @keydown.enter.prevent="goToWishlist"
    type="button"
    aria-label="Open wishlist"
    class="relative inline-flex items-center justify-center p-1 focus:outline-none"
  >
    <!-- Heart icon -->
    <Heart
      class="w-6 h-6 transition-transform duration-300"
      :class="[
        hasItems ? 'text-red-500' : 'text-gray-600',
        animating ? 'animate-heartbeat' : ''
      ]"
    />
  </button>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Heart } from 'lucide-vue-next'
import { useWishlistStore } from '@/stores/wishlist'

const router = useRouter()
const wishlist = useWishlistStore()

// Load wishlist on mount
onMounted(() => {
  if (typeof wishlist.loadWishlist === 'function') {
    wishlist.loadWishlist()
  }
})

// state
const count = computed(() =>
  Array.isArray(wishlist.favoriteProducts) ? wishlist.favoriteProducts.length : 0
)
const hasItems = computed(() => count.value > 0)

const animating = ref(false)
const prevCount = ref(undefined)
const ANIM_DURATION = 900 // ms

// trigger heartbeat animation when items added
watch(
  () => count.value,
  (newCount) => {
    if ((prevCount.value === undefined && newCount > 0) || (prevCount.value === 0 && newCount > 0)) {
      animating.value = true
      setTimeout(() => (animating.value = false), ANIM_DURATION)
    }
    prevCount.value = newCount
  },
  { immediate: true }
)

function goToWishlist() {
  router.push('/wishlist').catch(() => {})
}
</script>

<style scoped>
@keyframes heartbeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(0.95); }
  75% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

/* single-cycle heartbeat animation */
.animate-heartbeat {
  animation: heartbeat 0.9s ease-in-out;
}
</style>
