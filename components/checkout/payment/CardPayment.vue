<template>
  <div class="space-y-6">
    <!-- 💳 Card Payment Option -->
    <div
      class="relative border rounded-xl p-5 flex flex-col gap-4 cursor-pointer transition-all duration-300"
      :class="selected ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50'"
      @click="toggleSelect"
    >
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="p-3 rounded-full transition-all duration-300"
            :class="selected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'"
          >
            <CreditCard class="w-5 h-5" />
          </div>
          <div>
            <p class="font-medium text-gray-800">Credit / Debit Card</p>
            <p class="text-xs text-gray-500 mt-1">
              Pay securely using Visa, Mastercard, or Rupay cards.
            </p>
          </div>
        </div>

        <div v-if="selected" class="text-green-600">
          <Check class="w-5 h-5" />
        </div>
      </div>

      <!-- Expanded Section -->
      <transition name="fade-slide">
        <div
          v-if="selected"
          class="mt-4 border-t border-gray-200 pt-4 space-y-6"
          @click.stop
        >
          <!-- 💰 Total Payable -->
          <div
            class="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-green-100"
          >
            <span class="text-gray-600 font-medium">Total Payable</span>
            <span class="text-2xl font-extrabold text-green-700">
              ₹{{ cartStore.total }}
            </span>
          </div>

          <!-- 🧾 Card Payment Fields -->
          <div class="space-y-5">
            <div>
              <label class="block text-gray-700 font-medium text-sm mb-2">
                Enter your card details
              </label>
              <div class="grid gap-4">
                <div
                  id="card-number"
                  class="border rounded-lg p-3 bg-white min-h-[50px] flex items-center justify-center"
                >
                  <span class="text-gray-400 text-sm" v-if="!fieldsLoaded">
                    Loading card number field...
                  </span>
                </div>

                <div
                  id="card-holder"
                  class="border rounded-lg p-3 bg-white min-h-[50px] flex items-center justify-center"
                >
                  <span class="text-gray-400 text-sm" v-if="!fieldsLoaded">
                    Loading name field...
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div
                    id="card-expiry"
                    class="border rounded-lg p-3 bg-white min-h-[50px] flex items-center justify-center"
                  >
                    <span class="text-gray-400 text-sm" v-if="!fieldsLoaded">
                      Loading expiry...
                    </span>
                  </div>
                  <div
                    id="card-cvv"
                    class="border rounded-lg p-3 bg-white min-h-[50px] flex items-center justify-center"
                  >
                    <span class="text-gray-400 text-sm" v-if="!fieldsLoaded">
                      Loading CVV...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ✅ Proceed -->
          <div class="flex justify-end mt-6">
            <button
              @click.stop="submitCard"
              :disabled="!fieldsLoaded"
              class="px-6 py-2 rounded-lg font-medium shadow-sm transition-all duration-200
                text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                bg-green-600 hover:bg-green-700"
            >
              Pay Now
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { CreditCard, Check } from 'lucide-vue-next'
import { usePaymentStore } from '@/stores/paymentStore'
import { useCartStore } from '@/stores/cartStore'

// Props & Emits
const props = defineProps({ selected: Boolean })
const emit = defineEmits(['select'])

const cartStore = useCartStore()
const paymentStore = usePaymentStore()
const fieldsLoaded = ref(false)
let cashfree: any = null
let cardNumber: any, cardHolder: any, cardExpiry: any, cardCvv: any

// ✅ Toggle select/deselect (only header toggles)
const toggleSelect = () => {
  emit('select', props.selected ? '' : 'card')
}

// Load Cashfree when selected
watch(
  () => props.selected,
  async (isSelected) => {
    if (!isSelected) return
    await loadCashfree()
    mountCardFields()
  }
)

// ✅ Load Cashfree SDK
const loadCashfree = async () => {
  if (window.Cashfree) return
  await new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.js'
    script.onload = resolve
    document.head.appendChild(script)
  })
}

// ✅ Mount Cashfree Components
const mountCardFields = () => {
  if (!paymentStore.sessionId) {
    console.error('❌ No sessionId found in payment store')
    return
  }

  cashfree = Cashfree({ mode: 'sandbox' }) // change to 'production' later

  fieldsLoaded.value = false

  cardNumber = cashfree.create('cardNumber', { values: { placeholder: 'Enter card number' } })
  cardHolder = cashfree.create('cardHolder', { values: { placeholder: 'Name on card' } })
  cardExpiry = cashfree.create('cardExpiry', {})
  cardCvv = cashfree.create('cardCvv', {})

  cardNumber.mount('#card-number')
  cardHolder.mount('#card-holder')
  cardExpiry.mount('#card-expiry')
  cardCvv.mount('#card-cvv')

  let readyCount = 0
  const checkAllReady = () => {
    readyCount++
    if (readyCount >= 4) fieldsLoaded.value = true
  }

  cardNumber.on('ready', checkAllReady)
  cardHolder.on('ready', checkAllReady)
  cardExpiry.on('ready', checkAllReady)
  cardCvv.on('ready', checkAllReady)
}

// 🚀 Handle submit
const submitCard = async () => {
  console.log('💳 Submitting card payment...')
  // Later you’ll trigger cashfree.pay() with session ID
}
</script>

<style scoped>
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
