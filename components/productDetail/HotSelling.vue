<template>
  <div class="mt-6">
<h3 class="text-xl md:text-2xl font-bold mb-4 text-black relative inline-block">
 Recommended Bundles
  <span class="absolute left-0 bottom-0 w-12 h-1 bg-gray-500 rounded-full"></span>
</h3>


    <!-- Loading -->
    <div v-if="loading" class="flex gap-4 overflow-x-auto py-2">
      <div v-for="n in 6" :key="n" class="flex-shrink-0 w-48 h-60 bg-gray-200 rounded-xl animate-pulse"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

    <!-- Hot Items -->
    <div v-else class="flex gap-4 overflow-x-auto py-2">
      <div
        v-for="item in hotItems"
        :key="item.product_id"
        class="flex-shrink-0 w-48 bg-white shadow rounded-xl p-3 transition hover:shadow-lg hover:-translate-y-1 cursor-pointer"
        @click="goToProduct(item.product_url)"
      >
        <div class="relative w-full h-48">
          <img
            :src="item.hover && item.alternate_img ? item.alternate_img : item.img"
            alt="Item Image"
            class="w-full h-full object-contain rounded-lg transition duration-300"
            @mouseover="item.hover = true"
            @mouseleave="item.hover = false"
          />
        </div>
        <p class="text-sm font-medium mt-2">{{ item.name }}</p>
        <p class="text-lg font-semibold mt-1">₹{{ item.selling_price }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ofetch } from "ofetch";

const hotItems = ref([]);
const loading = ref(true);
const error = ref(null);
const router = useRouter();

const HOT_ITEMS_API =
  "https://api.streetstylestore.com/collections/sss_config/documents/sss-product-clr-items?a=1&x-typesense-api-key=F5gdSFxpg6bi8ZXfuybIsQy074HtBDkC";

async function fetchHotItems() {
  loading.value = true;
  error.value = null;

  try {
    const res = await ofetch(HOT_ITEMS_API);

    // Parse the 'data' string from the response
    const dataStr = res.data;
    if (!dataStr) throw new Error("No data field in API response");

    const dataArr = JSON.parse(dataStr);
    if (!Array.isArray(dataArr)) throw new Error("Parsed data is not an array");

    hotItems.value = dataArr.map(item => ({ ...item, hover: false }));
  } catch (err) {
    console.error("[HotSelling] Failed to fetch hot items:", err);
    error.value = "Failed to load hot selling items.";
  } finally {
    loading.value = false;
  }
}

function goToProduct(url) {
  router.push(url);
}

onMounted(fetchHotItems);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
