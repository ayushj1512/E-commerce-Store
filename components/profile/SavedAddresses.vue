<template>
  <section class="w-full overflow-hidden">
    <!-- Header row with title + Manage button -->
    <div class="flex items-center justify-between pt-4 pb-5">
      <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-black">
        Saved Addresses
      </h2>
      <router-link
        to="/profile/address"
        class="bg-black text-white px-4 py-2 rounded-lg shadow-md transition"
      >
        Manage Addresses
      </router-link>
    </div>

    <!-- Shimmer loading -->
    <div
      v-if="loading"
      class="flex w-full gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory p-3"
    >
      <div
        v-for="n in 3"
        :key="n"
        class="min-w-[260px] sm:min-w-[300px] max-w-[85%] sm:max-w-xs min-h-[200px] snap-start flex-shrink-0 rounded-lg border border-gray-200 bg-gray-100 animate-pulse p-5"
      >
        <div class="h-4 w-28 bg-gray-300 rounded mb-4"></div>
        <div class="h-3 w-40 bg-gray-300 rounded mb-3"></div>
        <div class="h-3 w-32 bg-gray-300 rounded mb-3"></div>
        <div class="h-3 w-28 bg-gray-300 rounded mb-3"></div>
        <div class="mt-6 h-8 w-24 bg-gray-300 rounded-full"></div>
      </div>
    </div>

    <!-- No addresses -->
    <div v-else-if="addresses.length === 0" class="text-center py-12">
      <p class="text-gray-600 mb-4 text-sm sm:text-base">
        No saved addresses yet.
      </p>
      <button
        @click="goToAddAddress"
        class="bg-black text-white px-5 sm:px-7 py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-shadow shadow-md text-xs sm:text-sm md:text-base"
      >
        Click here to add one
      </button>
    </div>

    <!-- Display addresses -->
    <div
      v-else
      class="flex w-full gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
    >
      <AddressCard
        v-for="address in addresses"
        :key="address.id_address"
        :address="address"
        class="min-w-[260px] sm:min-w-[300px] max-w-[85%] sm:max-w-xs min-h-[200px] snap-start flex-shrink-0"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAddressStore } from "~/stores/address";
import { useRouter } from "vue-router";
import AddressCard from "./AddressCard.vue";

const router = useRouter();
const addressStore = useAddressStore();
const loading = ref(true);

onMounted(async () => {
  try {
    console.log("[SavedAddresses] 📡 Fetching addresses...");
    await addressStore.fetchAddresses();
    console.log("[SavedAddresses] ✅ Addresses loaded:", addressStore.addresses);
  } catch (err) {
    console.error("[SavedAddresses] ❌ Failed to fetch addresses:", err);
  } finally {
    loading.value = false;
  }
});

const addresses = computed(() => addressStore.addresses);

function goToAddAddress() {
  router.push("/profile/add-address");
}
</script>

<style scoped>
::-webkit-scrollbar {
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #a3a3a3;
  border-radius: 9999px;
}
::-webkit-scrollbar-track {
  background: #f5f5f5;
}
</style>
