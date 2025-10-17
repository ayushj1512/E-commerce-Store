<template>
  <div class="min-h-screen bg-white text-black p-6 sm:p-10 font-inter">
    <!-- Page Title -->
    <h1
      class="text-3xl sm:text-4xl font-bold mb-10 text-center tracking-tight text-black animate-fadeIn"
    >
      My Past Orders
    </h1>

    <!-- Loader -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-24 text-gray-500 space-y-4 animate-pulse"
    >
      <div class="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Loading your orders...</span>
    </div>

    <!-- Search + Sort -->
    <div
      v-else
      class="flex flex-row justify-between items-center gap-3 mb-8 animate-fadeIn w-full"
    >
      <!-- Search -->
      <div class="relative flex-grow min-w-0">
        <Search class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by order number or status..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 bg-gray-50 text-black placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
        />
      </div>

      <!-- Sort -->
      <div class="relative flex-shrink-0 w-40 sm:w-64">
        <select
          v-model="sortOption"
          class="w-full px-5 py-3 pr-10 border border-gray-200 bg-white/70 backdrop-blur-md text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/80 text-sm sm:text-base appearance-none shadow-md hover:bg-white/90 transition-all duration-300"
        >
          <option disabled value="">Sort By</option>
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="high">Price: High to Low</option>
          <option value="low">Price: Low to High</option>
        </select>
        <ArrowDownAZ class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>

    <!-- Orders Grid -->
    <div
      v-if="filteredOrders.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-slideUp"
    >
      <div
        v-for="order in filteredOrders"
        :key="order.order_detail.order"
        @click="goToOrderDetail(order)"
        class="group cursor-pointer border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl hover:border-gray-400/80 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm"
      >
        <div>
          <div class="flex justify-between items-center mb-3">
            <h2 class="font-semibold text-lg tracking-wide group-hover:text-black/90 transition">
              Order #{{ order.order_detail.order }}
            </h2>
            <span
              :class="[ 
                'px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium capitalize border',
                statusClass(order.order_detail.status),
              ]"
            >
              {{ order.order_detail.status }}
            </span>
          </div>

          <div class="flex items-center text-gray-500 text-xs sm:text-sm mb-3 gap-1">
            <Calendar class="w-4 h-4" />
            <span>{{ formatDate(order.order_detail.order_date) }}</span>
          </div>

          <div class="space-y-1.5">
            <p class="text-sm flex items-center gap-1.5">
              <CreditCard class="w-4 h-4 text-gray-600" />
              <span>Total: <span class="font-semibold text-black">₹{{ order.order_detail.total_paid_tax_incl }}</span></span>
            </p>
            <p class="text-sm text-gray-600 flex items-center gap-1.5">
              <Wallet class="w-4 h-4 text-gray-600" />
              <span>Payment: {{ order.order_detail.payment || '—' }}</span>
            </p>
          </div>
        </div>

        <!-- Product Preview -->
        <div
          v-if="order.order_products?.length"
          class="border-t border-gray-200 pt-4 flex items-center gap-3"
        >
          <div class="relative">
            <img
              :src="order.order_products[0].img"
              alt="Product"
              class="w-16 h-16 rounded-xl object-cover border border-gray-200 group-hover:border-gray-400 transition"
            />
            <div
              class="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-xl transition"
            ></div>
          </div>
          <div>
            <p class="text-sm font-medium truncate text-black/90">
              {{ order.order_products[0].product_name }}
            </p>
            <p class="text-xs text-gray-600">
              Qty: {{ order.order_products[0].product_quantity }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Orders -->
    <div v-else-if="!loading" class="text-center py-20 animate-fadeIn">
      <ShoppingBag class="w-10 h-10 mx-auto mb-3 text-gray-500" />
      <p class="text-lg font-semibold mb-2 text-gray-700">No past orders found</p>
      <p class="text-sm text-gray-500 mb-6">Looks like it’s time to treat yourself!</p>
      <router-link
        to="/"
        class="inline-block px-6 py-3 border border-gray-800 rounded-xl hover:bg-black hover:text-white transition-all duration-300 text-sm sm:text-base font-medium shadow-sm hover:shadow-lg"
      >
        Shop Now
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import {
  Search,
  Calendar,
  CreditCard,
  Wallet,
  ShoppingBag,
  ArrowDownAZ,
} from "lucide-vue-next";

const orders = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const sortOption = ref("latest");
const router = useRouter();

const fetchOrders = async () => {
  try {
    const authStore = useAuthStore();
    if (!authStore.key || !authStore.id_customer) {
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
    if (Array.isArray(data)) orders.value = data;
    else if (Array.isArray(data?.data)) orders.value = data.data;
    else orders.value = [];
  } catch (err) {
    console.error("Failed to fetch past orders:", err);
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

// Navigate to order detail page using slugified route
const goToOrderDetail = (order) => {
  const orderIdSlug = encodeURIComponent(order.order_detail.order.toString());
  router.push(`/profile/order/${orderIdSlug}`);
};

const statusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "bg-green-50 text-green-700 border-green-300";
    case "shipped":
      return "bg-blue-50 text-blue-700 border-blue-300";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-300";
    case "canceled":
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-300";
    default:
      return "bg-gray-50 text-gray-700 border-gray-300";
  }
};

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

const filteredOrders = computed(() => {
  let filtered = [...orders.value];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.order_detail.order.toString().includes(q) ||
        order.order_detail.status.toLowerCase().includes(q)
    );
  }

  switch (sortOption.value) {
    case "latest":
      filtered.sort(
        (a, b) =>
          new Date(b.order_detail.order_date) - new Date(a.order_detail.order_date)
      );
      break;
    case "oldest":
      filtered.sort(
        (a, b) =>
          new Date(a.order_detail.order_date) - new Date(b.order_detail.order_date)
      );
      break;
    case "high":
      filtered.sort(
        (a, b) =>
          b.order_detail.total_paid_tax_incl - a.order_detail.total_paid_tax_incl
      );
      break;
    case "low":
      filtered.sort(
        (a, b) =>
          a.order_detail.total_paid_tax_incl - b.order_detail.total_paid_tax_incl
      );
      break;
  }

  return filtered;
});

onMounted(fetchOrders);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn { animation: fadeIn 0.7s ease-in-out both; }
.animate-slideUp { animation: slideUp 0.9s ease-out both; }
</style>
