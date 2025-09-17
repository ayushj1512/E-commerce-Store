<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-black">
          Manage Addresses
        </h1>
        <button
          @click="goToAddAddress"
          class="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-800 transition"
        >
          <Plus class="w-5 h-5" />
          Add New Address
        </button>
      </div>

      <!-- If not logged in -->
      <div
        v-if="!authStore.isAuthenticated && !loading"
        class="text-center py-20 bg-white rounded-xl shadow-md"
      >
        <p class="text-gray-600 mb-4 text-lg">Please log in to view your addresses.</p>
        <button
          @click="goToLogin"
          class="bg-black text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-800 transition"
        >
          Go to Login
        </button>
      </div>

      <!-- Loading shimmer -->
      <div v-else-if="loading" class="space-y-4">
        <div
          v-for="n in 3"
          :key="n"
          class="h-28 rounded-lg bg-gray-200 animate-pulse"
        ></div>
      </div>

      <!-- No addresses -->
      <div
        v-else-if="addresses.length === 0"
        class="text-center py-20 bg-white rounded-xl shadow-md"
      >
        <p class="text-gray-600 mb-4 text-lg">No saved addresses found.</p>
        <button
          @click="goToAddAddress"
          class="bg-black text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-800 transition"
        >
          Add Address
        </button>
      </div>

      <!-- Address list -->
      <div v-else class="grid gap-4 sm:gap-6">
        <div
          v-for="address in addresses"
          :key="address.id_address"
          class="relative bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition"
        >
          <!-- Delete Button -->
          <button
            @click="confirmDelete(address)"
            class="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
            aria-label="Delete Address"
          >
            <Trash2 class="w-5 h-5" />
          </button>

          <div>
            <p class="font-semibold text-black text-base sm:text-lg">
              {{ address.fullname }}
            </p>
            <p class="text-sm text-gray-600">
              {{ address.address1 }}
              <span v-if="address.address2">, {{ address.address2 }}</span>
            </p>
            <p class="text-sm text-gray-600">
              {{ address.city }}, {{ address.name }} - {{ address.postcode }}
            </p>
            <p class="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <Phone class="w-4 h-4" /> {{ address.phone_mobile }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <transition name="fade-scale">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-xl shadow-lg p-6 w-80 text-center space-y-4"
          role="dialog"
          aria-modal="true"
        >
          <h2 class="text-lg font-bold text-black">Delete Address?</h2>
          <p class="text-gray-600 text-sm">
            Are you sure you want to delete this address? This action cannot be
            undone.
          </p>
          <div class="flex justify-center gap-4">
            <button
              @click="deleteAddress"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Yes, Delete
            </button>
            <button
              @click="cancelDelete"
              class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAddressStore } from "~/stores/address";
import { useAuthStore } from "~/stores/auth";
import { Plus, Trash2, Phone } from "lucide-vue-next";

const router = useRouter();
const addressStore = useAddressStore();
const authStore = useAuthStore();

const loading = ref(true);
const showDeleteModal = ref(false);
const addressToDelete = ref(null);

onMounted(async () => {
  try {
    console.log("[AddressesPage] 🚀 Init");
    // ✅ Initialize auth first
    authStore.initAuth();

    if (!authStore.isAuthenticated) {
      console.warn("[AddressesPage] ⚠️ Not authenticated, skipping fetch");
      return;
    }

    console.log("[AddressesPage] 📡 Fetching addresses for user:", authStore.id_customer);
    await addressStore.fetchAddresses({
      key: authStore.key,
      id_customer: authStore.id_customer,
    });
    console.log("[AddressesPage] ✅ Addresses loaded:", addressStore.addresses);
  } catch (err) {
    console.error("[AddressesPage] ❌ Failed to fetch addresses:", err);
  } finally {
    loading.value = false;
  }
});

const addresses = computed(() => addressStore.getAddresses || []);

function goToAddAddress() {
  if (!authStore.isAuthenticated) {
    return goToLogin();
  }
  router.push("/profile/add-address");
}

function goToLogin() {
  router.push("/login");
}

function confirmDelete(address) {
  addressToDelete.value = address;
  showDeleteModal.value = true;
}

async function deleteAddress() {
  if (!addressToDelete.value) return;

  try {
    console.log("[AddressesPage] 🗑️ Deleting:", addressToDelete.value);
    await addressStore.removeAddress(addressToDelete.value.id_address, {
      key: authStore.key,
      id_customer: authStore.id_customer,
    });
  } catch (err) {
    console.error("[AddressesPage] ❌ Delete failed:", err);
  } finally {
    showDeleteModal.value = false;
    addressToDelete.value = null;
  }
}

function cancelDelete() {
  showDeleteModal.value = false;
  addressToDelete.value = null;
}
</script>

<style scoped>
/* Fade + scale modal animation */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease-in-out;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
