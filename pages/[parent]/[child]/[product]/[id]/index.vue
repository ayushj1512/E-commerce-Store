<template>
  <div class="bg-white text-black min-h-screen font-sans p-4 md:p-10">
    <!-- Loading Shimmer -->
    <div v-if="loading" class="space-y-6">
      <div class="w-full h-[450px] bg-gray-200 rounded-xl animate-pulse"></div>
      <div class="flex gap-4 overflow-x-auto">
        <div v-for="n in 6" :key="n" class="h-40 w-40 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
      </div>
      <div class="space-y-4 max-w-md">
        <div class="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div class="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div class="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
        <div class="flex gap-4">
          <div class="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
          <div class="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
        </div>
        <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20 text-red-500">{{ error }}</div>

    <!-- Product -->
    <div v-else class="flex flex-col md:flex-row gap-12">
      <!-- Images -->
      <div class="md:w-1/2">
        <ImageGallery v-model="selectedImage" :images="product.images" />
      </div>

      <!-- Info -->
      <div class="md:w-1/2 flex flex-col justify-between gap-6">
        <div>
          <!-- Product Name + Share Button -->
          <div class="flex items-start justify-between">
            <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
              {{ product.name }}
            </h1>
            <ShareButton />
          </div>

          <!-- Price Section -->
<div class="mt-2">
  <div class="flex items-baseline gap-4 relative">
    <!-- Selling Price -->
    <p class="text-2xl font-semibold">₹{{ product.real_selling_price }}</p>

    <!-- Original Price with line-through -->
    <p
      v-if="product.selling_price > product.real_selling_price"
      class="text-base line-through text-gray-500"
    >
      ₹{{ product.selling_price }}
    </p>

    <!-- Discount Badge -->
    <span
      v-if="product.selling_price > product.real_selling_price"
      class="ml-2 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full animate-bounce"
      :style="{ animationDuration: '0.8s' }"
    >
      {{ Math.round(((product.selling_price - product.real_selling_price) / product.selling_price) * 100) }}% OFF
    </span>
  </div>

  <!-- ⭐ Rating moved below -->
  <div
    v-if="product.avg_rating && product.avg_rating > 0 && product.total_ratings > 0"
    class="flex items-center gap-2 mt-2"
  >
    <!-- Stars -->
    <div class="flex">
      <span v-for="i in 5" :key="i" class="text-yellow-400">
        <i v-if="i <= Math.round(product.avg_rating)" class="fas fa-star"></i>
        <i v-else class="far fa-star text-gray-300"></i>
      </span>
    </div>

    <!-- Average + total count -->
    <span class="text-sm text-gray-600">
      {{ product.avg_rating.toFixed(1) }} ({{ product.total_ratings }} ratings)
    </span>
  </div>
</div>

 <ColorSelector
            v-if="parsedColors.length"
            :colors="parsedColors"
            v-model:selectedColor="selectedColor"
            @update:image="selectedImage = $event"
          />


          <!-- Wishlist + Voucher -->
     <div class="flex gap-4 mt-4 w-full items-center">
  <!-- ✅ Wishlist Button Component -->
  <WishlistButton
    :isWishlisted="isWishlisted"
    @toggle="toggleWishlist(product.id)"
  />

  <!-- Eligible Voucher -->
  <EligibleVoucher :voucher="eligibleVoucher" />
</div>



          <!-- ✅ Size Guide Modal -->
          <!-- ✅ Size Guide Modal -->
          <SizeGuide :sizes="filteredSizes" :selected-size="selectedSize" :show-size-chart="showSizeChart"
            :custom-size-chart="product.customSizeChartArr" @select-size="selectedSize = $event"
            @open-size-chart="showSizeChart = true" @close-size-chart="showSizeChart = false" />



          <!-- Short Description -->
          <p v-if="product.description_short" class="text-gray-600 leading-relaxed mt-3">
            {{ product.description_short }}
          </p>
          <div class="flex justify-start mt-4">
            <PincodeCheck />
          </div>

          <!-- Buy + Cart / Notify -->
          <div class="flex flex-col sm:flex-row gap-4 mt-6 sticky top-24 z-10">
            <template v-if="requiresSizeLogic">
              <template v-if="filteredSizes.length">
                <button @click="buyNow"
                  class="flex-1 bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transform hover:scale-105 transition">
                  Buy Now
                </button>
                <button @click="addToCart"
                  class="flex-1 border-2 border-black text-black py-3 px-6 rounded-full font-semibold hover:bg-black hover:text-white transform hover:scale-105 transition">
                  Add to Cart
                </button>
              </template>
              <template v-else>
                <button @click="notifyMe"
                  class="flex-1 bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all shadow-md">
                  Notify Me
                </button>
              </template>
            </template>
            <template v-else>
              <button @click="buyNow"
                class="flex-1 bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transform hover:scale-105 transition">
                Buy Now
              </button>
              <button @click="addToCart"
                class="flex-1 border-2 border-black text-black py-3 px-6 rounded-full font-semibold hover:bg-black hover:text-white transform hover:scale-105 transition">
                Add to Cart
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews & Recommendations -->
    <ReviewsRating v-if="product && product.id" :product-id="product.id" class="mt-10" />

    <!-- ✅ Replaced People Also Picked with component -->
    <PeopleAlsoPicked v-if="product.fbt_items?.length" :items="product.fbt_items" @select="goToProduct" class="mt-8" />

    <hot-selling />
    <TnC class="mt-10" />
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ofetch } from "ofetch";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlist";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import { useRecentlyViewStore } from "@/stores/recentlyViewStore";

import TnC from "@/components/productDetail/T&C.vue";
import PincodeCheck from "@/components/productDetail/pincode.vue";
import ReviewsRating from "@/components/productDetail/reviews&rating.vue";
import ShareButton from "@/components/common/ShareButton.vue";
import ImageGallery from "@/components/productDetail/ImageGallery.vue";
import PeopleAlsoPicked from "@/components/productDetail/FrequentlyBoughtTogether.vue";
import SizeGuide from "@/components/productDetail/SizeGuide.vue";
import EligibleVoucher from "@/components/productDetail/EligibleVoucher.vue";
import HotSelling from "@/components/productDetail/HotSelling.vue"
import WishlistButton from '@/components/productDetail/WishlistButton.vue'
import ColorSelector from "@/components/productDetail/ColorSelector.vue";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();
const toast = useToast();
const recentlyViewStore = useRecentlyViewStore();

// State
const product = ref({});
const selectedSize = ref("");
const selectedImage = ref("");
const eligibleVoucher = ref(null);
const loading = ref(true);
const error = ref(null);
const showSizeChart = ref(false);

// Computed
const filteredSizes = computed(() =>
  (product.value.product_size_array || product.value.product_all_sizes || []).filter(Boolean)
);

const isWishlisted = computed(() => wishlistStore.isFavorite(product.value.id));

// **Parse colors dynamically**
const parsedColors = computed(() => {
  if (!product.value.colors) return [];
  return product.value.colors.split(',').map(colorStr => {
    const [hex, name, verticalImg, attrImg] = colorStr.split('*');
    return { hex: hex.trim(), name: name.trim(), verticalImg: verticalImg.trim(), attrImg: attrImg.trim() };
  });
});

const requiresSizeLogic = computed(() => {
  const categoryIds = (product.value.categories || []).map(Number);
  return categoryIds.includes(16) || categoryIds.includes(18);
});

// Wishlist toggle
const toggleWishlist = (id) => {
  const isAdding = !wishlistStore.isFavorite(id);
  wishlistStore.toggleFavorite(id);

  if (isAdding) console.log(`[Wishlist] Added product ID: ${id}`);

  // toast?.success(
  //   wishlistStore.isFavorite(id) ? "Added to Wishlist ❤️" : "Removed from Wishlist 🤍",
  //   { timeout: 2000 }
  // );
};

// Add to cart
const addToCart = () => {
  if (requiresSizeLogic.value && filteredSizes.value.length && !selectedSize.value) {
    return toast?.warning("Select a size first");
  }

  const cartProduct = {
    id: product.value.id,
    name: product.value.name,
    price: +product.value.real_selling_price,
    realPrice: +product.value.selling_price,
    discountPrice: +product.value.discount_price || 0,
    categories: product.value.categories || [],
    size: selectedSize.value || null,
    image: selectedImage.value,
    quantity: 1
  };

  if (eligibleVoucher.value) {
    const voucherCatId = String(eligibleVoucher.value.id_category || "");
    const matchesCategory = cartProduct.categories.map(String).includes(voucherCatId);
    if (matchesCategory) {
      if (eligibleVoucher.value.discount_type === "percent") {
        cartProduct.price =
          cartProduct.realPrice - (cartProduct.realPrice * (eligibleVoucher.value.discount || 0)) / 100;
      } else if (eligibleVoucher.value.discount_type === "fixed") {
        cartProduct.price = Math.max(cartProduct.realPrice - (eligibleVoucher.value.discount || 0), 0);
      }
      cartProduct.voucherApplied = true;
      cartProduct.voucherId = eligibleVoucher.value.id;
    }
  }

  cartStore.addToCart(cartProduct);
  toast?.success(`${product.value.name} added to cart`);
};

// Buy now
const buyNow = () => {
  if (requiresSizeLogic.value && filteredSizes.value.length && !selectedSize.value) {
    return toast?.warning("Select a size first");
  }
  addToCart();
  router.push("/cart");
};

// Notify Me
const notifyMe = async () => {
  try {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    await ofetch(`${baseUrl}product/productNotify`, {
      method: "POST",
      body: {
        gateway_action: "product/productNotify",
        id_customer: authStore.id_customer,
        customer_email: authStore.email || "",
        id_cart: "0",
        id_product: product.value.id,
        id_product_attribute: 0,
        user_hash_key: authStore.user_hash_key
      }
    });
    toast.success("You will be notified for this product. Thanks for showing your interest!");
  } catch (err) {
    toast.error("Something went wrong. Please try again.");
    console.error(err);
  }
};

const goToProduct = (id) => router.push(`/category/subcategory/product/${id}`);
const formatText = (text) => text ? text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : "";

// Fetch product and vouchers
const fetchProduct = async () => {
  loading.value = true;
  error.value = null;
  try {
    const productId = route.params.id;
    const res = await ofetch(
      `https://api.streetstylestore.com/collections/products/documents/${productId}`,
      { headers: { "x-typesense-api-key": "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx" } }
    );

    const doc = res.document ?? res;
    const parsed = doc.product_data ? JSON.parse(doc.product_data) : {};
    const firstData = parsed["0"] || {};

    product.value = {
      ...doc,
      id: doc.id,
      name: doc.name || firstData.name || "",
      selling_price: doc.selling_price ?? firstData.selling_price ?? 0,
      real_selling_price: doc.real_selling_price ?? firstData.real_selling_price ?? doc.selling_price ?? 0,
      discount_price: doc.discount_price ?? firstData.discount_price ?? 0,
      images: parsed.images || [],
      product_size_array: doc.product_size_array || firstData.product_size_array || [],
      product_all_sizes: doc.product_all_sizes || [],
      customSizeChartArr: parsed.customSizeChartArr || null,
      fbt_items: (parsed.fbt || []).map(i => ({ ...i, hover: false })),
      categories: doc.categories || [],
      avg_rating: doc.review_stats?.avg_rating || 0,
      total_ratings: doc.review_stats?.total_ratings || 0,
      colors: doc.colors || firstData.colors || "",
    };

    recentlyViewStore.addProduct(product.value.id);
    selectedImage.value = product.value.images[0]?.bigImg || "";

    // Fetch vouchers
    const voucherRes = await ofetch(
      "https://api.streetstylestore.com/collections/sss_config/documents/voucher-listing?a=1&x-typesense-api-key=F5gdSFxpg6bi8ZXfuybIsQy074HtBDkC"
    );
    const vouchers = JSON.parse(voucherRes.data || "[]");
    const productCatIds = (product.value.categories || []).map(String);

    eligibleVoucher.value = vouchers.find(v => productCatIds.includes(String(v.id_category || "").trim()));

  } catch (err) {
    error.value = "Failed to fetch product data";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Load wishlist and product on mount
onMounted(() => {
  wishlistStore.loadWishlist();
  fetchProduct();
});
</script>

<style scoped>
/* Subtle card glow animation */
@keyframes card-glow {
  0% { box-shadow: 0 0 0px rgba(255,0,0,0); }
  50% { box-shadow: 0 0 12px rgba(255,0,0,0.6); }
  100% { box-shadow: 0 0 0px rgba(255,0,0,0); }
}
.shadow-wishlist {
  animation: card-glow 0.8s ease-in-out forwards;
}
</style>