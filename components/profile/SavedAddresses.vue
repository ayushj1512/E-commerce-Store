<template>
  <section class="w-full overflow-hidden">
    <h2 class="text-lg sm:text-xl md:text-2xl font-bold pt-4 pb-5 text-black">
      Saved Addresses
    </h2>

    <!-- No addresses -->
    <div v-if="addresses.length === 0" class="text-center py-10">
      <p class="text-gray-600 mb-3 text-sm sm:text-base">
        No saved addresses yet.
      </p>
      <button
        @click="goToAddAddress"
        class="bg-black text-white px-4 sm:px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition-shadow shadow-md text-xs sm:text-sm md:text-base"
      >
        Click here to add one
      </button>
    </div>

    <!-- Display addresses -->
    <div
      v-else
      class="flex w-full gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
    >
      <AddressCard
        v-for="address in addresses"
        :key="address.id_address"
        :address="address"
        class="min-w-[260px] sm:min-w-[300px] max-w-[85%] sm:max-w-xs snap-start flex-shrink-0"
        :is-selected="addressStore.deliveryAddress?.id_address === address.id_address"
        @select="selectAddress"
        @edit="editAddress"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useAddressStore } from "~/stores/address";
import { useRouter } from "vue-router";
import AddressCard from "./AddressCard.vue";

const router = useRouter();
const addressStore = useAddressStore();

onMounted(async () => {
  if (!addressStore.addresses.length) {
    try {
      console.log("[SavedAddresses] 📡 Fetching addresses...");
      await addressStore.fetchAddresses();
      console.log("[SavedAddresses] ✅ Addresses loaded:", addressStore.addresses);
    } catch (err) {
      console.error("[SavedAddresses] ❌ Failed to fetch addresses:", err);
    }
  }
});

const addresses = computed(() => addressStore.addresses);

function goToAddAddress() {
  router.push("/profile/add-address");
}

function selectAddress(address) {
  console.log("[SavedAddresses] 🏷️ Selected Address:", address);
  addressStore.setDeliveryAddress(address);
}

function editAddress(address) {
  console.log("[SavedAddresses] ✏️ Editing Address:", address);
  addressStore.setEditAddress(address);
  addressStore.setSaveAddressClick(true);
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
