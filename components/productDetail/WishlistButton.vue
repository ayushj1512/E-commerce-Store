<template>
  <button
    @click="toggleWishlist"
    class="px-4 py-2 rounded-full border-2 font-medium flex items-center gap-2 whitespace-nowrap relative overflow-hidden transition-all duration-300"
    :class="isWishlisted
      ? 'bg-red-500 border-red-500 text-white glow-card'
      : 'bg-white border-gray-300 text-black hover:border-black hover:bg-gray-100'"
  >
    <!-- Heart + Sparkles Animation -->
    <div class="relative w-6 h-6">
      <!-- Outline Heart -->
      <Heart class="w-6 h-6 absolute inset-0 transition-colors duration-200" :class="isWishlisted ? 'text-white' : 'text-black'" />

      <!-- Animated Heart + Effects -->
      <div v-if="animating" class="absolute inset-0 flex items-center justify-center">
        <Heart class="w-6 h-6 text-white fill-current animate-heart-pop"/>
        <span class="ripple-small"></span>
        <span class="sparkle sparkle-1"></span>
        <span class="sparkle sparkle-2"></span>
        <span class="sparkle sparkle-3"></span>
        <span class="sparkle sparkle-4"></span>
      </div>
    </div>

    <span>{{ isWishlisted ? ' Already In Wishlist' : ' Add to Wishlist' }}</span>
  </button>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Heart } from 'lucide-vue-next'

const props = defineProps({
  isWishlisted: { type: Boolean, default: false },
})
const emit = defineEmits(['toggle'])

const animating = ref(false)
const prevWishlisted = ref(false)
const ANIM_DURATION = 1700

watch(() => props.isWishlisted, (newVal) => {
  if (!prevWishlisted.value && newVal) {
    animating.value = true
    setTimeout(() => (animating.value = false), ANIM_DURATION)
  }
  prevWishlisted.value = newVal
})

function toggleWishlist() {
  emit('toggle')
}
</script>

<style scoped>
/* Card Glow */
@keyframes card-glow {
  0%,100% { box-shadow: 0 0 0px rgba(255,0,0,0); }
  50% { box-shadow: 0 0 12px rgba(255,0,0,0.6); }
}
.glow-card {
  animation: card-glow 0.8s ease-in-out forwards;
}

/* Heart pop animation */
@keyframes heart-pop {
  0% { transform: scale(0.75); opacity: 0.6; }
  30% { transform: scale(1.35); opacity: 1; }
  55% { transform: scale(0.95); }
  75% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
.animate-heart-pop {
  animation: heart-pop 1.7s cubic-bezier(0.25,1,0.5,1) forwards;
}

/* Soft ripple */
.ripple-small {
  width: 32px;
  height: 32px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  animation: ripple-anim 1.7s ease-out forwards;
  position: absolute;
}
@keyframes ripple-anim {
  0% { transform: scale(0.3); opacity: 0.7; }
  70% { transform: scale(1.2); opacity: 0.35; }
  100% { transform: scale(1.8); opacity: 0; }
}

/* Sparkles */
.sparkle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #fde68a;
  border-radius: 50%;
  opacity: 0;
  animation: sparkle-pop 2s ease-out forwards;
}
.sparkle-1 { top: -2px; left: 50%; animation-delay: 0s; }
.sparkle-2 { top: 50%; right: -2px; animation-delay: 0.1s; }
.sparkle-3 { bottom: -2px; left: 50%; animation-delay: 0.2s; }
.sparkle-4 { top: 50%; left: -2px; animation-delay: 0.3s; }

@keyframes sparkle-pop {
  0% { transform: scale(0.2) translate(0,0); opacity: 1; }
  50% { transform: scale(1.2) translate(var(--dx,0), var(--dy,0)); opacity: 1; }
  100% { transform: scale(0.5) translate(var(--dx,0), var(--dy,0)); opacity: 0; }
}
</style>
