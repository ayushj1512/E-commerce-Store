<template>
  <div class="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 flex justify-center">
    <div class="w-full max-w-3xl space-y-6">

      <!-- Delivery Information Card -->
      <div class="shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <button
          @click="toggleCard('delivery')"
          class="w-full flex justify-between items-center px-6 py-5 bg-black text-white focus:outline-none rounded-t-xl transition-colors duration-300"
        >
          <div class="flex items-center gap-3">
            <Package
              class="w-5 h-5 transition-colors duration-300"
              :class="isCardOpen('delivery') ? 'text-green-500' : ''"
            />
            <span class="text-base sm:text-lg font-semibold">Delivery Information</span>
          </div>
          <ChevronDown
            class="w-5 h-5 transition-transform duration-500 ease-in-out"
            :class="isCardOpen('delivery') ? 'rotate-180' : ''"
          />
        </button>

        <transition name="smooth-accordion">
          <div
            v-if="isCardOpen('delivery')"
            class="px-6 py-5 text-black text-sm sm:text-base leading-relaxed bg-white border-t border-gray-200 rounded-b-xl"
          >
            Our products are usually dispatched within <span class="font-semibold">3–21 days</span>, depending on availability. 
            <span class="font-medium">We ensure that every item is worth the wait, delivering quality and design that will delight you!</span>
          </div>
        </transition>
      </div>

      <!-- Returns & Exchange Card -->
      <div class="shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <button
          @click="toggleCard('returns')"
          class="w-full flex justify-between items-center px-6 py-5 bg-black text-white focus:outline-none rounded-t-xl transition-colors duration-300"
        >
          <div class="flex items-center gap-3">
            <RefreshCcw
              class="w-5 h-5 transition-colors duration-300"
              :class="isCardOpen('returns') ? 'text-green-500' : ''"
            />
            <span class="text-base sm:text-lg font-semibold">Returns & Exchange</span>
          </div>
          <ChevronDown
            class="w-5 h-5 transition-transform duration-500 ease-in-out"
            :class="isCardOpen('returns') ? 'rotate-180' : ''"
          />
        </button>

        <transition name="smooth-accordion">
          <div
            v-if="isCardOpen('returns')"
            class="px-6 py-5 text-black text-sm sm:text-base leading-relaxed bg-white border-t border-gray-200 rounded-b-xl"
          >
            <span class="font-semibold">Size exchanges are free of charge.</span> 
            If you wish to exchange your order for a different product, a nominal fee of <span class="font-semibold">₹100</span> applies. 
            <a @click.prevent="navigateToReturns" class="text-black underline cursor-pointer ml-1">Click here for full details.</a>
          </div>
        </transition>
      </div>

      <!-- Disclaimer Card -->
      <div class="shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <button
          @click="toggleCard('disclaimer')"
          class="w-full flex justify-between items-center px-6 py-5 bg-black text-white focus:outline-none rounded-t-xl transition-colors duration-300"
        >
          <div class="flex items-center gap-3">
            <Shield
              class="w-5 h-5 transition-colors duration-300"
              :class="isCardOpen('disclaimer') ? 'text-green-500' : ''"
            />
            <span class="text-base sm:text-lg font-semibold">Disclaimer</span>
          </div>
          <ChevronDown
            class="w-5 h-5 transition-transform duration-500 ease-in-out"
            :class="isCardOpen('disclaimer') ? 'rotate-180' : ''"
          />
        </button>

        <transition name="smooth-accordion">
          <div
            v-if="isCardOpen('disclaimer')"
            class="px-6 py-5 text-black text-sm sm:text-base leading-relaxed bg-white border-t border-gray-200 rounded-b-xl"
          >
            Please note that the actual color and appearance of products may slightly differ due to lighting conditions, photographic settings, or your device’s display. 
            We make every effort to represent each product as accurately as possible for your convenience.
          </div>
        </transition>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Package, RefreshCcw, ChevronDown, Shield } from "lucide-vue-next";

const openCards = ref([]);
const router = useRouter();

function toggleCard(card) {
  if (openCards.value.includes(card)) {
    openCards.value = openCards.value.filter(c => c !== card);
  } else {
    openCards.value.push(card);
  }
}

function isCardOpen(card) {
  return openCards.value.includes(card);
}

function navigateToReturns() {
  router.push("/returns");
}
</script>

<style scoped>
/* Smooth accordion with fade + slide */
.smooth-accordion-enter-active,
.smooth-accordion-leave-active {
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
.smooth-accordion-enter-from,
.smooth-accordion-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.smooth-accordion-enter-to,
.smooth-accordion-leave-from {
  max-height: 400px;
  opacity: 1;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

/* Hover lift effect */
div.shadow-lg:hover {
  transform: translateY(-3px);
  transition: transform 0.35s ease;
}
</style>
