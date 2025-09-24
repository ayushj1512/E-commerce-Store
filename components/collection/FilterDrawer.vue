<template>
  <div>
    <!-- Toggle Drawer Button -->
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

          <!-- Categories -->
          <div v-if="categories.length">
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

          <!-- Popular Tags -->
          <div v-if="popularTags.length">
            <h3 class="font-medium mb-2">Popular Tags</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in popularTags"
                :key="tag"
                @click="toggleTag(tag)"
                :class="[
                  selectedTags.includes(tag) 
                    ? 'bg-black text-white scale-105 shadow-md' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
                  'px-3 py-1 rounded-full border text-sm'
                ]"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- Other Tags -->
          <div v-if="tags.length">
            <h3 class="font-medium mb-2">Tags</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in tags"
                :key="tag"
                @click="toggleTag(tag)"
                :class="[
                  selectedTags.includes(tag) 
                    ? 'bg-black text-white scale-105 shadow-md' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
                  'px-3 py-1 rounded-full border text-sm'
                ]"
              >
                {{ tag }}
              </button>
            </div>
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
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
  categories: { type: Array, default: () => [] },
  tags: { type: Array, default: () => [] },
  popularTags: { type: Array, default: () => ["prom", "formal", "casual", "boutique"] },
});

const emit = defineEmits(["apply", "update:isOpen"]);

const isOpen = ref(false);
const selectedCategories = ref([]);
const selectedTags = ref([]);

const toggleDrawer = () => {
  isOpen.value = !isOpen.value;
  emit("update:isOpen", isOpen.value);
};
const closeDrawer = () => {
  isOpen.value = false;
  emit("update:isOpen", false);
};

const toggleTag = (tag) => {
  selectedTags.value.includes(tag)
    ? selectedTags.value = selectedTags.value.filter(t => t !== tag)
    : selectedTags.value.push(tag);
};

const applyFilters = () => {
  emit("apply", {
    categories: selectedCategories.value,
    tags: selectedTags.value
  });
  closeDrawer();
};

// Optional: reset selected filters if props change
watch(() => props.categories, () => selectedCategories.value = []);
watch(() => props.tags, () => selectedTags.value = []);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>
