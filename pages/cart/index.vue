<template>
  <div class="bg-gray-50 min-h-screen p-4 md:p-8">
    <div class="flex flex-col md:flex-row gap-6">
      <Confetti ref="confettiRef" />

      <!-- Empty Cart -->
      <EmptyCart v-if="!cart.items.length" class="w-full" />

      <!-- Cart Items & Summary -->
      <template v-else>
        <!-- Items -->
        <transition-group name="list" tag="div" class="w-full md:w-2/3 space-y-4">
          <CartCard
            v-for="item in sortedCartItems"
            :key="item._key"
            :item="item"
            :filtered-vouchers="filteredItemVouchers(item)"
            :is-voucher-applied="isVoucherApplied(item)"
            :final-price="getFinalPrice(item)"
            @increase="increaseQty"
            @decrease="decreaseQty"
            @remove="confirmRemove"
            @go-to-detail="goToDetail"
            @go-to-voucher="goToVoucherLink"
          />
        </transition-group>

        <!-- Summary -->
        <div class="w-full md:w-1/3 border rounded-2xl p-6 shadow-md bg-white md:sticky md:top-20 space-y-4">
          <h2 class="text-xl font-bold mb-4">Order Summary</h2>

          <div class="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>₹{{ cartSubtotal }}</span>
          </div>

          <div v-if="discount > 0" class="flex justify-between text-green-600 font-semibold">
            <span>Discount</span>
            <span>-₹{{ discount }}</span>
          </div>

          <div v-if="discount > 0" class="text-green-700 font-medium text-sm">
            You saved ₹{{ discount }} on this order!
          </div>

          <div class="flex justify-between font-bold text-2xl mt-6 border-t pt-4 text-gray-900">
            <span>Total Amount</span>
            <span>₹{{ cartTotal }}</span>
          </div>

          <button @click="checkout"
            class="w-full bg-black text-white py-3 rounded-xl mt-6 hover:bg-gray-800 font-semibold transition-all duration-200">
            Proceed to Checkout
          </button>
          <button @click="confirmClearCart"
            class="w-full bg-red-500 text-white py-3 rounded-xl mt-3 hover:bg-red-600 font-semibold transition-all duration-200">
            Clear Cart
          </button>
        </div>
      </template>

      <!-- Confirm Remove Modal -->
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-xl p-6 w-80">
          <h3 class="text-lg font-semibold mb-4">Remove Item</h3>
          <p class="mb-6">Are you sure you want to remove <strong>{{ modalItem?.name }}</strong> from the cart?</p>
          <div class="flex justify-end gap-3">
            <button @click="removeConfirmed"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200">
              Yes, Remove
            </button>
            <button @click="showModal = false"
              class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Clear Cart Modal -->
      <div v-if="showClearCartModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-xl p-6 w-80">
          <h3 class="text-lg font-semibold mb-4">Clear Cart</h3>
          <p class="mb-6">Are you sure you want to clear all items from the cart?</p>
          <div class="flex justify-end gap-3">
            <button @click="clearCartConfirmed"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200">
              Yes, Clear
            </button>
            <button @click="showClearCartModal = false"
              class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Global Toast -->
      <GlobalToast />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import axios from "axios"
import { useCartStore } from "@/stores/cartStore"
import { useAuthStore } from "@/stores/auth" // <-- added
import GlobalToast, { addToast } from "@/components/common/GlobalToast.vue"
import Confetti from '@/components/cart/confetti.vue'
import CartCard from '@/components/cart/CartCard.vue'
import EmptyCart from '@/components/cart/EmptyCart.vue'

const cart = useCartStore()
const auth = useAuthStore() // <-- added
const router = useRouter()
const route = useRoute()
const confettiRef = ref(null)
const discount = ref(0)
const vouchers = ref([])
const applicableVouchers = ref([])

// Helper Functions
const normalizeCartItems = () => {
  cart.items.forEach((item, index) => {
    if (!item._key) item._key = `${item.id}-${item.size || "default"}-${index}`
    if (!Array.isArray(item.categories)) item.categories = [item.categoryId || 0]
    if (!item.realPrice) item.realPrice = item.price
  })
}

const fetchVouchers = async () => {
  try {
    const res = await axios.get("https://api.streetstylestore.com/collections/sss_config/documents/voucher-listing?a=1&x-typesense-api-key=F5gdSFxpg6bi8ZXfuybIsQy074HtBDkC")
    const data = JSON.parse(res.data.data || "[]")
    vouchers.value = data.map(v => ({
      code: v.code || v.id_cart_rule,
      id_cart_rule: v.id_cart_rule,
      categoryId: Number(v.id_category),
      discount: parseFloat(v.discount_per_item || 0),
      minQty: parseInt(v.quantity || 1),
      category_name: v.category_name,
      link: v.link
    }))
    computeDiscounts()
  } catch (err) { console.error("Failed to load vouchers:", err) }
}

const goToVoucherLink = (link) => { if (link) router.push(link) }

const computeDiscounts = () => {
  if (!Array.isArray(cart.items)) return
  discount.value = 0
  applicableVouchers.value = []
  normalizeCartItems()

  const categoryGroups = {}
  cart.items.forEach(item => {
    item.categories.forEach(catId => {
      if (!categoryGroups[catId]) categoryGroups[catId] = []
      categoryGroups[catId].push(item)
    })
  })

  vouchers.value.forEach(v => {
    const itemsInCat = categoryGroups[v.categoryId] || []
    if (!itemsInCat.length) return

    let totalQty = itemsInCat.reduce((sum, i) => sum + i.quantity, 0)
    const fullGroups = Math.floor(totalQty / v.minQty)
    const discountedQty = fullGroups * v.minQty
    const leftoverQty = totalQty - discountedQty
    const remainingToUnlock = leftoverQty > 0 ? v.minQty - leftoverQty : 0

    let remainingDiscountQty = discountedQty
    const remainingPerItem = {}

    itemsInCat.forEach(item => {
      if (remainingDiscountQty > 0) {
        const qtyToDiscount = Math.min(item.quantity, remainingDiscountQty)
        item.discountQty = qtyToDiscount
        item.discountPerItem = v.discount
        item.discountApplied = qtyToDiscount > 0
        remainingDiscountQty -= qtyToDiscount
        remainingPerItem[item._key] = item.quantity > qtyToDiscount ? remainingToUnlock : 0
      } else {
        item.discountQty = 0
        item.discountPerItem = 0
        item.discountApplied = false
        remainingPerItem[item._key] = remainingToUnlock
      }
    })

    discount.value += itemsInCat.reduce((sum, i) => sum + (i.discountQty * (i.discountPerItem || 0)), 0)
    applicableVouchers.value.push({ ...v, remainingPerItem })
  })
}

const getItemVouchers = item => applicableVouchers.value.filter(v => item.categories.includes(v.categoryId))
const filteredItemVouchers = item => getItemVouchers(item).filter(v => v.remainingPerItem[item._key] >= 0)
const isVoucherApplied = item => getItemVouchers(item).some(v => v.remainingPerItem[item._key] === 0)
const getFinalPrice = item => item.discountApplied
  ? item.discountQty * (item.price - (item.discountPerItem || 0)) + (item.quantity - item.discountQty) * item.price
  : item.price * item.quantity

const sortedCartItems = computed(() => {
  const withDiscount = cart.items.filter(i => i.discountApplied)
  const withoutDiscount = cart.items.filter(i => !i.discountApplied)
  return [...withDiscount, ...withoutDiscount]
})

const cartSubtotal = computed(() => cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0))
const cartTotal = computed(() => cart.items.reduce((sum, i) => sum + getFinalPrice(i), 0))

const increaseQty = i => { cart.updateQuantity(i, i.quantity + 1, i.size); addToast('success', `+ ${i.name}`) }
const decreaseQty = i => { if (i.quantity > 1) { cart.updateQuantity(i, i.quantity - 1, i.size); addToast('warning', `- ${i.name}`) } }

const showModal = ref(false)
const modalItem = ref(null)
const confirmRemove = i => (modalItem.value = i, showModal.value = true)
const removeConfirmed = () => { cart.removeFromCart(modalItem.value); addToast('error', `${modalItem.value.name} removed from cart`); showModal.value = false }

const showClearCartModal = ref(false)
const confirmClearCart = () => showClearCartModal.value = true
const clearCartConfirmed = () => { cart.clearCart(); addToast('update', 'Cart cleared'); showClearCartModal.value = false }

// Updated checkout logic
const checkout = () => {
  if (!cart.items.length) {
    addToast('error', "Cart empty")
    return
  }

  if (!auth.isAuthenticated) {
    addToast('warning', "Please login first")
    setTimeout(() => router.push("/login"), 2000) // redirect after toast
    return
  }

  router.push("/checkout")
}

const slugify = t => t?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
const goToDetail = i => router.push(`/${route.params.parent || "products"}/${slugify(i.categories?.[0] || "general")}/${slugify(i.name || "item")}/${i.id}`)

watch(() => cart.items, computeDiscounts, { deep: true })
watch(discount, (newDiscount, oldDiscount) => { if (newDiscount > oldDiscount) setTimeout(() => { confettiRef.value?.triggerConfetti() }, 700) })

onMounted(async () => { 
  cart.loadCart()
  normalizeCartItems()
  await fetchVouchers()
  auth.initAuth() // <-- load auth session
})
</script>

<style>
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(20px); }
</style>
