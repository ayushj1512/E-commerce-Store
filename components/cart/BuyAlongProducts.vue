<template>
  <div class="buy-along-products">
    <div class="overflow-x-auto flex gap-4 py-4">
      <div
        v-for="product in products"
        :key="product.product_id"
        class="min-w-[160px] max-w-[160px] bg-white shadow rounded-xl p-2 flex flex-col items-center hover:shadow-lg transition"
      >
        <a :href="product.document.product_url" target="_blank" class="w-full">
          <img
            :src="product.document.img"
            alt="product.name"
            class="w-full h-40 object-contain rounded-md"
          />
          <h3 class="text-sm font-medium mt-2 line-clamp-2 text-center">{{ product.document.name }}</h3>
        </a>
        <div class="mt-1 text-center">
          <span class="text-gray-500 line-through text-xs mr-1" v-if="product.document.discount_price > 0">
            ₹{{ product.document.discount_price }}
          </span>
          <span class="text-black font-semibold text-sm">₹{{ product.document.selling_price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const products = ref([]);

async function fetchBuyAlongProducts() {
  try {
    const { data } = await axios.get(
      "https://api.streetstylestore.com/collections/products/documents/search?q=*&filter_by=product_id:=[126397,125399,126416,125294,73000]&filter_by=active:=1&sort_by=date_added_unix:desc&per_page=200&page=1&x-typesense-api-key=VvSmt6K1hvlGJhtTPsxjVrq8RNm9tSXh"
    );

    if (data.hits) {
      products.value = data.hits;
    }
  } catch (error) {
    console.error("Error fetching buy along products:", error);
  }
}

onMounted(() => {
  fetchBuyAlongProducts();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
