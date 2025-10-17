<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-inter p-4 sm:p-8 lg:p-12">
    <!-- Back Button -->
    <button
      @click="goBack"
      class="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm sm:text-base bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition transform hover:-translate-y-0.5"
    >
      ← Back
    </button>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
    </div>

    <!-- Order Details -->
    <div v-else-if="order" class="space-y-6 animate-fadeIn">
      <!-- Order Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight truncate text-black">
          Order #{{ order.order_detail.order }}
        </h1>

        <span
          :class="[ 'px-4 py-2 rounded-full text-sm sm:text-base font-semibold capitalize border', statusClass(order.order_detail.status) ]"
        >
          {{ order.order_detail.status }}
        </span>
      </div>

      <!-- Order Summary -->
      <div class="flex flex-col sm:flex-row sm:gap-6 gap-3 flex-wrap text-gray-700 text-sm sm:text-base">
        <div class="flex items-center gap-2">
          <Calendar class="w-5 h-5 text-gray-500" />
          <span>Order Date: {{ formatDate(order.order_detail.order_date) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <CreditCard class="w-5 h-5 text-gray-500" />
          <span>Total Amount: ₹{{ order.order_detail.order_amount }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Wallet class="w-5 h-5 text-gray-500" />
          <span>Payment: {{ order.order_detail.payment || "—" }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-3 mt-2">
        <TrackOrderButton
          :order="order"
          class="flex-1"
        />
        <GetSupportButton
          :order="order"
          class="flex-1"
        />
        <CancelOrderModal
          :order-id="order.order_detail.order"
          class="flex-1"
          :disabled="!order.order_detail.cancelled"
        />
      </div>

      <!-- Products List -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <div
          v-for="product in order.order_products"
          :key="product.product_id"
          class="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
        >
          <img
            :src="product.img"
            alt="Product"
            class="w-28 h-28 object-cover rounded-xl border border-gray-200"
          />
          <p class="font-medium text-center truncate">{{ product.product_name }}</p>
          <p class="text-sm text-gray-500">Qty: {{ product.product_quantity }}</p>
          <p class="text-sm text-gray-500">Price: ₹{{ product.product_price }}</p>
          <p class="text-xs text-gray-400">Status: {{ product.product_status }}</p>
        </div>
      </div>

      <!-- Shipping Address -->
      <div class="bg-white p-4 rounded-xl shadow-md mt-4 hover:shadow-lg transition">
        <h2 class="font-semibold text-lg mb-2 border-b pb-1 border-gray-200">Shipping Address</h2>
        <p class="truncate">{{ order.shipping_address.fullname }}</p>
        <p class="truncate">{{ order.shipping_address.address1 }} {{ order.shipping_address.address2 }}</p>
        <p class="truncate">{{ order.shipping_address.city }} - {{ order.shipping_address.postcode }}</p>
        <p class="truncate">{{ order.shipping_address.phone_mobile }}</p>
      </div>

      <!-- Customer Info -->
      <div class="bg-white p-4 rounded-xl shadow-md mt-4 hover:shadow-lg transition">
        <h2 class="font-semibold text-lg mb-2 border-b pb-1 border-gray-200">Customer Info</h2>
        <p>Name: {{ order.customer_detail.fullname }}</p>
        <p>Mobile: {{ order.customer_detail.mobile_number }}</p>
        <p>Email: {{ order.customer_detail.email || "—" }}</p>
      </div>

      <!-- Order History (Card style with colored dots) -->
      <div class="bg-white p-4 rounded-xl shadow-md mt-4 hover:shadow-lg transition">
        <h2 class="font-semibold text-lg mb-4 border-b pb-1 border-gray-200">Order History</h2>
        <div class="space-y-4">
          <div
            v-for="(status, index) in order.order_status_history"
            :key="index"
            class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
          >
            <span
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: status.color || '#3b82f6' }"
            ></span>
            <div>
              <p class="font-medium text-gray-800 text-sm sm:text-base">{{ status.name }}</p>
              <p class="text-gray-400 text-xs sm:text-sm">{{ formatDate(status.status_date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Order Found -->
    <div v-else class="text-center py-20 text-gray-400 text-lg">
      Order not found.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { Calendar, CreditCard, Wallet } from "lucide-vue-next";

// Import modular buttons
import TrackOrderButton from "@/components/order/TrackOrderButton.vue";
import GetSupportButton from "@/components/order/GetSupportButton.vue";
import CancelOrderModal from "@/components/order/CancelOrderModal.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const order = ref(null);
const loading = ref(true);

const orderId = route.params.order_id;

const fetchOrders = async () => {
  try {
    if (!authStore.key || !authStore.id_customer) {
      order.value = null;
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
    const allOrders = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    order.value = allOrders.find(o => o.order_detail.order.toString() === orderId) || null;
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    order.value = null;
  } finally {
    loading.value = false;
  }
};

const goBack = () => router.back();

const statusClass = status => {
  switch (status?.toLowerCase()) {
    case "delivered": return "bg-green-50 text-green-700 border-green-300";
    case "shipped": return "bg-blue-50 text-blue-700 border-blue-300";
    case "pending": return "bg-yellow-50 text-yellow-700 border-yellow-300";
    case "canceled":
    case "cancelled": return "bg-red-50 text-red-700 border-red-300";
    default: return "bg-gray-50 text-gray-700 border-gray-300";
  }
};

const formatDate = dateStr => {
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
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.7s ease-in-out both; }
</style>
