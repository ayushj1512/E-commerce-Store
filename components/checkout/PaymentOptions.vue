<template>
  <section class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
    <!-- Header -->
    <div class="bg-gradient-to-r from-black to-gray-800 p-5">
      <h2 class="text-xl font-semibold text-white tracking-wide flex items-center gap-2">
        💳 PAYMENT OPTIONS
      </h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-1 gap-4 p-6">
      <!-- COD -->
      <label
        class="relative flex items-center justify-between cursor-pointer border rounded-xl p-4 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        :class="selectedPaymentInternal === 'cod'
          ? 'border-green-500 shadow-xl bg-gradient-to-r from-green-100 to-green-200 selected'
          : 'border-gray-200'"
      >
        <div class="flex items-center gap-3">
          <input
            type="radio"
            value="cod"
            v-model="selectedPaymentInternal"
            @change="onPaymentChange('cod')"
            class="accent-green-500"
          />
          <div>
            <p class="font-medium">Cash on Delivery</p>
            <span
              v-if="selectedPaymentInternal === 'cod'"
              class="inline-block bg-red-100 text-red-700 px-2 py-0.5 rounded-md text-xs font-semibold"
            >
              ₹{{ cart.COD_CHARGE }} COD Charge Applied
            </span>
            <p v-else class="text-xs text-red-500 font-semibold mt-1">
              COD Charge ₹{{ cart.COD_CHARGE }} applicable
            </p>
          </div>
        </div>
      </label>

      <!-- BNPL -->
      <label
        class="relative flex flex-col cursor-pointer border rounded-xl p-4 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        :class="selectedPaymentInternal === 'bnpl'
          ? 'border-green-500 shadow-xl bg-gradient-to-r from-green-100 to-green-200 selected'
          : 'border-gray-200'"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <input
              type="radio"
              value="bnpl"
              v-model="selectedPaymentInternal"
              @change="onPaymentChange('bnpl')"
              class="accent-green-500"
            />
            <p class="font-medium">Buy Now Pay Later</p>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-xs text-gray-400">Powered by</span>
            <img src="https://assets.snapmint.com/assets/merchant/Logo.svg" alt="Snapmint" class="w-16 h-auto" />
          </div>
        </div>
        <p v-if="bnplPlan" class="text-xs text-gray-500 mt-2 ml-7">
          Pay ₹{{ bnplPlan.tdp }} now + 2 monthly payments of ₹{{ bnplPlan.tdp }} later
        </p>
        <p v-else class="text-xs text-gray-400 mt-2 ml-7 animate-pulse">Fetching BNPL details...</p>
      </label>

      <!-- UPI -->
      <label
        class="relative flex items-center justify-between cursor-pointer border rounded-xl p-4 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        :class="selectedPaymentInternal === 'upi'
          ? 'border-green-500 shadow-xl bg-gradient-to-r from-green-100 to-green-200 selected'
          : 'border-gray-200'"
      >
        <div class="flex items-center gap-3">
          <input
            type="radio"
            value="upi"
            v-model="selectedPaymentInternal"
            @change="onPaymentChange('upi')"
            class="accent-green-500"
          />
          <span class="font-medium">UPI (GooglePay / PhonePe / PayTM)</span>
        </div>
      </label>

      <!-- Credit / Debit Card -->
      <label
        class="relative flex items-center justify-between cursor-pointer border rounded-xl p-4 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        :class="selectedPaymentInternal === 'card'
          ? 'border-green-500 shadow-xl bg-gradient-to-r from-green-100 to-green-200 selected'
          : 'border-gray-200'"
      >
        <div class="flex items-center gap-3">
          <input
            type="radio"
            value="card"
            v-model="selectedPaymentInternal"
            @change="onPaymentChange('card')"
            class="accent-green-500"
          />
          <span class="font-medium">Credit / Debit Card</span>
        </div>
      </label>

      <!-- Net Banking -->
      <label
        class="relative flex items-center justify-between cursor-pointer border rounded-xl p-4 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        :class="selectedPaymentInternal === 'netbanking'
          ? 'border-green-500 shadow-xl bg-gradient-to-r from-green-100 to-green-200 selected'
          : 'border-gray-200'"
      >
        <div class="flex items-center gap-3">
          <input
            type="radio"
            value="netbanking"
            v-model="selectedPaymentInternal"
            @change="onPaymentChange('netbanking')"
            class="accent-green-500"
          />
          <span class="font-medium">Net Banking</span>
        </div>
      </label>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";

// Props
const props = defineProps({
  cart: {
    type: Object,
    required: true,
    default: () => ({
      COD_CHARGE: 0,
      setCOD: (val) => {},
    }),
  },
  modelValue: {
    type: String,
    default: "",
  },
  bnplPlan: {
    type: Object,
    default: null,
  },
});

// Emits
const emit = defineEmits(["update:modelValue"]);

// Internal state
const selectedPaymentInternal = ref(props.modelValue);

// Sync internal state with parent
watch(selectedPaymentInternal, (val) => {
  emit("update:modelValue", val);
});

// Handle payment change
const onPaymentChange = (paymentType) => {
  if (paymentType === "cod") props.cart.setCOD(true);
  else props.cart.setCOD(false);
  selectedPaymentInternal.value = paymentType;
};
</script>

<style scoped>
@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}
.selected {
  animation: pop 0.2s ease;
}
</style>
