<template>
  <div v-if="filteredSizes.length" class="w-full">
    <!-- Header: Sizes + Size Guide -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-semibold text-sm sm:text-base text-gray-800">
        Available Sizes:
      </h3>
      <button
        v-if="customSizeChart"
        @click="$emit('open-size-chart')"
        class="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium hover:border-black hover:text-black hover:bg-gray-100 transition-all"
      >
        <Ruler class="w-4 h-4 sm:w-5 sm:h-5" /> Size Guide
      </button>
    </div>

    <!-- Size Buttons -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="(size, idx) in filteredSizes"
        :key="idx"
        @click="$emit('select-size', size)"
        :class="[
          'px-3 py-2 sm:px-4 sm:py-2 border rounded-full text-sm sm:text-base transition transform hover:scale-105 active:scale-95',
          selectedSize === size
            ? 'bg-black text-white border-black shadow-sm'
            : 'bg-white text-gray-800 border-gray-300 hover:border-black hover:bg-gray-50'
        ]"
      >
        {{ size }}
      </button>
    </div>

    <!-- Size Guide Modal -->
    <transition name="fade">
      <div
        v-if="showSizeChart && customSizeChart"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6"
      >
        <div
          class="bg-white rounded-xl w-full max-w-lg sm:max-w-3xl shadow-xl overflow-hidden flex flex-col max-h-screen"
        >
          <!-- Modal Header -->
          <div class="flex justify-between items-center p-4 border-b">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Size Guide</h2>
            <button
              @click="$emit('close-size-chart')"
              class="text-gray-600 hover:text-black text-xl sm:text-2xl"
            >
              ✕
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-4 sm:p-6 overflow-y-auto">
            <table class="w-full border border-gray-200 text-sm sm:text-base">
              <thead>
                <tr class="bg-gray-100 text-left">
                  <th
                    v-for="(col, i) in customSizeChart.header"
                    :key="i"
                    class="px-3 sm:px-4 py-2 border-b border-gray-200 font-medium"
                  >
                    {{ col }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, idx) in customSizeChart.tableBody"
                  :key="idx"
                  class="hover:bg-gray-50"
                >
                  <td
                    v-for="(cell, j) in row"
                    :key="j"
                    class="px-3 sm:px-4 py-2 border-b border-gray-100"
                  >
                    {{ cell }}
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Bottom Notes -->
            <div
              v-if="customSizeChart.bottomRow?.length"
              class="mt-6 space-y-3 text-sm sm:text-base text-gray-600"
            >
              <div v-for="(note, i) in customSizeChart.bottomRow" :key="i">
                <p class="font-medium">{{ note.title }}</p>
                <p v-html="note.description"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Ruler } from "lucide-vue-next";

const props = defineProps({
  sizes: { type: Array, default: () => [] },
  selectedSize: String,
  showSizeChart: Boolean,
  customSizeChart: Object,
});

defineEmits(["select-size", "open-size-chart", "close-size-chart"]);

// ✅ Filter logic for numeric and extended alphanumeric sizes
const filteredSizes = computed(() => {
  if (!props.sizes?.length) return [];

  // Normalize and clean sizes
  const cleanSizes = props.sizes
    .map((s) => String(s).trim().toUpperCase())
    .filter(Boolean);

  // Separate numeric (e.g., 36, 38.5) and alphanumeric (e.g., XS, S, M, L, XL, 2XL, 3XL, ONE SIZE)
  const numericSizes = cleanSizes.filter((s) => /^\d+(\.\d+)?$/.test(s));
  const alphaSizes = cleanSizes.filter((s) =>
    /^(XXS|XS|S|M|L|XL|XXL|XXXL|XXXXL|2XS|2XL|3XL|4XL|5XL|ONESIZE|ONE SIZE|FREE SIZE)$/i.test(s)
  );

  // Sort numeric ascending
  const sortedNumeric = numericSizes.sort((a, b) => Number(a) - Number(b));

  // Sort alphabetic based on standard order
  const order = [
    "XXS",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "2XL",
    "XXL",
    "3XL",
    "XXXL",
    "4XL",
    "XXXXL",
    "5XL",
    "ONESIZE",
    "ONE SIZE",
    "FREE SIZE",
  ];
  const sortedAlpha = alphaSizes.sort((a, b) => order.indexOf(a) - order.indexOf(b));

  // Prefer numeric first if exists, then alpha
  if (sortedNumeric.length > 0) return sortedNumeric;
  if (sortedAlpha.length > 0) return sortedAlpha;

  return cleanSizes; // fallback for any unexpected formats
});
</script>
