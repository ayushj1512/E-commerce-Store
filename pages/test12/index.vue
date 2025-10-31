<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow space-y-8">
    <h1 class="text-2xl font-bold text-gray-800">💳 Payment Options Test</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500">Loading payment options...</div>

    <!-- Error -->
    <div v-else-if="error" class="text-red-500 font-medium">
      {{ error }}
    </div>

    <!-- Payment Options -->
    <div v-else>
      <div
        v-for="(option, key) in paymentOptions"
        :key="key"
        class="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition"
      >
        <h2 class="text-lg font-semibold mb-3">{{ option.name }}</h2>

        <!-- Show options with images -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div
            v-for="(imgOpt, idx) in option.optionWithImage"
            :key="idx"
            class="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            <img
              v-if="imgOpt.cardImg"
              :src="imgOpt.cardImg"
              :alt="imgOpt.cardName"
              class="h-10 object-contain mb-2"
            />
            <p class="text-sm text-gray-700 text-center font-medium">
              {{ imgOpt.cardName }}
            </p>
          </div>
        </div>

        <!-- Show options without images -->
        <div
          v-if="option.option && option.option.length > 0"
          class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
        >
          <div
            v-for="(opt, idx) in option.option"
            :key="idx"
            class="border border-gray-300 rounded-lg p-2 text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            {{ opt.cardName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const loading = ref(true);
const error = ref(null);
const paymentOptions = ref({});

onMounted(async () => {
  try {
    const res = await fetch(
      "https://api.streetstylestore.com/collections/sss_config/documents/paymentoption?a=1&x-typesense-api-key=F5gdSFxpg6bi8ZXfuybIsQy074HtBDkC"
    );
    const json = await res.json();

    // Parse the nested JSON string inside "data"
    paymentOptions.value = JSON.parse(json.data);

  } catch (err) {
    console.error("Error fetching payment options:", err);
    error.value = "Failed to load payment options.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Optional hover effects for cards */
img {
  transition: transform 0.2s ease;
}
img:hover {
  transform: scale(1.05);
}
</style>
