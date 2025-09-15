<template>
  <div class="min-h-screen bg-white px-4 py-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-black">Your Vouchers</h1>
      <button
        @click="fetchVouchers"
        class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
      >
        Refresh
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10 text-gray-600">
      Loading vouchers...
    </div>

    <!-- Empty State -->
    <div v-else-if="vouchers.length === 0" class="text-center py-10">
      <p class="text-gray-700 text-base font-medium">
        You don’t have any vouchers yet 🪄
      </p>
      <p class="text-gray-500 text-sm">
        Shop a little and we’ll surprise you with offers!
      </p>
    </div>

    <!-- Vouchers Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="voucher in vouchers"
        :key="voucher.code"
        class="border border-gray-300 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white"
      >
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-black">{{ voucher.code }}</h2>
          <span class="text-xs px-2 py-1 rounded-full bg-black text-white">
            {{ voucher.reduction || "Flat Off" }}
          </span>
        </div>
        <p class="text-gray-700 text-sm mb-1">
          {{ voucher.name || "Special Voucher" }}
        </p>
        <p class="text-gray-500 text-xs mb-2">
          Expires: {{ voucher.date_to || "N/A" }}
        </p>
        <p class="text-gray-600 text-xs">
          {{ voucher.description || "Use this voucher to save on your next order!" }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export default {
  name: "Vouchers",
  data() {
    return {
      vouchers: [],
      loading: true,
    };
  },
  methods: {
    async fetchVouchers() {
      this.loading = true;
      const authStore = useAuthStore();

      try {
        if (!authStore.isAuthenticated) {
          console.warn("⚠️ User not logged in");
          this.vouchers = [];
          return;
        }

        const requestData = JSON.stringify({
          gateway_action: "cart/availableVoucher",
          site: "streetstylestore",
          all: 0,
          user_hash_key: authStore.key,
        });

        const response = await axios.post(import.meta.env.VITE_BASE_URL, requestData, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        console.log("🔹 Full API Response:", response.data);

        if (response.data?.voucherList?.length > 0) {
          this.vouchers = response.data.voucherList;
          console.log("🔹 Voucher List:", this.vouchers);
        } else {
          this.vouchers = [];
          console.log("🔹 No vouchers found.");
        }
      } catch (err) {
        console.error("❌ Failed to fetch vouchers:", err);
        this.vouchers = [];
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchVouchers();
  },
};
</script>

<style scoped>
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
