<template>
  <div v-if="mounted" class="bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- 📍 ADDRESS -->
      <section class="bg-white p-6 rounded-2xl shadow-md">
        <!-- Full-width black header -->
        <div class="bg-black rounded-t-2xl -mx-6 -mt-6 p-4">
          <h2 class="text-xl font-bold text-white">DELIVERY ADDRESS</h2>
        </div>

        <!-- shimmer -->
        <div v-if="loading" class="space-y-3 mt-4">
          <div v-for="n in 2" :key="n" class="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>

        <!-- no addresses -->
        <div v-else-if="!addresses.length" class="text-center py-6 mt-4">
          <p class="text-gray-600 mb-3">No addresses found.</p>
          <button @click="goToAddAddress" class="bg-black text-white px-4 py-2 rounded-full">
            Add Address
          </button>
        </div>

        <!-- show addresses -->
        <div v-else class="space-y-3 mt-4">
          <div
            v-for="addr in addresses"
            :key="addr.id_address"
            @click="selectAddress(addr)"
            class="relative border p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
            :class="selectedAddress?.id_address === addr.id_address
              ? 'border-black shadow-lg ring-1 ring-black/10'
              : 'border-gray-200'"
          >
            <!-- Selected Tag -->
            <span
              v-if="selectedAddress?.id_address === addr.id_address"
              class="absolute top-2 right-2 text-xs bg-black text-white px-2 py-1 rounded-full"
            >
              Selected
            </span>

            <div>
              <p class="font-semibold">{{ addr.fullname }}</p>
              <p class="text-sm text-gray-600">
                {{ addr.address1 }} <span v-if="addr.address2">, {{ addr.address2 }}</span>
              </p>
              <p class="text-sm text-gray-600">
                {{ addr.city }}, {{ addr.name }} - {{ addr.postcode }}
              </p>
              <p class="text-sm text-gray-500">📞 {{ addr.phone_mobile }}</p>
            </div>
          </div>

          <div class="flex justify-center">
            <button @click="goToAddAddress" class="bg-black text-white px-4 py-2 rounded-full">
              Add New Address
            </button>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAddressStore } from "~/stores/address";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";

const mounted = ref(false);
const loading = ref(true);
const selectedAddress = ref(null);

const router = useRouter();
const addressStore = useAddressStore();
const authStore = useAuthStore();

const addresses = computed(() =>
  addressStore.addresses.map((a) => ({
    id_address: a.id_address,
    fullname: a.fullname || `${a.firstname ?? ""} ${a.lastname ?? ""}`,
    address1: a.address1 || "",
    address2: a.address2 || "",
    city: a.city || "",
    name: a.name || "",
    postcode: a.postcode || "",
    phone_mobile: a.phone_mobile || "",
  }))
);

function goToAddAddress() {
  router.push("/profile/add-address");
}

function selectAddress(addr) {
  selectedAddress.value = addr;
}

onMounted(async () => {
  mounted.value = true;
  loading.value = true;

  authStore.initAuth();

  if (authStore.isAuthenticated && authStore.key) {
    await addressStore.fetchAddresses();

    if (addressStore.addresses.length > 0) {
      const a = addressStore.addresses[0];
      selectedAddress.value = {
        id_address: a.id_address,
        fullname: a.fullname || `${a.firstname ?? ""} ${a.lastname ?? ""}`,
        address1: a.address1 || "",
        address2: a.address2 || "",
        city: a.city || "",
        name: a.name || "",
        postcode: a.postcode || "",
        phone_mobile: a.phone_mobile || "",
      };
    }
  }

  loading.value = false;
});
</script>
