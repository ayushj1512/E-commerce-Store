<template>
  <div v-if="mounted" class="bg-gray-50 min-h-screen py-6 px-3 sm:px-6 md:px-12 lg:px-24 flex flex-col overflow-x-hidden">
    <div class="mx-auto w-full max-w-6xl space-y-8 sm:space-y-10 flex-1">

      <!-- Greeting -->
      <div class="text-center mb-6 px-2">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black break-words">
          Hello, {{ auth.name || "Customer" }}!
        </h1>
        <p class="text-gray-700 sm:text-base md:text-lg mt-1 break-words">
          You are just a few steps away from grabbing your favorite accessories 🎉
        </p>
      </div>

      <!-- Profile Header -->
      <div
        class="bg-white shadow-xl rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 transform transition-transform hover:scale-[1.02] overflow-hidden relative">

        <!-- Logout Button Top Right -->
        <div class="absolute top-4 right-4">
          <button @click="showLogoutModal = true"
            class="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors font-semibold text-sm shadow-md">
            Logout
          </button>
        </div>

        <!-- Avatar -->
        <div class="relative flex-shrink-0">
          <img :src="avatarUrl" alt="Customer Avatar"
            class="w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-full border-4 border-black shadow-md object-cover" />
          <button @click="router.push('/profile/avatar')"
            class="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full border-2 border-white hover:bg-gray-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15.232 5.232l3.536 3.536M16.5 3.75a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </button>
        </div>

        <!-- Info -->
        <div class="flex-1 flex flex-col gap-2 text-center md:text-left overflow-hidden">
          <h1 class="text-xl sm:text-2xl md:text-4xl font-extrabold text-black break-words">{{ auth.name || "Customer" }}</h1>
          <p class="text-gray-700 font-medium text-sm sm:text-base break-words">ID: {{ auth.id_customer || "0000" }}</p>
          
          <p v-if="auth.isVIP" class="text-yellow-500 font-bold text-sm sm:text-base mt-1">
            VIP Customer
          </p>

          <div class="flex flex-wrap items-center gap-2 justify-center md:justify-start mt-2">
            <button 
              @click="router.push('/profile/vouchers')"
              class="bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800 transition text-xs sm:text-sm whitespace-nowrap"
            >
              See Available Vouchers
            </button>
            
            <button 
              @click="router.push('/profile/refunds')"
              class="bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800 transition text-xs sm:text-sm whitespace-nowrap"
            >
              View Refunds
            </button>

            <!-- ✅ My Earnings -->
            <button 
              @click="router.push('/profile/stats')"
              class="bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800 transition text-xs sm:text-sm whitespace-nowrap"
            >
              My Earnings
            </button>
          </div>

          <p class="mt-2 text-gray-600 italic text-sm sm:text-base break-words">
            "{{ randomQuote }}"
          </p>
        </div>

      </div>

      <!-- Past Orders -->
      <PastOrders :orders="pastOrders" />

      <!-- Saved Addresses -->
      <SavedAddresses />

      <!-- Raise Concern Button -->
      <section class="flex justify-center mt-6 px-2">
        <button @click="router.push('/profile/support')"
          class="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition shadow-md font-semibold text-base">
          Raise a Concern
        </button>
      </section>
    </div>

    <!-- Deactivation Button at Bottom -->
    <div class="mt-6 flex justify-center px-2">
      <button @click="router.push('/profile/deactivation')"
        class="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition shadow-md font-semibold text-base">
        Deactivate Account
      </button>
    </div>

    <!-- Logout Confirmation Modal -->
    <transition name="fade-scale">
      <div v-if="showLogoutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 overflow-x-hidden">
        <div
          class="bg-white rounded-2xl p-6 sm:p-8 md:p-10 max-w-sm w-full shadow-xl relative transform scale-95 transition-all overflow-hidden">
          <div class="text-red-500 text-center text-5xl mb-4">⚠️</div>
          <p class="text-lg font-semibold mb-6 text-center break-words">
            Are you sure you want to logout? This will clear your session.
          </p>
          <div class="flex justify-center gap-4 flex-wrap">
            <button @click="logoutConfirmed"
              class="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition">
              Yes, Logout
            </button>
            <button @click="showLogoutModal = false"
              class="flex-1 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition">
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
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";
import { useCookies } from "@vueuse/integrations/useCookies";
import SavedAddresses from "~/components/profile/SavedAddresses.vue";
import PastOrders from "~/components/profile/PastOrders.vue";

definePageMeta({ middleware: ["auth"] });

const auth = useAuthStore();
const router = useRouter();
const mounted = ref(false);

// Logout modal
const showLogoutModal = ref(false);

// Cookies
const cookies = useCookies(["user_avatar"]);

onMounted(() => {
  mounted.value = true;
  auth.loadSession();

  pastOrders.value = [
    { id: 101, date: "2025-09-01", items: ["Bag", "Wallet"], total: 2999, status: "Delivered" },
    { id: 102, date: "2025-09-05", items: ["Sunglasses"], total: 999, status: "Shipped" },
    { id: 103, date: "2025-09-08", items: ["Purse", "Keychain"], total: 1799, status: "Delivered" },
  ];

  randomQuote.value = quotes[Math.floor(Math.random() * quotes.length)];
});

// Avatar URL (from cookies or default)
const avatarUrl = computed(() => cookies.get("user_avatar") || "https://i.pinimg.com/736x/f3/74/ae/f374ae1dcad3e0b5920d23041130dadc.jpg");

// Logout confirmation
const logoutConfirmed = () => {
  auth.logout();
  router.push("/login");
};

const quotes = [
  "Fashion is the armor to survive the reality of everyday life.",
  "Style is a way to say who you are without having to speak.",
  "In order to be irreplaceable, one must always be different.",
  "Elegance is not standing out, but being remembered.",
  "Life is too short to wear boring accessories."
];
const randomQuote = ref("");
const pastOrders = ref([]);
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
