<template>
  <div class="w-full bg-black text-white overflow-hidden relative shadow-lg">
    <div class="relative flex items-center justify-center h-10 sm:h-12 md:h-14 lg:h-16">
      <transition-group
        name="slide-fade"
        tag="div"
        class="absolute w-full flex justify-center items-center"
      >
        <p
          v-for="(item, index) in [items[currentIndex]]"
          :key="index"
          class="text-xs sm:text-sm md:text-base lg:text-lg font-semibold px-4 sm:px-6 md:px-8 py-1 rounded-md hover:scale-105 transition-transform duration-300 bg-white bg-opacity-10 backdrop-blur-sm cursor-pointer text-center"
        >
          {{ item }}
        </p>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Offers / trending messages
const items = [
  "🎉 Flat 20% off on first order! Use code FIRST20",
  "🔥 Trending: 'Streetwear Essentials' collection live now",
  "🚀 Free delivery on orders above ₹199",
  "💡 Quote of the day: 'Style is a way to say who you are without speaking.'",
  "🌟 New arrivals: Check out the latest accessories!",
];

const currentIndex = ref(0);
let interval = null;

// Auto-cycle messages every 4s
const startTicker = () => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % items.length;
  }, 4000);
};

onMounted(startTicker);
onUnmounted(() => clearInterval(interval));
</script>

<style scoped>
/* Fade + vertical slide animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.8s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-20%);
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20%);
}
</style>
