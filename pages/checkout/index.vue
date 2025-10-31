<template>
  <div v-if="mounted" class="bg-gray-50 min-h-screen py-6 px-3 sm:px-6 md:px-12 lg:px-24">
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- 1️⃣ CART (TOP) -->
      <CartSummary :cart="cart" />

      <!-- 2️⃣ DELIVERY ADDRESS -->
      <div>
        <CheckoutAddressSelector />
      </div>

      <!-- 3️⃣ PAYMENT SUMMARY (no payment options) -->
      <section class="bg-white p-6 rounded-2xl shadow-md">
        <div class="bg-black rounded-t-2xl -mx-6 -mt-6 p-4">
          <h2 class="text-xl font-bold text-white">ORDER SUMMARY</h2>
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

          <div class="flex justify-between font-bold text-lg border-t pt-2">
            <span>TOTAL AMOUNT</span>
            <span>₹{{ totalWithCod }}</span>
          </div>

          <div class="pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <!-- Trust icons -->
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex items-center gap-2">
                <Shield class="w-5 h-5 text-green-600" />
                <span class="text-sm font-medium">Secure Checkout</span>
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

            <!-- Proceed to Payment Button -->
            <div class="flex items-center gap-3">
              <button
                @click="goToPayment"
                class="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <CreditCard class="w-5 h-5" />
                <span>PROCEED TO PAYMENT • ₹{{ totalWithCod }}</span>
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
import { useRouter } from "vue-router";
import CheckoutAddressSelector from "~/components/checkout/CheckoutAddressSelector.vue";
import CartSummary from "~/components/checkout/CartSummary.vue";
import { Shield, Repeat, RefreshCw, CreditCard, ArrowRight } from "lucide-vue-next";

const cart = useCartStore();
const addressStore = useAddressStore();
const checkout = useCheckoutStore();
const router = useRouter();

const mounted = ref(false);

const subtotal = computed(() => cart.subtotal);
const discount = computed(() => cart.discount);
const totalWithCod = computed(() => cart.total);

// ✅ Proceed to Payment button logic
function goToPayment() {
  if (!addressStore.deliveryAddress) {
    alert("Please select a delivery address before proceeding.");
    return;
  }

  // Save order progress
  checkout.setOrder({
    orderItems: cart.items.map(item => ({
      id: item.id,
      name: item.name,
      variant: item.variant || "",
      image: item.images?.[0]?.img || "",
      quantity: item.quantity,
      price: cart.getFinalPrice(item),
    })),
    subtotal: subtotal.value,
    discount: discount.value,
    total: totalWithCod.value,
    deliveryAddress: addressStore.deliveryAddress,
    billingAddress: addressStore.billingAddress || addressStore.deliveryAddress,
    orderReference: "REF" + Date.now(),
    orderDate: new Date().toLocaleString(),
  });

  // Navigate to payment page
  router.push("/checkout/payment");
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

/* Faster subtle pulse animation for the promo message */
@keyframes pulse-fast {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.02); }
}
.animate-pulse-fast {
  animation: pulse-fast 1.2s ease-in-out infinite;
}
</style>
