<template>
  <button
    @click="goToWishlist"
    @keydown.enter.prevent="goToWishlist"
    type="button"
    aria-label="Open wishlist"
    class="inline-flex items-center justify-center focus:outline-none"
  >
    <div class="relative w-6 h-6">
      <!-- Outline Heart (stationary default state) -->
      <Heart
        class="w-6 h-6 absolute inset-0 transition-colors duration-200 text-black"
      />

      <!-- Animated Heart + Sparkles -->
      <div
        v-if="animating"
        class="absolute inset-0 flex items-center justify-center"
      >
        <Heart class="w-6 h-6 text-red-500 fill-current animate-heart-pop"/>
        
        <!-- Soft ripple -->
        <span class="ripple-small"></span>

        <!-- Sparkles -->
        <span class="sparkle sparkle-1"></span>
        <span class="sparkle sparkle-2"></span>
        <span class="sparkle sparkle-3"></span>
        <span class="sparkle sparkle-4"></span>
      </div>
    </div>
  </button>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Heart } from 'lucide-vue-next'
import { useWishlistStore } from '@/stores/wishlist'

const router = useRouter()
const wishlist = useWishlistStore()

onMounted(() => {
  if (typeof wishlist.loadWishlist === 'function') wishlist.loadWishlist()
})

const count = computed(() =>
  Array.isArray(wishlist.favoriteProducts) ? wishlist.favoriteProducts.length : 0
)

const animating = ref(false)
const prevCount = ref(undefined)
const ANIM_DURATION = 1700 // increased duration

watch(
  () => count.value,
  (newCount) => {
    // Trigger animation only on addition
    if (prevCount.value === undefined || prevCount.value < newCount) {
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
/* Heart pop animation (smooth easing) */
@keyframes heart-pop {
  0% { transform: scale(0.75); opacity: 0.6; }
  30% { transform: scale(1.35); opacity: 1; }
  55% { transform: scale(0.95); }
  75% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
.animate-heart-pop {
  animation: heart-pop 1.7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

/* Soft ripple effect */
.ripple-small {
  width: 32px;
  height: 32px;
  border: 2px solid rgba(239, 68, 68, 0.25);
  border-radius: 50%;
  animation: ripple-anim 1.7s ease-out forwards;
  position: absolute;
}

@keyframes ripple-anim {
  0% { transform: scale(0.3); opacity: 0.7; }
  70% { transform: scale(1.2); opacity: 0.35; }
  100% { transform: scale(1.8); opacity: 0; }
}

/* Sparkles animation */
.sparkle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #fde68a;
  border-radius: 50%;
  opacity: 0;
  animation: sparkle-pop 2.0s ease-out forwards;
}

.sparkle-1 { top: -2px; left: 50%; animation-delay: 0s; }
.sparkle-2 { top: 50%; right: -2px; animation-delay: 0.1s; }
.sparkle-3 { bottom: -2px; left: 50%; animation-delay: 0.2s; }
.sparkle-4 { top: 50%; left: -2px; animation-delay: 0.3s; }

@keyframes sparkle-pop {
  0% { transform: scale(0.2) translate(0,0); opacity: 1; }
  50% { transform: scale(1.2) translate(var(--dx, 0), var(--dy, 0)); opacity: 1; }
  100% { transform: scale(0.5) translate(var(--dx, 0), var(--dy, 0)); opacity: 0; }
}
</style>
