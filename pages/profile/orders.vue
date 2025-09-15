<template>
  <div class="min-h-screen bg-white text-black p-4 sm:p-6">
    <!-- Page Title -->
    <h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Orders</h1>

    <!-- Search + Sort Controls -->
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
      <!-- Search -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search orders..."
        class="flex-1 px-3 sm:px-4 py-2 border border-black bg-white text-black placeholder-gray-500 rounded focus:outline-none text-sm sm:text-base"
      />

      <!-- Sort -->
      <select
        v-model="sortOption"
        class="w-full sm:w-1/3 px-3 sm:px-4 py-2 border border-black bg-white text-black rounded focus:outline-none text-sm sm:text-base"
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
        <option value="high">Price: High to Low</option>
        <option value="low">Price: Low to High</option>
      </select>
    </div>

    <!-- Orders List -->
    <div v-if="filteredOrders.length" class="space-y-3 sm:space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="border border-black rounded-lg p-3 sm:p-4 hover:bg-black hover:text-white transition text-sm sm:text-base cursor-pointer"
        @click="viewOrder(order)"
      >
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h2 class="font-semibold text-base sm:text-lg">Order #{{ order.id }}</h2>
          <span class="text-xs sm:text-sm opacity-70 mt-1 sm:mt-0">{{ formatDate(order.date) }}</span>
        </div>
        <p class="mt-2 text-xs sm:text-sm">Status: {{ order.status }}</p>
        <p class="text-xs sm:text-sm">Total: ₹{{ order.total }}</p>
      </div>
    </div>

    <!-- No Orders -->
    <div v-else class="text-center py-12 sm:py-16 px-4">
      <p class="text-base sm:text-lg font-medium mb-2">Looks like you haven’t ordered yet! 🛍️</p>
      <p class="text-xs sm:text-sm text-gray-600 mb-5">Why not treat yourself to something special today?</p>
      <router-link
        to="/"
        class="inline-block px-4 sm:px-6 py-2 border border-black rounded text-sm sm:text-base hover:bg-black hover:text-white transition"
      >
        Start Shopping
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"

// Reactive State
const orders = ref([])
const searchQuery = ref("")
const sortOption = ref("latest")

// Simulate Vuex/API utility
const $api = {
  async gatewayServerCall(axios, url, payload, key, withCredentials) {
    // Replace with your actual API call
    return axios.post(url, JSON.parse(payload), { withCredentials }).then(res => res.data)
  }
}

const $axios = axios
const $globals = { gatewayUrl: "https://gateway.streetstylestore.com/gateway/v1/", site: "defaultSite" }

// Fetch Orders
const fetchOrders = async () => {
  try {
    const requestData = JSON.stringify({
      gateway_action: "customer/getCustomerOrderList",
      version: "1",
      orderType: "all",  // Adjust as needed
      orderTime: "all"   // Adjust as needed
    })

    const res = await $api.gatewayServerCall($axios, $globals.gatewayUrl, requestData, '', true)
    orders.value = res.orders || []
  } catch (err) {
    console.error("Failed to fetch orders:", err)
  }
}

onMounted(fetchOrders)

// Computed: Filter + Sort
const filteredOrders = computed(() => {
  let filtered = [...orders.value]

  // Search
  if (searchQuery.value) {
    filtered = filtered.filter(order =>
      order.id.toString().includes(searchQuery.value) ||
      order.status.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Sort
  if (sortOption.value === "latest") {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
  } else if (sortOption.value === "oldest") {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
  } else if (sortOption.value === "high") {
    filtered.sort((a, b) => b.total - a.total)
  } else if (sortOption.value === "low") {
    filtered.sort((a, b) => a.total - b.total)
  }

  return filtered
})

// Format Date
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

// Actions
const viewOrder = async (order) => {
  try {
    // Get Specific Order Details
    const requestData = JSON.stringify({
      gateway_action: "customer/getCustomerOrderList",
      version: "1",
      orderType: "all",
      idOrder: order.id
    })
    const res = await $api.gatewayServerCall($axios, $globals.gatewayUrl, requestData, '', true)
    console.log("Specific Order:", res)

    // Optionally Track Order
    if(order.tracking) {
      const trackData = JSON.stringify({
        gateway_action: 'customer/customerOrder',
        site: $globals.site,
        type: 'trackOrder',
        idOrder: order.id,
        idCarrier: order.carrierId,
        shippingNumber: order.shippingNumber
      })
      const trackRes = await $api.gatewayServerCall($axios, $globals.gatewayUrl, trackData, '', true)
      console.log("Tracking Info:", trackRes)
    }

    // Optionally Send Pre-Order Confirmation
    // await sendPreOrderConfirmation(order.id)

  } catch (err) {
    console.error("Failed to fetch order details:", err)
  }
}

const sendPreOrderConfirmation = async (orderId) => {
  if (!orderId) return
  try {
    const requestData = JSON.stringify({
      gateway_action: "order/confirmation/index",
      id_order: orderId,
      version: "1"
    })
    const res = await $api.gatewayServerCall($axios, $globals.gatewayUrl, requestData, '', true)
    console.log("Pre-Order Confirmation:", res)
    return res
  } catch (err) {
    console.error("Failed to send pre-order confirmation:", err)
  }
}
</script>
