<template>
  <div
    class="relative border rounded-xl p-5 flex flex-col gap-4 cursor-pointer transition-all duration-300"
    :class="isSelected
      ? 'border-green-600 bg-green-50 shadow-sm'
      : 'border-gray-200 bg-white hover:bg-gray-50'"
    @click="handleSelect"
  >
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div
          class="p-3 rounded-full transition-all duration-300"
          :class="isSelected
            ? 'bg-green-100 text-green-600'
            : 'bg-gray-100 text-gray-500'"
        >
          <CreditCard class="w-5 h-5" />
        </div>
        <div>
          <p class="font-medium text-gray-800">Snapmint EMI</p>
          <p class="text-xs text-gray-500 mt-1">
            Pay later in easy EMIs via Snapmint.
          </p>
        </div>
      </div>
      <div v-if="isSelected" class="text-green-600">
        <Check class="w-5 h-5" />
      </div>
    </div>

    <!-- Expanded Section -->
    <transition name="fade-slide">
      <div
        v-if="isSelected"
        class="mt-4 border-t border-gray-200 pt-4 space-y-3"
      >
        <!-- 🕓 Loading -->
        <div v-if="loading" class="text-center text-sm text-gray-500">
          Checking Snapmint eligibility...
          <div class="mt-3 flex justify-center">
            <div
              class="loader border-4 border-gray-300 border-t-green-500 rounded-full w-6 h-6 animate-spin"
            ></div>
          </div>
        </div>

        <!-- ❌ Error -->
        <div
          v-else-if="error"
          class="text-red-600 text-sm font-semibold text-center"
        >
          {{ error }}
        </div>

        <!-- ✅ Eligible -->
        <div v-else>
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-700 font-medium">
              Eligible for Snapmint
            </p>
            <img
              src="https://assets.snapmint.com/assets/merchant/Logo.svg"
              alt="Snapmint"
              class="w-20 h-auto"
            />
          </div>

          <p class="text-xs text-gray-500">
            Buy now, pay later in easy EMIs with Snapmint.
          </p>

          <button
            @click.stop="initiateSnapmint"
            class="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 mt-3 transition flex items-center justify-center"
            :disabled="initiating"
          >
            <span v-if="!initiating">Proceed with Snapmint</span>
            <span v-else class="animate-pulse">Redirecting...</span>
          </button>
        </div>

        <!-- 🔒 Hidden form (auto-submitted when ready) -->
        <form
          v-if="paymentForm && snapMintPaymentAction"
          id="snapmintPayment"
          name="snapmint"
          method="post"
          :action="snapMintPaymentAction"
        >
          <div v-html="paymentForm"></div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { CreditCard, Check } from 'lucide-vue-next'
import { usePaymentStore } from '@/stores/paymentStore'

const props = defineProps({
  cartTotal: { type: Number, required: true },
})

const paymentStore = usePaymentStore()

const loading = ref(false)
const initiating = ref(false)
const error = ref(null)
const paymentForm = ref('')
const snapMintPaymentAction = ref('')

const API_BASE = 'https://gateway.streetstylestore.com/gateway/v1/'

// ✅ Computed helper
const isSelected = computed(() => paymentStore.isSelected('netbanking'))

// 🟢 Handle selection (relies on Pinia store mutual exclusion)
async function handleSelect() {
  paymentStore.selectMethod('snapmint')
  if (isSelected.value) {
    await checkEligibility()
  }
}

// 🧠 Check eligibility
async function checkEligibility() {
  try {
    loading.value = true
    error.value = null

    const payload = {
      type: 'info',
      gateway_action: 'order/snapmint/index',
      site: 'sss',
    }

    const { data } = await axios.post(`${API_BASE}order/snapmint/index`, payload)

    if (!data || data.snapMint !== true) {
      error.value = 'Snapmint not available for this order.'
    }
  } catch (e) {
    console.error(e)
    error.value = 'Unable to verify Snapmint eligibility. Please try again.'
  } finally {
    loading.value = false
  }
}

// 🚀 Initiate Snapmint payment
async function initiateSnapmint() {
  if (!isSelected.value) return

  try {
    initiating.value = true

    const payload = {
      amount: props.cartTotal,
      gateway_action: 'order/snapmint/initiate',
      site: 'sss',
    }

    const { data } = await axios.post(`${API_BASE}order/snapmint/initiate`, payload)

    if (data && data.snapMintPaymentAction && data.paymentForm) {
      snapMintPaymentAction.value = data.snapMintPaymentAction
      paymentForm.value = data.paymentForm

      // Auto-submit form
      setTimeout(() => {
        const form = document.getElementById('snapmintPayment')
        if (form) form.submit()
      }, 300)
    } else {
      error.value = 'Invalid Snapmint response received.'
    }
  } catch (e) {
    console.error(e)
    error.value = 'Failed to start Snapmint checkout.'
  } finally {
    initiating.value = false
  }
}

// 🔄 Watch for store change (auto close if another method is selected)
watch(
  () => paymentStore.selectedPaymentMethod,
  (newVal) => {
    if (newVal !== 'snapmint') {
      // cleanup when deselected
      error.value = null
      paymentForm.value = ''
      snapMintPaymentAction.value = ''
    }
  }
)
</script>

<style scoped>
.loader {
  border-top-color: #16a34a;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
