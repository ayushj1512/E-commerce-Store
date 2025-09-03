<template>
  <div class="w-full bg-black text-white overflow-hidden relative shadow-lg">
    <div class="relative flex items-center justify-center h-12 sm:h-14 md:h-14 lg:h-14 px-2 sm:px-4 md:px-6">
      <transition-group
        name="pop-fade"
        tag="div"
        class="absolute w-full flex justify-center items-center"
      >
        <p
          v-for="(item, index) in [items[currentIndex]]"
          :key="index"
          class="text-[10px] sm:text-xs md:text-sm lg:text-base font-medium px-3 sm:px-4 md:px-6 py-1 rounded-md bg-white bg-opacity-10 backdrop-blur-sm hover:scale-105 transition-transform duration-300 cursor-pointer text-center"
        >
          {{ item }}
        </p>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Messages to cycle through
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
/* Pop + fade animation */
.pop-fade-enter-active,
.pop-fade-leave-active {
  transition: all 0.7s ease;
}
.pop-fade-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(-5deg);
}
.pop-fade-enter-to {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}
.pop-fade-leave-from {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}
.pop-fade-leave-to {
  opacity: 0;
  transform: scale(0.8) rotate(5deg);
}
</style>
