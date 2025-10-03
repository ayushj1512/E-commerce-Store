<template>
  <div class="flex flex-col items-center justify-center px-4 sm:px-6">
    <transition name="fade-scale">
      <div
        v-if="voucher"
        class="relative w-full max-w-md sm:max-w-xl rounded-xl overflow-hidden shadow-2xl border border-white transform transition-all duration-500 hover:scale-105 px-4 sm:px-8 py-4 sm:py-6"
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

        <!-- Soft glow behind the card -->
        <div class="absolute inset-0 rounded-xl bg-white opacity-5 blur-3xl animate-glow"></div>

        <!-- Coupon text -->
        <div class="flex flex-col items-center justify-center text-center z-10 text-white font-bold text-lg sm:text-xl uppercase tracking-wide relative">
          {{ voucher.category_name }}
        </div>

        <!-- Sparkles (appear only below text on mobile) -->
        <div class="absolute bottom-0 left-0 w-full h-2/3 pointer-events-none overflow-hidden">
          <span 
            v-for="i in sparkles"
            :key="i"
            class="absolute bg-white rounded-full animate-sparkle"
            :style="getRandomPosition(i)">
          </span>
        </div>

        <!-- Side circular cutouts -->
        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-transparent rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-4 sm:-ml-5"></div>
        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-transparent rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-4 sm:-mr-5"></div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { ofetch } from "ofetch";

const props = defineProps({
  categoryId: { type: [String, Number], required: true }
});

const voucher = ref(null);

const fetchVoucher = async () => {
  try {
    const res = await ofetch(
      "https://api.streetstylestore.com/collections/sss_config/documents/voucher-listing?a=1&x-typesense-api-key=F5gdSFxpg6bi8ZXfuybIsQy074HtBDkC"
    );
    const data = JSON.parse(res.data || "[]");
    voucher.value = data.find(v => Number(v.id_category) === Number(props.categoryId)) || null;
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchVoucher);
watch(() => props.categoryId, fetchVoucher);

// Sparkle positions (appear below text)
const sparkles = 25; // reduced for mobile
const getRandomPosition = (index) => {
  const top = 40 + Math.random() * 60 + '%'; // lower 60% only
  const left = Math.random() * 100 + '%';
  const size = Math.random() * 4 + 1 + 'px';
  const delay = Math.random() * 2 + 's';
  const duration = Math.random() * 2 + 1.5 + 's';
  const opacity = Math.random() * 0.5 + 0.3;
  return { top, left, width: size, height: size, animationDelay: delay, animationDuration: duration, opacity };
};

// Format text helper (if needed)
const formatText = (text) =>
  text ? text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : "";

// Background gradient
const backgroundStyle = ref({
  background: "radial-gradient(circle at top left, #111 0%, #000 100%)"
});
</script>

<style scoped>
/* Fade-scale transition */
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
