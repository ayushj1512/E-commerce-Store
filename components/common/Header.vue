<template>
  <header class="bg-white text-black shadow-md relative z-50">
    <!-- Mobile Header -->
    <div class="flex items-center justify-between px-4 py-3 md:hidden">
      <button @click="mobileSidebarOpen = true" class="focus:outline-none"><Menu class="w-6 h-6"/></button>
      <div class="cursor-pointer" @click="navigateTo('/')">
        <img src="https://images.streetstylestore.com/new-sssnew-images/sss-logo.jpg" alt="Street Style Store" class="h-10 object-contain"/>
      </div>
      <div class="flex items-center space-x-4">
        <button @click="navigateToSearch()" class="hover:text-gray-600 transition-colors"><SearchIcon class="w-6 h-6"/></button>
        <ShoppingCart class="w-6 h-6 hover:text-gray-600 cursor-pointer transition-colors" @click="navigateTo('/cart')"/>
        <User class="w-6 h-6 hover:text-gray-600 cursor-pointer transition-colors" @click="navigateTo('/profile')"/>
        <Heart class="w-6 h-6 hover:text-gray-600 cursor-pointer transition-colors" @click="navigateTo('/wishlist')"/>
      </div>
    </div>

    <!-- Desktop Header -->
    <div class="hidden md:flex items-center justify-between px-6 py-3">
      <div class="cursor-pointer" @click="navigateTo('/')">
        <img src="https://images.streetstylestore.com/new-sssnew-images/sss-logo.jpg" alt="Street Style Store" class="h-12 object-contain"/>
      </div>
      <div class="flex items-center space-x-6 w-full max-w-3xl">
        <nav class="flex space-x-4 flex-1">
          <div v-for="menu in menus" :key="menu.name" class="relative cursor-pointer" @click="navigateTo('/collection')">
            <button class="font-medium hover:text-gray-600 transition-colors">{{ menu.name }}</button>
          </div>
        </nav>
        <HeaderSearch v-if="isClient" class="flex-1" :recent-searches="recentSearches" :popular-searches="popularSearches"
          @search="navigateToSearch" @image-search="handleImageSearch"/>
      </div>
      <div class="flex items-center space-x-4">
        <ShoppingCart class="w-6 h-6 hover:text-gray-600 cursor-pointer transition-colors" @click="navigateTo('/cart')"/>
        <User class="w-6 h-6 hover:text-gray-600 cursor-pointer transition-colors" @click="navigateTo('/profile')"/>
        <Heart class="w-6 h-6 hover:text-gray-600 cursor-pointer transition-colors" @click="navigateTo('/wishlist')"/>
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <transition name="slide">
      <div v-if="mobileSidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50" @click.self="mobileSidebarOpen=false">
        <div class="fixed left-0 top-0 w-64 h-full bg-white shadow-lg z-50 flex flex-col overflow-y-auto">
          <div class="flex justify-end p-4">
            <button @click="mobileSidebarOpen=false" class="focus:outline-none"><X class="w-6 h-6"/></button>
          </div>
          <nav class="flex flex-col">
            <div v-for="menu in menus" :key="menu.name" class="border-b border-gray-200">
              <button @click="toggleMenu(menu.name)" class="w-full text-left px-4 py-3 font-medium hover:bg-gray-100 flex justify-between items-center">
                {{ menu.name }} <span class="text-lg font-bold">{{ openMenus.includes(menu.name)?'-':'+' }}</span>
              </button>
              <ul v-if="openMenus.includes(menu.name)" class="flex flex-col bg-gray-50">
                <li v-for="item in menu.items" :key="item" class="px-6 py-2 hover:bg-gray-100 cursor-pointer transition-colors text-sm" @click="navigateTo('/collection')">{{ item }}</li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </transition>
  </header>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart, User, Heart, Menu, X, SearchIcon } from 'lucide-vue-next'
import HeaderSearch from './HeaderSearch.vue'

const router = useRouter()
const menus = [
  { name:"Tops", items:["Crop Tops","Blouses","Shirts","Tunics","Graphic Tees"] },
  { name:"Dresses", items:["Party Dresses","Casual Dresses","Maxi Dresses","Midi Dresses"] },
  { name:"Bottoms", items:["Jeans","Skirts","Shorts","Trousers","Leggings"] },
  { name:"Accessories", items:["Bags","Belts","Hats","Scarves","Sunglasses"] },
  { name:"Footwear", items:["Flats","Heels","Sneakers","Sandals"] }
]

const recentSearches=ref(['Crop Tops','Black Jeans','Sneakers'])
const popularSearches=ref(['Maxi Dress','Sunglasses','Flats','Belts'])
const mobileSidebarOpen=ref(false), openMenus=ref([]), isClient=ref(false)
onMounted(()=>{ isClient.value=true })

const toggleMenu=name=>openMenus.value.includes(name)?openMenus.value=openMenus.value.filter(n=>n!==name):openMenus.value.push(name)
const navigateTo=path=>{ router.push(path); mobileSidebarOpen.value=false }
const navigateToSearch=query=>{ if(typeof window!=='undefined' && window.innerWidth<768) router.push('/search'); else if(query) router.push(`/search-results?query=${encodeURIComponent(query)}`); else router.push('/search') }
const handleImageSearch=file=>console.log('Image uploaded for search:',file)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
.font-great-vibes{font-family:'Great Vibes',cursive;font-weight:700}
.slide-enter-active,.slide-leave-active{transition:all 0.3s ease}
.slide-enter-from{transform:translateX(-100%)}
.slide-enter-to{transform:translateX(0)}
.slide-leave-from{transform:translateX(0)}
.slide-leave-to{transform:translateX(-100%)}
</style>
