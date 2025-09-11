<template>
  <div v-if="mounted" class="bg-gray-50 min-h-screen py-6 px-3 sm:px-6 md:px-12 lg:px-24 flex flex-col">
    <div class="mx-auto space-y-8 sm:space-y-10 flex-1">

      <!-- Greeting -->
      <div class="text-center mb-6">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black">
          Hello, {{ auth.name || "Customer" }}!
        </h1>
        <p class="text-gray-700 sm:text-base md:text-lg mt-1">
          You are just a few steps away from grabbing your favorite accessories 🎉
        </p>
      </div>

      <!-- Profile Header -->
      <div
        class="bg-white shadow-xl rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 transform transition-transform hover:scale-[1.02]">
        <!-- Avatar -->
        <div class="flex-shrink-0">
          <img :src="avatarUrl" alt="Customer Avatar"
            class="w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-full border-4 border-black shadow-md" />
        </div>

        <!-- Info -->
        <div class="flex-1 flex flex-col gap-2 text-center md:text-left">
          <h1 class="text-xl sm:text-2xl md:text-4xl font-extrabold text-black">{{ auth.name || "Customer" }}</h1>
          <p class="text-gray-700 font-medium text-sm sm:text-base">ID: {{ auth.id_customer || "0000" }}</p>
          <span
            class="inline-block mt-2 px-3 py-1 bg-black text-white font-semibold rounded-full text-xs sm:text-sm md:text-base">
            VIP Customer
          </span>
          <p class="mt-2 text-gray-600 italic text-sm sm:text-base">"{{ randomQuote }}"</p>
        </div>
      </div>

      <!-- Past Orders -->
      <section>
        <h2 class="text-lg sm:text-xl md:text-2xl font-bold pt-4 pb-5 text-black">Past Orders</h2>
        <div v-if="pastOrders.length === 0" class="text-center py-6">
          <p class="text-gray-600 text-sm sm:text-base">You have no past orders.</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div v-for="order in pastOrders" :key="order.id"
            class="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all">
            <p class="font-semibold text-black mb-2 text-sm sm:text-base">Order #{{ order.id }}</p>
            <p class="text-gray-700 text-xs sm:text-sm mb-1">Date: {{ order.date }}</p>
            <p class="text-gray-700 text-xs sm:text-sm mb-1">Items: {{ order.items.join(", ") }}</p>
            <p class="text-gray-700 text-xs sm:text-sm mb-1">Total: ₹{{ order.total }}</p>
            <span class="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm">
              {{ order.status }}
            </span>
          </div>
        </div>
      </section>

      <!-- Saved Addresses -->
      <SavedAddresses />

      <!-- Raise Concern Button -->
      <section class="flex justify-center mt-6">
        <button @click="showConcernModal = true"
          class="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition shadow-md font-semibold text-base">
          Raise a Concern
        </button>
      </section>
    </div>

    <!-- Logout Button at Bottom -->
    <div class="mt-8 flex justify-center">
      <button @click="showLogoutModal = true"
        class="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-colors font-semibold text-base shadow-md">
        Logout
      </button>
    </div>

    <!-- Concern Modal -->
    <transition name="fade-scale">
      <div v-if="showConcernModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          class="bg-white rounded-2xl p-6 sm:p-8 md:p-10 max-w-md w-full shadow-xl relative transform scale-95 transition-all">
          <h2 class="text-xl sm:text-2xl font-bold text-center mb-4">Raise a Concern</h2>
          <p class="text-gray-600 text-sm sm:text-base mb-4 text-center">
            Facing any issue? Let us know and our support team will assist you promptly.
          </p>
          <textarea v-model="concernText" placeholder="Type your concern here..."
            class="w-full border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent mb-4 text-sm sm:text-base md:text-base resize-none"
            rows="4"></textarea>
          <div class="flex justify-center gap-4">
            <button @click="submitConcern"
              class="flex-1 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition shadow-md">
              Submit
            </button>
            <button @click="showConcernModal = false"
              class="flex-1 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition shadow-md">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Logout Confirmation Modal -->
    <transition name="fade-scale">
      <div v-if="showLogoutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          class="bg-white rounded-2xl p-6 sm:p-8 md:p-10 max-w-sm w-full shadow-xl relative transform scale-95 transition-all">
          <div class="text-red-500 text-center text-5xl mb-4">⚠️</div>
          <p class="text-lg font-semibold mb-6 text-center">
            Are you sure you want to logout? This will clear your session.
          </p>
          <div class="flex justify-center gap-4">
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
import SavedAddresses from "~/components/profile/SavedAddresses.vue";

definePageMeta({ middleware: ["auth"] });

const auth = useAuthStore();
const router = useRouter();
const mounted = ref(false);

// Concern modal
const showConcernModal = ref(false);
const concernText = ref("");

// Logout modal
const showLogoutModal = ref(false);

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

const avatarUrl = computed(() =>
  "https://i.pinimg.com/736x/b1/68/87/b16887baf28b8f5dea2806a92d2f35f2.jpg"
);

const submitConcern = () => {
  if (!concernText.value.trim()) {
    alert("Please type your concern.");
    return;
  }
  console.log("Concern submitted:", concernText.value);
  alert("Your concern has been submitted! Our team will contact you soon.");
  concernText.value = "";
  showConcernModal.value = false;
};

// Logout confirmation
const confirmLogout = () => {
  showLogoutModal.value = true;
};

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
section div:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

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
