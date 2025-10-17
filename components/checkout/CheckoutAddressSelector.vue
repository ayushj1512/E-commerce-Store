<template>
  <div v-if="mounted" class="bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- 📍 DELIVERY ADDRESS -->
      <section class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
        <!-- Header with toggle -->
        <div
          @click="toggleCard"
          class="bg-gradient-to-r from-black to-gray-800 p-4 cursor-pointer flex justify-between items-center rounded-t-2xl transition-all duration-300 hover:from-gray-900 hover:to-gray-700 select-none"
        >
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            📍 DELIVERY ADDRESS ({{ addresses.length }})
          </h2>

          <!-- 🔄 Chevron rotates -->
          <ChevronDown
            class="w-5 h-5 text-white transform transition-transform duration-500"
            :style="{ transform: `rotate(${rotation}deg)` }"
          />
        </div>

        <!-- Expandable content -->
        <transition name="expand">
          <div v-show="isExpanded" class="p-6 space-y-4">
            <!-- shimmer/loading -->
            <div v-if="loading" class="space-y-3">
              <div v-for="n in 2" :key="n" class="h-24 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
            </div>

            <!-- no addresses -->
            <div v-else-if="!addresses.length" class="text-center py-6">
              <p class="text-gray-600 mb-3">No addresses found.</p>
              <button
                @click="goToAddAddress"
                class="flex items-center gap-2 justify-center bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
              >
                <span class="text-lg">➕</span> Add Address
              </button>
            </div>

            <!-- addresses list -->
            <div v-else class="space-y-3">
              <div
                v-for="addr in addresses"
                :key="addr.id_address"
                @click="selectAddress(addr)"
                class="relative border p-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                :class="selectedAddress?.id_address === addr.id_address
                  ? 'border-green-500 shadow-xl ring-1 ring-green-200 bg-gradient-to-r from-green-50 to-green-100 selected'
                  : 'border-gray-200 bg-white'"
              >
                <!-- Selected Tag -->
                <span
                  v-if="selectedAddress?.id_address === addr.id_address"
                  class="absolute top-2 right-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1"
                >
                  ✅ Selected
                </span>

                <div class="space-y-1">
                  <p class="font-semibold text-gray-800">{{ addr.fullname }}</p>
                  <p class="text-sm text-gray-600">
                    📍 {{ addr.address1 }}<span v-if="addr.address2">, {{ addr.address2 }}</span>
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ addr.city }}, {{ addr.name }} - {{ addr.postcode }}
                  </p>
                  <p class="text-sm text-gray-500 flex items-center gap-1">
                    📞 {{ addr.phone_mobile }}
                  </p>
                </div>
              </div>

             <div class="flex justify-center pt-2">
  <button
    @click="goToAddAddress"
    class="flex items-center gap-2 justify-center bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
  >
    <Plus class="w-5 h-5" /> Add New Address
  </button>
</div>

            </div>
          </div>
        </transition>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAddressStore } from "~/stores/address";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";
import { ChevronDown,  Plus } from "lucide-vue-next";

const mounted = ref(false);
const loading = ref(true);
const selectedAddress = ref(null);
const isExpanded = ref(true);
const rotation = ref(0);

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

function toggleCard() {
  isExpanded.value = !isExpanded.value;
  rotation.value += 180;
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

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.4s ease;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 2000px;
  opacity: 1;
  overflow: hidden;
}

/* Selected card pop effect */
@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}
.selected {
  animation: pop 0.2s ease;
}
</style>
