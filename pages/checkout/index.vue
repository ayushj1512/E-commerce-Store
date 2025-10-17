<template>
  <div v-if="mounted" class="bg-gray-50 min-h-screen py-6 px-3 sm:px-6 md:px-12 lg:px-24">
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- 1) CART (TOP) -->
      <CartSummary
        :cart="cart"
        :selectedPayment="selectedPayment"
        @update:selectedPayment="selectedPayment = $event"
      />

      <!-- 2) DELIVERY ADDRESS -->
      <div>
        <CheckoutAddressSelector />
      </div>

      <!-- 3) PAYMENT OPTIONS -->
      <PaymentOptions
        :cart="cart"
        v-model="selectedPayment"
        :bnplPlan="bnplPlan"
      />

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
            <span>+ ₹{{ cart.COD_CHARGE }}</span>
          </div>

          <div
            v-if="selectedPayment === 'cod'"
            class="flex items-center justify-center gap-2 bg-green-50 border border-green-300 text-green-700 rounded-lg py-2 px-4 mx-auto mt-2 text-sm sm:text-base font-semibold shadow-sm animate-pulse-fast"
          >
            <span class="text-lg">💰</span>
            <span>Pay Online & Save ₹{{ cart.COD_CHARGE }}</span>
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
import CartSummary from "~/components/checkout/CartSummary.vue";
import PaymentOptions from "~/components/checkout/PaymentOptions.vue";
import { Shield, Repeat, RefreshCw, CreditCard, ArrowRight } from "lucide-vue-next";
import axios from "axios";

const cart = useCartStore();
const addressStore = useAddressStore();
const checkout = useCheckoutStore();
const orderStore = useOrdersStore();
const router = useRouter();

const mounted = ref(false);
// By default, no payment option selected
const selectedPayment = ref("");
const bnplPlan = ref(null);

const subtotal = computed(() => cart.subtotal);
const discount = computed(() => cart.discount);
const totalItems = computed(() => cart.totalQuantity);
const totalWithCod = computed(() => cart.total);

const fetchSnapmintPlan = async () => {
  try {
    const res = await axios.get(`https://api.snapmint.com/v1/public/merchant_plans`, {
      params: {
        order_value: totalWithCod.value,
        subvention: "undefined",
        udf1: "",
        skuid: "undefined",
        page: "products_page",
        merchant_id: 1460,
      },
    });
    if (res.data?.status === "Success" && res.data.plans.length > 0) {
      bnplPlan.value = res.data.plans[0];
    }
  } catch (err) {
    console.error("Error fetching Snapmint plan:", err);
    bnplPlan.value = null;
  }
};

async function handleOrder() {
  if (!addressStore.deliveryAddress) {
    alert("Please select a delivery address before proceeding.");
    return;
  }

  if (!selectedPayment.value) {
    alert("Please select a payment method before proceeding.");
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
  fetchSnapmintPlan();
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
