<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import VideoCard from "@/components/common/VideoCard.vue";

const apiUrl =
  "https://api.streetstylestore.com/collections/sss_config/documents/slider?a=1&x-typesense-api-key=Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx";

const lookMenu = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchLookMenu = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(apiUrl);
    const dataString = response.data.data;
    const parsedData = JSON.parse(dataString);
    lookMenu.value = parsedData.look_menu || [];
  } catch (err) {
    console.error(err);
    error.value = "Failed to fetch videos.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchLookMenu);
</script>

<template>
  <section class="py-6 bg-white">
    <!-- Full width black heading -->
    <div class="w-full bg-black py-3 mb-4">
      <h2
        class="text-white text-center text-lg sm:text-xl md:text-2xl font-bold"
      >
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
        v-for="item in lookMenu"
        :key="item.id"
        :title="item.name"
        :videoUrl="item.img"
        class="flex-shrink-0 w-64 sm:w-72 md:w-80"
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
