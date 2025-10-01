<template>
  <aside
    class="bg-white text-black w-full md:w-72 p-5 rounded-xl shadow-lg overflow-y-auto transition-all duration-300"
    style="max-width:22rem"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold">Filters</h3>
      <X
        @click="onClose"
        class="w-6 h-6 md:w-5 md:h-5 cursor-pointer text-gray-600 hover:text-black"
      />
    </div>

    <!-- Popular Tags -->
    <div v-if="popularTagOptions.length" class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <h4 class="font-medium text-sm">Popular Tags</h4>
        <RotateCw
          @click="selectedTagsLocal = []"
          class="w-5 h-5 md:w-4 md:h-4 cursor-pointer text-gray-500 hover:text-black"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in popularTagOptions"
          :key="`pop-${tag}`"
          @click="toggleTag(tag)"
          :class="[
            selectedTagsLocal.includes(tag)
              ? 'bg-black text-white scale-105 shadow-md'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
            'px-3 py-1 rounded-full border text-sm transition-all'
          ]"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- Sizes -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <h4 class="font-medium text-sm">Sizes</h4>
        <RotateCw
          @click="clearSizes"
          class="w-5 h-5 md:w-4 md:h-4 cursor-pointer text-gray-500 hover:text-black"
        />
      </div>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="size in sizeOptions"
          :key="size"
          @click="toggleSize(size)"
          :class="[
            selectedSizesLocal.includes(size)
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-gray-300',
            'px-3 py-1 rounded-full text-sm border transition-all'
          ]"
        >
          {{ size }}
        </button>
      </div>
    </div>

    <!-- Price Range -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-2">
        <h4 class="font-medium text-sm">Price</h4>
        <RotateCw
          @click="resetPrice"
          class="w-5 h-5 md:w-4 md:h-4 cursor-pointer text-gray-500 hover:text-black"
        />
      </div>

      <!-- Price Display -->
      <div class="text-sm mb-4 flex justify-between text-gray-800 font-medium">
        <span>₹{{ priceRangeLocal[0] }}</span>
        <span>₹{{ priceRangeLocal[1] }}</span>
      </div>

      <!-- Dual Range Slider -->
      <div class="relative h-3">
        <!-- Track -->
        <div class="absolute h-3 w-full bg-gray-300 rounded-full"></div>

        <!-- Filled Range -->
        <div
          class="absolute h-3 bg-black rounded-full"
          :style="{
            left: ((priceRangeLocal[0] - priceMin)/(priceMax - priceMin)) * 100 + '%',
            width: ((priceRangeLocal[1] - priceRangeLocal[0]) / (priceMax - priceMin)) * 100 + '%'
          }"
        ></div>

        <!-- Min Slider -->
        <input
          type="range"
          :min="priceMin"
          :max="priceMax"
          v-model.number="priceRangeLocal[0]"
          @input="handleMinPrice"
          class="absolute w-full h-3 top-0 bg-transparent pointer-events-auto appearance-none"
        />
        <!-- Max Slider -->
        <input
          type="range"
          :min="priceMin"
          :max="priceMax"
          v-model.number="priceRangeLocal[1]"
          @input="handleMaxPrice"
          class="absolute w-full h-3 top-0 bg-transparent pointer-events-auto appearance-none"
        />
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex flex-col md:flex-row gap-3">
      <button
        @click="clearAll"
        class="flex-1 border border-gray-300 rounded py-2 px-3 text-sm hover:bg-gray-100 flex items-center justify-center gap-1"
      >
        <RotateCw class="w-4 h-4" /> Clear All
      </button>
      <button
        @click="onApply"
        class="flex-1 bg-black text-white rounded py-2 px-3 text-sm hover:bg-gray-800 flex items-center justify-center gap-1"
      >
        Apply <Check class="w-4 h-4" />
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { X, RotateCw, Check } from "lucide-vue-next";

const props = defineProps({
  items: { type: Array, default: () => [] },
  selectedTags: { type: Array, default: () => [] },
  selectedSizes: { type: Array, default: () => [] },
});

const emit = defineEmits([
  "update:selectedTags",
  "update:selectedSizes",
  "update:filtered",
  "applyFilters",
  "close",
]);

// =======================
// Local State
// =======================
const selectedTagsLocal = ref([...props.selectedTags]);
const selectedSizesLocal = ref([...props.selectedSizes]);

watch(
  () => props.selectedTags,
  (v) => (selectedTagsLocal.value = [...v]),
  { deep: true }
);
watch(
  () => props.selectedSizes,
  (v) => (selectedSizesLocal.value = [...v]),
  { deep: true }
);

// =======================
// Compute popular tags and size options
// =======================
const popularTagOptions = computed(() => {
  const freq = {};
  props.items.forEach((p) =>
    (p.tags || []).forEach((t) => t && (freq[t] = (freq[t] || 0) + 1))
  );
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map((e) => e[0]);
});

const sizeOptions = computed(() => {
  const s = new Set();
  props.items.forEach((p) =>
    (p.sizes || []).forEach((sz) => sz && s.add(sz))
  );
  return Array.from(s).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
});

// =======================
// Price range
// =======================
const priceMin = computed(() =>
  Math.floor(Math.min(...props.items.map((p) => p.price || 0)))
);
const priceMax = computed(() =>
  Math.ceil(Math.max(...props.items.map((p) => p.price || 0)))
);
const priceRangeLocal = ref([priceMin.value, priceMax.value]);

watch(() => props.items, () => {
  priceRangeLocal.value = [priceMin.value, priceMax.value];
});

// =======================
// Toggle functions
// =======================
function toggleTag(tag) {
  const idx = selectedTagsLocal.value.indexOf(tag);
  idx === -1
    ? selectedTagsLocal.value.push(tag)
    : selectedTagsLocal.value.splice(idx, 1);
}
function toggleSize(size) {
  const idx = selectedSizesLocal.value.indexOf(size);
  idx === -1
    ? selectedSizesLocal.value.push(size)
    : selectedSizesLocal.value.splice(idx, 1);
}
function clearSizes() {
  selectedSizesLocal.value = [];
}
function resetPrice() {
  priceRangeLocal.value = [priceMin.value, priceMax.value];
}
function clearAll() {
  selectedTagsLocal.value = [];
  selectedSizesLocal.value = [];
  priceRangeLocal.value = [priceMin.value, priceMax.value];
}

// =======================
// Slider Handlers
// =======================
function handleMinPrice() {
  if (priceRangeLocal.value[0] > priceRangeLocal.value[1]) {
    priceRangeLocal.value[0] = priceRangeLocal.value[1];
  }
}
function handleMaxPrice() {
  if (priceRangeLocal.value[1] < priceRangeLocal.value[0]) {
    priceRangeLocal.value[1] = priceRangeLocal.value[0];
  }
}

// =======================
// Filtered items computation
// =======================
const filteredItems = computed(() => {
  const tags = selectedTagsLocal.value;
  const sizes = selectedSizesLocal.value;
  const [minP, maxP] = priceRangeLocal.value;

  return props.items.filter((p) => {
    if (tags.length && !(p.tags || []).some((t) => tags.includes(t)))
      return false;
    if (sizes.length && !(p.sizes || []).some((s) => sizes.includes(s)))
      return false;
    const price = Number(p.price || 0);
    if (price < minP || price > maxP) return false;
    return true;
  });
});

watch(filteredItems, (val) => emit("update:filtered", val), { immediate: true });

// =======================
// Event Emitters
// =======================
function onApply() {
  emit("applyFilters");
}
function onClose() {
  emit("close");
}
</script>

<style scoped>
/* Scrollbar styling for all screens */
aside::-webkit-scrollbar {
  width: 8px;
}
aside::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 999px;
}

/* Range slider thumbs */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 9999px;
  background: #000;
  cursor: pointer;
  border: 2px solid #fff;
  margin-top: -6px;
}
input[type="range"]::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 9999px;
  background: #000;
  cursor: pointer;
  border: 2px solid #fff;
}
input[type="range"] {
  background: transparent;
}
</style>
