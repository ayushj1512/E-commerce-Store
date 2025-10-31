<template>
  <transition name="fade-bounce">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative border border-gray-100 animate-pop"
      >
        <!-- Close Button -->
        <button
          @click="cancel"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- Header -->
        <div class="flex flex-col items-center mb-4">
          <AlertCircle class="w-10 h-10 text-green-600 mb-2" />
          <h2 class="text-lg md:text-xl font-semibold text-gray-800 text-center">
            Confirm Cash on Delivery
          </h2>
        </div>

        <!-- Description -->
        <p class="text-gray-600 text-sm text-center mb-5 leading-relaxed">
          Cash on Delivery orders are
          <span class="font-medium">dispatched immediately</span>.
          Please confirm you’ll be available to receive the package and make the payment.
        </p>

        <!-- Captcha -->
        <div class="space-y-2 mb-5">
          <label class="block text-sm font-medium text-gray-700 text-center">
            What is
            <span class="font-semibold text-green-700">{{ captcha.a }}</span> +
            <span class="font-semibold text-green-700">{{ captcha.b }}</span> ?
          </label>

          <div class="relative">
            <input
              v-model="captchaAnswer"
              type="text"
              placeholder="Enter your answer"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm text-center"
            />
            <RefreshCw
              @click="generateCaptcha"
              class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 cursor-pointer transition"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 mt-4">
          <button
            @click="cancel"
            class="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium"
          >
            Cancel
          </button>

          <button
            @click="confirm"
            class="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium flex items-center justify-center gap-1"
          >
            <Check class="w-4 h-4" /> Confirm
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { X, RefreshCw, Check, AlertCircle } from 'lucide-vue-next'
import { useCODPayment } from '@/composable/useCODPayment'

// Props & Emits
const props = defineProps({
  show: { type: Boolean, required: true },
})
const emit = defineEmits(['close', 'confirmCOD'])

// Captcha state
const captcha = ref({ a: 0, b: 0 })
const captchaAnswer = ref('')

// COD composable
const { confirmCODPayment } = useCODPayment()

// Generate new captcha
function generateCaptcha() {
  captcha.value = {
    a: Math.floor(Math.random() * 9) + 1,
    b: Math.floor(Math.random() * 9) + 1,
  }
}

// When modal opens, reset captcha & optionally trigger COD API
watch(
  () => props.show,
  async (visible) => {
    if (visible) {
      captchaAnswer.value = ''
      generateCaptcha()

      console.log('💰 COD modal opened → initiating COD API...')
      try {
        await confirmCODPayment()
      } catch (err) {
        console.error('❌ COD API call failed:', err)
      }
    }
  }
)

onMounted(generateCaptcha)

// Cancel
function cancel() {
  captchaAnswer.value = ''
  emit('close')
}

// Confirm
function confirm() {
  const correct = captcha.value.a + captcha.value.b
  if (parseInt(captchaAnswer.value) === correct) {
    emit('confirmCOD')
    emit('close')
  } else {
    alert('❌ Please solve the CAPTCHA correctly to continue.')
  }
}
</script>

<style scoped>
.fade-bounce-enter-active,
.fade-bounce-leave-active {
  transition: all 0.3s ease;
}
.fade-bounce-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}
.fade-bounce-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.animate-pop {
  animation: bounceIn 0.35s ease-out;
}
@keyframes bounceIn {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  60% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
