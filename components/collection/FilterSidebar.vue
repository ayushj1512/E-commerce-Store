<template>
  <div class="flex flex-col md:flex-row gap-6">
    <!-- Sidebar -->
    <aside
      class="w-full md:w-1/5 bg-white shadow-xl rounded-xl md:rounded-none
             flex flex-wrap md:flex-col gap-4 p-4 sm:p-6 relative mt-16 md:mt-0 z-10"
    >
      <!-- Category Filter -->
      <div class="flex-1 min-w-[200px]">
        <h3 class="font-semibold text-black mb-2 sm:mb-3">Category</h3>
        <div class="flex flex-wrap md:flex-col gap-2">
          <label
            v-for="category in categories"
            :key="category"
            class="flex items-center space-x-2 cursor-pointer hover:text-gray-800 transition text-sm sm:text-base"
          >
            <input
              type="checkbox"
              v-model="selectedCategories"
              :value="category"
              class="form-checkbox text-black accent-black"
            />
            <span>{{ category }}</span>
          </label>
        </div>
      </div>

      <!-- Size Filter -->
      <div class="flex-1 min-w-[180px]">
        <h3 class="font-semibold text-black mb-2 sm:mb-3">Size</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="size in sizes"
            :key="size"
            @click="toggleSize(size)"
            :class="[
              'px-3 sm:px-4 py-1 rounded-full border font-medium transition text-sm sm:text-base',
              selectedSizes.includes(size)
                ? 'bg-black text-white border-black shadow-md'
                : 'bg-white text-black border-gray-300 hover:bg-gray-100'
            ]"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <!-- Price Filter -->
      <div class="flex-1 min-w-[200px]">
        <h3 class="font-semibold text-black mb-2 sm:mb-3">Price</h3>
        <input
          type="range"
          min="0"
          max="5000"
          step="50"
          v-model="priceRange"
          class="w-full accent-black"
        />
        <div class="flex justify-between text-xs sm:text-sm text-gray-600 mt-1">
          <span>₹0</span>
          <span>₹{{ priceRange }}</span>
        </div>
      </div>

      <!-- Brand Filter -->
      <div class="flex-1 min-w-[200px]">
        <h3 class="font-semibold text-black mb-2 sm:mb-3">Brand</h3>
        <div class="flex flex-wrap md:flex-col gap-2">
          <label
            v-for="brand in brands"
            :key="brand"
            class="flex items-center space-x-2 cursor-pointer hover:text-gray-800 transition text-sm sm:text-base"
          >
            <input
              type="checkbox"
              v-model="selectedBrands"
              :value="brand"
              class="form-checkbox text-black accent-black"
            />
            <span>{{ brand }}</span>
          </label>
        </div>
      </div>

      <!-- Apply / Reset Buttons -->
      <div class="flex-1 min-w-[200px] flex flex-col md:flex-row md:gap-3 mt-auto">
        <button
          @click="resetFilters"
          class="py-2 px-4 border border-gray-300 rounded-full hover:bg-gray-100 transition font-medium text-black text-sm sm:text-base"
        >
          Reset
        </button>
        <button
          @click="applyFilters"
          class="py-2 px-4 bg-black text-white rounded-full hover:bg-gray-800 transition font-medium shadow-md text-sm sm:text-base mt-2 md:mt-0"
        >
          Apply
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from "vue";

const categories = ["T-Shirts", "Hoodies", "Jeans", "Jackets"];
const sizes = ["S", "M", "L", "XL", "XXL"];
const brands = ["Nike", "Adidas", "Puma", "Reebok"];

const selectedCategories = ref([]);
const selectedSizes = ref([]);
const selectedBrands = ref([]);
const priceRange = ref(2500);

const toggleSize = (size) => {
  if (selectedSizes.value.includes(size)) {
    selectedSizes.value = selectedSizes.value.filter((s) => s !== size);
  } else {
    selectedSizes.value.push(size);
  }
};

const applyFilters = () => {
  console.log("Selected Categories:", selectedCategories.value);
  console.log("Selected Sizes:", selectedSizes.value);
  console.log("Selected Brands:", selectedBrands.value);
  console.log("Max Price:", priceRange.value);
};

const resetFilters = () => {
  selectedCategories.value = [];
  selectedSizes.value = [];
  selectedBrands.value = [];
  priceRange.value = 2500;
};
</script>

<style scoped>
/* Only keep vertical scrollbar on desktop */
aside {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
}
aside::-webkit-scrollbar {
  width: 6px;
}
aside::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}
</style>
