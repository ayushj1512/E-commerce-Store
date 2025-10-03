<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center p-6">
    <h1 class="text-3xl font-bold mb-12 text-center text-black">Voucher / Coupon Preview</h1>

    <!-- Coupon -->
    <transition name="fade-scale">
      <div
        v-if="voucher"
        class="relative w-full max-w-md rounded-xl overflow-hidden shadow-2xl border border-white transform transition-all duration-500 hover:scale-105 hover:shadow-2xl px-8 py-6"
        style="background: radial-gradient(circle at top left, #111 0%, #000 100%);"
      >
        <!-- Top striped border (thinner) -->
        <div
          class="absolute top-0 left-0 w-full"
          style="height: 10px; background: repeating-linear-gradient(45deg, #fff, #fff 4px, #000 4px, #000 8px);"
        ></div>

        <!-- Bottom striped border (thinner) -->
        <div
          class="absolute bottom-0 left-0 w-full"
          style="height: 10px; background: repeating-linear-gradient(45deg, #fff, #fff 4px, #000 4px, #000 8px);"
        ></div>

        <!-- Soft glow behind the card -->
        <div class="absolute inset-0 rounded-xl bg-white opacity-5 blur-3xl animate-glow"></div>

        <!-- Coupon content -->
        <div class="flex flex-col items-center justify-center text-center z-10 text-white">
          <h2 class="text-xl font-bold uppercase tracking-wider animate-pop relative">
            {{ voucher.category_name }}
          </h2>
        </div>

        <!-- Sparkles -->
        <div class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <span 
            v-for="i in 60" 
            :key="i" 
            class="absolute bg-white rounded-full animate-sparkle" 
            :style="getRandomPosition(i)">
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";

const voucher = ref({
  category_name: "Category 1 Voucher"
});

// Sparkle positions and variations
const getRandomPosition = (index) => {
  const top = Math.random() * 100 + '%';
  const left = Math.random() * 100 + '%';
  const size = Math.random() * 5 + 1 + 'px';
  const delay = Math.random() * 2 + 's';
  const duration = Math.random() * 2 + 1.5 + 's';
  const opacity = Math.random() * 0.6 + 0.4;
  return { top, left, width: size, height: size, animationDelay: delay, animationDuration: duration, opacity };
};
</script>

<style scoped>
/* Coupon appear transition */
.fade-scale-enter-active { transition: all 0.4s ease; }
.fade-scale-leave-active { transition: all 0.3s ease; }
.fade-scale-enter-from { opacity: 0; transform: scale(0.95); }
.fade-scale-enter-to { opacity: 1; transform: scale(1); }
.fade-scale-leave-from { opacity: 1; transform: scale(1); }
.fade-scale-leave-to { opacity: 0; transform: scale(0.95); }

/* Pop animation for text */
@keyframes pop { 
  0% { transform: scale(0.95); opacity: 0; } 
  50% { transform: scale(1.05); opacity: 1; } 
  100% { transform: scale(1); opacity: 1; } 
}
.animate-pop { animation: pop 0.6s ease-out; }

/* Sparkle animation */
@keyframes sparkle { 
  0% { opacity: 0; transform: scale(0); } 
  50% { opacity: 1; transform: scale(1.5); } 
  100% { opacity: 0; transform: scale(0); } 
}
.animate-sparkle { animation-name: sparkle; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }

/* Glow animation behind card */
@keyframes glow {
  0%, 100% { transform: scale(1); opacity: 0.05; }
  50% { transform: scale(1.03); opacity: 0.15; }
}
.animate-glow { animation: glow 3s ease-in-out infinite; }
</style>
