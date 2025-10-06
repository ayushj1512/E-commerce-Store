<template>
  <div class="bg-white text-black flex items-center justify-center p-6">
    <div class="flex flex-wrap gap-4 justify-center">
      <div
        v-for="offer in offers"
        :key="offer.id"
        @click="navigateTo(offer.id)"
        class="cursor-pointer bg-black hover:bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
      >
        {{ offer.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const offers = [
  { label: '3 for 1199 Shoes', id: 93 },
  { label: '2 for 1199 Shoes', id: 268 },
  { label: '3 for 1299 Clothing', id: 939 },
  { label: '3 for 899 Clothing', id: 827 },
  { label: '4 for 999 Clothing', id: 881 },
  { label: '3 for 699 Plus Size Clothing', id: 946 },
]

const navigateTo = (id) => {
  router.push(`/collection/${id}`)
}
</script>

<style scoped>
/* Smooth hover effect handled by Tailwind classes */
</style>
