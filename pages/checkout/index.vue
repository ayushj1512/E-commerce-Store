<template>
  <div v-if="mounted" class="bg-gray-50 min-h-screen py-6 px-3 sm:px-6 md:px-12 lg:px-24">
    <div class="max-w-5xl mx-auto space-y-8">

      <!-- Delivery Address Selector -->
      <CheckoutAddressSelector />

      <!-- Order Items -->
      <section class="bg-white p-6 rounded-2xl shadow-md">
        <h2 class="text-xl font-bold mb-4">Your Cart</h2>
        <div v-if="cart.items.length === 0" class="text-center py-6">
          <p class="text-gray-600 text-sm sm:text-base">Your cart is empty.</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="item in cart.items" :key="item.id + (item.size || '')" class="flex justify-between items-center border-b pb-3">
            <div class="flex items-center gap-3">
              <img :src="item.image" alt="Product" class="w-16 h-20 object-cover rounded-xl" />
              <div>
                <p class="font-medium text-gray-800">{{ item.name }}</p>
                <p v-if="item.size" class="text-gray-500 text-sm">Size: {{ item.size }}</p>
                <p class="text-gray-900 font-semibold">₹{{ item.price }} x {{ item.quantity }}</p>
              </div>
            </div>
            <p class="font-semibold text-gray-900">₹{{ item.price * item.quantity }}</p>
          </div>

          <!-- Summary -->
          <div class="mt-4 space-y-2 text-gray-700">
            <div class="flex justify-between font-medium">
              <span>Subtotal</span>
              <span>₹{{ subtotal }}</span>
            </div>
            <div class="flex justify-between font-medium">
              <span>Delivery</span>
              <span>₹{{ deliveryCharge }}</span>
            </div>
            <div class="flex justify-between font-medium">
              <span>Discount</span>
              <span>-₹{{ discount }}</span>
            </div>
            <div class="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{{ subtotal + deliveryCharge - discount }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Payment Method -->
      <section class="bg-white p-6 rounded-2xl shadow-md">
        <h2 class="text-xl font-bold mb-4">Payment Method</h2>
        <div class="space-y-2">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="radio" value="cod" v-model="selectedPayment" class="accent-black" />
            <span>Cash on Delivery</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="radio" value="card" v-model="selectedPayment" class="accent-black" />
            <span>Credit / Debit Card</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="radio" value="upi" v-model="selectedPayment" class="accent-black" />
            <span>UPI / Wallet</span>
          </label>
        </div>
      </section>

      <!-- Place Order Button -->
      <div class="flex justify-center mt-6">
        <button @click="placeOrder"
          class="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors w-full sm:w-auto">
          Place Order - ₹{{ subtotal + deliveryCharge - discount }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "~/stores/cartStore";
import { useAddressStore } from "~/stores/address";
import { useRouter } from "vue-router";

// Import the new address selector component
import CheckoutAddressSelector from "~/components/checkout/CheckoutAddressSelector.vue";

const cart = useCartStore();
const addressStore = useAddressStore();
const router = useRouter();
const mounted = ref(false);

const selectedPayment = ref("cod");
const deliveryCharge = 40;
const discount = 0;

onMounted(() => {
  mounted.value = true;
});

// Computed subtotal
const subtotal = computed(() =>
  cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
);

// Place order (dummy)
const placeOrder = () => {
  if (!addressStore.deliveryAddress.id_address) {
    alert("Please select a delivery address!");
    return;
  }
  alert(`Order placed successfully with ${selectedPayment.value.toUpperCase()}! Total: ₹${subtotal.value + deliveryCharge - discount}`);
  cart.clearCart();
  router.push("/order-success");
};
</script>

<style scoped>
input:checked {
  accent-color: black;
}
</style>
