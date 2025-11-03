<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <!-- Header -->
    <header class="bg-white py-10 px-4 text-center border-b border-gray-200">
      <h1 class="text-3xl font-semibold tracking-tight text-black">
        🎟️ Your Vouchers
      </h1>
      <p class="text-gray-500 mt-2 text-sm">
        Exclusive savings curated just for you
      </p>
    </header>

    <!-- Main Body -->
    <main class="px-4 py-10">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-16 text-gray-500 animate-pulse">
        Loading vouchers...
      </div>

      <!-- Empty -->
      <div v-else-if="!vouchers || vouchers.length === 0" class="text-center py-16">
        <p class="text-gray-800 font-medium text-lg mb-1">
          You don’t have any vouchers yet 🪄
        </p>
        <p class="text-gray-500 text-sm">
          Shop a little — we’ll surprise you with some offers soon!
        </p>
      </div>

      <!-- Voucher Cards -->
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="voucher in vouchers"
          :key="voucher.code"
          class="relative bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1 border border-gray-200"
        >
          <!-- Top Section -->
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base sm:text-lg md:text-xl font-semibold text-black tracking-tight">
              {{ voucher.code }}
            </h2>
            <span
              class="text-xs sm:text-sm font-medium px-3 py-1 rounded-full"
              :class="voucher.status === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'"
            >
              {{ voucher.coupon_type || "Voucher" }}
            </span>
          </div>

          <!-- Discount -->
          <p
            class="text-green-700 bg-green-50 border border-green-100 inline-block px-3 py-1 text-sm rounded-full font-medium mb-3"
          >
            {{ getReductionText(voucher) }}
          </p>

          <!-- Status -->
          <p class="text-gray-600 text-sm">
            <span class="font-semibold text-black">Status:</span>
            <span
              :class="voucher.status === 'Yes' ? 'text-green-600 font-semibold' : 'text-gray-400 font-semibold'"
            >
              {{ voucher.status === 'Yes' ? 'Active' : 'Inactive' }}
            </span>
          </p>

          <!-- Expires In -->
          <p
            class="text-sm flex items-center gap-2 mt-2"
            :class="voucher.expiry_days <= 0 ? 'text-red-600' : 'text-gray-700'"
          >
            <span class="text-lg">⏳</span>
            <span
              class="font-semibold"
              :class="voucher.expiry_days <= 0 ? 'text-red-600' : 'text-black'"
            >
              {{
                voucher.expiry_days > 0
                  ? `Expires in ${voucher.expiry_days} days`
                  : 'Expired'
              }}
            </span>
          </p>
        </div>
      </div>

      <!-- Checkout Button -->
      <div v-if="checkoutUrl" class="text-center mt-12">
        <a
          :href="checkoutUrl"
          target="_blank"
          class="inline-block px-8 py-3 bg-green-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-green-700 transition"
        >
          Go to Checkout
        </a>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// --- Dummy Response (Simulating API) ---
const dummyResponse = {
  status: true,
  user_email: "",
  checkOutUrl: "https://dummy-checkout.com",
  voucherList: [
    {
      reduction_amount: "100.00",
      code: "HNNZQFJK",
      date_expiration: "17/11/2025",
      reduction_percent: "0.00",
      id_order_return: "0",
      status: "Yes",
      expiry_days: "16",
      coupon_type: "exchange",
    },
    {
      reduction_amount: "50.00",
      code: "SAVE50",
      date_expiration: "25/12/2025",
      reduction_percent: "0.00",
      id_order_return: "0",
      status: "Yes",
      expiry_days: "54",
      coupon_type: "discount",
    },
    {
      reduction_amount: "200.00",
      code: "EXPIRED123",
      date_expiration: "01/10/2025",
      reduction_percent: "0.00",
      id_order_return: "0",
      status: "No",
      expiry_days: "-5",
      coupon_type: "exchange",
    },
  ],
};

// --- State ---
const loading = ref(true);
const vouchers = ref([]);
const checkoutUrl = ref("");

// --- Simulated API Call ---
onMounted(async () => {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800)); // simulate latency
  vouchers.value = dummyResponse.voucherList;
  checkoutUrl.value = dummyResponse.checkOutUrl;
  loading.value = false;
});

// --- Helpers ---
function getReductionText(voucher) {
  const amount = parseFloat(voucher.reduction_amount || 0);
  const percent = parseFloat(voucher.reduction_percent || 0);
  if (percent > 0) return `${percent}% Off`;
  if (amount > 0) return `₹${amount} Off`;
  return "Special Offer";
}
</script>

<style scoped>
.relative:hover {
  background: linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%);
}

/* 📱 Mobile optimization */
@media (max-width: 640px) {
  .relative {
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
  }
  p {
    margin-bottom: 0.15rem;
  }
}
</style>
