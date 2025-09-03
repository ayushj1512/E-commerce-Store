<template>
  <div>
    <!-- Mobile Filter Toggle Button -->
    <button
      @click="isOpen = true"
      class="md:hidden bg-black text-white px-5 py-2 shadow-xl hover:bg-gray-800 transition"
    >
      Filters
    </button>

    <!-- Sidebar Overlay for Mobile -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity"
      @click="isOpen = false"
    ></div>

    <!-- Sidebar Card -->
    <aside
      :class="[
        'fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto rounded-r-xl',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:relative md:shadow-xl md:w-72 md:block'
      ]"
    >
      <div class="p-6 flex flex-col h-full space-y-6">
        <!-- Close Button for Mobile -->
        <button
          class="md:hidden self-end text-gray-600 text-xl font-bold hover:text-gray-800 transition"
          @click="isOpen = false"
        >
          ✕
        </button>

        <!-- Filters Title -->
        <h2 class="text-2xl font-bold text-black mb-4">Filters</h2>

        <!-- Card Wrapper for all Filters -->
        <div class="flex flex-col gap-5 bg-gray-50 p-4 rounded-xl shadow-inner">
          
          <!-- Category Filter -->
          <div>
            <h3 class="font-semibold text-black mb-3">Category</h3>
            <div class="flex flex-col gap-2">
              <label
                v-for="category in categories"
                :key="category"
                class="flex items-center space-x-2 cursor-pointer hover:text-gray-800 transition"
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
                  'px-4 py-1 rounded-full border font-medium transition',
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
            <div class="flex justify-between text-sm text-gray-600 mt-1">
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
                class="flex items-center space-x-2 cursor-pointer hover:text-gray-800 transition"
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

        </div>

        <!-- Apply / Reset Buttons -->
        <div class="mt-auto flex justify-between gap-3">
          <button
            @click="resetFilters"
            class="flex-1 py-2 px-4 border border-gray-300 rounded-full hover:bg-gray-100 transition font-medium text-black"
          >
            Reset
          </button>
          <button
            @click="applyFilters"
            class="flex-1 py-2 px-4 bg-black text-white rounded-full hover:bg-gray-800 transition font-medium shadow-md"
          >
            Apply
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);

const categories = ['T-Shirts', 'Hoodies', 'Jeans', 'Jackets'];
const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const brands = ['Nike', 'Adidas', 'Puma', 'Reebok'];

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
  console.log('Selected Categories:', selectedCategories.value);
  console.log('Selected Sizes:', selectedSizes.value);
  console.log('Selected Brands:', selectedBrands.value);
  console.log('Max Price:', priceRange.value);
};

const resetFilters = () => {
  selectedCategories.value = [];
  selectedSizes.value = [];
  selectedBrands.value = [];
  priceRange.value = 2500;
};
</script>

<style scoped>
aside::-webkit-scrollbar {
  width: 6px;
}
aside::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.3);
  border-radius: 3px;
}
</style>
