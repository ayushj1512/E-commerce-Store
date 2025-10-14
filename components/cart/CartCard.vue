<template>
  <div
    class="border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out bg-white overflow-hidden"
  >
    <!-- Voucher Strip -->
    <div
      v-if="singleVoucher"
      :class="[
        'px-3 py-2 border-b font-medium text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2',
        singleVoucher.remainingPerItem[item._key] > 0
          ? 'bg-black text-white border-gray-700'
          : 'bg-green-500 text-white border-green-500'
      ]"
    >
      <div class="flex flex-wrap items-center gap-1 sm:gap-2">
        🎉 Eligible for
        <span class="uppercase font-semibold">{{ singleVoucher.category_name }}</span>
        offer
      </div>

      <div class="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 sm:mt-0">
        <span
          v-if="singleVoucher.remainingPerItem[item._key] > 0"
          class="text-gray-200 italic text-xs sm:text-sm"
        >
          (Add {{ singleVoucher.remainingPerItem[item._key] }} more to unlock full discount)
        </span>

        <button
          v-if="singleVoucher.remainingPerItem[item._key] > 0 && singleVoucher.link"
          @click.stop="$emit('go-to-voucher', singleVoucher.link)"
          class="px-2 py-1 bg-white text-black rounded-md text-xs sm:text-sm font-semibold hover:bg-gray-200 transition"
        >
          Browse Products
        </button>

        <span
          v-else
          class="ml-1 font-bold px-2 py-1 rounded-full text-green-500 bg-white text-xs sm:text-sm"
        >
          Extra Discount Applied!
        </span>
      </div>
    </div>

    <!-- Product Details -->
    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 transition-all duration-300 hover:bg-gray-50 rounded-2xl"
      :class="{
        'shadow-lg ': !item.discountApplied && isVoucherApplied
      }"
    >
      <!-- Product Info -->
      <div
        @click="$emit('go-to-detail', item)"
        class="flex items-start sm:items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0 cursor-pointer flex-1"
      >
        <img
          :src="item.image || 'https://via.placeholder.com/100x100.png?text=Image'"
          alt="Product"
          class="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        />
        <div class="flex-1 min-w-0">
          <h2
            class="truncate font-semibold text-base sm:text-lg"
            :class="item.discountApplied || isVoucherApplied ? 'text-green-700' : 'text-gray-900'"
          >
            {{ item.name }}
          </h2>
          <p v-if="item.size" class="text-xs sm:text-sm text-gray-500 truncate">
            Size: {{ item.size }}
          </p>
          <div class="mt-1 flex items-center gap-2 flex-wrap">
            <span
              v-if="item.discountApplied"
              class="line-through text-gray-400 text-xs sm:text-sm"
            >
              ₹{{ item.realPrice * item.quantity }}
            </span>
            <span
              class="font-bold text-sm sm:text-base"
              :class="item.discountApplied || isVoucherApplied ? 'text-green-700' : 'text-gray-900'"
            >
              ₹{{ finalPrice }}
            </span>
          </div>
        </div>
      </div>

      <!-- Quantity Controls -->
      <div class="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
        <button
          @click.stop="$emit('decrease', item)"
          class="px-2 py-1 border rounded-md hover:bg-gray-200 text-sm sm:text-base"
        >
          -
        </button>
        <span class="font-semibold text-sm sm:text-base">{{ item.quantity }}</span>
        <button
          @click.stop="$emit('increase', item)"
          class="px-2 py-1 border rounded-md hover:bg-gray-200 text-sm sm:text-base"
        >
          +
        </button>
        <button
          @click.stop="$emit('remove', item)"
          class="ml-1 sm:ml-3 text-red-500 hover:underline text-xs sm:text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  item: Object,
  filteredVouchers: Array,
  isVoucherApplied: Boolean,
  finalPrice: Number,
});

const emit = defineEmits([
  "increase",
  "decrease",
  "remove",
  "go-to-detail",
  "go-to-voucher",
]);

const singleVoucher = computed(() => {
  if (!props.filteredVouchers?.length) return null;
  return [...props.filteredVouchers].sort(
    (a, b) => (a.minQty || 0) - (b.minQty || 0)
  )[0];
});
</script>

<style scoped>

</style>
