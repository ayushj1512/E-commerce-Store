<template>
  <div class="bg-white text-black min-h-screen p-4 md:p-8">
    <h1 class="text-2xl font-semibold mb-6">Test Products Page</h1>

    <!-- Sorting -->
    <div class="flex gap-4 mb-4 items-center">
      <label>Sort by:</label>
      <select v-model="selectedSort" class="border rounded px-2 py-1">
        <option value="default">Default</option>
        <option value="lowtohigh">Price: Low to High</option>
        <option value="hightolow">Price: High to Low</option>
        <option value="latest">Newest</option>
        <option value="rating">Rating</option>
      </select>
    </div>

    <!-- Products Grid (dynamic responsive with min 2 / max 7 columns) -->
    <div
      ref="gridContainer"
      class="grid gap-6 mt-6"
      :style="{
        gridTemplateColumns: `repeat(${columns}, 1fr)`
      }"
    >
      <ProductCard
        v-for="product in sortedProducts"
        :key="product.id"
        :id="product.id"
        :title="product.name"
        :image="product.img"
        :hoverImage="product.alternate_img"
        :price="product.discount_price || product.selling_price"
        :avgRating="product.avg_rating"
      />
    </div>

    <div v-if="!products.length" class="text-center py-10 text-gray-500">
      Loading or no products found...
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import ProductCard from "@/components/common/ProductCard.vue";

const API_URL =
  "https://api.streetstylestore.com/collections/products/documents/search?q=*&filter_by=categories%3A%3D128&filter_by=active%3A%3D1&per_page=250&page=1";
const API_KEY = "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx";

// --- State ---
const products = ref([]);
const selectedSort = ref("default");
const columns = ref(2);
const gridContainer = ref(null);

// --- Responsive Column Calculation ---
const calculateColumns = () => {
  if (!gridContainer.value) return;
  const containerWidth = gridContainer.value.clientWidth;
  const minColWidth = 180; // minimum column width in px
  const maxCols = 7;
  const minCols = 2;
  let fitCols = Math.floor(containerWidth / minColWidth);
  fitCols = Math.max(minCols, Math.min(maxCols, fitCols));
  columns.value = fitCols;
};

// --- Fetch Products ---
const fetchProducts = async () => {
  try {
    const res = await fetch(API_URL, {
      headers: { "x-typesense-api-key": API_KEY },
    });
    const data = await res.json();

    products.value = data.hits.map((hit) => {
      const doc = hit.document;
      return {
        id: doc.id,
        name: doc.name,
        img: doc.img,
        alternate_img: doc.alternate_img,
        selling_price: doc.selling_price,
        discount_price: doc.discount_price,
        avg_rating: doc.avg_rating ?? 0,
        raw: doc,
      };
    });
  } catch (err) {
    console.error("Error fetching products:", err);
  }
};

// --- Sorting ---
const sortedProducts = computed(() => {
  const arr = [...products.value];
  switch (selectedSort.value) {
    case "lowtohigh":
      return arr.sort((a, b) => a.selling_price - b.selling_price);
    case "hightolow":
      return arr.sort((a, b) => b.selling_price - a.selling_price);
    case "latest":
      return arr.sort(
        (a, b) => new Date(b.raw.date_added) - new Date(a.raw.date_added)
      );
    case "rating":
      return arr.sort((a, b) => b.avg_rating - a.avg_rating);
    default:
      return arr;
  }
});

// --- Lifecycle ---
onMounted(() => {
  fetchProducts();
  calculateColumns();
  window.addEventListener("resize", calculateColumns);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", calculateColumns);
});
</script>

<style scoped>
/* Optional: add hover effect for card */
</style>
