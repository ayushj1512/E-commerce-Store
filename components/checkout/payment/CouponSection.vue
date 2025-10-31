<template>
  <section
    class="border-b border-gray-200 pb-6 max-w-2xl mx-auto mt-10 bg-white "
  >
    <!-- Title -->
    <h2 class="text-xl font-semibold text-gray-800 mb-4 text-center sm:text-left">
      Apply Coupon Code
    </h2>

    <!-- Input + Apply -->
    <div class="flex flex-col sm:flex-row gap-3 items-center">
      <input
        v-model="couponCode"
        type="text"
        placeholder="Enter coupon code"
        class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm sm:text-base"
      />
      <button
        @click="applyCoupon"
        class="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 w-full sm:w-auto text-sm sm:text-base"
      >
        Apply
      </button>
    </div>

    <!-- Available Coupons -->
    <div v-if="availableCoupons.length" class="mt-6">
      <p class="text-sm text-gray-600 mb-3 font-medium">
        Available Coupons (showing top 10):
      </p>

      <!-- Responsive Grid -->
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
      >
        <button
          v-for="coupon in availableCoupons.slice(0, 10)"
          :key="coupon.code"
          @click="selectCoupon(coupon.code)"
          :class="[
            'flex flex-col items-center justify-center px-3 py-3 border text-sm rounded-xl transition-all duration-200 cursor-pointer font-medium',
            appliedCoupon === coupon.code
              ? 'bg-green-100 border-green-400 text-green-700'
              : 'bg-gray-50 hover:bg-green-50 border-gray-200 text-gray-700'
          ]"
        >
          <span class="text-sm font-semibold">{{ coupon.code }}</span>
          <span class="text-gray-500 text-xs mt-0.5">₹{{ coupon.reduction_amount }}</span>
        </button>
      </div>
    </div>

    <!-- Success / Error Message -->
    <p
      v-if="couponMessage"
      :class="couponSuccess ? 'text-green-600' : 'text-red-600'"
      class="mt-4 text-sm sm:text-base text-center sm:text-left"
    >
      {{ couponMessage }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Emit event when a coupon is applied
const emit = defineEmits(['coupon-applied'])

// Reactive data
const couponCode = ref('')
const availableCoupons = ref<any[]>([])
const couponMessage = ref('')
const couponSuccess = ref(false)
const appliedCoupon = ref('')
const checkOutUrl = ref('')

// 🟢 Fetch available coupons from API
async function fetchCoupons() {
  try {
    const res = await axios.post(
      'https://gateway.streetstylestore.com/gateway/v1/',
      {
        gateway_action: 'cart/availableVoucher',
        site: 'streetstylestore',
        all: 0,
        user_hash_key: '3797e9a44450936d2c68b7cae1dced6c',
      },
      {
        headers: {
          'x-typesense-api-key':
            'Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx',
        },
      }
    )

    // Handle backend response
    if (res.data?.status && Array.isArray(res.data.voucherList)) {
      availableCoupons.value = res.data.voucherList
      checkOutUrl.value = res.data.checkOutUrl || ''
    } else {
      availableCoupons.value = []
    }
  } catch (error) {
    console.error('Error fetching coupons:', error)
    availableCoupons.value = []
  }
}

// 🟡 Apply coupon manually
function applyCoupon() {
  const found = availableCoupons.value.find(
    (c) => c.code.toLowerCase() === couponCode.value.trim().toLowerCase()
  )

  if (found) {
    const discountValue = parseFloat(found.reduction_amount) || 0
    couponSuccess.value = true
    couponMessage.value = `🎉 Coupon ${found.code} applied successfully! You saved ₹${discountValue}.`
    appliedCoupon.value = found.code
    emit('coupon-applied', {
      code: found.code,
      discount: discountValue,
      checkOutUrl: checkOutUrl.value,
    })
  } else {
    couponSuccess.value = false
    couponMessage.value = '❌ Invalid or unavailable coupon.'
    appliedCoupon.value = ''
    emit('coupon-applied', { code: null, discount: 0 })
  }
}

// 🟢 Select coupon from list
function selectCoupon(code: string) {
  couponCode.value = code
  applyCoupon()
}

// Load coupons on mount
onMounted(fetchCoupons)
</script>

<style scoped>
button {
  transition: transform 0.15s ease;
}
button:hover {
  transform: translateY(-2px);
}
</style>
