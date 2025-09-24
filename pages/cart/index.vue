<template>
  <div class="bg-gray-50 min-h-screen p-4 md:p-8">
    <div class="flex flex-col md:flex-row gap-6">

      <!-- Empty Cart -->
      <EmptyCart v-if="!Array.isArray(cart.items) || cart.items.length === 0" class="w-full" />

      <!-- Cart Items & Summary -->
      <template v-else>
        <!-- Items -->
        <div class="w-full md:w-2/3 space-y-4">
          <div 
            v-for="item in cart.items" 
            :key="item._key" 
            class="border rounded-2xl shadow-sm hover:shadow-lg transition bg-white"
          >
            <!-- Voucher strip (per item) -->
            <div v-for="(ctx, idx) in getItemVouchers(item)" :key="idx" 
                 :class="[
                   'px-4 py-2 border-b rounded-t-2xl font-medium text-sm flex items-center gap-2',
                   ctx.remainingPerItem[item._key] > 0 
                     ? 'bg-black text-white border-gray-700' 
                     : 'bg-green-50 text-green-700 border-green-500'
                 ]"
            >
              🎉 Eligible for
              <span class="uppercase font-semibold">{{ ctx.category_name }}</span>
              offer
              <span v-if="ctx.remainingPerItem[item._key] > 0" class="ml-1 text-gray-400">
                (Add {{ ctx.remainingPerItem[item._key] }} more to unlock full discount)
              </span>
              <span v-else class="ml-1 font-bold">
                Extra Discount Applied!
              </span>
            </div>

            <!-- Product details -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
              <div @click="goToDetail(item)" class="flex items-start sm:items-center space-x-4 mb-4 sm:mb-0 cursor-pointer flex-1">
                <img :src="item.image" alt="Product" class="w-20 h-24 object-cover rounded-xl" />
                <div>
                  <h2 class="font-semibold text-lg" :class="isVoucherApplied(item) ? 'text-green-700' : 'text-gray-900'">
                    {{ item.name }}
                  </h2>
                  <p v-if="item.size" class="text-sm text-gray-500">Size: {{ item.size }}</p>
                  <div class="mt-1">
                    <span v-if="item.discountApplied" :class="isVoucherApplied(item) ? 'line-through text-gray-400 mr-2' : 'line-through text-gray-300 mr-2'">
                      ₹{{ item.price * item.quantity }}
                    </span>
                    <span class="font-bold text-lg" :class="isVoucherApplied(item) ? 'text-green-700' : 'text-gray-900'">
                      ₹{{ getFinalPrice(item) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <button @click.stop="decreaseQty(item)" class="px-2 py-1 border rounded-lg hover:bg-gray-200">-</button>
                <span class="font-semibold">{{ item.quantity }}</span>
                <button @click.stop="increaseQty(item)" class="px-2 py-1 border rounded-lg hover:bg-gray-200">+</button>
                <button @click.stop="confirmRemove(item)" class="ml-3 text-red-500 hover:underline text-sm">Remove</button>
              </div>
            </div>
          </div>
        </div>

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

          <div class="flex justify-between font-bold text-2xl mt-6 border-t pt-4 text-gray-900">
            <span>Total Amount</span>
            <span>₹{{ cartTotal }}</span>
          </div>

          <button @click="checkout" class="w-full bg-black text-white py-3 rounded-xl mt-6 hover:bg-gray-800 font-semibold">
            Proceed to Checkout
          </button>
          <button @click="confirmClearCart" class="w-full bg-red-500 text-white py-3 rounded-xl mt-3 hover:bg-red-600 font-semibold">
            Clear Cart
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import axios from "axios"
import { useCartStore } from "@/stores/cartStore"
import EmptyCart from "@/components/cart/EmptyCart.vue"

const router = useRouter()
const route = useRoute()
const cart = useCartStore()

const discount = ref(0)
const vouchers = ref([])
const applicableVouchers = ref([])
let toast = null

// Fetch vouchers
const fetchVouchers = async () => {
  try {
    const res = await axios.get(
      "https://api.streetstylestore.com/collections/sss_config/documents/voucher-listing?a=1&x-typesense-api-key=F5gdSFxpg6bi8ZXfuybIsQy074HtBDkC"
    )
    const data = JSON.parse(res.data.data || "[]")
    vouchers.value = data.map(v => ({
      code: v.code || v.id_cart_rule,
      id_cart_rule: v.id_cart_rule,
      categoryId: Number(v.id_category),
      discount: parseFloat(v.discount_per_item || 0),
      minQty: parseInt(v.quantity || 1),
      category_name: v.category_name
    }))
    computeDiscounts()
  } catch (err) {
    console.error("Failed to load vouchers:", err)
  }
}

// Compute discounts so only first N items eligible
const computeDiscounts = () => {
  if (!Array.isArray(cart.items)) return

  discount.value = 0
  applicableVouchers.value = []

  vouchers.value.forEach(v => {
    const matchingItems = cart.items.filter(item => (item.categories || []).includes(v.categoryId))
    const totalQty = matchingItems.reduce((sum, i) => sum + i.quantity, 0)

    // Track how much discount to apply per item
    let remainingQtyForDiscount = Math.floor(totalQty / v.minQty) * v.minQty
    const remainingPerItem = {}

    matchingItems.forEach(item => {
      if (!item.realPrice || item.realPrice === 0) item.realPrice = item.price
      const qtyToDiscount = Math.min(item.quantity, remainingQtyForDiscount)
      item.discountPrice = v.discount * qtyToDiscount
      item.discountApplied = qtyToDiscount > 0
      remainingQtyForDiscount -= qtyToDiscount

      // For remaining items, show how many more to unlock
      remainingPerItem[item._key] = Math.max(v.minQty - qtyToDiscount, 0)
    })

    discount.value += v.discount * (Math.floor(totalQty / v.minQty) * v.minQty)
    if (matchingItems.length > 0) applicableVouchers.value.push({ ...v, remainingPerItem })
  })
}

// Get vouchers for each item
const getItemVouchers = (item) => applicableVouchers.value.filter(ctx => (item.categories || []).includes(ctx.categoryId))

// Check if voucher fully applied for item
const isVoucherApplied = (item) => {
  const vouchersForItem = getItemVouchers(item)
  return vouchersForItem.some(v => v.remainingPerItem[item._key] === 0)
}

// Final price per item
const getFinalPrice = (item) => {
  const voucher = getItemVouchers(item).find(v => v.remainingPerItem[item._key] === 0)
  return voucher ? item.price * item.quantity - (item.discountPrice || 0) : item.price * item.quantity
}

// Watch cart changes
watch(() => cart.items, computeDiscounts, { deep: true })

onMounted(async () => {
  if (typeof window !== "undefined") toast = (await import("vue-toastification")).useToast()
  cart.loadCart()
  if (cart.fetchVouchers) await cart.fetchVouchers()
  await fetchVouchers()
})

// Computed totals
const cartSubtotal = computed(() => Array.isArray(cart.items) ? cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0) : 0)
const cartTotal = computed(() => Array.isArray(cart.items) ? Array.from(cart.items).reduce((sum, i) => sum + getFinalPrice(i), 0) : 0)

// Quantity functions
const increaseQty = i => {
  cart.updateQuantity(i, i.quantity + 1, i.size)
  toast?.info(`+ ${i.name}`, { timeout: 1800 })
}
const decreaseQty = i => {
  if (i.quantity > 1) {
    cart.updateQuantity(i, i.quantity - 1, i.size)
    toast?.warning(`- ${i.name}`, { timeout: 1800 })
  }
}

// Remove item
const showModal = ref(false)
const modalItem = ref(null)
const confirmRemove = i => (modalItem.value = i, showModal.value = true)
const removeConfirmed = () => {
  cart.removeFromCart(modalItem.value)
  toast?.error(`${modalItem.value.name} removed`)
  showModal.value = false
}

// Clear cart
const showClearCartModal = ref(false)
const confirmClearCart = () => showClearCartModal.value = true
const clearCartConfirmed = () => {
  cart.clearCart()
  toast?.error("All items removed")
  showClearCartModal.value = false
}

// Checkout
const checkout = () => {
  if (!Array.isArray(cart.items) || cart.items.length === 0) toast?.error("Cart empty")
  else { toast?.success("Proceeding..."); setTimeout(() => router.push("/checkout"), 500) }
}

// Navigate to product detail
const slugify = t => t?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
const goToDetail = i => router.push(`/${route.params.parent || "products"}/${slugify(i.categories?.[0] || "general")}/${slugify(i.name || "item")}/${i.id}`)
</script>

