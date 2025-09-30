<template>
  <header class="bg-white text-black shadow-md sticky top-0 z-50">
    <!-- Mobile Header -->
    <div class="flex items-center justify-between px-4 py-3 md:hidden">
      <button @click="mobileSidebarOpen = true" class="focus:outline-none">
        <Menu class="w-6 h-6"/>
      </button>

      <!-- Centered Logo -->
      <div class="cursor-pointer" @click="navigateTo('/')">
        <img src="https://images.streetstylestore.com/new-sssnew-images/sss-logo.jpg" alt="Street Style Store" class="h-10 object-contain"/>
      </div>

      <!-- Search, Cart, User, Wishlist -->
      <div class="flex items-center space-x-4 relative">
        <button @click="navigateToSearch()" class="hover:text-gray-600 transition-colors">
          <SearchIcon class="w-6 h-6"/>
        </button>

        <div class="relative cursor-pointer" @click="navigateTo('/cart')">
          <ShoppingCart class="w-6 h-6 hover:text-gray-600 transition-colors"/>
          <span v-if="totalCartItems > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {{ totalCartItems }}
          </span>
        </div>

        <User class="w-6 h-6 hover:text-gray-600 cursor-pointer transition-colors" @click="navigateTo('/profile')"/>

        <!-- ✅ Reusable WishlistIcon -->
        <WishlistIcon />
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

        <!-- Mini-Cart -->
        <div class="relative cursor-pointer" @mouseenter="showMiniCart = true" @mouseleave="showMiniCart = false">
          <ShoppingCart class="w-6 h-6 hover:text-gray-600 transition-colors"/>
          <span v-if="totalCartItems > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {{ totalCartItems }}
          </span>

          <transition name="fade-scale">
            <div
              v-if="showMiniCart && Array.isArray(cart.items) && cart.items.length > 0"
              class="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded-xl p-4 z-50"
            >
              <div class="max-h-64 overflow-y-auto space-y-4">
                <div 
                  v-for="item in cart.items" 
                  :key="item._key"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center space-x-3 cursor-pointer" @click="navigateToProduct(item)">
                    <img :src="item.image" alt="Product" class="w-12 h-16 object-cover rounded-lg"/>
                    <div>
                      <h4 class="font-semibold text-sm">{{ item.name }}</h4>
                      <p v-if="item.size" class="text-xs text-gray-500">Size: {{ item.size }}</p>
                      <p class="font-bold text-sm">₹{{ item.price }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-1">
                    <button @click.stop="decreaseQty(item)" class="px-1 py-0.5 border rounded hover:bg-gray-100">-</button>
                    <span class="text-sm font-medium">{{ item.quantity }}</span>
                    <button @click.stop="increaseQty(item)" class="px-1 py-0.5 border rounded hover:bg-gray-100">+</button>
                  </div>
                </div>
              </div>
              <div class="mt-4 border-t pt-3">
                <button @click="navigateTo('/cart')" class="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">View Cart & Checkout</button>
              </div>
            </div>
          </transition>
        </div>

        <User class="w-6 h-6 hover:text-gray-600 cursor-pointer transition-colors" @click="navigateTo('/profile')"/>

        <!-- ✅ Reusable WishlistIcon -->
        <WishlistIcon />
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart, User, Menu, X, SearchIcon } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlist'
import slugify from 'slugify'
import WishlistIcon from '@/components/header/WishlistIcon.vue'

const cart = useCartStore()
const wishlist = useWishlistStore()
const router = useRouter()

const menus = [
  { name:"Tops", items:["Crop Tops","Blouses","Shirts","Tunics","Graphic Tees"] },
  { name:"Dresses", items:["Party Dresses","Casual Dresses","Maxi Dresses","Midi Dresses"] },
  { name:"Bottoms", items:["Jeans","Skirts","Shorts","Trousers","Leggings"] },
  { name:"Accessories", items:["Bags","Belts","Hats","Scarves","Sunglasses"] },
  { name:"Footwear", items:["Flats","Heels","Sneakers","Sandals"] }
]

const mobileSidebarOpen = ref(false)
const openMenus = ref([])
const showMiniCart = ref(false)

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

const navigateToCategory = (category) => {
  const slug = slugify(category, { lower: true })
  router.push(`/collection/${slug}`)
}

const navigateToSubCategory = (parent, sub) => {
  const parentSlug = slugify(parent, { lower: true })
  const subSlug = slugify(sub, { lower: true })
  router.push(`/${parentSlug}/${subSlug}`)
  mobileSidebarOpen.value = false
}

const navigateToProduct = (item) => {
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

const increaseQty = (item) => cart.updateQuantity(item, item.quantity + 1)
const decreaseQty = (item) => { if(item.quantity>1) cart.updateQuantity(item, item.quantity - 1) }

const totalCartItems = computed(() => {
  return Array.isArray(cart.items) ? cart.items.reduce((total, item) => total + (item.quantity || 0), 0) : 0
})
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
