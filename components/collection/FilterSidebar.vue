<template>
  <div class="flex flex-col md:flex-row gap-6">
    <!-- Sidebar -->
    <aside
      class="w-full md:w-1/5 bg-white shadow-xl rounded-xl md:rounded-none
             flex flex-col gap-6 p-6 relative mt-16 md:mt-0 z-10"
    >
      <!-- Category Filter -->
      <div>
        <h3 class="font-semibold text-black mb-3">Category</h3>
        <div class="flex flex-col gap-2">
          <label
            v-for="category in categories"
            :key="category"
            class="flex items-center space-x-2 cursor-pointer text-sm sm:text-base"
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
      <div>
        <h3 class="font-semibold text-black mb-3">Size</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="size in sizes"
            :key="size"
            @click="toggleSize(size)"
            :class="[
              'px-4 py-1 rounded-full border font-medium transition text-sm',
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
      <div>
        <h3 class="font-semibold text-black mb-3">Price</h3>
        <input
          type="range"
          min="0"
          max="5000"
          step="50"
          v-model="priceRange"
          class="w-full accent-black"
        />
        <div class="flex justify-between text-xs text-gray-600 mt-1">
          <span>₹0</span>
          <span>₹{{ priceRange }}</span>
        </div>
      </div>

      <!-- Brand Filter -->
      <div>
        <h3 class="font-semibold text-black mb-3">Brand</h3>
        <div class="flex flex-col gap-2">
          <label
            v-for="brand in brands"
            :key="brand"
            class="flex items-center space-x-2 cursor-pointer text-sm sm:text-base"
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

      <!-- Action Buttons -->
      <div class="flex gap-3 mt-auto">
        <button
          @click="resetFilters"
          class="flex-1 py-2 px-4 border border-gray-300 rounded-full hover:bg-gray-100 transition font-medium text-sm"
        >
          Reset
        </button>
        <button
          @click="applyFilters"
          class="flex-1 py-2 px-4 bg-black text-white rounded-full hover:bg-gray-800 transition font-medium text-sm shadow-md"
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
  console.log("Categories:", selectedCategories.value);
  console.log("Sizes:", selectedSizes.value);
  console.log("Brands:", selectedBrands.value);
  console.log("Price up to:", priceRange.value);
};

const resetFilters = () => {
  selectedCategories.value = [];
  selectedSizes.value = [];
  selectedBrands.value = [];
  priceRange.value = 2500;
};
</script>

<style scoped>
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
