<template>
  <div class="overflow-hidden w-full bg-white py-4">
    <!-- Render only on client to avoid SSR hydration mismatch -->
    <div
      v-if="mounted"
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
import { ref, onMounted, nextTick } from "vue";

const headlineWrapper = ref(null);
const animationDuration = ref(20);
const repeatCount = ref(20);
const mounted = ref(false);

const adjustRepeatCount = () => {
  const width = window.innerWidth;
  if (width < 640) repeatCount.value = 12; // mobile
  else if (width < 1024) repeatCount.value = 16; // tablet
  else repeatCount.value = 20; // desktop
};

onMounted(async () => {
  mounted.value = true; // ensure rendering happens only on client
  adjustRepeatCount();
  window.addEventListener("resize", adjustRepeatCount);

  // Wait for DOM to render
  await nextTick();

  if (headlineWrapper.value) {
    const wrapperWidth = headlineWrapper.value.offsetWidth;
    animationDuration.value = Math.max(wrapperWidth / 100, 20);
  }
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
  100% { transform: translateX(-100%); } /* scroll full width */
}

.animate-scroll {
  display: inline-flex;
  animation: scroll linear infinite;
  animation-timing-function: linear;
}
</style>
