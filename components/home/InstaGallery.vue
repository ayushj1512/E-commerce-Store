<template>
  <!-- ✅ Show only if images exist or are loading -->
  <div v-if="homeStore.instaLoading || homeStore.instaImages.length > 0" class="overflow-hidden">
    <!-- Heading -->
    <div class="text-center bg-black py-2 mb-8">
      <h3 class="inline-block px-6 py-2 text-2xl md:text-3xl font-bold text-white rounded">
        STRAIGHT FROM OUR FEED
      </h3>
    </div>

    <!-- Loading Shimmer -->
    <div v-if="homeStore.instaLoading" class="flex gap-4 sm:gap-6 overflow-x-auto px-4 md:px-12">
      <div
        v-for="n in 6"
        :key="n"
        class="flex-shrink-0 w-[140px] sm:w-[180px] md:w-[220px] relative rounded-xl overflow-hidden"
      >
        <div class="relative w-full aspect-[9/16] bg-gray-200 animate-pulse"></div>
      </div>
    </div>

    <!-- Infinite Ticker -->
    <div v-else class="relative w-full overflow-hidden">
      <div
        class="flex gap-4 sm:gap-6 animate-marquee"
        :class="{ 'group-hover:[animation-play-state:paused]': !isMobile }"
        :style="{ '--marquee-duration': marqueeDuration + 's' }"
      >
        <div
          v-for="(item, index) in homeStore.doubledImages"
          :key="index"
          class="flex-shrink-0 w-[140px] sm:w-[180px] md:w-[220px] relative rounded-xl overflow-hidden shadow cursor-pointer"
          @click="handleClick(item.link)"
        >
          <div class="relative w-full aspect-[9/16] bg-gray-200">
            <img
              v-if="item.img"
              :src="item.img"
              alt="Instagram Post"
              class="absolute inset-0 w-full h-full object-cover transform transition duration-300"
              :class="{ 'hover:scale-105': !isMobile }"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useHomeStore } from '@/stores/homeStore'

const homeStore = useHomeStore()
const marqueeDuration = 40

const isMobile = ref(false)
onMounted(() => {
  isMobile.value = window.innerWidth < 768
})

// ⚡ SSR-safe fetch (for server-side rendering)
if (homeStore.instaImages.length === 0 && import.meta.server) {
  await homeStore.fetchInstagramFeed()
}

// 🖼️ Client-side fetch fallback
onMounted(async () => {
  if (homeStore.instaImages.length === 0) {
    await homeStore.fetchInstagramFeed()
  }
})

// 🔗 Open Instagram link
const handleClick = (link) => {
  if (link) window.open(link, '_blank')
}
</script>

<style>
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}
.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee var(--marquee-duration, 40s) linear infinite;
}
</style>
