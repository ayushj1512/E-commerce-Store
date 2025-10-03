<template>
  <transition name="fade-scale">
    <div v-if="voucher" class="flex-1 flex justify-center mb-4 px-4 sm:px-6">
      <div
        class="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 py-4 sm:py-6 rounded-xl w-full max-w-md sm:max-w-xl text-center font-bold text-white shadow-2xl border border-white transform transition-all duration-500 hover:scale-105"
        :style="backgroundStyle"
      >
        <!-- Top striped border -->
        <div
          class="absolute top-0 left-0 w-full"
          style="height: 8px; background: repeating-linear-gradient(45deg, #fff, #fff 3px, #000 3px, #000 6px);"
        ></div>

        <!-- Bottom striped border -->
        <div
          class="absolute bottom-0 left-0 w-full"
          style="height: 8px; background: repeating-linear-gradient(45deg, #fff, #fff 3px, #000 3px, #000 6px);"
        ></div>

        <!-- Glow behind card -->
        <div class="absolute inset-0 rounded-xl bg-white opacity-5 blur-3xl animate-glow"></div>

        <!-- Circular side cutouts -->
        <div
          class="w-6 h-6 sm:w-8 sm:h-8 bg-transparent rounded-full absolute top-1/2 -translate-y-1/2 left-0 -ml-3 sm:-ml-4"
        ></div>
        <div
          class="w-6 h-6 sm:w-8 sm:h-8 bg-transparent rounded-full absolute top-1/2 -translate-y-1/2 right-0 -mr-3 sm:-mr-4"
        ></div>

        <!-- Voucher text -->
        <div class="z-10 text-center text-sm sm:text-base relative">
          Part of {{ formatText(voucher.category_name) }}
        </div>

        <!-- Sparkles below text only -->
        <div class="absolute bottom-0 left-0 w-full h-2/3 pointer-events-none overflow-hidden">
          <span
            v-for="i in sparkles"
            :key="i"
            class="absolute bg-white rounded-full animate-sparkle"
            :style="getRandomPosition(i)"
          ></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  voucher: {
    type: Object,
    default: null
  }
});

const sparkles = 25; // fewer sparkles for mobile

// Background gradient
const backgroundStyle = ref({
  background: "radial-gradient(circle at top left, #111 0%, #000 100%)"
});

// Sparkle positions below text
const getRandomPosition = (index) => {
  const top = 40 + Math.random() * 60 + "%"; // only lower 60% of card
  const left = Math.random() * 100 + "%";
  const size = Math.random() * 4 + 1 + "px";
  const delay = Math.random() * 2 + "s";
  const duration = Math.random() * 2 + 1.5 + "s";
  const opacity = Math.random() * 0.5 + 0.3;
  return { top, left, width: size, height: size, animationDelay: delay, animationDuration: duration, opacity };
};

const formatText = (text) =>
  text ? text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : "";
</script>

<style scoped>
/* Coupon appear transition */
.fade-scale-enter-active { transition: all 0.4s ease; }
.fade-scale-leave-active { transition: all 0.3s ease; }
.fade-scale-enter-from { opacity: 0; transform: scale(0.95); }
.fade-scale-enter-to { opacity: 1; transform: scale(1); }
.fade-scale-leave-from { opacity: 1; transform: scale(1); }
.fade-scale-leave-to { opacity: 0; transform: scale(0.95); }

/* Sparkle animation */
@keyframes sparkle { 
  0% { opacity: 0; transform: scale(0); } 
  50% { opacity: 1; transform: scale(1.5); } 
  100% { opacity: 0; transform: scale(0); } 
}
.animate-sparkle { animation-name: sparkle; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }

/* Glow animation */
@keyframes glow {
  0%, 100% { transform: scale(1); opacity: 0.05; }
  50% { transform: scale(1.03); opacity: 0.15; }
}
.animate-glow { animation: glow 3s ease-in-out infinite; }
</style>
