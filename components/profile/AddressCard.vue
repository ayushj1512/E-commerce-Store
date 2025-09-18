<template>
  <div
    class="relative bg-white p-8 sm:p-5 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1 border border-gray-200"
  >
    <!-- Address Info -->
    <div class="mb-3 sm:mb-4">
      <p class="text-sm sm:text-base md:text-lg font-semibold text-black mb-1 truncate">
        {{ address.fullname }}
      </p>
      <p class="text-gray-600 text-[11px] sm:text-xs md:text-sm leading-snug">
        {{ address.address1 }}, {{ address.address2 }}
      </p>
      <p class="text-gray-600 text-[11px] sm:text-xs md:text-sm leading-snug">
        {{ address.city }}, {{ address.name }} - {{ address.postcode }}
      </p>
      <p class="text-gray-500 text-[11px] sm:text-xs md:text-sm mt-1">
        📞 {{ address.phone_mobile }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  address: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
/* Subtle hover background */
div:hover {
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
}
</style>
