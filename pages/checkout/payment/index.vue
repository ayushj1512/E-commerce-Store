<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Secure Checkout
        </h1>
        <p class="text-gray-600 text-sm md:text-base">
          Choose your preferred payment method and complete your order securely.
        </p>
      </header>

      <!-- Checkout Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
        <!-- 🧾 Order Summary -->
        <section
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 border-b border-gray-200 pb-6 text-center sm:text-left"
        >
          <div class="flex items-center justify-center sm:justify-start gap-4">
            <div class="hidden sm:flex p-3 bg-green-50 rounded-full text-green-600">
              <WalletCards class="w-6 h-6" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-800">Order Summary</h2>
              <p class="text-gray-500 text-sm">Inclusive of all taxes and delivery</p>

              <!-- 💰 COD Charge Info -->
              <p
                v-if="paymentStore.selectedPaymentMethod === 'cod'"
                class="mt-2 text-sm text-red-500 font-medium"
              >
                ₹99 COD charge applied
              </p>
            </div>
          </div>

          <div class="sm:text-right">
            <h3 class="text-3xl sm:text-4xl font-extrabold text-green-600">
              ₹{{ finalTotal }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">Payable Amount</p>
          </div>
        </section>

        <!-- 🏷 Coupon Section -->
        <CouponSection @coupon-applied="handleCoupon" />

        <!-- 💳 Payment Methods -->
        <section>
          <h2 class="text-xl font-semibold text-gray-800 mb-5 text-center sm:text-left">
            Select Payment Method
          </h2>

          <div class="flex flex-col gap-4">
            <!-- 💚 UPI Payment -->
            <UpiPayment />

            <!-- 💳 Card Payment -->
            <CardPayment />

            <!-- 🟢 Snapmint Payment -->
            <SnapmintPayment :cart-total="finalTotal" />

            <!-- 🏦 NetBanking / Wallet -->
            <NetBanking />

            <!-- 💵 Cash on Delivery -->
            <CODPayment @open-cod-modal="openCODModal" />
          </div>
        </section>
      </div>

      <!-- 🔒 Trust Badges -->
      <div
        class="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-10 text-gray-500 text-sm"
      >
        <ShieldCheck class="w-5 h-5 text-green-600" />
        <span>256-bit SSL Encryption</span>
        <span>•</span>
        <span>RBI & PCI-DSS Compliant</span>
        <span>•</span>
        <span>Trusted Payment Gateways</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useAddressStore } from '@/stores/address'
import { useAuthStore } from '@/stores/auth'
import { usePaymentStore } from '@/stores/paymentStore'

import CouponSection from '@/components/checkout/payment/CouponSection.vue'
import SnapmintPayment from '@/components/checkout/payment/SnapmintPayment.vue'
import UpiPayment from '@/components/checkout/payment/UpiPayment.vue'
import CardPayment from '@/components/checkout/payment/CardPayment.vue'
import NetBanking from '@/components/checkout/payment/NetBanking.vue'
import CODPayment from '@/components/checkout/payment/CODPayment.vue'

import { WalletCards, ShieldCheck } from 'lucide-vue-next'

const cartStore = useCartStore()
const addressStore = useAddressStore()
const authStore = useAuthStore()
const paymentStore = usePaymentStore()

const couponDiscount = ref(0)
const showCODModal = ref(false)

// 🧾 Calculate Totals
const cartTotal = computed(() => cartStore.total || 0)
const finalTotal = computed(() => {
  const baseTotal =
    paymentStore.selectedPaymentMethod === 'cod'
      ? cartTotal.value + 99
      : cartTotal.value
  return Math.max(baseTotal - couponDiscount.value, 0)
})

// 🎟️ Handle Coupon Discount
function handleCoupon(discount: number) {
  couponDiscount.value = discount
}

// 💵 COD Modal Logic
function openCODModal() {
  showCODModal.value = true
}
function closeCODModal() {
  showCODModal.value = false
}
function confirmCOD() {
  closeCODModal()
  console.log('✅ COD confirmed!')
}

// 🟢 Default Payment Initialization (UPI)
onMounted(async () => {
  console.log('🛒 Checkout mounted — setting default method: UPI')
  paymentStore.selectMethod('upi')
  await paymentStore.proceedToPayment('upi')
})

// 🔄 Auto-update payment session when method changes
watch(
  () => paymentStore.selectedPaymentMethod,
  async (newMethod) => {
    if (!newMethod) return
    console.log(`💳 Payment method changed → ${newMethod}`)
    await paymentStore.proceedToPayment(newMethod)
  }
)
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
