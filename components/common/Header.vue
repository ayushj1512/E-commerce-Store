<template>
  <header
    :class="[
      'bg-white text-black shadow-md z-50',
      !isListingPage ? 'sticky top-0' : 'md:sticky md:top-0'
    ]"
  >
    <!-- Mobile Header -->
    <div class="flex items-center justify-between px-4 py-3 md:hidden">
      <button @click="mobileSidebarOpen = true" class="focus:outline-none">
        <Menu class="w-6 h-6"/>
      </button>

      <!-- Centered Logo -->
      <div class="cursor-pointer" @click="navigateTo('/')">
        <img src="https://images.streetstylestore.com/new-sssnew-images/sss-logo.jpg" alt="Street Style Store" class="h-10 object-contain"/>
      </div>

      <!-- Search, Cart, Profile, Wishlist -->
      <div class="flex items-center space-x-4 relative">
        <button @click="navigateToSearch()" class="hover:text-gray-600 transition-colors">
          <SearchIcon class="w-6 h-6"/>
        </button>

       
        <!-- Profile Icon Component -->
        <ProfileIcon />

        <!-- Wishlist Icon -->
        <WishlistIcon /> 
        
        <!-- Cart Icon Component -->
        <CartIcon />

      </div>
    </div>

    <!-- Desktop Header -->
    <div class="hidden md:flex items-center justify-between px-6 py-3 relative">
      <!-- Logo -->
      <div class="cursor-pointer" @click="navigateTo('/')">
        <img src="https://images.streetstylestore.com/new-sssnew-images/sss-logo.jpg" alt="Street Style Store" class="h-10 object-contain"/>
      </div>

      <!-- Centered Menu -->
      <nav class="flex-1 flex justify-center space-x-6">
        <div v-for="menu in menus" :key="menu.name" class="relative cursor-pointer">
          <button 
            class="font-medium hover:text-gray-600 transition-colors"
            @click="navigateToCategory(menu.name)"
          >
            {{ menu.name }}
          </button>
        </div>
      </nav>

      <!-- Right-side Icons -->
      <div class="flex items-center space-x-4">
        <button @click="navigateToSearch()" class="hover:text-gray-600 transition-colors">
          <SearchIcon class="w-6 h-6"/>
        </button>

        

        <!-- Profile Icon Component -->
        <ProfileIcon />

        <!-- Wishlist Icon -->
        <WishlistIcon />
        
        <!-- Cart Icon Component -->
        <CartIcon />
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <transition name="slide">
      <div v-if="mobileSidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50" @click.self="mobileSidebarOpen=false">
        <div class="fixed left-0 top-0 w-64 h-full bg-white shadow-lg z-50 flex flex-col overflow-y-auto">
          <div class="flex justify-end p-4">
            <button @click="mobileSidebarOpen=false" class="focus:outline-none">
              <X class="w-6 h-6"/>
            </button>
          </div>
          <nav class="flex flex-col">
            <div v-for="menu in menus" :key="menu.name" class="border-b border-gray-200">
              <button @click="toggleMenu(menu.name)" class="w-full text-left px-4 py-3 font-medium hover:bg-gray-100 flex justify-between items-center">
                {{ menu.name }} <span class="text-lg font-bold">{{ openMenus.includes(menu.name)?'-':'+' }}</span>
              </button>
              <ul v-if="openMenus.includes(menu.name)" class="flex flex-col bg-gray-50">
                <li v-for="item in menu.items" :key="item" class="px-6 py-2 hover:bg-gray-100 cursor-pointer transition-colors text-sm"
                  @click="navigateToSubCategory(menu.name, item)">
                  {{ item }}
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, X, SearchIcon } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlist'
import slugify from 'slugify'

import WishlistIcon from '@/components/header/WishlistIcon.vue'
import CartIcon from '@/components/header/CartIcon.vue'
import ProfileIcon from '@/components/header/ProfileIcon.vue'

const cart = useCartStore()
const wishlist = useWishlistStore()
const router = useRouter()
const route = useRoute()

// Detect if we are on product listing page /[parent]/[child]/index.vue
const isListingPage = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  return segments.length === 2
})

const menus = [
  { name:"Tops", items:["Crop Tops","Blouses","Shirts","Tunics","Graphic Tees"] },
  { name:"Dresses", items:["Party Dresses","Casual Dresses","Maxi Dresses","Midi Dresses"] },
  { name:"Bottoms", items:["Jeans","Skirts","Shorts","Trousers","Leggings"] },
  { name:"Accessories", items:["Bags","Belts","Hats","Scarves","Sunglasses"] },
  { name:"Footwear", items:["Flats","Heels","Sneakers","Sandals"] }
]

const mobileSidebarOpen = ref(false)
const openMenus = ref([])

onMounted(() => { 
  cart.loadCart()
  wishlist.loadWishlist()
})

const toggleMenu = name => {
  if(openMenus.value.includes(name)){
    openMenus.value = openMenus.value.filter(n=>n!==name)
  } else {
    openMenus.value.push(name)
  }
}

const navigateTo = path => { router.push(path); mobileSidebarOpen.value=false }
const navigateToCategory = category => {
  const slug = slugify(category, { lower: true })
  router.push(`/collection/${slug}`)
}
const navigateToSubCategory = (parent, sub) => {
  const parentSlug = slugify(parent, { lower: true })
  const subSlug = slugify(sub, { lower: true })
  router.push(`/${parentSlug}/${subSlug}`)
  mobileSidebarOpen.value = false
}
const navigateToProduct = item => {
  const parentSlug = slugify(item.parentCategory || 'collection', { lower: true })
  const subSlug = slugify(item.subCategory || 'products', { lower: true })
  const productSlug = slugify(item.name, { lower: true })
  router.push(`/${parentSlug}/${subSlug}/${productSlug}/${item.id}`)
}
const navigateToSearch = query => { 
  if(typeof window!=='undefined' && window.innerWidth<768) router.push('/search'); 
  else if(query) router.push(`/search-results?query=${encodeURIComponent(query)}`); 
  else router.push('/search') 
}
</script>

<style scoped>
.slide-enter-active,.slide-leave-active{transition:all 0.3s ease}
.slide-enter-from{transform:translateX(-100%)}
.slide-enter-to{transform:translateX(0)}
.slide-leave-from{transform:translateX(0)}
.slide-leave-to{transform:translateX(-100%)}

.fade-scale-enter-active, .fade-scale-leave-active { transition: all 0.2s ease; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: scale(0.95); }
.fade-scale-enter-to, .fade-scale-leave-from { opacity: 1; transform: scale(1); }
</style>
