<template>
  <div class="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <ProductCardScroll
      v-for="product in products"
      :key="product.id"
      :id="product.id"
      :title="product.name"
      :images="product.images.map(img => img.img)"
      :price="product.selling_price"
      :mrp="product.discount_price"
      :avg-rating="product.avg_rating"
      :product-url="product.product_url"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import ProductCardScroll from "@/components/common/ProductCardScroll.vue"

const products = ref([])

const fetchProducts = async () => {
  const res = await fetch(
    "https://api.streetstylestore.com/collections/products/documents/search?q=*&filter_by=tags:=[tops]&filter_by=active:=1&sort_by=date_updated_unix:desc&sort_by=avg_rating:desc&per_page=30&page=1",
    {
      headers: { "x-typesense-api-key": "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx" }
    }
  )
  const data = await res.json()
  products.value = data.hits.map(hit => hit.document)
}

onMounted(() => fetchProducts())
</script>
