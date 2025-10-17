<template>
  <transition name="slide-up">
    <div
      v-if="showBanner && (isAndroid || isIOS)"
      class="fixed bottom-0 inset-x-0 z-50"
    >
      <div
        class="bg-black text-white flex items-center justify-between px-4 py-3 md:px-6 md:py-4 shadow-lg space-x-4 md:space-x-6"
      >
        <!-- Left: App logo + info -->
        <div class="flex items-center flex-1 min-w-0 space-x-3">
          <div class="flex-shrink-0">
            <svg
              class="w-10 h-10 md:w-12 md:h-12 text-white"
              viewBox="0 0 640 640"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M447.1 332.7C446.9 296 463.5 268.3 497.1 247.9C478.3 221 449.9 206.2 412.4 203.3C376.9 200.5 338.1 224 323.9 224C308.9 224 274.5 204.3 247.5 204.3C191.7 205.2 132.4 248.8 132.4 337.5C132.4 363.7 137.2 390.8 146.8 418.7C159.6 455.4 205.8 545.4 254 543.9C279.2 543.3 297 526 329.8 526C361.6 526 378.1 543.9 406.2 543.9C454.8 543.2 496.6 461.4 508.8 424.6C443.6 393.9 447.1 334.6 447.1 332.7zM390.5 168.5C417.8 136.1 415.3 106.6 414.5 96C390.4 97.4 362.5 112.4 346.6 130.9C329.1 150.7 318.8 175.2 321 202.8C347.1 204.8 370.9 191.4 390.5 168.5z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="font-bold text-sm md:text-base truncate">
              Get the Street Style Store App
            </p>
            <p class="text-xs md:text-sm text-gray-300 truncate">
              Shop faster & unlock exclusive deals
            </p>
          </div>
        </div>

        <!-- Right: Conditional CTA + Close -->
        <div class="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
          <button
            v-if="isAndroid"
            @click="openPlayStore"
            class="bg-white text-black px-4 py-2 md:px-5 md:py-2.5 rounded-full font-semibold text-sm md:text-base shadow-sm hover:bg-gray-200 transform hover:scale-105 transition"
          >
            Get on Play Store
          </button>

          <button
            v-if="isIOS"
            @click="openAppStore"
            class="bg-white text-black px-4 py-2 md:px-5 md:py-2.5 rounded-full font-semibold text-sm md:text-base shadow-sm hover:bg-gray-200 transform hover:scale-105 transition"
          >
            Get on App Store
          </button>

          <button
            @click="dismissBanner"
            class="text-white hover:text-gray-400 text-2xl md:text-3xl font-bold focus:outline-none"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from "vue";

const showBanner = ref(true);
const isAndroid = ref(false);
const isIOS = ref(false);

// Detect platform
onMounted(() => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  isAndroid.value = /android/i.test(ua);
  isIOS.value = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
});

// Open store links
const openPlayStore = () => {
  window.open(
    "https://play.google.com/store/apps/details?id=com.streetstylestore.m.twa",
    "_blank"
  );
};

const openAppStore = () => {
  window.open(
    "https://apps.apple.com/in/app/street-style-store/id6476806673",
    "_blank"
  );
};

// Dismiss banner
const dismissBanner = () => {
  showBanner.value = false;
};
</script>

<style scoped>
/* Smooth slide animation */
.slide-up-enter-active {
  animation: slide-up-in 0.4s ease-out forwards;
}
.slide-up-leave-active {
  animation: slide-up-out 0.3s ease-in forwards;
}

@keyframes slide-up-in {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0%);
    opacity: 1;
  }
}

@keyframes slide-up-out {
  0% {
    transform: translateY(0%);
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}
</style>
