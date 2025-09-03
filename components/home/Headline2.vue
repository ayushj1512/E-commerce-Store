<template>
  <div class="overflow-hidden w-full bg-white py-4">
    <div
      class="flex whitespace-nowrap animate-scroll"
      :style="{ animationDuration: animationDuration + 's' }"
      ref="headlineWrapper"
    >
      <span
        v-for="n in repeatCount"
        :key="n"
        class="inline-block text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bebas mr-8 sm:mr-12 md:mr-16"
      >
        STREET STYLE HIGHLIGHTS
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const headlineWrapper = ref(null);
const animationDuration = ref(20);
const repeatCount = ref(20);

const adjustRepeatCount = () => {
  const width = window.innerWidth;
  if (width < 640) repeatCount.value = 12; // mobile
  else if (width < 1024) repeatCount.value = 16; // tablet
  else repeatCount.value = 20; // desktop
};

onMounted(() => {
  adjustRepeatCount();
  window.addEventListener("resize", adjustRepeatCount);
  const wrapperWidth = headlineWrapper.value.offsetWidth;
  animationDuration.value = Math.max(wrapperWidth / 100, 20);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

.font-bebas {
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 1px;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-scroll {
  display: inline-flex;
  animation: scroll linear infinite;
  animation-timing-function: linear;
}
</style>
