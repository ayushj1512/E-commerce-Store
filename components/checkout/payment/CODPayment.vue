<template>
  <div class="space-y-6">
    <!-- 💵 COD Payment Option Card -->
    <div
      class="relative border rounded-xl p-5 flex flex-col gap-4 cursor-pointer transition-all duration-300"
      :class="cartStore.codSelected ? 'border-green-600 bg-green-50 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'"
      @click="toggleCOD"
    >
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="p-3 rounded-full transition-all duration-300"
            :class="cartStore.codSelected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'"
          >
            <Wallet class="w-5 h-5" />
          </div>
          <div>
            <p class="font-medium text-gray-800">Cash on Delivery (COD)</p>
            <p class="text-xs text-gray-500 mt-1">
              Pay with cash or card upon delivery of your order.
            </p>
          </div>
        </div>
        <div v-if="cartStore.codSelected" class="text-green-600">
          <Check class="w-5 h-5" />
        </div>
      </div>

      <!-- Expanded Section -->
      <transition name="fade-slide">
        <div
          v-if="cartStore.codSelected"
          class="mt-4 border-t border-gray-200 pt-4 space-y-6"
        >
          <!-- 💰 Total Payable -->
          <div
            class="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-green-100"
          >
            <span class="text-gray-600 font-medium">Total Payable (COD)</span>
            <span class="text-2xl font-extrabold text-green-700">
              ₹{{ cartStore.total }}
            </span>
          </div>

          <!-- ℹ️ COD Info -->
          <div
            class="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3 shadow-sm"
          >
            <Info class="w-5 h-5 text-green-600 mt-0.5" />
            <p class="text-sm text-gray-700 leading-snug">
              💡 Pay online and <span class="font-semibold text-green-700">save ₹{{ cartStore.COD_CHARGE }}</span>
              COD handling charge.
            </p>
          </div>

          <!-- ✅ Confirm COD -->
          <div class="flex justify-end mt-6">
            <button
              @click.stop="openCODModal"
              class="px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all duration-200
                text-white
                bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- 🧾 COD Confirmation Modal -->
    <CODConfirmModal
      :show="showCODModal"
      @close="showCODModal = false"
      @confirmCOD="handleCODConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Wallet, Check, Info } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cartStore'
import CODConfirmModal from '@/components/checkout/payment/CODConfirmModal.vue'

const cartStore = useCartStore()
const showCODModal = ref(false)

// Toggle COD selection
function toggleCOD() {
  const newState = !cartStore.codSelected
  cartStore.setCOD(newState)
  cartStore.saveCart()
}

// Open confirmation modal
function openCODModal() {
  showCODModal.value = true
}

// Confirm COD order
function handleCODConfirmed() {
  console.log('✅ COD order confirmed successfully for ₹', cartStore.total)
  // placeOrder({ payment_mode: 'COD' }) // your logic here
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
