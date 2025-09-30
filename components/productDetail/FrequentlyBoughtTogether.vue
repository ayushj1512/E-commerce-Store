<template>
  <div v-if="items?.length" class="mt-8">
    <h3 class="text-xl md:text-2xl font-bold mb-4 text-black relative inline-block">
      People Also Picked
      <span class="absolute left-0 bottom-0 w-12 h-1 bg-gray-500 rounded-full"></span>
    </h3>
    <div class="flex gap-4 overflow-x-auto py-2">
      <div
        v-for="item in items"
        :key="item.product_id"
        class="flex-shrink-0 w-48 bg-white shadow rounded-xl p-3 transition hover:shadow-lg hover:-translate-y-1 cursor-pointer"
        @click="$emit('select', item.product_id)"
      >
        <img
          :src="item.hover && item.alternate_img ? item.alternate_img : item.img"
          alt="Picked Item"
          class="w-full h-48 object-contain rounded-lg transition duration-300"
          @mouseover="item.hover = true"
          @mouseleave="item.hover = false"
        />
        <p class="text-sm font-medium mt-2 truncate">{{ item.name }}</p>
        <p class="text-lg font-semibold mt-1">₹{{ item.selling_price }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

defineEmits(["select"])
</script>
