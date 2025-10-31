<template>
  <div
    class="relative bg-white p-3 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1 border border-gray-200"
  >
    <!-- Address Info -->
    <div class="flex flex-col gap-0.5 sm:gap-1">
      <!-- Name -->
      <p class="text-[15px] sm:text-base md:text-lg font-semibold text-black">
        {{ address.fullname }}
      </p>

      <!-- Address Line 1 -->
      <p class="text-gray-600 text-[12px] sm:text-[13px] md:text-sm leading-snug">
        {{ address.address1 }}
      </p>

      <!-- Address Line 2 -->
      <p
        v-if="address.address2"
        class="text-gray-600 text-[12px] sm:text-[13px] md:text-sm leading-snug"
      >
        {{ address.address2 }}
      </p>

      <!-- City, State & Pincode -->
      <p class="text-gray-600 text-[12px] sm:text-[13px] md:text-sm leading-snug">
        {{ address.city }}, {{ address.name }} - {{ address.postcode }}
      </p>

      <!-- Phone -->
      <p class="text-gray-500 text-[12px] sm:text-[13px] md:text-sm mt-1">
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
/* ✨ Subtle hover gradient */
.relative:hover {
  background: linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%);
}

/* 📱 Mobile optimization */
@media (max-width: 640px) {
  .relative {
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
  }
  p {
    margin-bottom: 0.15rem;
  }
}
</style>
