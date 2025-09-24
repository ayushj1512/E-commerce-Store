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
      <div class="md:w-1/2 flex flex-col gap-4">
        <div class="w-full h-[450px] p-4 bg-gray-50 rounded-xl flex items-center justify-center relative">
          <img :src="selectedImage" alt="Selected Product" class="rounded-lg w-full h-full object-contain transition-transform duration-300"/>
        </div>
        <div v-if="product.images.length > 1" class="flex gap-4 overflow-x-auto mt-4">
          <div v-for="(img, i) in product.images" :key="i" @click="selectImage(i)" 
               :class="['p-2 rounded-xl flex items-center justify-center cursor-pointer flex-shrink-0 border-2', selectedIndex===i?'border-black':'border-gray-200']"
               style="width:140px;height:140px">
            <img :src="img.img" alt="Thumb" class="rounded-lg w-full h-full object-contain"/>
          </div>
        </div>
      </div>

      <!-- Info -->
      <div class="md:w-1/2 flex flex-col justify-between gap-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight">{{ product.name }}</h1>
          <div class="flex items-baseline gap-4 mt-2">
            <p class="text-2xl font-semibold">₹{{ product.real_selling_price }}</p>
            <p v-if="product.selling_price > product.real_selling_price" class="text-base line-through text-gray-500">
              ₹{{ product.selling_price }}
            </p>
          </div>

          <!-- Wishlist + Voucher -->
          <div class="flex gap-4 mt-4 w-full items-center">
            <button @click="toggleWishlist(product.id)"
              class="px-4 py-2 rounded-full border-2 font-medium transition-all flex items-center gap-2 whitespace-nowrap"
              :class="isWishlisted ? 'bg-red-500 border-red-500 text-white hover:bg-red-600' 
                                     : 'bg-white border-gray-300 text-black hover:border-black hover:bg-gray-100'">
              <span v-if="isWishlisted">❤️ In Wishlist</span>
              <span v-else>🤍 Add to Wishlist</span>
            </button>

            <transition name="fade-scale">
              <div v-if="eligibleVoucher" class="flex-1 flex justify-center mb-4">
                <div class="relative z-10 flex items-center justify-center px-6 py-3 rounded-lg bg-black text-white w-full max-w-xl text-center shadow-md border border-dashed border-white font-bold text-xs md:text-sm">
                  Part of {{ formatText(eligibleVoucher.category_name) }}
                  <div class="w-8 h-8 bg-white rounded-full absolute top-1/2 -translate-y-1/2 left-0 -ml-4"></div>
                  <div class="w-8 h-8 bg-white rounded-full absolute top-1/2 -translate-y-1/2 right-0 -mr-4"></div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Sizes -->
          <div v-if="filteredSizes.length" class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-sm">Available Sizes:</h3>
              <button v-if="product.customSizeChartArr" @click="showSizeChart=true"
                class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 text-sm font-medium hover:border-black hover:text-black hover:bg-gray-100 transition-all">
                <Ruler class="w-4 h-4"/> Size Guide
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <button v-for="(size, idx) in filteredSizes" :key="idx" @click="selectedSize=size"
                      :class="['px-3 py-1 border rounded-full text-sm transition hover:scale-105', 
                               selectedSize===size?'bg-black text-white border-black':'bg-white text-black border-gray-300']">
                {{ size }}
              </button>
            </div>
          </div>

          <p v-if="product.description_short" class="text-gray-600 leading-relaxed mt-3">{{ product.description_short }}</p>
          <div class="flex justify-start mt-4"><PincodeCheck/></div>

          <!-- Buy + Cart / Notify -->
          <div class="flex flex-col sm:flex-row gap-4 mt-6 sticky top-24 z-10">
            <template v-if="requiresSizeLogic">
              <template v-if="filteredSizes.length">
                <button @click="buyNow" class="flex-1 bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transform hover:scale-105 transition">Buy Now</button>
                <button @click="addToCart" class="flex-1 border-2 border-black text-black py-3 px-6 rounded-full font-semibold hover:bg-black hover:text-white transform hover:scale-105 transition">Add to Cart</button>
              </template>
              <template v-else>
                <button @click="notifyMe" class="flex-1 bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all shadow-md">Notify Me</button>
              </template>
            </template>
            <template v-else>
              <!-- Other categories always show Buy + Cart -->
              <button @click="buyNow" class="flex-1 bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transform hover:scale-105 transition">Buy Now</button>
              <button @click="addToCart" class="flex-1 border-2 border-black text-black py-3 px-6 rounded-full font-semibold hover:bg-black hover:text-white transform hover:scale-105 transition">Add to Cart</button>
            </template>
          </div>

        </div>
      </div>
    </div>

    <!-- Reviews & Recommendations -->
    <ReviewsRating 
      v-if="product && product.id" 
      :product-id="product.id" 
      class="mt-10"
    />
    <div v-if="product.fbt_items?.length" class="mt-8">
      <h3 class="text-xl md:text-2xl font-bold mb-4 text-black relative inline-block">
        People Also Picked
        <span class="absolute left-0 bottom-0 w-12 h-1 bg-gray-500 rounded-full"></span>
      </h3>
      <div class="flex gap-4 overflow-x-auto py-2">
        <div v-for="item in product.fbt_items" :key="item.product_id" 
             class="flex-shrink-0 w-48 bg-white shadow rounded-xl p-3 transition hover:shadow-lg hover:-translate-y-1 cursor-pointer"
             @click="goToProduct(item.product_id)">
          <img :src="item.hover && item.alternate_img ? item.alternate_img : item.img" alt="FBT Item" 
               class="w-full h-48 object-contain rounded-lg transition duration-300"
               @mouseover="item.hover=true" @mouseleave="item.hover=false"/>
          <p class="text-sm font-medium mt-2 truncate">{{ item.name }}</p>
          <p class="text-lg font-semibold mt-1">₹{{ item.selling_price }}</p>
        </div>
      </div>
    </div>

    <hot-selling/>
    <TnC class="mt-10"/>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ofetch } from "ofetch";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlist";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/auth";
import { Ruler } from "lucide-vue-next";
import TnC from "@/components/productDetail/T&C.vue";
import PincodeCheck from "@/components/productDetail/pincode.vue";
import ReviewsRating from "@/components/productDetail/reviews&rating.vue";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();
const toast = useToast();

const product = ref({});
const selectedSize = ref("");
const selectedIndex = ref(0);
const selectedImage = ref("");
const eligibleVoucher = ref(null);
const loading = ref(true);
const error = ref(null);
const showSizeChart = ref(false);

const filteredSizes = computed(() =>
  (product.value.product_size_array || product.value.product_all_sizes || []).filter(Boolean)
);

const isWishlisted = computed(() => wishlistStore.isFavorite(product.value.id));

// Check if product belongs to category 16 or 18
const requiresSizeLogic = computed(() => {
  const categoryIds = (product.value.categories || []).map(Number);
  return categoryIds.includes(16) || categoryIds.includes(18);
});

const selectImage = (idx) => {
  selectedIndex.value = idx;
  selectedImage.value = product.value.images[idx]?.bigImg || "";
};

const toggleWishlist = (id) => {
  wishlistStore.toggleFavorite(id);
  toast?.success(
    wishlistStore.isFavorite(id) ? "Added to Wishlist ❤️" : "Removed from Wishlist 🤍",
    { timeout: 2000 }
  );
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

  // Apply voucher
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
  // For categories 16/18, size selection required
  if (requiresSizeLogic.value && filteredSizes.value.length && !selectedSize.value) {
    return toast?.warning("Select a size first");
  }

  addToCart();
  router.push("/cart");
};

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
      categories: doc.categories || []
    };

    selectedImage.value = product.value.images[0]?.bigImg || "";
    selectedIndex.value = 0;

    // Fetch vouchers
    const voucherRes = await ofetch(
      "https://api.streetstylestore.com/collections/sss_config/documents/voucher-listing?a=1&x-typesense-api-key=F5gdSFxpg6bi8ZXfuybIsQy074HtBDkC"
    );

    const vouchers = JSON.parse(voucherRes.data || "[]");
    const productCatIds = (product.value.categories || []).map(String);

    eligibleVoucher.value = vouchers.find(v => {
      const voucherCatId = String(v.id_category || "").trim();
      return productCatIds.includes(voucherCatId);
    });

  } catch (err) {
    error.value = "Failed to fetch product data";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  wishlistStore.loadWishlist();
  fetchProduct();
});
</script>
