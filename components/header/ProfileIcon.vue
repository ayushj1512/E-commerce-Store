<template>
  <div class="relative" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <!-- Profile Icon (Lucide) -->
    <User
      class="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors"
      @click="goToProfile"
    />

    <!-- Dropdown below icon (Desktop only) -->
    <transition name="fade-scale">
      <div
        v-if="showProfileDropdown && isDesktop"
        class="absolute right-0 mt-1 w-64 bg-white shadow-lg border rounded-2xl p-4 z-50"
      >
        <div v-if="auth.isAuthenticated" class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <img
              :src="avatarUrl"
              alt="Avatar"
              class="w-12 h-12 rounded-full border-2 border-black object-cover"
            />
            <div class="flex flex-col">
              <!-- Enhanced Name -->
              <p class="text-xl font-bold text-black break-words">{{ auth.name || "Customer" }}</p>
              <span
                v-if="auth.isVIP"
                class="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1"
              >
                VIP
              </span>
            </div>
          </div>

          <!-- Small Fashion Quote -->
          <p class="text-xs text-gray-600 italic mt-1">
            "{{ randomQuote }}"
          </p>

          <!-- Logout Button -->
          <button
            @click.stop="showLogoutModal = true"
            class="mt-2 w-full bg-red-500 text-white py-1.5 rounded-lg hover:bg-red-600 transition text-sm"
          >
            Logout
          </button>
        </div>

        <div v-else>
          <p class="text-sm text-gray-700">You are not logged in</p>
          <button
            @click.stop="navigateToLogin"
            class="mt-2 w-full bg-black text-white py-1.5 rounded-lg hover:bg-gray-800 transition"
          >
            Login
          </button>
        </div>
      </div>
    </transition>

    <!-- Logout Confirmation Modal -->
    <transition name="fade-scale">
      <div
        v-if="showLogoutModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      >
        <div
          class="bg-white rounded-2xl p-6 sm:p-8 md:p-10 max-w-sm w-full shadow-xl relative transform scale-95 transition-all overflow-hidden"
        >
          <div class="text-red-500 text-center text-5xl mb-4">⚠️</div>
          <p class="text-lg font-semibold mb-6 text-center break-words">
            Are you sure you want to logout? This will clear your session.
          </p>
          <div class="flex justify-center gap-4 flex-wrap">
            <button
              @click="logoutConfirmed"
              class="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
            >
              Yes, Logout
            </button>
            <button
              @click="showLogoutModal = false"
              class="flex-1 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useCookies } from "@vueuse/integrations/useCookies";
import { User } from "lucide-vue-next";

const router = useRouter();
const auth = useAuthStore();
const showProfileDropdown = ref(false);
const showLogoutModal = ref(false);
const isDesktop = ref(false);

// Avatar from cookies or default
const cookies = useCookies(["user_avatar"]);
const avatarUrl = computed(() => cookies.get("user_avatar") || "https://i.pinimg.com/736x/f3/74/ae/f374ae1dcad3e0b5920d23041130dadc.jpg");

// Fashion Quotes
const quotes = [
  "Fashion is the armor to survive the reality of everyday life.",
  "Style is a way to say who you are without having to speak.",
  "Elegance is not standing out, but being remembered.",
  "Life is too short to wear boring accessories."
];
const randomQuote = ref("");

// Only access window in client
onMounted(() => {
  auth.initAuth();
  randomQuote.value = quotes[Math.floor(Math.random() * quotes.length)];

  if (typeof window !== "undefined") {
    isDesktop.value = window.innerWidth >= 768;
    window.addEventListener("resize", updateIsDesktop);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", updateIsDesktop);
  }
});

const updateIsDesktop = () => {
  if (typeof window !== "undefined") {
    isDesktop.value = window.innerWidth >= 768;
  }
};

// Navigate to profile or login
const goToProfile = () => {
  if (auth.isAuthenticated) router.push("/profile");
  else router.push("/login");
};

// Logout confirmation
const logoutConfirmed = () => {
  auth.logout();
  showLogoutModal.value = false;
  router.push("/login");
};

// Desktop hover dropdown
const handleMouseEnter = () => {
  if (isDesktop.value) showProfileDropdown.value = true;
};
const handleMouseLeave = () => {
  if (isDesktop.value) showProfileDropdown.value = false;
};

// Login button inside dropdown
const navigateToLogin = () => router.push("/login");
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
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
