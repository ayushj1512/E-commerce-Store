<template>
  <div>
    <!-- Button to toggle drawer -->
    <button
      @click="toggleDrawer"
      class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
    >
      Filters
    </button>

    <!-- Overlay -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/40 z-40"
        @click="closeDrawer"
      ></div>
    </transition>

    <!-- Drawer -->
    <transition name="slide">
      <aside
        v-if="isOpen"
        class="fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 overflow-y-auto"
      >
        <!-- Header -->
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-semibold">Filters</h2>
          <button @click="closeDrawer" class="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <!-- Filter Content -->
        <div class="p-4 space-y-4">
          <!-- Example: Category filter -->
          <div>
            <h3 class="font-medium mb-2">Category</h3>
            <ul class="space-y-2">
              <li v-for="cat in categories" :key="cat">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedCategories" :value="cat" />
                  <span>{{ cat }}</span>
                </label>
              </li>
            </ul>
          </div>

          <!-- Example: Price filter -->
          <div>
            <h3 class="font-medium mb-2">Price</h3>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              v-model="priceRange"
              class="w-full"
            />
            <p class="text-sm text-gray-600">Up to ₹{{ priceRange }}</p>
          </div>

          <!-- Apply Button -->
          <button
            @click="applyFilters"
            class="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isOpen = ref(false);
const categories = ["Shoes", "Bags", "Clothing", "Accessories"];
const selectedCategories = ref([]);
const priceRange = ref(2500);

const toggleDrawer = () => {
  isOpen.value = !isOpen.value;
};

const closeDrawer = () => {
  isOpen.value = false;
};

const applyFilters = () => {
  console.log("Selected Categories:", selectedCategories.value);
  console.log("Price Range:", priceRange.value);
  closeDrawer();
};
</script>

<style scoped>
/* Overlay animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Drawer slide animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
