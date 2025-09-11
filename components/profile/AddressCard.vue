<template>
  <div
    class="relative bg-white p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1"
    :class="{
      'border-2 border-black shadow-md': isSelected,
      'border border-gray-200': !isSelected
    }"
  >
    <!-- Selected Badge -->
    <span
      v-if="isSelected"
      class="absolute top-2 right-2 text-[9px] sm:text-[10px] font-semibold bg-black text-white px-2 py-0.5 rounded-full uppercase tracking-wide"
    >
      Selected
    </span>

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

    <!-- Divider -->
    <div class="border-t border-gray-200 my-2 sm:my-3"></div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between gap-2">
      <button
        class="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 border border-black text-black text-[11px] sm:text-xs md:text-sm rounded-md font-medium transition hover:bg-black hover:text-white"
        @click="selectAddress"
      >
        ✔️ <span>Select</span>
      </button>
      <button
        class="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 border border-gray-400 text-gray-700 text-[11px] sm:text-xs md:text-sm rounded-md font-medium transition hover:bg-gray-700 hover:text-white"
        @click="editAddressCard"
      >
        ✏️ <span>Edit</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAddressStore } from '~/stores/address'
import { computed } from 'vue'

const props = defineProps({
  address: {
    type: Object,
    required: true,
  },
})

const addressStore = useAddressStore()

const isSelected = computed(() => {
  return addressStore.deliveryAddress?.id_address === props.address.id_address
})

function selectAddress() {
  addressStore.setDeliveryAddress(props.address)
}

function editAddressCard() {
  addressStore.setEditAddress(props.address)
  addressStore.setSaveAddressClick(true)
}
</script>

<style scoped>
/* Subtle hover background */
div:hover {
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
}
</style>
