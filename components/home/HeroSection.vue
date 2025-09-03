<template>
  <section class="relative w-full overflow-hidden" style="padding-top: 46.92%;">
    <!-- Slides Container -->
    <div
      class="absolute top-0 left-0 w-full h-full flex transition-transform duration-700"
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
        />
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button
      @click="prevSlide"
      class="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 z-20"
    >
      &#10094;
    </button>
    <button
      @click="nextSlide"
      class="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 z-20"
    >
      &#10095;
    </button>

    <!-- Pagination Dots -->
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
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

const slides = ref([
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
  "/4.jpg",
]);

const currentSlide = ref(0);
let slideInterval = null;

// Autoplay
const startAutoplay = () => {
  slideInterval = setInterval(() => nextSlide(), 5000);
};

// Navigation
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};
const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};
const goToSlide = (index) => {
  currentSlide.value = index;
};

onMounted(() => {
  startAutoplay();
});

onBeforeUnmount(() => {
  clearInterval(slideInterval);
});
</script>

<style scoped>
/* Smooth swipe transition handled by Tailwind */
</style>
