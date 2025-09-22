<template>
  <div class="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 flex justify-center">
    <div class="w-full max-w-3xl space-y-6">
      <!-- Delivery Information Card -->
      <div class="shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <!-- Heading always black -->
        <button
          @click="toggleCard('delivery')"
          class="w-full flex justify-between items-center px-6 py-5 bg-black text-white focus:outline-none rounded-t-xl transition-colors duration-300"
        >
          <div class="flex items-center gap-3">
            <Package
              class="w-5 h-5 transition-colors duration-300"
              :class="openCard === 'delivery' ? 'text-green-500' : ''"
            />
            <span class="text-base sm:text-lg font-semibold">Delivery Information</span>
          </div>
          <ChevronDown
            class="w-5 h-5 transition-transform duration-500 ease-in-out"
            :class="openCard === 'delivery' ? 'rotate-180' : ''"
          />
        </button>

        <!-- Expanded content white -->
        <transition name="smooth-accordion">
          <div
            v-if="openCard === 'delivery'"
            class="px-6 py-5 text-black text-sm sm:text-base leading-relaxed bg-white border-t border-gray-200 rounded-b-xl"
          >
            Products are generally dispatched in <span class="font-semibold">3-21 days</span> depending upon the product you have ordered.
            <span class="font-medium">We guarantee that our products are worth the wait!</span> You will surely be amazed by the quality and the design that we offer at our price.
          </div>
        </transition>
      </div>

      <!-- Returns & Exchange Card -->
      <div class="shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <!-- Heading always black -->
        <button
          @click="toggleCard('returns')"
          class="w-full flex justify-between items-center px-6 py-5 bg-black text-white focus:outline-none rounded-t-xl transition-colors duration-300"
        >
          <div class="flex items-center gap-3">
            <RefreshCcw
              class="w-5 h-5 transition-colors duration-300"
              :class="openCard === 'returns' ? 'text-green-500' : ''"
            />
            <span class="text-base sm:text-lg font-semibold">Returns & Exchange</span>
          </div>
          <ChevronDown
            class="w-5 h-5 transition-transform duration-500 ease-in-out"
            :class="openCard === 'returns' ? 'rotate-180' : ''"
          />
        </button>

        <!-- Expanded content white -->
        <transition name="smooth-accordion">
          <div
            v-if="openCard === 'returns'"
            class="px-6 py-5 text-black text-sm sm:text-base leading-relaxed bg-white border-t border-gray-200 rounded-b-xl"
          >
            <span class="font-semibold">Size exchange is free.</span> We do charge a fee of <span class="font-semibold">Rs 100</span> in case you want to change the ordered product with a different product. 
            <a @click.prevent="navigateToReturns" class="text-black underline cursor-pointer ml-1">Click here for details.</a>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Package, RefreshCcw, ChevronDown } from "lucide-vue-next";

const openCard = ref(null);
const router = useRouter();

function toggleCard(card) {
  openCard.value = openCard.value === card ? null : card;
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
