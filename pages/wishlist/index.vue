<template>
  <div class="bg-gray-50 min-h-screen py-6 px-4 md:px-12 lg:px-20">
    
    <!-- Header -->
    <div v-if="mounted" class="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 bg-white p-4 md:p-6 rounded-xl shadow-sm">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold">My Wishlist</h1>
        <p class="text-gray-600 italic text-sm md:text-base mt-1">"{{ randomQuote }}"</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
    </div>

    <!-- Wishlist Grid -->
    <div v-if="mounted && !loading && wishlistProducts.length" class="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div
        v-for="product in wishlistProducts"
        :key="product.id"
        class="bg-white rounded-lg shadow-md overflow-hidden relative transform transition hover:scale-105 duration-300"
      >
        <!-- Remove icon on top-right -->
        <button 
          @click="removeFromWishlist(product.id)" 
          class="absolute top-2 right-2 bg-white hover:bg-red-500 text-red-500 hover:text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-md z-10 transition"
          title="Remove from wishlist"
        >
          ✕
        </button>

        <!-- Product Image -->
        <div class="w-full h-48 sm:h-56 md:h-64 lg:h-56 overflow-hidden">
          <img
            :src="product.image"
            alt="Product Image"
            class="w-full h-full object-cover transition duration-300 hover:scale-110"
          />
        </div>

        <!-- Product Info -->
        <div class="p-3 flex flex-col gap-1">
          <h3 class="font-semibold text-gray-800 text-sm md:text-base truncate" :title="product.name">{{ product.name }}</h3>
          <p class="text-gray-900 font-bold text-sm md:text-base">₹{{ product.price }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="mounted && !loading && wishlistProducts.length === 0" class="text-center text-gray-500 py-10">
      No products in wishlist.
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useWishlistStore } from "~/stores/wishlist";

const mounted = ref(false);
const wishlist = useWishlistStore();
const wishlistProducts = ref([]);
const loading = ref(false);

// Quotes
const quotes = [
  "Fashion is the armor to survive the reality of everyday life.",
  "Style is a way to say who you are without having to speak.",
  "In order to be irreplaceable, one must always be different.",
  "Fashion is about dreaming and making other people dream.",
  "Elegance is not standing out, but being remembered."
];
const randomQuote = ref(quotes[0]);

// Pagination support
const perPage = ref(100);
const page = ref(1);

// Fetch product details dynamically using wishlist IDs
const fetchProducts = async () => {
  if (!wishlist.favoriteProducts.length) {
    wishlistProducts.value = [];
    return;
  }

  loading.value = true;
  try {
    const ids = wishlist.favoriteProducts.join(",");

    const res = await fetch(
      `https://api.streetstylestore.com/collections/products/documents/search?q=*&filter_by=product_id:[${ids}]&filter_by=active:=1&sort_by=date_updated_unix:desc&per_page=${perPage.value}&page=${page.value}`,
      {
        headers: {
          "x-typesense-api-key": "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx"
        }
      }
    );

    if (!res.ok) throw new Error("Failed to fetch wishlist products");
    const data = await res.json();

    wishlistProducts.value = (data.hits || []).map((item) => {
      const p = item.document || item;
      return {
        id: p.product_id || p.id,
        name: p.name || "Unnamed Product",
        price: p.discount_price > 0 ? p.discount_price : (p.selling_price || p.real_selling_price || "N/A"),
        image: p.img || p.alternate_img || "https://via.placeholder.com/300x300"
      };
    });
  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    loading.value = false;
  }
};

// Remove product
const removeFromWishlist = (id) => {
  wishlist.toggleFavorite(id);
  wishlistProducts.value = wishlistProducts.value.filter((p) => p.id !== id);
};

onMounted(() => {
  mounted.value = true;
  wishlist.loadWishlist(); // Load from cookie/localStorage
  randomQuote.value = quotes[Math.floor(Math.random() * quotes.length)];
  fetchProducts();
});

// Re-fetch products whenever wishlist changes
watch(
  () => wishlist.favoriteProducts,
  () => {
    fetchProducts();
  },
  { deep: true }
);
</script>

<style scoped>
.loader {
  border-top-color: #6366f1;
  animation: spinner 1s linear infinite;
}
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
