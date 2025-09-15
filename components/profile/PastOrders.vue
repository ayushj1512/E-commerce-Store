<template>
  <section>
    <!-- Header with button -->
    <div class="flex justify-between items-center pt-4 pb-5">
      <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-black">Past Orders</h2>
      <router-link
        to="/profile/orders"
        class="bg-black text-white px-4 py-2 rounded-lg shadow-md transition"
      >
        Show All Orders
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-6">
      <p class="text-gray-600 text-sm sm:text-base">Loading your orders...</p>
    </div>

    <!-- No Orders -->
    <div v-else-if="orders.length === 0" class="text-center py-6">
      <p class="text-gray-600 text-sm sm:text-base">You have no past orders.</p>
    </div>

    <!-- Orders Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div
        v-for="order in orders"
        :key="order.id_order"
        class="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all"
      >
        <p class="font-semibold text-black mb-2 text-sm sm:text-base">Order #{{ order.id_order }}</p>
        <p class="text-gray-700 text-xs sm:text-sm mb-1">Date: {{ order.date_add }}</p>
        <p class="text-gray-700 text-xs sm:text-sm mb-1">Items: {{ order.items?.join(', ') || '-' }}</p>
        <p class="text-gray-700 text-xs sm:text-sm mb-1">Total: ₹{{ order.total_paid }}</p>
        <span
          class="inline-block mt-2 px-3 py-1 rounded-full text-xs sm:text-sm"
          :class="statusClass(order.current_state_name)"
        >
          {{ order.current_state_name }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

// State
const orders = ref([]);
const loading = ref(true);

const fetchOrders = async () => {
  try {
    const authStore = useAuthStore();

    if (!authStore.key || !authStore.id_customer) {
      console.warn("⚠️ No customer session found. Redirect to login?");
      orders.value = [];
      loading.value = false;
      return;
    }

    const payload = {
      gateway_action: "customer/getCustomerOrderList",
      version: "1",
      orderType: "all",
      orderTime: "3 MONTH",
      id_customer: authStore.id_customer,
      user_hash_key: authStore.key,
    };

    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}`,
      payload
    );

    console.log("[PastOrders] API response:", data);

    if (data?.data?.orderList) {
      orders.value = data.data.orderList;
    } else {
      orders.value = [];
    }
  } catch (err) {
    console.error("Failed to fetch past orders:", err);
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

// Dynamic status color
const statusClass = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Shipped":
      return "bg-blue-100 text-blue-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Fetch on mount
onMounted(fetchOrders);
</script>

<style scoped>
section div:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
</style>
