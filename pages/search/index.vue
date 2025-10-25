<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8" @scroll.passive="handleScroll" ref="scrollContainer">

    <!-- Premium Search Bar -->
    <div
      class="flex items-center bg-white border border-gray-300 rounded-3xl shadow-lg px-5 py-3 mb-6 transition-transform">
      <Search class="w-7 h-7 text-gray-700 mr-3" />
      <input
        type="text"
        v-model="query"
        placeholder="Search for products..."
        class="flex-1 bg-transparent focus:outline-none placeholder-gray-400 text-gray-900 text-base"
      />
      <button
        @click="triggerFileUpload"
        class="ml-3 p-2 rounded-full hover:bg-gray-200 transition"
      >
        <Camera class="w-6 h-6 text-gray-700" />
      </button>
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        accept="image/*"
        @change="handleImageUpload"
      />
    </div>

    <!-- Recently Searched -->
    <div
      class="mb-6"
      v-if="recentSearches && recentSearches.length && products && products.length"
    >
      <h2 class="font-bold text-lg mb-2 text-gray-900">Recently Searched</h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(item, index) in recentSearches"
          :key="item"
          :class="[ 'flex items-center bg-gray-200 text-gray-900 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-300 transition transform hover:scale-105', index >= 7 ? 'hidden sm:flex' : '' ]"
        >
          <span @click="searchItem(item)">{{ item }}</span>
          <button
            class="ml-2 text-gray-600 hover:text-red-500"
            @click.stop="removeRecent(item)"
          >
            ✕
          </button>
        </span>
      </div>
    </div>

    <!-- Popular Searches -->
    <div
      class="mb-6"
      v-if="products && products.length"
    >
      <h2 class="font-bold text-lg mb-2 text-gray-900">Popular Searches</h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(item, index) in popularSearches"
          :key="item"
          :class="[
            'bg-black text-white px-3 py-1 rounded-full cursor-pointer hover:bg-gray-700 transition transform hover:scale-110',
            index >= 14 ? 'hidden sm:flex' : '' // show only first 14 items on mobile (~2 rows)
          ]"
          @click="searchItem(item)"
        >
          {{ item }}
        </span>
      </div>
    </div>

    <!-- Search Results -->
    <div class="mb-6" v-if="loading">
      <p class="text-gray-500">Searching...</p>
    </div>

    <div v-if="products && products.length && !loading">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-bold text-lg text-gray-900">
          {{ query.trim() ? 'Search Results' : 'You may like' }}
        </h2>
        <span class="text-gray-500 font-medium">
          ({{ totalResults }} items)
        </span>
      </div>

      <!-- Grid layout for search results -->
      <div class="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-4">
        <ProductCard
          v-for="item in products"
          :key="item.id"
          :id="item.product_id"
          :image="item.image"
          :hoverImage="item.alternate_img"
          :title="item.name"
          :price="item.real_selling_price"
          :mrp="item.selling_price > item.real_selling_price ? item.selling_price : null"
          :productUrl="item.product_url"
          class="w-full"
        />
      </div>

      <div v-if="loadingMore" class="mt-4 text-center text-gray-500">
        Loading more products...
      </div>
    </div>

    <!-- No Results Component -->
    <NoResults
      v-if="!loading && (!products || !products.length)"
      :query="query"
      :suggestedProducts="suggestedProducts"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search, Camera } from 'lucide-vue-next'
import ProductCard from '@/components/common/ProductCard.vue'
import NoResults from '@/components/search/NoResults.vue'
import { useToast } from "vue-toastification"

const route = useRoute()
const toast = useToast()

const query = ref('')
const fileInput = ref(null)
const activeCategories = ref([])
const products = ref([]) 
const suggestedProducts = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const recentSearches = ref([])
const popularSearches = ref([
  "Tops","Crop Top","Crop","Round Neck","Sleeveless","Half Sleeve","Bodycon",
  "Shirt","Full Sleeves","White","Long Sleeve","Graphic","Summer","Oversize",
  "Mini","Floral","Midi","Maxi","Strapless","Jumpsuit","Lavender"
])

const totalResults = ref(0)
let page = ref(1)
const perPage = 20

// --- Cookie helpers ---
const setCookie = (name, value, days) => {
  let expires = ''
  if (days) {
    const d = new Date()
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + d.toUTCString()
  }
  document.cookie = name + '=' + encodeURIComponent(value || '') + expires + '; path=/'
}

const getCookie = (name) => {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim()
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length))
  }
  return null
}

// --- Fetch active categories ---
const fetchActiveCategories = async () => {
  try {
    const res = await fetch(
      "https://api.streetstylestore.com/collections/sss_config/documents/sss-active-categories?a=1&x-typesense-api-key=F5gdSFxpg6bi8ZXfuybIsQy074HtBDkC"
    )
    const data = await res.json()
    activeCategories.value = JSON.parse(data.data)
  } catch (err) {
    console.error("Error fetching active categories:", err)
    toast.error("Failed to load categories")
  }
}

// --- Fetch products ---
const searchProducts = async (reset = true) => {
  if (!activeCategories.value.length) return
  if (reset) {
    products.value = []
    page.value = 1
    totalResults.value = 0
    loading.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const queries = query.value.trim()
      ? [query.value.trim()]
      : recentSearches.value.slice(0, 3).length
        ? recentSearches.value.slice(0, 3)
        : popularSearches.value.slice(0, 3)

    let allResults = []

    for (const q of queries) {
      const url = `https://api.streetstylestore.com/collections/products/documents/search?q=${encodeURIComponent(q)}&filter_by=categories:=[${activeCategories.value.join(",")}]
&query_by=tags,name,product_id&filter_by=active:=1&sort_by=date_updated_unix:desc&per_page=${perPage}&page=${page.value}&x-typesense-api-key=VvSmt6K1hvlGJhtTPsxjVrq8RNm9tSXh`.replace(/\s+/g, '')

      const res = await fetch(url)
      const data = await res.json()
      allResults.push(...data.hits.map(h => ({
        id: h.document.id,
        product_id: h.document.product_id,
        name: h.document.name,
        selling_price: Number(h.document.selling_price),
        real_selling_price: Number(h.document.real_selling_price),
        image: h.document.img || h.document.images?.[0],
        alternate_img: h.document.alternate_img,
        product_url: h.document.product_url
      })))
      totalResults.value = data.found || allResults.length
    }

    products.value.push(...allResults)
  } catch (err) {
    console.error("Error fetching products:", err)
    toast.error("Failed to load products")
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// --- Infinite scroll using window ---
const handleScroll = () => {
  if (loadingMore.value || loading.value) return
  const scrollBottom = window.innerHeight + window.scrollY
  const pageHeight = document.documentElement.offsetHeight

  if (scrollBottom >= pageHeight - 200) {
    if (products.value.length < totalResults.value) {
      page.value += 1
      searchProducts(false)
    }
  }
}

// --- Manage recent searches ---
const addToRecent = (term) => {
  if (!term) return
  term = term.trim()
  if (!term) return

  recentSearches.value = recentSearches.value.filter(item => item !== term)
  recentSearches.value.unshift(term)
  if (recentSearches.value.length > 10) recentSearches.value.pop()

  setCookie("recentSearches", JSON.stringify(recentSearches.value), 7)
}

const searchItem = (item) => {
  query.value = item
  addToRecent(item)
  searchProducts(true)
}

const removeRecent = (item) => {
  recentSearches.value = recentSearches.value.filter(i => i !== item)
  setCookie("recentSearches", JSON.stringify(recentSearches.value), 7)
}

const triggerFileUpload = () => fileInput.value.click()
const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  toast.info(`Image search triggered 📷`)
}

// --- Watch input from header or local ---
let debounceTimer
watch(query, (newVal) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (!newVal.trim()) return
    addToRecent(newVal)
    searchProducts(true)
  }, 800)
})

// --- On mount ---
onMounted(async () => {
  window.addEventListener('scroll', handleScroll)

  const saved = getCookie("recentSearches")
  if (saved) {
    try {
      recentSearches.value = JSON.parse(saved)
    } catch {
      recentSearches.value = []
    }
  }

  if (route.query.query) query.value = route.query.query

  await fetchActiveCategories()
  searchProducts(true)
})

// --- Remove scroll listener on unmount ---
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
