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
          <Landmark class="w-5 h-5" />
        </div>
        <div>
          <p class="font-medium text-gray-800">Netbanking Payment</p>
          <p class="text-xs text-gray-500 mt-1">
            Pay directly using your bank’s secure portal.
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
        class="mt-4 border-t border-gray-200 pt-4 space-y-6"
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

        <!-- 🏦 Cashfree Netbanking Component -->
        <div>
          <label class="block text-gray-700 font-medium text-sm mb-2">
            Select your bank
          </label>
          <div
            id="netbankingContainer"
            class="border rounded-lg p-3 bg-white min-h-[80px] flex items-center justify-center"
          >
            <span class="text-gray-400 text-sm" v-if="!netbankingLoaded">
              Loading available banks...
            </span>
          </div>
        </div>

        <!-- ✅ Proceed -->
        <div class="flex justify-end mt-6">
          <button
            @click.stop="proceedToPayment"
            :disabled="!netbankingLoaded || paymentStore.loading"
            class="px-6 py-2 rounded-lg font-medium shadow-sm transition-all duration-200
              text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              bg-green-600 hover:bg-green-700"
          >
            {{ paymentStore.loading ? 'Processing...' : 'Proceed to Pay' }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Landmark, Check } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cartStore'
import { usePaymentStore } from '@/stores/paymentStore'
import { useNuxtApp } from '#app'

const cartStore = useCartStore()
const paymentStore = usePaymentStore()
const { $cashfree } = useNuxtApp()

const netbankingLoaded = ref(false)
let netbankingInstance: any = null

// ✅ Computed: whether this payment method is selected
const isSelected = computed(() => paymentStore.isSelected('snapmint'))

// 🧹 Cleanup on unmount
onBeforeUnmount(() => {
  destroyNetbanking()
})

// 🟢 Handle selection
async function handleSelect() {
  if (isSelected.value) {
    // If already selected → deselect (close it)
    paymentStore.clearMethod()
    destroyNetbanking()
  } else {
    // Otherwise, select and mount component
    paymentStore.selectMethod('netbanking')

    if (!paymentStore.sessionId) {
      console.log('🌀 Creating Cashfree session for Netbanking...')
      await paymentStore.proceedToPayment('netbanking')
    }

    loadNetbankingComponent()
  }
}

// 🚀 Proceed to Payment
async function proceedToPayment() {
  if (!isSelected.value) return
  console.log('🟢 Proceeding with Netbanking payment:', paymentStore.sessionId)

  if (!$cashfree) return console.error('❌ Cashfree SDK not initialized.')

  if (!paymentStore.sessionId) {
    console.error('❌ Missing session ID, regenerating...')
    await paymentStore.proceedToPayment('netbanking')
  }

  $cashfree.checkout()
}

// 🏦 Mount Cashfree Netbanking Component
async function loadNetbankingComponent(retryCount = 0) {
  const sessionId = paymentStore.sessionId
  if (!sessionId) return console.error('❌ Missing payment session ID')

  await nextTick()

  if (!$cashfree || typeof $cashfree.create !== 'function') {
    if (retryCount < 5) {
      console.warn(`⚠️ Cashfree SDK not ready. Retrying... (${retryCount + 1})`)
      return setTimeout(() => loadNetbankingComponent(retryCount + 1), 600)
    }
    return console.error('❌ Cashfree SDK failed to initialize.')
  }

  try {
    console.log('🔄 Mounting Cashfree Netbanking component...')
    destroyNetbanking()

    netbankingLoaded.value = false

    netbankingInstance = $cashfree.create('netbanking', {
      paymentSessionId: sessionId,
    })
    netbankingInstance.mount('#netbankingContainer')

    netbankingInstance.on('ready', () => {
      netbankingLoaded.value = true
      console.log('✅ Netbanking component loaded successfully')
    })
  } catch (err) {
    console.error('❌ Error initializing Netbanking component:', err)
  }
}

// 🧹 Helper: safely destroy instance
function destroyNetbanking() {
  if (netbankingInstance?.destroy) {
    try {
      netbankingInstance.destroy()
      console.log('🧹 Netbanking component destroyed')
    } catch (err) {
      console.warn('⚠️ Safe destroy failed:', err)
    } finally {
      netbankingInstance = null
      netbankingLoaded.value = false
    }
  }
}

// 🔄 Watch for session changes
watch(
  () => paymentStore.sessionId,
  (newVal) => {
    if (isSelected.value && newVal) loadNetbankingComponent()
  }
)

// ✅ Auto-init on mount if already selected
onMounted(() => {
  if (isSelected.value && paymentStore.sessionId) {
    loadNetbankingComponent()
  }
})
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
