<template>
  <div v-if="mounted" class="bg-gray-50 min-h-screen py-6 px-3 sm:px-6 md:px-12 lg:px-24">
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- 1) CART (TOP) -->
      <section class="bg-white p-6 rounded-2xl shadow-md">
        <div class="bg-black rounded-t-2xl -mx-6 -mt-6 p-3">
          <h2 class="text-xl font-bold text-white">YOUR CART</h2>
        </div>

        <div v-if="!Array.isArray(cart.items) || cart.items.length === 0" class="text-center py-6">
          <p class="text-gray-600 text-sm sm:text-base">Your cart is empty.</p>
        </div>

        <div v-else class="space-y-4 pt-2">
          <div
            v-for="item in cart.items"
            :key="item._key || item.id + (item.size || '')"
            class="flex justify-between items-center border-b pb-3"
          >
            <div class="flex items-center gap-3">
              <img :src="item.image" alt="Product" class="w-16 h-20 object-cover rounded-xl" />
              <div>
                <p class="font-medium text-gray-800">{{ item.name }}</p>
                <p v-if="item.size" class="text-gray-500 text-sm">Size: {{ item.size }}</p>
                <p class="text-gray-900 font-semibold">₹{{ item.price }} x {{ item.quantity }}</p>
              </div>
            </div>
            <p class="font-semibold text-gray-900">₹{{ (item.price || 0) * (item.quantity || 0) }}</p>
          </div>

          <!-- small inline summary -->
          <div class="mt-4 flex justify-between items-center text-gray-700 flex-wrap gap-2">
            <div class="text-sm">
              Total items: <span class="font-semibold">{{ totalItems }}</span>
            </div>
            <div class="text-sm">
              Subtotal: <span class="font-semibold">₹{{ subtotal }}</span>
            </div>
            <div class="text-sm">
              Discount: -₹{{ discount }}
            </div>
            <div class="text-lg font-bold mt-1">
              Total: ₹{{ total }}
            </div>
          </div>

          <!-- Friendly savings message -->
          <div class="mt-2 p-3 bg-yellow-100 rounded-lg text-center text-yellow-800 font-medium">
            🎉 Can't miss this! You're saving ₹{{ discount }} on this order.
          </div>
        </div>
      </section>

      <!-- 2) DELIVERY ADDRESS -->
      <div><CheckoutAddressSelector /></div>

      <!-- 3) PAYMENT OPTIONS -->
      <section class="bg-white p-6 rounded-2xl shadow-md">
        <div class="bg-black rounded-t-2xl -mx-6 -mt-6 p-4">
          <h2 class="text-xl font-bold text-white">PAYMENT OPTIONS</h2>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-4">
          <label
            class="flex items-center justify-between cursor-pointer border rounded-xl p-3 hover:shadow-md transition"
            :class="selectedPayment === 'cod' ? 'border-black shadow-md' : 'border-gray-300'"
          >
            <div class="flex items-center gap-3">
              <input type="radio" value="cod" v-model="selectedPayment" class="accent-black" />
              <div>
                <p class="font-medium">Cash on Delivery</p>
                <p class="text-xs text-gray-500">Not available on this order. ₹99 COD charge if applicable.</p>
              </div>
            </div>
          </label>

          <label
            class="flex items-center justify-between cursor-pointer border rounded-xl p-3 hover:shadow-md transition"
            :class="selectedPayment === 'bnpl' ? 'border-black shadow-md' : 'border-gray-300'"
          >
            <div class="flex items-center gap-3">
              <input type="radio" value="bnpl" v-model="selectedPayment" class="accent-black" />
              <div>
                <p class="font-medium">Buy Now Pay Later</p>
                <p class="text-xs text-gray-500">Pay ₹{{ bnplNow }} now + 2 monthly payments of ₹{{ bnplLater }} later</p>
              </div>
            </div>
          </label>

          <label
            class="flex items-center justify-between cursor-pointer border rounded-xl p-3 hover:shadow-md transition"
            :class="selectedPayment === 'upi' ? 'border-black shadow-md' : 'border-gray-300'"
          >
            <div class="flex items-center gap-3">
              <input type="radio" value="upi" v-model="selectedPayment" class="accent-black" />
              <span class="font-medium">UPI (GooglePay / PhonePe / PayTM)</span>
            </div>
          </label>

          <label
            class="flex items-center justify-between cursor-pointer border rounded-xl p-3 hover:shadow-md transition"
            :class="selectedPayment === 'card' ? 'border-black shadow-md' : 'border-gray-300'"
          >
            <div class="flex items-center gap-3">
              <input type="radio" value="card" v-model="selectedPayment" class="accent-black" />
              <span class="font-medium">Credit / Debit Card (Visa / Master / Amex)</span>
            </div>
          </label>

          <label
            class="flex items-center justify-between cursor-pointer border rounded-xl p-3 hover:shadow-md transition"
            :class="selectedPayment === 'netbanking' ? 'border-black shadow-md' : 'border-gray-300'"
          >
            <div class="flex items-center gap-3">
              <input type="radio" value="netbanking" v-model="selectedPayment" class="accent-black" />
              <span class="font-medium">Net Banking</span>
            </div>
          </label>
        </div>
      </section>

      <!-- 4) ORDER SUMMARY -->
      <section class="bg-white p-6 rounded-2xl shadow-md">
        <div class="bg-black rounded-t-2xl -mx-6 -mt-6 p-4">
          <h2 class="text-xl font-bold text-white">ORDER SUMMARY</h2>
        </div>

        <div class="space-y-3 text-gray-700 mt-4">
          <div class="flex justify-between font-medium">
            <span>Total Items</span>
            <span>{{ totalItems }}</span>
          </div>

          <div class="flex justify-between font-medium">
            <span>Subtotal</span>
            <span>₹{{ subtotal }}</span>
          </div>

          <div class="flex justify-between font-medium">
            <span>Discount</span>
            <span>-₹{{ discount }}</span>
          </div>

          <div class="flex justify-between font-bold text-lg border-t pt-2">
            <span>TOTAL PAYMENT</span>
            <span>₹{{ total }}</span>
          </div>

          <div class="pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

            <!-- Icons section -->
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex items-center gap-2">
                <lucide-shield class="w-5 h-5 text-green-600" />
                <span class="text-sm font-medium">Secure Payment</span>
              </div>
              <div class="flex items-center gap-2">
                <lucide-repeat class="w-5 h-5 text-green-600" />
                <span class="text-sm font-medium">Easy Exchange</span>
              </div>
              <div class="flex items-center gap-2">
                <lucide-refresh-cw class="w-5 h-5 text-green-600" />
                <span class="text-sm font-medium">Fast Refunds</span>
              </div>
            </div>

            <!-- Proceed button -->
            <div class="flex items-center gap-3">
              <button @click="proceedToPayment"
                class="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
                <lucide-credit-card class="w-5 h-5" />
                <span>PROCEED TO PAYMENT • ₹{{ total }}</span>
                <lucide-arrow-right class="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "~/stores/cartStore";
import { useAddressStore } from "~/stores/address";
import { useRouter } from "vue-router";
import CheckoutAddressSelector from "~/components/checkout/CheckoutAddressSelector.vue";

import { 
  Shield, Repeat, RefreshCw, CreditCard, ArrowRight 
} from "lucide-vue-next";

const cart = useCartStore();
const addressStore = useAddressStore();
const router = useRouter();

const mounted = ref(false);
const selectedPayment = ref("cod");

const discount = 199; // example discount

// totals
const subtotal = computed(() =>
  Array.isArray(cart.items)
    ? cart.items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0)
    : 0
);
const totalItems = computed(() =>
  Array.isArray(cart.items)
    ? cart.items.reduce((acc, item) => acc + (item.quantity || 0), 0)
    : 0
);
const total = computed(() => subtotal.value - discount);

const bnplNow = computed(() => Math.round(total.value / 3));
const bnplLater = computed(() => bnplNow.value);

function proceedToPayment() {
  if (!addressStore.deliveryAddress) {
    alert("Please select a delivery address before proceeding.");
    return;
  }
  router.push("/checkout/payment");
}

onMounted(() => {
  mounted.value = true;
});
</script>

<style scoped>
input:checked {
  accent-color: black;
}
</style>
