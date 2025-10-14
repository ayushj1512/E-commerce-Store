<template>
  <div class="pt-16 bg-gray-50 min-h-screen"> <!-- padding-top for sticky header -->
    <!-- Mobile Sticky Filter + Sort Header -->
    <MobileFilterSortHeader
      v-model="selectedSort"
      :options="sortOptions"
      @toggle-drawer="toggleDrawer"
    />

    <!-- Test Products Grid -->
    <div class="mt-4 grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 px-4">
      <ProductCard
        v-for="product in sortedProducts"
        :key="product.id"
        :id="product.id"
        :title="product.displayName"
        :image="product.imageUrl"
        :hoverImage="product.hoverImageUrl"
        :price="product.displayPrice"
        :mrp="product.displayDiscount + product.displayPrice"
        :avgRating="product.avgRating"
        :showCartBtn="true"
      />
    </div>

    <div v-if="!sortedProducts.length" class="text-center py-10 text-gray-500">
      No products to display.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MobileFilterSortHeader from '@/components/collection/MobileFilterSortHeader.vue'
import ProductCard from '@/components/common/ProductCard.vue'

// 🔽 Sorting state
const selectedSort = ref('default')
const sortOptions = [
  { label: 'Price: Low to High', value: 'lowtohigh' },
  { label: 'Price: High to Low', value: 'hightolow' },
  { label: 'Newest', value: 'latest' },
  { label: 'Trending', value: 'trending' },
  { label: 'Rating', value: 'rating' }
]

// 🔹 Mock products
const products = ref([
  { id: 1, displayName: 'Crop Top', imageUrl: '/images/product1.jpg', hoverImageUrl: '/images/product1b.jpg', displayPrice: 299, displayDiscount: 50, avgRating: 4.2 },
  { id: 2, displayName: 'Jeans', imageUrl: '/images/product2.jpg', hoverImageUrl: '/images/product2b.jpg', displayPrice: 799, displayDiscount: 100, avgRating: 4.5 },
  { id: 3, displayName: 'Sneakers', imageUrl: '/images/product3.jpg', hoverImageUrl: '/images/product3b.jpg', displayPrice: 1299, displayDiscount: 200, avgRating: 4.8 },
  { id: 4, displayName: 'Skirt', imageUrl: '/images/product4.jpg', hoverImageUrl: '/images/product4b.jpg', displayPrice: 499, displayDiscount: 50, avgRating: 4.1 },
  { id: 5, displayName: 'Blouse', imageUrl: '/images/product5.jpg', hoverImageUrl: '/images/product5b.jpg', displayPrice: 399, displayDiscount: 0, avgRating: 3.9 },
])

// 🔃 Sorted products
const sortedProducts = computed(() => {
  const arr = [...products.value]
  switch (selectedSort.value) {
    case 'lowtohigh': return arr.sort((a,b) => (a.displayPrice) - (b.displayPrice))
    case 'hightolow': return arr.sort((a,b) => (b.displayPrice) - (a.displayPrice))
    case 'latest': return arr // mock: no date, so keep as is
    case 'rating': return arr.sort((a,b) => b.avgRating - a.avgRating)
    default: return arr
  }
})

// 🔽 Drawer toggle
const toggleDrawer = () => {
  console.log('Filter drawer opened')
  // You can add drawer logic here later
}
</script>

<style scoped>
.pt-16 { padding-top: 4rem; } /* avoid overlap with sticky header */
</style>
