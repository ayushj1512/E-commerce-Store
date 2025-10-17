<template>
  <teleport to="body">
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
      <div
        class="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto animate-fadeIn relative"
      >
        <h3 class="text-lg font-bold mb-2">Cancel Order</h3>
        <button
          @click="close"
          class="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl transition-transform hover:scale-110"
        >
          &times;
        </button>

        <p class="mb-4 text-gray-700">
          Order Id: <span class="font-semibold">{{ orderId }}</span>
        </p>

        <p class="mb-4 text-gray-600">
          We are sorry that you are canceling this order. Please select a reason that helps us improve our service.
        </p>

        <div class="space-y-2 mb-4">
          <label v-for="(reason, index) in reasons" :key="index" class="flex items-center gap-2">
            <input
              type="radio"
              class="accent-red-600"
              :value="reason"
              v-model="selectedReason"
            />
            <span>{{ reason }}</span>
          </label>
        </div>

        <div v-if="selectedReason === 'Other'" class="mb-4">
          <textarea
            v-model="otherReason"
            placeholder="Please specify..."
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          ></textarea>
        </div>

        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            @click="close"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            @click="confirmCancel"
            :disabled="!selectedReason || loading"
          >
            <span v-if="!loading">Confirm</span>
            <span v-else class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({
  orderId: {
    type: Number,
    required: true
  },
  modelValue: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(["update:modelValue"]);

const showModal = ref(props.modelValue);
const loading = ref(false);
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
  (val) => {
    showModal.value = val;
    if (val) {
      selectedReason.value = "";
      otherReason.value = "";
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

    alert("Your order has been canceled. We are sorry for the inconvenience caused.");
    close();
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
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
</style>
