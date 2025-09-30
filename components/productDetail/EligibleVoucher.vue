<template>
  <transition name="fade-scale">
    <div v-if="voucher" class="flex-1 flex justify-center mb-4">
      <div
        class="relative z-10 flex items-center justify-center px-6 py-3 rounded-lg bg-black text-white w-full max-w-xl text-center shadow-md border border-dashed border-white font-bold text-xs md:text-sm"
      >
        Part of {{ formatText(voucher.category_name) }}
        <div
          class="w-8 h-8 bg-white rounded-full absolute top-1/2 -translate-y-1/2 left-0 -ml-4"
        ></div>
        <div
          class="w-8 h-8 bg-white rounded-full absolute top-1/2 -translate-y-1/2 right-0 -mr-4"
        ></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  voucher: {
    type: Object,
    default: null
  }
});

const formatText = (text) =>
  text ? text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : "";
</script>
