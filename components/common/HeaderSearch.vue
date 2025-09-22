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
        @focus="navigateToSearch"
        @keydown.enter="searchItem(query)"
      />

      <!-- Image Upload Button (kept intact) -->
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Camera } from 'lucide-vue-next'

const emit = defineEmits(['search', 'image-search'])
const router = useRouter()

const query = ref('')
const fileInput = ref(null)
const isMobile = ref(false) // SSR-safe default

// SSR-safe: check window
if (typeof window !== 'undefined') {
  isMobile.value = window.innerWidth < 768
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
  })
}

// Always navigate to /search when field is active
const navigateToSearch = () => {
  router.push('/search')
}

// Search via text
const searchItem = (item) => {
  query.value = item
  emit('search', item)
  router.push(`/search-results?query=${encodeURIComponent(item)}`)
}

// Trigger hidden file input
const triggerFileUpload = () => {
  if (fileInput.value) fileInput.value.click()
}

// Handle Image Upload
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  emit('image-search', file)
  router.push('/search')
}
</script>
