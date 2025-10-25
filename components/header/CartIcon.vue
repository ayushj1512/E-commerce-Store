<template>
  <div 
    class="relative cursor-pointer"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="goToCart"
  >
    <ShoppingCart class="w-6 h-6 hover:text-gray-600 transition-colors"/>
    <span v-if="totalItems > 0"
      class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
      {{ totalItems }}
    </span>

    <transition name="fade-scale">
      <div
        v-if="showMiniCart"
        class="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded-xl p-4 z-50"
      >
        <div class="max-h-64 overflow-y-auto space-y-4">
          <div 
            v-for="item in cart.items" 
            :key="item._key"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3 cursor-pointer" @click.stop="navigateToProduct(item)">
              <img :src="item.image" alt="Product" class="w-12 h-16 object-cover rounded-lg"/>
              <div>
                <h4 class="font-semibold text-sm">{{ item.name }}</h4>
                <p v-if="item.size" class="text-xs text-gray-500">Size: {{ item.size }}</p>
                <p class="font-bold text-sm">₹{{ getItemUnitPrice(item) }}</p>
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
          <button 
            @click="goToCart" 
            class="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            View Cart & Checkout
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()
const router = useRouter()
const showMiniCart = ref(false)

const totalItems = computed(() => {
  return Array.isArray(cart.items) ? cart.items.reduce((sum, i) => sum + (i.quantity || 0), 0) : 0
})

const increaseQty = item => cart.updateQuantity(item, item.quantity + 1)
const decreaseQty = item => { 
  if(item.quantity > 1) cart.updateQuantity(item, item.quantity - 1) 
  else cart.removeFromCart(item)
}

// Navigate to product detail
const navigateToProduct = item => {
  const parentSlug = item.parentCategory ? item.parentCategory.toLowerCase() : 'collection'
  const subSlug = item.subCategory ? item.subCategory.toLowerCase() : 'products'
  const productSlug = item.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')
  router.push(`/${parentSlug}/${subSlug}/${productSlug}/${item.id}`)
}

// Always navigate to /cart on click
const goToCart = () => router.push('/cart')

// Show mini-cart only on desktop and when cart has items
const handleMouseEnter = () => {
  if (typeof window !== 'undefined' && window.innerWidth >= 768 && totalItems.value > 0) {
    showMiniCart.value = true
  }
}

const handleMouseLeave = () => {
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    showMiniCart.value = false
  }
}

// Get per-unit price using cart store logic
const getItemUnitPrice = item => {
  return item.quantity > 0 
    ? ((item.finalPrice || item.MRP_price * item.quantity) / item.quantity).toFixed(2)
    : item.MRP_price.toFixed(2)
}
</script>

<style scoped>
.fade-scale-enter-active, .fade-scale-leave-active { transition: all 0.2s ease; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: scale(0.95); }
.fade-scale-enter-to, .fade-scale-leave-from { opacity: 1; transform: scale(1); }
</style>
