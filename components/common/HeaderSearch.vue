<template>
  <div class="relative w-full md:max-w-md">
    <!-- Search Input with Image Upload -->
    <div
      class="flex items-center relative bg-white border border-gray-300 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-black transition"
    >
      <input
        type="text"
        v-model="query"
        placeholder="Search products..."
        class="flex-1 px-4 py-2 rounded-full focus:outline-none text-gray-700"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="searchItem(query)"
      />

      <!-- Image Upload Button -->
       <button
    @click="triggerFileUpload"
    class="absolute right-3 text-gray-400 hover:text-gray-700 transition text-lg"
    title="Search by Image"
  >
    <Camera class="w-5 h-5" />
  </button>
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        class="hidden"
        @change="handleImageUpload"
      />
    </div>

    <!-- Dropdown -->
    <transition name="fade-slide">
      <div
        v-if="showDropdown && (recentSearches.length || popularSearches.length)"
        class="absolute top-full left-0 w-full bg-white shadow-lg rounded-xl mt-2 z-50 border border-gray-200 text-sm"
      >
        <!-- Recently Searched -->
        <div v-if="recentSearches.length" class="p-3 border-b border-gray-200">
          <p class="text-gray-500 mb-2 font-medium">Recently Searched</p>
          <ul>
            <li
              v-for="item in recentSearches"
              :key="item"
              class="py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-700 transition"
              @mousedown.prevent="searchItem(item)"
            >
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- Popular Searches -->
        <div v-if="popularSearches.length" class="p-3">
          <p class="text-gray-500 mb-2 font-medium">Popular Searches</p>
          <ul class="flex flex-wrap gap-2">
            <li
              v-for="item in popularSearches"
              :key="item"
              class="bg-yellow-400 text-black px-3 py-1 rounded-full cursor-pointer hover:bg-yellow-500 transition transform hover:scale-105"
              @mousedown.prevent="searchItem(item)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Camera } from 'lucide-vue-next'

const props = defineProps({
  recentSearches: { type: Array, default: () => ['Crop Tops', 'Black Jeans', 'Sneakers'] },
  popularSearches: { type: Array, default: () => ['Maxi Dress', 'Sunglasses', 'Flats', 'Belts'] },
});

const emit = defineEmits(['search', 'image-search']);
const router = useRouter();

const query = ref('');
const showDropdown = ref(false);
const fileInput = ref(null);
const isMobile = ref(false); // SSR-safe default

// SSR-safe: update only if window exists
const updateIsMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768;
  }
};

onMounted(() => {
  updateIsMobile(); // safe
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateIsMobile);
  }
});

// Search via text
const searchItem = (item) => {
  query.value = item;
  showDropdown.value = false;
  emit('search', item);

  if (isMobile.value) {
    router.push('/search');
  } else {
    router.push(`/search-results?query=${encodeURIComponent(item)}`);
  }
};

// Trigger hidden file input
const triggerFileUpload = () => {
  if (fileInput.value) fileInput.value.click();
};

// Handle Image Upload
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  emit('image-search', file);

  if (isMobile.value) {
    router.push('/search');
  } else {
    router.push({ path: '/search', query: { q: query.value } });
  }
};

// Handle focus for dropdown
const handleFocus = () => {
  if (isMobile.value === false) showDropdown.value = true;
};

// Prevent dropdown from disappearing too early
const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 150);
};
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
