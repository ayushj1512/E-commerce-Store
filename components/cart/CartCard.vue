<template>
  <div class="border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out bg-white overflow-hidden">
    <!-- Voucher Strip -->
    <div
      v-for="(v, idx) in filteredVouchers"
      :key="idx"
      :class="[
        'px-4 py-2 border-b rounded-t-2xl font-medium text-sm flex flex-col sm:flex-row items-center justify-between gap-2 transition-all duration-300',
        v.remainingPerItem[item._key] > 0
          ? 'bg-black text-white border-gray-700'
          : 'bg-green-400 text-white border-green-500 shadow-md'
      ]"
    >
      <div class="flex items-center gap-2">
        🎉 Eligible for
        <span class="uppercase font-semibold">{{ v.category_name }}</span>
        offer
      </div>

      <div class="flex items-center gap-2 mt-1 sm:mt-0">
        <span v-if="v.remainingPerItem[item._key] > 0" class="text-gray-200 italic text-xs sm:text-sm">
          (Add {{ v.remainingPerItem[item._key] }} more to unlock full discount)
        </span>

        <button
          v-if="v.remainingPerItem[item._key] > 0 && v.link"
          @click.stop="$emit('go-to-voucher', v.link)"
          class="px-2 py-1 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition"
        >
          Browse Products
        </button>

        <span
          v-else
          class="ml-1 font-bold px-3 py-1 rounded-full text-white shadow-md animate-pop-in-out"
        >
          Extra Discount Applied!
        </span>
      </div>
    </div>

    <!-- Product Details -->
    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 transition-all duration-300 hover:bg-gray-50"
      :class="isVoucherApplied ? 'shadow-lg scale-102 rounded-2xl' : ''"
    >
      <div
        @click="$emit('go-to-detail', item)"
        class="flex items-start sm:items-center space-x-4 mb-4 sm:mb-0 cursor-pointer flex-1"
      >
        <img
          :src="item.image"
          alt="Product"
          class="w-20 h-24 object-cover rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        />
        <div>
          <h2
            :class="isVoucherApplied
              ? 'font-semibold text-green-700 text-lg sm:text-xl animate-price-change'
              : 'font-semibold text-gray-900 text-lg sm:text-xl'"
          >
            {{ item.name }}
          </h2>
          <p v-if="item.size" class="text-sm text-gray-500">Size: {{ item.size }}</p>
          <div class="mt-1 flex items-center gap-2">
            <span v-if="item.discountApplied" class="line-through text-gray-400 mr-2 text-sm sm:text-base">
              ₹{{ item.realPrice * item.quantity }}
            </span>
            <span
              class="font-bold text-lg sm:text-xl"
              :class="isVoucherApplied ? 'text-green-700 animate-price-change' : 'text-gray-900'"
            >
              ₹{{ finalPrice }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-3 mt-2 sm:mt-0">
        <button
          @click.stop="$emit('decrease', item)"
          class="px-2 py-1 border rounded-lg hover:bg-gray-200 animate-pop-button"
        >
          -
        </button>
        <span class="font-semibold">{{ item.quantity }}</span>
        <button
          @click.stop="$emit('increase', item)"
          class="px-2 py-1 border rounded-lg hover:bg-gray-200 animate-pop-button"
        >
          +
        </button>
        <button
          @click.stop="$emit('remove', item)"
          class="ml-3 text-red-500 hover:underline text-sm sm:text-base"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: Object,
  filteredVouchers: Array,
  isVoucherApplied: Boolean,
  finalPrice: Number
})

defineEmits(['increase', 'decrease', 'remove', 'go-to-detail', 'go-to-voucher'])
</script>

<style>
/* Pop in & out animation */
@keyframes pop-in-out {
  0% { transform: scale(0.8); opacity: 0.6; }
  25% { transform: scale(1.1); opacity: 1; }
  50% { transform: scale(0.9); opacity: 0.9; }
  75% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-pop-in-out {
  animation: pop-in-out 1s ease-in-out infinite;
}

/* Price change bounce */
@keyframes price-change {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.animate-price-change {
  animation: price-change 0.5s ease-in-out;
}

/* Pop effect for + / - buttons */
@keyframes pop-button {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
.animate-pop-button:active {
  animation: pop-button 0.3s ease-in-out;
}

/* Slight card scale when voucher applied */
.scale-102 {
  transform: scale(1.02);
}
</style>
