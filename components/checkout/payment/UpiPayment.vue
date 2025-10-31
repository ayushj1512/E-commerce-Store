<template>
  <div class="space-y-6">
    <!-- 💳 UPI Payment Option Card -->
    <div
      class="relative border rounded-xl p-5 flex flex-col gap-4 cursor-pointer transition-all duration-300"
      :class="selectedOption === 'upi' ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50'"
      @click="selectOption('upi')"
    >
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="p-3 rounded-full transition-all duration-300"
            :class="selectedOption === 'upi' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'"
          >
            <QrCode class="w-5 h-5" />
          </div>
          <div>
            <p class="font-medium text-gray-800">UPI Payment</p>
            <p class="text-xs text-gray-500 mt-1">
              Pay using your UPI ID, preferred UPI app, or scan QR code.
            </p>
          </div>
        </div>
        <div v-if="selectedOption === 'upi'" class="text-green-600">
          <Check class="w-5 h-5" />
        </div>
      </div>

      <!-- Expanded Section -->
      <transition name="fade-slide">
        <div
          v-if="selectedOption === 'upi'"
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

          <!-- 🧾 Cashfree Components -->
          <div class="space-y-5">
            <!-- 🏦 Enter UPI ID -->
            <div>
              <label class="block text-gray-700 font-medium text-sm mb-2">
                Pay via UPI ID
              </label>
              <div
                id="upiCollect"
                class="border rounded-lg p-3 bg-white min-h-[60px] flex items-center justify-center"
              >
                <span class="text-gray-400 text-sm" v-if="!upiCollectLoaded">
                  Loading UPI field...
                </span>
              </div>
            </div>

            <!-- 📱 Pay via UPI Apps -->
            <div>
              <label class="block text-gray-700 font-medium text-sm mb-3">
                Or Pay Using UPI App
              </label>
              <div class="flex flex-wrap gap-3 justify-start">
                <div
                  v-for="(app, index) in upiApps"
                  :key="index"
                  :id="`upiApp-${app.id}`"
                  class="flex-1 min-w-[120px] max-w-[150px] border rounded-lg bg-white p-3 flex items-center justify-center shadow-sm"
                >
                  <span class="text-gray-400 text-sm">Loading...</span>
                </div>
              </div>
            </div>

            <!-- 📷 Pay via QR -->
            <div>
              <label class="block text-gray-700 font-medium text-sm mb-2">
                Or Scan & Pay
              </label>
              <div
                id="upiQr"
                class="flex justify-center items-center border rounded-lg bg-white min-h-[240px]"
              >
                <span class="text-gray-400 text-sm" v-if="!upiQrLoaded">
                  Generating QR...
                </span>
              </div>
            </div>
          </div>

          <!-- ✅ Proceed -->
          <div class="flex justify-end mt-6">
            <button
              @click.stop="proceedToPayment"
              :disabled="!upiCollectLoaded && !upiQrLoaded && !upiAppsLoaded"
              class="px-6 py-2 rounded-lg font-medium shadow-sm transition-all duration-200
                text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                bg-green-600 hover:bg-green-700"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
import { QrCode, Check } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cartStore'
import { usePaymentStore } from '@/stores/paymentStore'
import { useNuxtApp } from '#app'

const cartStore = useCartStore()
const paymentStore = usePaymentStore()
const { $cashfree } = useNuxtApp()

const selectedOption = ref('')
const upiCollectLoaded = ref(false)
const upiQrLoaded = ref(false)
const upiAppsLoaded = ref(false)

let upiCollectInstance: any = null
let upiQrInstance: any = null
let upiAppInstances: any[] = []

const upiApps = [
  { id: 'gpay', label: 'Google Pay' },
  { id: 'phonepe', label: 'PhonePe' },
  { id: 'paytm', label: 'Paytm' },
  { id: 'bhim', label: 'BHIM' },
]

// 🧹 Cleanup
onBeforeUnmount(() => {
  if (upiCollectInstance?.destroy) upiCollectInstance.destroy()
  if (upiQrInstance?.destroy) upiQrInstance.destroy()
  upiAppInstances.forEach((inst) => inst?.destroy?.())
})

// 🟢 User selects UPI
function selectOption(option: string) {
  selectedOption.value = selectedOption.value === option ? '' : option
  if (selectedOption.value === 'upi') {
    waitForSessionAndLoad()
  }
}

// 🟢 Wait for session ID before loading Cashfree components
async function waitForSessionAndLoad(retryCount = 0) {
  if (!paymentStore.sessionId) {
    if (retryCount < 8) {
      console.warn(`⚠️ Waiting for session ID... Retry ${retryCount + 1}`)
      return setTimeout(() => waitForSessionAndLoad(retryCount + 1), 800)
    }
    return console.error('❌ No payment session ID found in store after waiting.')
  }
  loadUPIComponents()
}

// 🚀 Proceed button
function proceedToPayment() {
  const sessionId = paymentStore.sessionId
  console.log('🟢 Proceeding with UPI payment for session:', sessionId)
  if (!$cashfree || !sessionId) return console.error('❌ Missing Cashfree SDK or session ID.')
  $cashfree.checkout()
}

// 🧠 Load UPI Components
async function loadUPIComponents(retryCount = 0) {
  const sessionId = paymentStore.sessionId
  if (!sessionId) return console.error('❌ Missing payment session ID in store.')

  await nextTick()

  if (!$cashfree || typeof $cashfree.create !== 'function') {
    if (retryCount < 5) {
      console.warn(`⚠️ Cashfree SDK not ready. Retrying... (${retryCount + 1})`)
      return setTimeout(() => loadUPIComponents(retryCount + 1), 600)
    }
    return console.error('❌ Cashfree SDK failed to initialize.')
  }

  try {
    console.log('🔄 Mounting Cashfree UPI components...')
    if (upiCollectInstance?.destroy) upiCollectInstance.destroy()
    if (upiQrInstance?.destroy) upiQrInstance.destroy()
    upiAppInstances.forEach((inst) => inst?.destroy?.())

    upiCollectLoaded.value = false
    upiQrLoaded.value = false
    upiAppsLoaded.value = false

    // 🏦 UPI Collect
    upiCollectInstance = $cashfree.create('upiCollect', {
      paymentSessionId: sessionId,
      placeholder: 'Enter your UPI ID',
    })
    upiCollectInstance.mount('#upiCollect')
    upiCollectInstance.on('ready', () => {
      upiCollectLoaded.value = true
      console.log('✅ UPI Collect component loaded')
    })

    // 📱 UPI Apps
    let loadedApps = 0
    for (const app of upiApps) {
      const instance = $cashfree.create('upiApp', {
        paymentSessionId: sessionId,
        upiApp: app.id,
        buttonText: app.label,
        buttonIcon: true,
      })
      instance.mount(`#upiApp-${app.id}`)
      instance.on('ready', () => {
        loadedApps++
        if (loadedApps === upiApps.length) {
          upiAppsLoaded.value = true
          console.log('✅ All UPI Apps loaded')
        }
      })
      upiAppInstances.push(instance)
    }

    // 📷 UPI QR
    upiQrInstance = $cashfree.create('upiQr', {
      paymentSessionId: sessionId,
      values: { size: '220px' },
    })
    upiQrInstance.mount('#upiQr')
    upiQrInstance.on('ready', () => {
      upiQrLoaded.value = true
      console.log('✅ UPI QR component loaded')
    })
  } catch (err) {
    console.error('❌ Error initializing UPI components:', err)
  }
}

onMounted(() => {
  if (selectedOption.value === 'upi') waitForSessionAndLoad()
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
