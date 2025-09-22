<template>
  <div class="bg-gray-50 min-h-screen p-4 md:p-8">
    <div class="flex flex-col md:flex-row gap-6">

      <!-- Empty Cart -->
      <EmptyCart v-if="cart.items.length === 0" class="w-full" />

      <!-- Cart Items & Summary -->
      <template v-else>
        <!-- Items -->
        <div class="w-full md:w-2/3 space-y-4">
          <div
            v-for="item in cart.items"
            :key="item._key"
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded-2xl p-4 shadow-sm hover:shadow-lg transition bg-white"
          >
            <div @click="goToDetail(item)" class="flex items-start sm:items-center space-x-4 mb-4 sm:mb-0 cursor-pointer flex-1">
              <img :src="item.image" alt="Product" class="w-20 h-24 object-cover rounded-xl" />
              <div>
                <h2 class="font-semibold text-lg">{{ item.name }}</h2>
                <p v-if="item.size" class="text-sm text-gray-500">Size: {{ item.size }}</p>
                <p class="font-bold mt-1">₹{{ item.price }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <button @click.stop="decreaseQty(item)" class="px-2 py-1 border rounded-lg hover:bg-gray-200">-</button>
              <span class="font-semibold">{{ item.quantity }}</span>
              <button @click.stop="increaseQty(item)" class="px-2 py-1 border rounded-lg hover:bg-gray-200">+</button>
              <button @click.stop="confirmRemove(item)" class="ml-3 text-red-500 hover:underline text-sm">Remove</button>
            </div>
          </div>

          <!-- Eligible Voucher Messages -->
          <transition name="fade-scale" v-for="(ctx, idx) in cart.eligibleVouchers" :key="idx">
            <div
              v-if="ctx.remaining > 0 || ctx.remaining === 0"
              class="mb-4 px-6 py-4 bg-purple-50 border-l-4 border-purple-400 rounded-lg flex justify-between items-center"
            >
              <div class="text-purple-700 font-semibold">
                Eligible for <span class="uppercase">{{ ctx.voucher.category_name }}</span>
                <span v-if="ctx.remaining > 0" class="text-gray-500 font-normal ml-2">
                  (Add {{ ctx.remaining }} more to get this offer)
                </span>
              </div>
            </div>
          </transition>

        </div>

        <!-- Summary -->
        <div class="w-full md:w-1/3 border rounded-2xl p-6 shadow-md bg-white md:sticky md:top-20 space-y-4">
          <h2 class="text-xl font-bold mb-4">Order Summary</h2>
          <div class="flex justify-between text-gray-700"><span>Subtotal</span><span>₹{{ cart.totalPrice }}</span></div>
          <div class="flex justify-between text-gray-700"><span>Delivery</span><span>₹{{ deliveryCharge }}</span></div>
          <div class="flex justify-between text-gray-700"><span>Discount</span><span>-₹{{ discount }}</span></div>

          <div class="mt-4">
            <label class="block mb-2 font-medium">Apply Coupon</label>
            <div class="flex gap-2">
              <input v-model="couponCode" type="text" placeholder="Enter code" class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              <button @click="applyCoupon" class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm">Apply</button>
            </div>
          </div>

          <div class="flex justify-between font-bold text-lg mt-6 border-t pt-3">
            <span>Total</span>
            <span>₹{{ cart.totalPrice + deliveryCharge - discount }}</span>
          </div>

          <button @click="checkout" class="w-full bg-black text-white py-3 rounded-xl mt-6 hover:bg-gray-800 font-semibold">Proceed to Checkout</button>
          <button @click="confirmClearCart" class="w-full bg-red-500 text-white py-3 rounded-xl mt-3 hover:bg-red-600 font-semibold">Clear Cart</button>
        </div>
      </template>
    </div>

    <!-- Remove Item Modal -->
    <transition name="fade-scale">
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative transform scale-95 transition-all">
          <div class="text-red-500 text-center text-5xl mb-4">⚠️</div>
          <p class="text-lg font-semibold mb-6 text-center">
            Remove <span class="text-red-500">"{{ modalItem?.name }}"</span> from your cart?
          </p>
          <div class="flex justify-center gap-4">
            <button @click="removeConfirmed" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600">Yes, Remove</button>
            <button @click="showModal=false" class="flex-1 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Clear Cart Modal -->
    <transition name="fade-scale">
      <div v-if="showClearCartModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative transform scale-95 transition-all">
          <div class="text-red-500 text-center text-5xl mb-4">🛒</div>
          <p class="text-lg font-semibold mb-2 text-center">Clear your entire cart?</p>
          <p class="text-sm text-gray-500 text-center mb-4">This action cannot be undone.</p>
          <div class="flex justify-center gap-4">
            <button @click="clearCartConfirmed" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600">Yes, Clear All</button>
            <button @click="showClearCartModal=false" class="flex-1 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useCartStore } from "@/stores/cartStore"
import EmptyCart from "@/components/cart/EmptyCart.vue"

const router = useRouter(), route = useRoute(), cart = useCartStore()
const couponCode = ref(""), discount = ref(0), deliveryCharge = 40
let toast = null

onMounted(async () => {
  if (typeof window!=="undefined") toast = (await import("vue-toastification")).useToast()
  cart.loadCart()
  await cart.fetchVouchers()
})

// Quantity functions
const increaseQty = i => (cart.updateQuantity(i, i.quantity+1, i.size), toast?.info(`+ ${i.name}`, {timeout:1800}))
const decreaseQty = i => i.quantity>1 && (cart.updateQuantity(i, i.quantity-1, i.size), toast?.warning(`- ${i.name}`, {timeout:1800}))

// Remove item
const showModal=ref(false), modalItem=ref(null)
const confirmRemove=i=>(modalItem.value=i,showModal.value=true)
const removeConfirmed=()=> (cart.removeFromCart(modalItem.value),toast?.error(`${modalItem.value.name} removed`),showModal.value=false)

// Clear cart
const showClearCartModal=ref(false)
const confirmClearCart=()=>showClearCartModal.value=true
const clearCartConfirmed=()=> (cart.clearCart(),toast?.error("All items removed"),showClearCartModal.value=false)

// Coupon
const applyCoupon=()=> {
  discount.value = couponCode.value.toLowerCase()==="save10"?200:0
  toast?.[discount.value?"success":"warning"](discount.value?"Coupon Applied!":"Invalid Coupon")
}

// Checkout
const checkout=()=>cart.items.length===0?toast?.error("Cart empty"):(toast?.success("Proceeding..."),setTimeout(()=>router.push("/checkout"),500))

// Navigate to product detail
const slugify=t=>t?.toString().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)+/g,"")
const goToDetail=i=>router.push(`/${route.params.parent||"products"}/${slugify(i.categories?.[0]||"general")}/${slugify(i.name||"item")}/${i.id}`)
</script>


<style></style>