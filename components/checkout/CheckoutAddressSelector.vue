<template>
  <section class="bg-white p-6 rounded-2xl shadow-md">
    <h2 class="text-xl font-bold mb-4">Delivery Address</h2>

    <!-- No addresses -->
    <div v-if="!addresses.length" class="text-center py-6">
      <p class="text-gray-600 mb-3 text-sm sm:text-base">No addresses found.</p>
      <button @click="addNewAddress"
        class="bg-black text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-800 transition-shadow">
        Add Address
      </button>
    </div>

    <!-- Existing addresses -->
    <div v-else class="space-y-3">
      <div v-for="addr in addresses" :key="addr.id_address"
        class="border rounded-xl p-4 flex justify-between items-start cursor-pointer hover:shadow-md transition"
        :class="{'border-black': isSelected(addr), 'border-gray-200': !isSelected(addr)}"
        @click="selectAddress(addr)"
      >
        <div>
          <p class="font-semibold text-black">{{ addr.name }}</p>
          <p class="text-gray-700 text-sm">{{ addr.street }}, {{ addr.city }}</p>
          <p class="text-gray-700 text-sm">{{ addr.state }} - {{ addr.zip }}</p>
          <p class="text-gray-700 text-sm">{{ addr.phone }}</p>
        </div>
        <div class="flex flex-col items-end gap-2">
          <span v-if="isSelected(addr)" class="text-green-600 font-semibold text-sm">Selected</span>
          <button @click.stop="editAddress(addr)" class="text-blue-600 text-xs underline hover:text-blue-800">
            Edit
          </button>
          <button @click.stop="removeAddress(addr.id_address)" class="text-red-500 text-xs underline hover:text-red-600">
            Remove
          </button>
        </div>
      </div>

      <!-- Add new address button -->
      <div class="flex justify-center mt-4">
        <button @click="addNewAddress"
          class="bg-black text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-800 transition-shadow">
          Add New Address
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useAddressStore } from "~/stores/address";
import { useRouter } from "vue-router";

const addressStore = useAddressStore();
const router = useRouter();

// Fetch addresses on mount
onMounted(async () => {
  console.log("[DeliveryAddress] Component mounted");
  console.log("[DeliveryAddress] Current store addresses:", addressStore.getAddresses);

  if (!addressStore.addresses.length) {
    console.log("[DeliveryAddress] No addresses found in store. Fetching...");
    await addressStore.getAddresses();
    console.log("[DeliveryAddress] Addresses after fetch:", addressStore.getAddresses);
  }
});

// Reactive list of addresses
const addresses = computed(() => {
  console.log("[DeliveryAddress] Computing addresses list:", addressStore.getAddresses);
  return addressStore.getAddresses;
});

// Check if address is selected
const isSelected = (addr) => {
  const selected = addressStore.getDeliveryAddress.id_address === addr.id_address;
  console.log("[DeliveryAddress] Checking if address is selected:", addr, selected);
  return selected;
};

// Select delivery address
const selectAddress = (addr) => {
  console.log("[DeliveryAddress] Selecting address:", addr);
  addressStore.setDeliveryAddress(addr);
  console.log("[DeliveryAddress] Delivery address in store now:", addressStore.getDeliveryAddress);
};

// Add new address
const addNewAddress = () => {
  console.log("[DeliveryAddress] Navigating to add new address page");
  router.push("/profile/add-address");
};

// Edit address
const editAddress = (addr) => {
  console.log("[DeliveryAddress] Editing address:", addr);
  addressStore.setEditAddress(addr);
  console.log("[DeliveryAddress] Edit address in store now:", addressStore.getEditAddress);
  router.push("/profile/add-address");
};

// Remove address
const removeAddress = async (id_address) => {
  console.log("[DeliveryAddress] Attempting to remove address ID:", id_address);
  if (confirm("Are you sure you want to remove this address?")) {
    await addressStore.removeAddress(id_address);
    console.log("[DeliveryAddress] Address removed. Current store addresses:", addressStore.getAddresses);
  } else {
    console.log("[DeliveryAddress] Remove action canceled for address ID:", id_address);
  }
};
</script>

<style scoped>
.border-black {
  border-width: 2px;
}
</style>
