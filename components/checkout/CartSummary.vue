<template>
  <section class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 max-w-7xl mx-auto w-full">
    <!-- Header with toggle -->
    <div
      @click="toggleCart"
      class="bg-black p-4 cursor-pointer flex justify-between items-center rounded-t-2xl transition-all duration-300 select-none shadow-md hover:shadow-lg transform"
    >
      <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
        🛒 YOUR CART ({{ cartStore.totalQuantity }})
      </h2>
      <ChevronDown
        class="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-500"
        :style="{ transform: `rotate(${rotation}deg)` }"
      />
    </div>

    <!-- Expandable content -->
    <transition name="expand">
      <div v-show="isCartExpanded" class="p-4 sm:p-6 space-y-6">
        <!-- Empty Cart -->
        <div v-if="!cartStore.items.length" class="text-center py-12">
          <p class="text-gray-500 text-sm sm:text-base md:text-lg mb-4">Your cart is empty.</p>
          <button
            class="mt-4 bg-black text-white px-5 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg hover:from-gray-900 hover:to-gray-700 hover:scale-105 transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>

        <!-- Cart Items -->
        <div v-else class="space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item._key"
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white gap-4"
          >
            <div class="flex items-start sm:items-center gap-4 w-full sm:w-auto">
              <img
                :src="item.image"
                alt="Product"
                class="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl border border-gray-200 flex-shrink-0"
              />
              <div class="truncate flex-1">
                <p class="font-semibold text-gray-800 text-sm sm:text-base truncate">{{ item.name }}</p>
                <p
                  v-if="item.size"
                  class="text-xs sm:text-sm text-gray-500 mt-1 inline-block bg-gray-100 px-2 py-0.5 rounded"
                >
                  Size: {{ item.size }}
                </p>
                <p class="text-gray-900 font-bold mt-1 text-sm sm:text-base">
                  ₹{{ cartStore.getFinalPrice(item) * item.quantity }} 
                  <span class="text-gray-500 font-normal text-xs sm:text-sm">(x{{ item.quantity }} ₹{{ item.price }})</span>
                </p>
              </div>
            </div>
            <div class="flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:gap-1 w-full sm:w-auto justify-between sm:justify-end">
              <p class="font-semibold text-gray-900 text-sm sm:text-lg">₹{{ cartStore.getFinalPrice(item) * item.quantity }}</p>
              <button class="text-red-500 hover:text-red-600 text-xs sm:text-sm transition-colors">
                Remove
              </button>
            </div>
          </div>

          <!-- Cart Summary -->
          <div class="mt-6 p-4 bg-gray-50 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-gray-700 shadow-sm text-sm sm:text-base">
            <div class="flex flex-col sm:flex-row sm:gap-6 gap-1 w-full sm:w-auto">
              <div>Total items: <span class="font-semibold">{{ cartStore.totalQuantity }}</span></div>
              <div>Subtotal: <span class="font-semibold">₹{{ cartStore.subtotal }}</span></div>
              <div class="text-green-600 font-medium flex items-center gap-1">💸 Discount: -₹{{ cartStore.discount }}</div>
              <div v-if="cartStore.codSelected" class="flex items-center gap-1">🚚 Delivery: <span class="font-semibold">₹{{ cartStore.COD_CHARGE }}</span></div>
            </div>
            <div class="text-lg font-bold text-black mt-2 sm:mt-0">Total Payment: ₹{{ cartStore.total }}</div>
          </div>

          <!-- Discount Highlight -->
          <div
            v-if="cartStore.discount > 0"
            class="mt-4 p-4 bg-green-100 border border-green-400 text-green-900 rounded-xl text-center font-semibold text-sm sm:text-base shadow-md animate-bounce"
          >
            🎉 You're saving ₹{{ cartStore.discount }} on this order!
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '~/stores/cartStore';
import { ChevronDown } from 'lucide-vue-next';

const cartStore = useCartStore();
const isCartExpanded = ref(true);
const rotation = ref(0);

const toggleCart = () => {
  isCartExpanded.value = !isCartExpanded.value;
  rotation.value += 180;
};
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

/* Subtle pop animation for cart items */
@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
</style>
