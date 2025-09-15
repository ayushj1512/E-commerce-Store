<template>
  <div v-if="mounted" class="bg-gray-50 min-h-screen py-6 px-3 sm:px-6 md:px-12 lg:px-24 flex flex-col overflow-x-hidden">
    <div class="mx-auto w-full max-w-6xl space-y-8 sm:space-y-10 flex-1">

      <!-- Page Title -->
      <div class="text-center mb-6 px-2">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-black break-words">
          Refunds
        </h1>
        <p class="text-gray-700 sm:text-base md:text-lg mt-1 break-words">
          View all your refund requests and their status.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-10 text-gray-600">
        Loading refunds...
      </div>

      <!-- No Refunds -->
      <div v-else-if="refunds.length === 0" class="text-center py-10 text-gray-600">
        <p class="text-gray-700 text-base font-medium">
          No refunds found 🪄
        </p>
        <p class="text-gray-500 text-sm">
          Once you request a refund, it will appear here.
        </p>
      </div>

      <!-- Refunds List -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="refund in refunds"
          :key="refund.refund_id"
          class="border border-gray-300 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white overflow-hidden">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-semibold text-black break-words">Order: {{ refund.order_id }}</h2>
            <span
              :class="statusClass(refund.status)"
              class="text-xs px-2 py-1 rounded-full text-white whitespace-nowrap">
              {{ refund.status }}
            </span>
          </div>
          <p class="text-gray-700 text-sm mb-1 break-words">
            Amount: ₹{{ refund.amount || "N/A" }}
          </p>
          <p class="text-gray-500 text-xs mb-2 break-words">
            Requested On: {{ formatDate(refund.requested_on) || "N/A" }}
          </p>
          <p class="text-gray-600 text-xs break-words">
            Reason: {{ refund.reason || "No reason provided" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import axios from "axios";

definePageMeta({ middleware: ["auth"] });

const auth = useAuthStore();
const mounted = ref(false);
const refunds = ref([]);
const loading = ref(true);

const fetchRefunds = async () => {
  loading.value = true;
  try {
    const requestData = JSON.stringify({
      gateway_action: "customer/customerOrder",
      type: "getRefundDetails",
      version: "1",
      id_customer: auth.id_customer
    });

    const response = await axios.post(import.meta.env.VITE_BASE_URL, requestData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    });

    console.log("Refunds API Response:", response.data);
    refunds.value = response.data?.refundList || [];
  } catch (err) {
    console.error("Failed to fetch refunds:", err);
    refunds.value = [];
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

const statusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-500";
    case "approved":
      return "bg-green-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

onMounted(() => {
  mounted.value = true;
  fetchRefunds();
});
</script>

<style scoped>
/* Mobile Optimization */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
