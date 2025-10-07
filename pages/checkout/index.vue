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
          <div v-for="item in cart.items" :key="item._key || item.id + (item.size || '')"
            class="flex justify-between items-center border-b pb-3">
            <div class="flex items-center gap-3">
              <img :src="item.image" alt="Product" class="w-16 h-20 object-cover rounded-xl" />
              <div>
                <p class="font-medium text-gray-800">{{ item.name }}</p>
                <p v-if="item.size" class="text-gray-500 text-sm">Size: {{ item.size }}</p>
                <p class="text-gray-900 font-semibold">
                  ₹{{ cart.getFinalPrice(item) }} ({{ item.quantity }}x ₹{{ item.price }})
                </p>
              </div>
            </div>
            <p class="font-semibold text-gray-900">₹{{ cart.getFinalPrice(item) }}</p>
          </div>

          <!-- inline summary -->
          <div class="mt-4 flex justify-between items-center text-gray-700 flex-wrap gap-2">
            <div class="text-sm">Total items: <span class="font-semibold">{{ totalItems }}</span></div>
            <div class="text-sm">Subtotal: <span class="font-semibold">₹{{ subtotal }}</span></div>
            <div class="text-sm">Discount: -₹{{ discount }}</div>
            <div v-if="selectedPayment === 'cod'" class="text-sm">
              Delivery Charges: <span class="font-semibold">₹{{ cart.COD_CHARGE }}</span>
            </div>
            <div class="text-lg font-bold mt-1">Total Payment: ₹{{ totalWithCod }}</div>
          </div>

          <div v-if="discount > 0" class="mt-2 p-3 bg-black rounded-lg text-center text-white font-medium">
            🎉 You're saving <span class="text-green-500">₹{{ discount }}</span> on this order.
          </div>

        </div>
      </section>

      <!-- 2) DELIVERY ADDRESS -->
      <div>
        <CheckoutAddressSelector />
      </div>

      <!-- 3) PAYMENT OPTIONS -->
      <section class="bg-white p-6 rounded-2xl shadow-md">
        <div class="bg-black rounded-t-2xl -mx-6 -mt-6 p-4">
          <h2 class="text-xl font-bold text-white">PAYMENT OPTIONS</h2>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-4">
          <!-- COD -->
          <label
            class="flex items-center justify-between cursor-pointer border rounded-xl p-3 hover:shadow-md transition"
            :class="selectedPayment === 'cod' ? 'border-black shadow-md' : 'border-gray-300'">
            <div class="flex items-center gap-3">
              <input type="radio" value="cod" v-model="selectedPayment" @change="cart.setCOD(true)"
                class="accent-black" />
              <div>
                <p class="font-medium">Cash on Delivery</p>
                <p class="text-xs text-gray-500" v-if="selectedPayment !== 'cod'">Pay Online & Save ₹{{ cart.COD_CHARGE
                  }}</p>
                <p class="text-xs text-gray-500" v-else>₹{{ cart.COD_CHARGE }} COD charge</p>
              </div>
            </div>
          </label>

          <!-- BNPL -->
          <label
            class="flex items-center justify-between cursor-pointer border rounded-xl p-3 hover:shadow-md transition"
            :class="selectedPayment === 'bnpl' ? 'border-black shadow-md' : 'border-gray-300'">
            <div class="flex items-center gap-3">
              <input type="radio" value="bnpl" v-model="selectedPayment" @change="cart.setCOD(false)"
                class="accent-black" />
              <div>
                <p class="font-medium">Buy Now Pay Later</p>
                <p class="text-xs text-gray-500">Pay ₹{{ bnplNow }} now + 2 monthly payments of ₹{{ bnplLater }} later
                </p>
              </div>
            </div>
          </label>

          <!-- Other payment methods -->
          <label
            class="flex items-center justify-between cursor-pointer border rounded-xl p-3 hover:shadow-md transition"
            :class="selectedPayment === 'upi' ? 'border-black shadow-md' : 'border-gray-300'">
            <div class="flex items-center gap-3">
              <input type="radio" value="upi" v-model="selectedPayment" @change="cart.setCOD(false)"
                class="accent-black" />
              <span class="font-medium">UPI (GooglePay / PhonePe / PayTM)</span>
            </div>
          </label>

          <label
            class="flex items-center justify-between cursor-pointer border rounded-xl p-3 hover:shadow-md transition"
            :class="selectedPayment === 'card' ? 'border-black shadow-md' : 'border-gray-300'">
            <div class="flex items-center gap-3">
              <input type="radio" value="card" v-model="selectedPayment" @change="cart.setCOD(false)"
                class="accent-black" />
              <span class="font-medium">Credit / Debit Card</span>
            </div>
          </label>

          <label
            class="flex items-center justify-between cursor-pointer border rounded-xl p-3 hover:shadow-md transition"
            :class="selectedPayment === 'netbanking' ? 'border-black shadow-md' : 'border-gray-300'">
            <div class="flex items-center gap-3">
              <input type="radio" value="netbanking" v-model="selectedPayment" @change="cart.setCOD(false)"
                class="accent-black" />
              <span class="font-medium">Net Banking</span>
            </div>
          </label>
        </div>
      </section>

      <!-- 4) PAYMENT SUMMARY -->
<section class="bg-white p-6 rounded-2xl shadow-md">
  <div class="bg-black rounded-t-2xl -mx-6 -mt-6 p-4">
    <h2 class="text-xl font-bold text-white">PAYMENT SUMMARY</h2>
  </div>

  <div class="space-y-3 text-gray-700 mt-4">
    <div class="flex justify-between font-medium">
      <span>Subtotal</span>
      <span>₹{{ subtotal }}</span>
    </div>

    <div v-if="discount > 0" class="flex justify-between font-medium">
      <span>Discount</span>
      <span class="text-green-500 font-semibold">-₹{{ discount }}</span>
    </div>

    <!-- Delivery Charges only if COD selected -->
    <div v-if="selectedPayment === 'cod'" class="flex justify-between font-medium">
      <span>Delivery Charges</span>
      <span>₹{{ cart.COD_CHARGE }}</span>
    </div>

    <!-- Pay Online & Save only if COD is selected -->
    <div v-if="selectedPayment === 'cod'" class="text-red-500 font-semibold text-center mt-2">
      💰 Pay Online & Save ₹{{ cart.COD_CHARGE }}
    </div>

    <div class="flex justify-between font-bold text-lg border-t pt-2">
      <span>TOTAL PAYMENT</span>
      <span>₹{{ totalWithCod }}</span>
    </div>

    <div class="pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <!-- Icons section -->
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <Shield class="w-5 h-5 text-green-600" />
          <span class="text-sm font-medium">Secure Payment</span>
        </div>
        <div class="flex items-center gap-2">
          <Repeat class="w-5 h-5 text-green-600" />
          <span class="text-sm font-medium">Easy Exchange</span>
        </div>
        <div class="flex items-center gap-2">
          <RefreshCw class="w-5 h-5 text-green-600" />
          <span class="text-sm font-medium">Fast Refunds</span>
        </div>
      </div>

      <!-- Proceed / Place Order button -->
      <div class="flex items-center gap-3">
        <button @click="handleOrder"
          class="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
          <CreditCard class="w-5 h-5" />
          <span>
            {{ selectedPayment === 'cod' ? `PLACE ORDER • ₹${totalWithCod}` : `PROCEED TO PAYMENT • ₹${totalWithCod}` }}
          </span>
          <ArrowRight class="w-5 h-5" />
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
import { useCheckoutStore } from "~/stores/checkoutStore";
import { useOrdersStore } from "~/stores/orders";
import { useRouter } from "vue-router";
import CheckoutAddressSelector from "~/components/checkout/CheckoutAddressSelector.vue";
import { Shield, Repeat, RefreshCw, CreditCard, ArrowRight } from "lucide-vue-next";

const cart = useCartStore();
const addressStore = useAddressStore();
const checkout = useCheckoutStore();
const orderStore = useOrdersStore();
const router = useRouter();

const mounted = ref(false);
const selectedPayment = ref(cart.codSelected ? "cod" : "bnpl");

const subtotal = computed(() => cart.subtotal);
const discount = computed(() => cart.discount);
const totalItems = computed(() => cart.totalQuantity);
const totalWithCod = computed(() => cart.total);

const bnplNow = computed(() => Math.round(totalWithCod.value / 3));
const bnplLater = computed(() => bnplNow.value);

async function handleOrder() {
  if (!addressStore.deliveryAddress) {
    alert("Please select a delivery address before proceeding.");
    return;
  }

  checkout.selectedPayment = selectedPayment.value;

  if (selectedPayment.value === "cod") {
    orderStore.setOrderItems(cart.items);
    orderStore.setOrderDetail({
      total: totalWithCod.value,
      subtotal: subtotal.value,
      discount: discount.value,
      deliveryAddress: addressStore.deliveryAddress,
      paymentMethod: selectedPayment.value,
    });

    const orderId = "ORD" + Date.now();
    orderStore.setOrderId(orderId);
    orderStore.setOrderReference("REF" + Date.now());

    alert("Order placed successfully!");
    cart.clearCart();
    router.push("/order-success");
  } else {
    cart.setCOD(false);
    router.push("/checkout/payment");
  }
}

onMounted(() => {
  mounted.value = true;
  cart.loadCart();
  cart.fetchVouchers();
});
</script>

<style scoped>
input:checked {
  accent-color: black;
}
</style>
