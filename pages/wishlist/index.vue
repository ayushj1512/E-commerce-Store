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
      <ProductCard
        v-for="product in wishlistProducts"
        :key="product.id"
        :id="product.id"
        :title="product.name"
        :image="product.image"
        :price="product.price"
        :product-url="product.product_url"
        @card-click="goToProduct(product)"
  
      />
    </div>

    <!-- Empty State -->
    <div v-if="mounted && !loading && wishlistProducts.length === 0" class="text-center text-gray-500 py-10">
      Your wishlist is empty.
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import { useWishlistStore } from "~/stores/wishlist"
import { useRouter } from "vue-router"
import ProductCard from "@/components/common/ProductCard.vue"

const mounted = ref(false)
const wishlist = useWishlistStore()
const wishlistProducts = ref([])
const loading = ref(false)
const router = useRouter()

// Random quotes
const quotes = [
  "Fashion is the armor to survive the reality of everyday life.",
  "Style is a way to say who you are without having to speak.",
  "In order to be irreplaceable, one must always be different.",
  "Fashion is about dreaming and making other people dream.",
  "Elegance is not standing out, but being remembered."
]
const randomQuote = ref(quotes[0])

// Pagination
const perPage = ref(100)
const page = ref(1)

// Generate URL slug
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// Fetch wishlist product details
const fetchProducts = async () => {
  const validIds = wishlist.favoriteProducts.filter(id => id != null && id !== '');
  if (!validIds.length) {
    wishlistProducts.value = [];
    return;
  }

  loading.value = true;
  try {
    const ids = validIds.join(",");
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

    wishlistProducts.value = (data.hits || []).map(item => {
      const p = item.document || item;
      const fallbackUrl = `/category/subcategory/${createSlug(p.name)}/${p.product_id || p.id}`;

      let parsedData = {};
      if (p.product_data) {
        try { parsedData = JSON.parse(p.product_data); } 
        catch (err) { console.warn("Failed to parse product_data JSON", err); }
      }

      let price = p.discount_price && Number(p.discount_price) > 0 ? p.discount_price : p.selling_price || "N/A";

      if (parsedData[0] && parsedData[0].discount_price && Number(parsedData[0].discount_price) > 0) {
        price = parsedData[0].discount_price;
      } else if (parsedData[0] && parsedData[0].selling_price) {
        price = parsedData[0].selling_price;
      }

      price = Math.round(Number(price));

      return {
        id: p.product_id || p.id,
        name: p.name || "Unnamed Product",
        price,
        image: (p.img || p.alternate_img || (parsedData.images && parsedData.images[0]?.img) || "https://via.placeholder.com/300x300"),
        product_url: p.product_url && p.product_url.length > 0 ? p.product_url : fallbackUrl
      }
    });
  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    loading.value = false;
  }
};

// Remove product from wishlist
const removeFromWishlist = (id) => {
  wishlist.toggleFavorite(id)
  wishlistProducts.value = wishlistProducts.value.filter((p) => p.id !== id)
}

// Navigate to product page
const goToProduct = (product) => {
  if (!product) return
  router.push(product.product_url).catch(() => {})
}

// On mounted
onMounted(() => {
  mounted.value = true
  wishlist.loadWishlist()
  randomQuote.value = quotes[Math.floor(Math.random() * quotes.length)]
  fetchProducts()
})

// Re-fetch on wishlist change
watch(
  () => wishlist.favoriteProducts,
  () => fetchProducts(),
  { deep: true }
)
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
