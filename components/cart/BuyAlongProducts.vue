<template>
  <div class="buy-along-products">
    <div class="overflow-x-auto flex gap-4 py-4">
      <div
        v-for="product in products"
        :key="product.document.product_id"
        class="min-w-[160px] max-w-[160px] bg-white shadow rounded-xl p-2 flex flex-col items-center hover:shadow-lg transition"
      >
        <!-- Conditional Link -->
        <component
          :is="isInternal(product.document.product_url) ? 'router-link' : 'a'"
          :to="isInternal(product.document.product_url) ? product.document.product_url : null"
          :href="!isInternal(product.document.product_url) ? product.document.product_url : null"
          :target="!isInternal(product.document.product_url) ? '_blank' : null"
          class="w-full block"
        >
          <img
            :src="product.document.img"
            :alt="product.document.name"
            class="w-full h-40 object-contain rounded-md"
          />
          <h3 class="text-sm font-medium mt-2 line-clamp-2 text-center">
            {{ product.document.name }}
          </h3>
        </component>

        <!-- Pricing Section -->
        <div class="mt-1 text-center">
          <span
            v-if="product.parsedDiscount > 0"
            class="text-gray-500 line-through text-xs mr-1"
          >
            ₹{{ product.parsedDiscount }}
          </span>
          <span class="text-black font-semibold text-sm">
            ₹{{ product.parsedPrice }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const products = ref([]);

/**
 * Detect if a given URL is internal (within the same app)
 */
function isInternal(url) {
  return typeof url === "string" && url.startsWith("/");
}

async function fetchBuyAlongProducts() {
  try {
    const { data } = await axios.get(
      "https://api.streetstylestore.com/collections/products/documents/search?q=*&filter_by=product_id:=[126397,125399,126416,125294,73000]&filter_by=active:=1&sort_by=date_added_unix:desc&per_page=200&page=1&x-typesense-api-key=VvSmt6K1hvlGJhtTPsxjVrq8RNm9tSXh"
    );

    if (data.hits) {
      // Process product_data JSON safely for pricing
      products.value = data.hits.map((p) => {
        const doc = p.document;
        let parsedPrice = doc.selling_price || 0;
        let parsedDiscount = doc.discount_price || 0;

        try {
          const productData = JSON.parse(doc.product_data);
          if (productData && productData["0"]) {
            const base = productData["0"];
            parsedPrice = parseFloat(base.selling_price) || parsedPrice;
            parsedDiscount = parseFloat(base.discount_price) || parsedDiscount;
          }
        } catch (err) {
          console.warn("Error parsing product_data for:", doc.product_id);
        }

        return {
          ...p,
          parsedPrice,
          parsedDiscount,
        };
      });
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

/* Smooth horizontal scroll */
.buy-along-products::-webkit-scrollbar {
  height: 6px;
}
.buy-along-products::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}
.buy-along-products::-webkit-scrollbar-track {
  background: transparent;
}
</style>
