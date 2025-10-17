<template>
  <section>
    <!-- Header with button -->
    <div class="flex justify-between items-center pt-4 pb-5">
      <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-black">Recent Orders</h2>
      <router-link
        to="/profile/orders"
        class="bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-900 transition"
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
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="order in orders"
        :key="order.order_detail.order"
        @click="goToOrderDetail(order)"
        class="bg-white border border-gray-200 p-5 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
      >
        <div>
          <p class="font-semibold text-black text-base mb-1">Order #{{ order.order_detail.order }}</p>
          <p class="text-gray-600 text-sm mb-1">
            Date: {{ formatDate(order.order_detail.order_date) }}
          </p>
          <p class="text-gray-600 text-sm mb-1">
            Items: {{ order.order_products.map(p => p.product_name).join(', ') || '-' }}
          </p>
          <p class="text-gray-600 text-sm mb-2">
            Total: ₹{{ order.order_detail.total_paid_tax_incl }}
          </p>
        </div>
        <div class="mt-3">
          <span
            class="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-center"
            :class="statusClass(order.order_detail.status)"
          >
            {{ order.order_detail.status }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const orders = ref([]);
const loading = ref(true);
const router = useRouter();

// API section unchanged
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

    const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}`, payload);

    console.log("[PastOrders] API response:", data);

    if (Array.isArray(data)) {
      orders.value = data;
    } else if (Array.isArray(data?.data)) {
      orders.value = data.data;
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

// Navigate to order detail page on card click
const goToOrderDetail = (order) => {
  console.log("Navigating to order detail:", order.order_detail.order);
  router.push("/profile/orders");
};

// Dynamic status color
const statusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "canceled":
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const cleaned = dateStr.replace(/\\/g, "").split(" ")[0];
  const [dd, mm, yyyy] = cleaned.split("/");
  return new Date(`${yyyy}-${mm}-${dd}`).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

onMounted(fetchOrders);
</script>

<style scoped>
/* Smooth hover effect for all cards */
section div:hover {
  transform: translateY(-3px);
  transition: all 0.3s ease;
}
</style>
