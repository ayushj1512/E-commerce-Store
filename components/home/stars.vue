<script setup>
import { storeToRefs } from "pinia";
import { useHomeStore } from "@/stores/homeStore";
import VideoCard from "@/components/common/VideoCard.vue";
import { useRouter } from "vue-router";

// ✅ Access Pinia store
const homeStore = useHomeStore();
const { sliderList, loading, error } = storeToRefs(homeStore);

// ✅ Vue Router instance
const router = useRouter();

// ✅ Run fetch on server during SSR
await useAsyncData("lookMenu", () => homeStore.fetchSlider("look_menu"));

// ✅ Function to handle video card click
function handleCardClick(item) {
  if (!item?.link) return;

  // Check if it's an external link
  if (item.link.startsWith("http") || item.link.startsWith("https")) {
    window.open(item.link, "_blank");
  } else {
    router.push(item.link);
  }
}
</script>

<template>
  <section class="pb-6 bg-white">
    <!-- Full width black heading -->
    <div class="w-full bg-black py-3 mb-4">
      <h2 class="text-white text-center text-lg sm:text-xl md:text-2xl font-bold">
        STREET STYLE HIGHLIGHTS
      </h2>
    </div>

    <!-- Loading / Error -->
    <div v-if="loading" class="text-center text-gray-500 py-6">
      Loading videos...
    </div>
    <div v-else-if="error" class="text-center text-red-500 py-6">
      {{ error }}
    </div>

    <!-- Video Scroll -->
    <div v-else class="overflow-x-auto px-4 pb-4 flex gap-4 scrollbar-hide">
      <VideoCard
        v-for="item in sliderList"
        :key="item.id"
        :title="item.name"
        :videoUrl="item.img"
        class="flex-shrink-0 w-64 sm:w-72 md:w-80 cursor-pointer"
        @click="handleCardClick(item)"
      />
    </div>
  </section>
</template>

<style scoped>
/* Hide horizontal scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
  scroll-behavior: smooth;
}
</style>
