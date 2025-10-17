<template>
  <div>
    <button
      class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base disabled:opacity-50 flex items-center justify-center gap-2"
      :disabled="loading || !idOrder"
      @click="trackOrder"
    >
      <span v-if="!loading">Track Order</span>
      <span v-else class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
    </button>

    <!-- Modal for tracking info -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg relative">
        <h3 class="text-lg font-bold mb-4">Order Tracking</h3>
        <button @click="showModal = false" class="absolute top-2 right-3 text-gray-500 hover:text-gray-800">&times;</button>

        <div v-if="trackingData" class="space-y-2">
          <p><span class="font-medium">Status:</span> {{ trackingData.status || "Pending" }}</p>
          <p><span class="font-medium">Carrier:</span> {{ trackingData.idCarrier || "—" }}</p>
          <p><span class="font-medium">Shipping Number:</span> {{ trackingData.shippingNumber || "—" }}</p>
          <p><span class="font-medium">Last Updated:</span> {{ formatDate(trackingData.lastUpdate) || "—" }}</p>
        </div>

        <div v-else class="text-gray-500">No tracking information available.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({
  idOrder: { type: Number, required: true }
});

const authStore = useAuthStore();

const loading = ref(false);
const showModal = ref(false);
const trackingData = ref(null);

const trackOrder = async () => {
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
      showModal.value = true;
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

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
};
</script>

<style scoped>
/* Modal fade-in animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.fixed > div {
  animation: fadeIn 0.3s ease-out;
}
</style>
