<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 p-4 md:p-8">

    <!-- Premium Search Bar -->
    <div
      class="flex items-center bg-white/80 backdrop-blur-md border border-gray-300 rounded-3xl shadow-lg px-5 py-3 mb-6 transition-transform hover:scale-105">
      <Search class="w-7 h-7 text-gray-700 mr-3" />
      <input type="text" v-model="query" placeholder="Search for products..."
        class="flex-1 bg-transparent focus:outline-none placeholder-gray-400 text-gray-900 text-base"
        @focus="showSuggestions = true" @keydown.enter="searchItem(query)" />
      <button @click="triggerFileUpload"
        class="ml-3 p-2 rounded-full hover:bg-gray-200 transition">
        <Camera class="w-6 h-6 text-gray-700" />
      </button>
      <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleImageUpload" />
    </div>

    <!-- Suggestions Dropdown -->
    <transition name="fade-slide">
      <div v-if="showSuggestions && filteredSuggestions.length"
        class="bg-white rounded-xl shadow-md p-3 mb-6 max-h-60 overflow-y-auto border border-gray-200">
        <p class="text-gray-500 text-sm mb-2 font-medium">Suggestions</p>
        <ul>
          <li v-for="item in filteredSuggestions" :key="item"
            class="py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
            @mousedown.prevent="searchItem(item)">
            {{ item }}
          </li>
        </ul>
      </div>
    </transition>

    <!-- Recently Searched -->
    <div class="mb-6">
      <h2 class="font-bold text-lg mb-2 text-gray-800">Recently Searched</h2>
      <div class="flex flex-wrap gap-2">
        <span v-for="item in recentSearches" :key="item"
          class="bg-gray-200 text-gray-900 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-300 transition transform hover:scale-105"
          @click="searchItem(item)">{{ item }}</span>
      </div>
    </div>

    <!-- Popular Searches -->
    <div class="mb-6">
      <h2 class="font-bold text-lg mb-2 text-gray-800">Popular Searches</h2>
      <div class="flex flex-wrap gap-2">
        <span v-for="item in popularSearches" :key="item"
          class="bg-black text-white px-3 py-1 rounded-full cursor-pointer hover:bg-gray-400 transition transform hover:scale-110"
          @click="searchItem(item)">{{ item }}</span>
      </div>
    </div>

    <!-- Trending Products -->
    <div class="mb-6">
      <h2 class="font-bold text-lg mb-4 text-gray-800">Trending Products</h2>
      <div class="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
        <div v-for="item in trendingItems" :key="item.id"
          class="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:scale-105 transform transition w-52 flex-shrink-0">
          <img :src="item.image" :alt="item.name" class="w-full h-44 object-cover" />
          <div class="p-3">
            <p class="text-sm font-semibold truncate text-gray-900">{{ item.name }}</p>
            <p class="text-xs text-gray-500">₹{{ item.price }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- You Might Be Looking For -->
    <div class="mb-6">
      <h2 class="font-bold text-lg mb-4 text-gray-800">You Might Be Looking For</h2>
      <div class="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
        <div v-for="item in recommendedItems" :key="item.id"
          class="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:scale-105 transform transition w-52 flex-shrink-0">
          <img :src="item.image" :alt="item.name" class="w-full h-44 object-cover" />
          <div class="p-3">
            <p class="text-sm font-semibold truncate text-gray-900">{{ item.name }}</p>
            <p class="text-xs text-gray-500">₹{{ item.price }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Camera } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const query = ref('')
const showSuggestions = ref(false)
const fileInput = ref(null)

const recentSearches = ref(['Crop Tops','Black Jeans','Sneakers'])
const popularSearches = ref(['Maxi Dress','Sunglasses','Flats','Belts'])

const trendingItems = ref([
  {id:1,name:'White Shirt',price:1200,image:'https://i.pinimg.com/1200x/11/92/cc/1192cc157f0f8877702538fd82f87118.jpg',slug:'white-shirt'},
  {id:2,name:'Black Jeans',price:2200,image:'https://i.pinimg.com/1200x/b4/5d/44/b45d440b3cdd53f8dc8a928287ddd9e8.jpg',slug:'black-jeans'},
  {id:3,name:'Red Dress',price:3200,image:'https://i.pinimg.com/736x/03/e7/fa/03e7fa63d7126cfa1b20de7f364bbbc1.jpg',slug:'red-dress'},
])

const recommendedItems = ref([
  {id:4,name:'Leather Bag',price:1500,image:'https://i.pinimg.com/1200x/24/30/39/243039692713e4c3d2e1c278b47d8502.jpg',slug:'leather-bag'},
  {id:5,name:'Sneakers',price:1800,image:'https://i.pinimg.com/736x/48/3d/c2/483dc2ff71b4970b83e9e9143d19db1f.jpg',slug:'sneakers'},
])

const suggestions = computed(()=>[...recentSearches.value,...popularSearches.value])
const filteredSuggestions = computed(()=>query.value?suggestions.value.filter(i=>i.toLowerCase().includes(query.value.toLowerCase())):[])

const searchItem = item=>{
  query.value=item
  router.push(`/search-results?query=${encodeURIComponent(item)}`)
  showSuggestions.value=false
}

const triggerFileUpload = () => fileInput.value.click()
const handleImageUpload = e => {
  const file = e.target.files[0]; 
  if(!file) return
  alert(`Image search triggered 📷`)
  router.push({path:'/search',query:{q:query.value}})
}
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.fade-slide-enter-active,.fade-slide-leave-active{transition:all 0.25s ease}
.fade-slide-enter-from,.fade-slide-leave-to{opacity:0;transform:translateY(-5px)}
.fade-slide-enter-to,.fade-slide-leave-from{opacity:1;transform:translateY(0)}
</style>
