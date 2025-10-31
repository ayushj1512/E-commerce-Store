<template>
  <div
    class="relative border rounded-xl p-5 flex flex-col gap-4 transition-all duration-300 select-none"
    :class="[
      disabled
        ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-70'
        : selected
          ? 'border-green-600 bg-green-50 cursor-pointer'
          : 'border-gray-200 bg-white hover:bg-gray-50 cursor-pointer'
    ]"
    @click="toggleSelect"
  >
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div
          class="p-3 rounded-full transition-all duration-300"
          :class="[
            disabled
              ? 'bg-gray-200 text-gray-400'
              : selected
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-500'
          ]"
        >
          <CreditCard class="w-5 h-5" />
        </div>
        <div>
          <p
            class="font-medium text-gray-800"
            :class="{ 'text-gray-500': disabled }"
          >
            Snapmint (Pay in EMIs)
          </p>
          <p
            class="text-xs mt-1"
            :class="disabled ? 'text-gray-400' : 'text-gray-500'"
          >
            Pay later in easy monthly installments.
          </p>
        </div>
      </div>

      <div v-if="selected && !disabled" class="text-green-600">
        <Check class="w-5 h-5" />
      </div>
    </div>

    <!-- EMI Plan List -->
    <transition name="fade-slide">
      <div
        v-if="selected && !disabled"
        class="mt-4 border-t border-gray-200 pt-4 space-y-3"
        @click.stop
      >
        <div v-if="loading" class="text-gray-500 text-sm flex items-center gap-2">
          <svg
            class="w-4 h-4 animate-spin text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Fetching available EMI plans...
        </div>

        <div v-else-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>

        <div v-else-if="plans.length" class="grid gap-3">
          <div
            v-for="(plan, index) in plans"
            :key="index"
            class="p-4 bg-white border border-green-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm font-semibold text-gray-800">
                  {{ plan.tenure }} Month EMI
                </p>
                <p class="text-xs text-gray-500" v-html="plan.emi_month_text"></p>
              </div>
              <p class="text-green-600 font-semibold text-lg">
                ₹{{ plan.emi_amount }}/mo
              </p>
            </div>

            <div class="mt-2 text-xs text-gray-600 grid grid-cols-2 gap-2">
              <p>
                Down Payment:
                <span class="font-medium text-gray-800">
                  ₹{{ plan.down_payment.toFixed(2) }}
                </span>
              </p>
              <p>
                Total Payable:
                <span class="font-medium text-gray-800">
                  ₹{{ plan.total_you_pay }}
                </span>
              </p>
              <p
                v-if="plan.is_zero_percent"
                class="col-span-2 text-green-600 font-medium"
              >
                ✅ No Cost EMI Available
              </p>
            </div>
          </div>
        </div>

        <div v-else class="text-gray-500 text-sm">
          No EMI plans available for this order amount.
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { CreditCard, Check } from 'lucide-vue-next'
import axios from 'axios'
import { useCartStore } from '@/stores/cartStore'

const props = defineProps({
  selected: { type: Boolean, required: true },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['select'])
const loading = ref(false)
const error = ref('')
const plans = ref<any[]>([])
const cartStore = useCartStore()

// 🖱️ Toggle select/deselect
const toggleSelect = async () => {
  if (props.disabled) return
  emit('select', props.selected ? '' : 'snapmint')
  await nextTick()
}

// 🧠 Fetch Snapmint EMI plans
const fetchSnapmintPlans = async () => {
  loading.value = true
  error.value = ''
  plans.value = []

  try {
    const orderValue = cartStore.total || 0
    const url = `https://api.snapmint.com/v1/public/merchant_plans?order_value=${orderValue}&merchant_id=1460&page=checkout_page`

    const { data } = await axios.get(url)

    if (data?.status === 'Success' && Array.isArray(data.plans)) {
      plans.value = data.plans.filter(p => p.display_plan)
    } else {
      throw new Error('Unable to fetch EMI plans')
    }
  } catch (err) {
    console.error('Snapmint API Error:', err)
    error.value = 'Failed to load EMI plans. Please try again later.'
  } finally {
    loading.value = false
  }
}

// 🎯 Auto-fetch plans when selected
watch(
  () => props.selected,
  (newVal) => {
    if (newVal && !props.disabled) fetchSnapmintPlans()
  }
)

// 🚀 Auto-fetch if already selected on mount
onMounted(() => {
  if (props.selected && !props.disabled) fetchSnapmintPlans()
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
