<template>
  <div class="overflow-hidden">
    <!-- Heading -->
    <div class="text-center bg-black py-2 mb-8">
      <h3 class="inline-block px-6 py-2 text-2xl md:text-3xl font-bold text-white rounded">
       STRAIGHT FROM OUR FEED
      </h3>
    </div>

    <!-- Loading Shimmer -->
    <div v-if="loading" class="flex gap-4 sm:gap-6 overflow-x-auto px-4 md:px-12">
      <div
        v-for="n in 6"
        :key="n"
        class="flex-shrink-0 w-[140px] sm:w-[180px] md:w-[220px] relative rounded-xl overflow-hidden"
      >
        <div class="relative w-full aspect-[9/16] bg-gray-200 animate-pulse"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="images.length === 0" class="text-center text-gray-500 py-10">
      No images available right now.
    </div>

    <!-- Smooth Infinite Ticker -->
    <div v-else class="relative w-full overflow-hidden">
      <div
        class="flex gap-4 sm:gap-6 animate-marquee"
        :class="{'group-hover:[animation-play-state:paused]': !isMobile}"
        :style="{ '--marquee-duration': marqueeDuration + 's' }"
      >
        <!-- duplicate loop for infinite effect -->
        <div
          v-for="(item, index) in doubledImages"
          :key="index"
          class="flex-shrink-0 w-[140px] sm:w-[180px] md:w-[220px] relative rounded-xl overflow-hidden shadow cursor-pointer"
          @click="handleClick(item.link)"
        >
          <!-- Aspect Ratio 9:16 -->
          <div class="relative w-full aspect-[9/16] bg-gray-200">
            <img
              v-if="item.img"
              :src="item.img"
              alt="Instagram Post"
              class="absolute inset-0 w-full h-full object-cover transform transition duration-300"
              :class="{'hover:scale-105': !isMobile}"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { ofetch } from "ofetch";

const images = ref([]);
const loading = ref(true);
const doubledImages = ref([]);
const marqueeDuration = 40; // bigger = slower scroll

// Detect if mobile
const isMobile = computed(() => window.innerWidth < 768);

const API_URL =
  "https://api.streetstylestore.com/collections/sss_config/documents/slider?a=1";
const API_KEY = "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx";

const fetchInstaImages = async () => {
  try {
    const res = await ofetch(API_URL, {
      headers: {
        "x-typesense-api-key": API_KEY,
      },
    });

    if (res?.data) {
      const parsed = JSON.parse(res.data);
      images.value = parsed.instagram_images || [];
      doubledImages.value = [...images.value, ...images.value]; // repeat images for infinite loop
    }
  } catch (err) {
    console.error("❌ Error fetching Instagram images:", err);
  } finally {
    loading.value = false;
  }
};

// Click handler for mobile / all devices
const handleClick = (link) => {
  window.open(link, "_blank");
};

onMounted(fetchInstaImages);
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
