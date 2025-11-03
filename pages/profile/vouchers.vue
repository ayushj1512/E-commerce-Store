<template>
  <div class="min-h-screen bg-white px-4 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Vouchers</h1>
      <button
        @click="refreshVouchers"
        class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Refresh
      </button>
    </div>

    <!-- Loading -->
    <div v-if="cartStore.creditVoucherLoading" class="text-center py-10 text-gray-500">
      Loading vouchers...
    </div>

    <!-- Empty -->
    <div v-else-if="!cartStore.creditVouchers || cartStore.creditVouchers.length === 0" class="text-center py-12">
      <p class="text-gray-800 font-medium mb-1">
        You don’t have any vouchers yet 🪄
      </p>
      <p class="text-gray-500 text-sm">
        Shop a little and we’ll surprise you with offers!
      </p>
    </div>

    <!-- Voucher Cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="voucher in cartStore.creditVouchers"
        :key="voucher.code"
        class="relative border border-gray-200 rounded-2xl bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300"
      >
        <!-- Type Tag -->
        <div
          class="absolute top-0 right-0 bg-black text-white text-xs px-3 py-1 rounded-bl-lg"
        >
          {{ voucher.coupon_type || "Voucher" }}
        </div>

        <!-- Voucher Code -->
        <div class="mb-3">
          <h2 class="text-xl font-bold text-gray-900 tracking-wider">
            {{ voucher.code }}
          </h2>
        </div>

        <!-- Reduction -->
        <div class="mb-3">
          <span
            class="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full"
          >
            {{ getReductionText(voucher) }}
          </span>
        </div>

        <!-- Expiry -->
        <p class="text-gray-600 text-sm mb-1">
          <span class="font-semibold">Expires:</span>
          {{ formatDate(voucher.date_expiration) }}
        </p>

        <!-- Status -->
        <p class="text-sm mb-1">
          <span class="font-semibold">Status:</span>
          <span
            :class="voucher.status === 'Yes'
              ? 'text-green-600 font-semibold'
              : 'text-red-500 font-semibold'"
          >
            {{ voucher.status === 'Yes' ? 'Active' : 'Inactive' }}
          </span>
        </p>

        <!-- Expiry Days -->
        <p v-if="voucher.expiry_days" class="text-gray-500 text-sm mt-1">
          ⏳ Expires in {{ voucher.expiry_days }} days
        </p>
      </div>
    </div>

    <!-- Checkout Button -->
    <div v-if="cartStore.creditVoucherCheckoutUrl" class="text-center mt-10">
      <a
        :href="cartStore.creditVoucherCheckoutUrl"
        target="_blank"
        class="inline-block px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition"
      >
        Go to Checkout
      </a>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useCartStore } from "@/stores/cartStore";

const cartStore = useCartStore();

/**
 * Format expiry date to readable form
 */
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  try {
    const [dd, mm, yyyy] = dateStr.replace(/\\/g, "").split("/");
    return new Date(`${yyyy}-${mm}-${dd}`).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format readable discount text
 */
function getReductionText(voucher) {
  const amount = parseFloat(voucher.reduction_amount || 0);
  const percent = parseFloat(voucher.reduction_percent || 0);
  if (percent > 0) return `${percent}% Off`;
  if (amount > 0) return `₹${amount} Off`;
  return "Special Offer";
}

/**
 * Fetch vouchers from Pinia store
 */
function refreshVouchers() {
  cartStore.fetchCreditVoucher();
}

onMounted(() => {
  refreshVouchers();
});
</script>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
</style>
