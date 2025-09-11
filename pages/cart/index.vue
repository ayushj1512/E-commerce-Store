<template>
  <div class="bg-gray-50 min-h-screen p-4 md:p-8">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- If cart is empty -->
      <EmptyCart v-if="cart.items.length === 0" class="w-full" />

      <!-- If cart has items -->
      <template v-else>
        <!-- Cart Items -->
        <div class="w-full md:w-2/3 space-y-4">
          <div
            v-for="item in cart.items"
            :key="item.id + '-' + (item.size ?? 'default')"
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded-2xl p-4 shadow-sm hover:shadow-lg transition bg-white"
          >
            <!-- Product Clickable Section -->
            <div
              class="flex items-start sm:items-center space-x-4 mb-4 sm:mb-0 cursor-pointer flex-1"
              @click="goToDetail(item)"
            >
              <img
                :src="item.image"
                alt="Product"
                class="w-20 h-24 object-cover rounded-xl"
              />
              <div>
                <h2 class="font-semibold text-lg">{{ item.name }}</h2>
                <p v-if="item.size" class="text-sm text-gray-500">
                  Size: {{ item.size }}
                </p>
                <p class="font-bold mt-1">₹{{ item.price }}</p>
              </div>
            </div>

            <!-- Quantity & Remove -->
            <div class="flex items-center space-x-3">
              <button
                @click.stop="decreaseQty(item)"
                class="px-2 py-1 border rounded-lg hover:bg-gray-200 transition"
              >
                -
              </button>
              <span class="font-semibold">{{ item.quantity }}</span>
              <button
                @click.stop="increaseQty(item)"
                class="px-2 py-1 border rounded-lg hover:bg-gray-200 transition"
              >
                +
              </button>
              <button
                @click.stop="confirmRemove(item)"
                class="ml-3 text-red-500 hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Summary Section -->
        <div
          class="w-full md:w-1/3 border rounded-2xl p-6 shadow-md bg-white md:sticky md:top-20 space-y-4"
        >
          <h2 class="text-xl font-bold mb-4">Order Summary</h2>

          <div class="flex justify-between text-gray-700">
            <span>Subtotal</span><span>₹{{ cart.totalPrice }}</span>
          </div>
          <div class="flex justify-between text-gray-700">
            <span>Delivery</span><span>₹{{ deliveryCharge }}</span>
          </div>
          <div class="flex justify-between text-gray-700">
            <span>Discount</span><span>-₹{{ discount }}</span>
          </div>

          <!-- Coupon -->
          <div class="mt-4">
            <label class="block mb-2 font-medium">Apply Coupon</label>
            <div class="flex gap-2">
              <input
                v-model="couponCode"
                type="text"
                placeholder="Enter code"
                class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                @click="applyCoupon"
                class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
              >
                Apply
              </button>
            </div>
          </div>

          <div class="flex justify-between font-bold text-lg mt-6 border-t pt-3">
            <span>Total</span>
            <span>₹{{ cart.totalPrice + deliveryCharge - discount }}</span>
          </div>

          <button
            @click="checkout"
            class="w-full bg-black text-white py-3 rounded-xl mt-6 hover:bg-gray-800 transition text-lg font-semibold"
          >
            Proceed to Checkout
          </button>

          <!-- Clear Cart Button -->
          <button
            @click="confirmClearCart"
            class="w-full bg-red-500 text-white py-3 rounded-xl mt-3 hover:bg-red-600 transition text-lg font-semibold"
          >
            Clear Cart
          </button>
        </div>
      </template>
    </div>

    <!-- Confirm Remove Item Modal -->
    <transition name="fade-scale">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative transform scale-95 transition-all"
        >
          <div class="text-red-500 text-center text-5xl mb-4">⚠️</div>
          <p class="text-lg font-semibold mb-6 text-center">
            Are you sure you want to remove
            <span class="text-red-500">"{{ modalItem?.name }}"</span> from your
            cart?
          </p>
          <div class="flex justify-center gap-4">
            <button
              @click="removeConfirmed"
              class="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
            >
              Yes, Remove
            </button>
            <button
              @click="showModal = false"
              class="flex-1 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Confirm Clear Cart Modal -->
    <transition name="fade-scale">
      <div
        v-if="showClearCartModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative transform scale-95 transition-all"
        >
          <div class="text-red-500 text-center text-5xl mb-4">🛒</div>
          <p class="text-lg font-semibold mb-6 text-center">
            Are you sure you want to
            <span class="text-red-500">clear your entire cart</span>?
          </p>
          <p class="text-sm text-gray-500 text-center mb-4">
            This action cannot be undone.
          </p>
          <div class="flex justify-center gap-4">
            <button
              @click="clearCartConfirmed"
              class="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
            >
              Yes, Clear All
            </button>
            <button
              @click="showClearCartModal = false"
              class="flex-1 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
            >
              Cancel
            </button>
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

const router = useRouter()
const route = useRoute()
const cart = useCartStore()

// coupon & totals
const couponCode = ref("")
const discount = ref(0)
const deliveryCharge = 40

// Toast
let toast = null
onMounted(async () => {
  if (typeof window !== "undefined") {
    const Toastification = await import("vue-toastification")
    const { useToast } = Toastification
    toast = useToast()
  }
})

// qty functions
const increaseQty = (item) => {
  cart.updateQuantity(item.id, item.quantity + 1, item.size)
  toast?.info(`Increased quantity of ${item.name}`, {
    timeout: 1800,
    position: "top-right",
  })
}

const decreaseQty = (item) => {
  if (item.quantity > 1) {
    cart.updateQuantity(item.id, item.quantity - 1, item.size)
    toast?.warning(`Decreased quantity of ${item.name}`, {
      timeout: 1800,
      position: "top-right",
    })
  }
}

// modal remove
const showModal = ref(false)
const modalItem = ref(null)
const confirmRemove = (item) => {
  modalItem.value = item
  showModal.value = true
}
const removeConfirmed = () => {
  cart.removeFromCart(modalItem.value.id, modalItem.value.size)
  toast?.error(`${modalItem.value.name} removed from cart`, {
    timeout: 2500,
    position: "top-right",
  })
  showModal.value = false
}

// clear cart modal
const showClearCartModal = ref(false)
const confirmClearCart = () => {
  showClearCartModal.value = true
}
const clearCartConfirmed = () => {
  cart.clearCart()
  toast?.error("All items removed from cart", {
    timeout: 2500,
    position: "top-right",
  })
  showClearCartModal.value = false
}

// coupon
const applyCoupon = () => {
  if (couponCode.value.toLowerCase() === "save10") {
    discount.value = 200
    toast?.success("Coupon Applied! You saved ₹200", {
      timeout: 2500,
      position: "top-right",
    })
  } else {
    discount.value = 0
    toast?.warning("Invalid Coupon! Enter a valid code", {
      timeout: 2500,
      position: "top-right",
    })
  }
}

// checkout
const checkout = () => {
  if (cart.items.length === 0) {
    toast?.error("Your cart is empty!", { timeout: 2500, position: "top-right" });
    return;
  }
  toast?.success("Proceeding to checkout...", { timeout: 1800, position: "top-right" });
  setTimeout(() => router.push("/checkout"), 500); // <-- updated route
};
// slugify helper
const slugify = (text) =>
  text?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")

// navigate to product detail (same as products grid)
const goToDetail = (item) => {
  const categorySlug = slugify(item.category || "general")
  const productSlug = slugify(item.name || "item")
  const parent = route.params.parent || "products"

  router.push(`/${parent}/${categorySlug}/${productSlug}/${item.id}`)
}
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
