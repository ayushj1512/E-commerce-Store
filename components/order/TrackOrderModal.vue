<template>
  <teleport to="body">
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6"
    >
      <div class="bg-white rounded-2xl shadow-lg w-full sm:max-w-md p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-black">Order Tracking</h3>
          <button
            @click="closeModal"
            class="text-gray-500 hover:text-black text-2xl transition-transform hover:scale-110"
            aria-label="Close modal"
          >&times;</button>
        </div>

        <!-- Tracking Info -->
        <div v-if="trackingData" class="space-y-2 text-gray-800">
          <p><span class="font-semibold">Status:</span> {{ trackingData.status || "Pending" }}</p>
          <p><span class="font-semibold">Carrier:</span> {{ trackingData.idCarrier || "—" }}</p>
          <p><span class="font-semibold">Shipping Number:</span> {{ trackingData.shippingNumber || "—" }}</p>
          <p><span class="font-semibold">Last Updated:</span> {{ formatDate(trackingData.lastUpdate) || "—" }}</p>
        </div>

        <div v-else class="text-gray-500 text-center py-4">
          No tracking information available.
        </div>

        <!-- Close Button -->
        <div class="flex justify-end mt-4">
          <button
            class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
            @click="closeModal"
          >
            Close
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
  modelValue: Boolean,
  idOrder: { type: Number, required: true }
});

const emit = defineEmits(["update:modelValue"]);

const authStore = useAuthStore();
const showModal = ref(false);
const loading = ref(false);
const trackingData = ref(null);

// Watch for v-model changes from parent
watch(
  () => props.modelValue,
  (val) => {
    showModal.value = val;
    if (val && !trackingData.value) fetchTrackingData();
  }
);

// Fetch tracking info
const fetchTrackingData = async () => {
  if (!authStore.key || !authStore.id_customer) {
    alert("You must be logged in to track orders.");
    return;
  }

  loading.value = true;
  try {
    const payload = {
      gateway_action: "customer/customerOrder",
      site: "sss",
      type: "trackOrder",
      idOrder: props.idOrder,
      id_customer: authStore.id_customer,
      user_hash_key: authStore.key
    };

    const { data } = await axios.post(import.meta.env.VITE_BASE_URL, payload);

    if (data) {
      trackingData.value = {
        status: data.status,
        idCarrier: data.idCarrier,
        shippingNumber: data.shippingNumber,
        lastUpdate: data.status_date
      };
    } else {
      alert("Tracking info not found.");
    }
  } catch (err) {
    console.error("Track Order Error:", err);
    alert("Failed to fetch tracking info.");
  } finally {
    loading.value = false;
  }
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  emit("update:modelValue", false);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
