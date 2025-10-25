<template>
  <teleport to="body">
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 sm:p-6"
    >
      <div
        class="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn flex flex-col"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-2">
            <LucideXCircle v-if="canceled" class="w-6 h-6 text-red-600" />
            <h3 class="text-xl sm:text-2xl font-semibold text-gray-900">
              {{ canceled ? "Order Canceled" : "Cancel Order" }}
            </h3>
          </div>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-900 text-2xl transition-transform hover:scale-110"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <!-- Dynamic Content -->
        <div class="flex flex-col gap-5">
          <!-- Cancel Form -->
          <template v-if="!canceled">
            <!-- Order ID -->
            <p class="text-gray-700 text-sm sm:text-base font-medium">
              Order Id: <span class="font-semibold">{{ orderId }}</span>
            </p>

            <!-- Regret Message -->
            <p class="text-gray-600 text-sm sm:text-base">
              We're sorry you're canceling your order. Please select a reason below to help us improve.
            </p>

            <!-- Reason Selection -->
            <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
              <label
                v-for="(reason, index) in reasons"
                :key="index"
                class="flex items-center gap-3 text-gray-700 text-sm sm:text-base cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
              >
                <input
                  type="radio"
                  class="accent-red-600"
                  :value="reason"
                  v-model="selectedReason"
                />
                <span>{{ reason }}</span>
              </label>
            </div>

            <!-- Other Reason Textarea -->
            <div v-if="selectedReason === 'Other'">
              <textarea
                v-model="otherReason"
                placeholder="Please specify..."
                class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base mt-2"
                rows="3"
              ></textarea>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row justify-end gap-3 mt-4">
              <button
                class="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition w-full sm:w-auto text-sm sm:text-base flex items-center justify-center gap-2"
                @click="close"
                :disabled="loading"
              >
                <LucideX class="w-4 h-4" />
                Cancel
              </button>
              <button
                class="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base"
                @click="confirmCancel"
                :disabled="!selectedReason || loading"
              >
                <span v-if="!loading">Confirm</span>
                <span v-else class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              </button>
            </div>
          </template>

          <!-- Confirmation -->
          <template v-else>
            <div class="flex flex-col items-center gap-4 py-6">
              <LucideCheckCircle class="w-12 h-12 text-green-600" />
              <p class="text-gray-800 text-center text-sm sm:text-base">
                Your order has been successfully canceled. We apologize for the inconvenience.
              </p>
              <button
                class="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base flex items-center gap-2"
                @click="close"
              >
                <LucideX class="w-4 h-4" />
                Close
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { LucideX, LucideXCircle, LucideCheckCircle } from "lucide-vue-next";

const props = defineProps({
  orderId: { type: Number, required: true },
  modelValue: { type: Boolean, required: true }
});
const emit = defineEmits(["update:modelValue"]);

const showModal = ref(props.modelValue);
const loading = ref(false);
const canceled = ref(false);

const reasons = [
  "Order Created by Mistake",
  "Item(s) would not arrive on time",
  "Shipping Cost too High",
  "Item Price too High",
  "Found Cheaper Somewhere else",
  "Need to Change Shipping Address",
  "Need to Change Billing Address",
  "Need to Change Payment Method",
  "Other"
];

const selectedReason = ref("");
const otherReason = ref("");
const authStore = useAuthStore();

watch(
  () => props.modelValue,
  val => {
    showModal.value = val;
    if (val) {
      selectedReason.value = "";
      otherReason.value = "";
      canceled.value = false;
    }
  }
);

const close = () => {
  showModal.value = false;
  emit("update:modelValue", false);
};

const confirmCancel = async () => {
  if (!selectedReason.value) return;

  loading.value = true;
  try {
    const reasonText =
      selectedReason.value === "Other" && otherReason.value
        ? `Cancel - ${otherReason.value}`
        : `Cancel - ${selectedReason.value}`;

    const payload = {
      gateway_action: "customer/customerOrder",
      type: "cancel",
      idOrder: props.orderId,
      id_customer: authStore.id_customer,
      cancelReason: reasonText,
      user_hash_key: authStore.key
    };

    await axios.post("https://gateway.streetstylestore.com/gateway/v1/", payload);
    canceled.value = true;
  } catch (err) {
    console.error("Cancel order failed:", err);
    alert("Failed to cancel order. Please try again.");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }

/* Scrollbar for reasons */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.2);
  border-radius: 3px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
</style>
