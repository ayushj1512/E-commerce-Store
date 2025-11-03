<template>
  <section
    class="relative w-full overflow-hidden touch-pan-y select-none"
    style="padding-top: 46.92%;"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Slides Container -->
    <div
      class="absolute top-0 left-0 w-full h-full flex transition-transform duration-700 ease-in-out"
      :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
    >
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="w-full flex-shrink-0 h-full"
      >
        <img
          :src="slide"
          alt="Hero Image"
          class="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Navigation Arrows (Hidden on Mobile) -->
    <button
      @click="prevSlide"
      class="hidden sm:flex absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 z-20"
    >
      &#10094;
    </button>
    <button
      @click="nextSlide"
      class="hidden sm:flex absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 z-20"
    >
      &#10095;
    </button>

    <!-- Pagination Dots -->
    <div
      class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20"
    >
      <span
        v-for="(slide, index) in slides"
        :key="index"
        @click="goToSlide(index)"
        :class="[
          'w-3 h-3 rounded-full cursor-pointer',
          currentSlide === index ? 'bg-white' : 'bg-gray-400'
        ]"
      ></span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const slides = ref(["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg"]);

const currentSlide = ref(0);
let slideInterval = null;

// Touch variables
let startX = 0;
let endX = 0;

// Autoplay
const startAutoplay = () => {
  slideInterval = setInterval(() => nextSlide(), 5000);
};

const stopAutoplay = () => {
  if (slideInterval) clearInterval(slideInterval);
};

// Navigation
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};
const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};
const goToSlide = (index) => {
  currentSlide.value = index;
};

// Touch handlers
const handleTouchStart = (e) => {
  stopAutoplay();
  startX = e.touches[0].clientX;
};

const handleTouchMove = (e) => {
  endX = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  const diff = startX - endX;
  const threshold = 50; // Minimum swipe distance in px
  if (Math.abs(diff) > threshold) {
    if (diff > 0) nextSlide(); // swipe left
    else prevSlide(); // swipe right
  }
  startAutoplay();
};

onMounted(() => {
  startAutoplay();
});

onBeforeUnmount(() => {
  clearInterval(slideInterval);
});
</script>

<style scoped>
/* Optional: Prevent double-tap zoom and select */
section {
  -webkit-user-drag: none;
  -webkit-tap-highlight-color: transparent;
}
</style>
