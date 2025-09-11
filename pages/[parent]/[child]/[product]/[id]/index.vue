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

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20 text-red-500">{{ error }}</div>

    <!-- Product Content -->
    <div v-else class="flex flex-col md:flex-row gap-12">
      <!-- Left Images -->
      <div class="md:w-1/2 flex flex-col gap-4">
        <div class="w-full rounded-xl flex items-center justify-center p-4 h-[450px] bg-gray-50 transition">
          <img :src="selectedImage" alt="Selected Product" class="rounded-lg w-full h-full object-contain" loading="lazy"/>
        </div>

        <div v-if="product.images.length > 1" class="flex gap-4 overflow-x-auto w-full mt-4">
          <div
            v-for="(img, index) in product.images"
            :key="index"
            @click="selectImage(index)"
            :class="['bg-gray-50 rounded-xl flex items-center justify-center p-2 cursor-pointer transition transform hover:scale-105 flex-shrink-0 border-2', selectedIndex === index ? 'border-black' : 'border-gray-200']"
            style="width: 140px; height: 140px;"
          >
            <img :src="img.img" alt="Thumb" class="rounded-lg w-full h-full object-contain" loading="lazy"/>
          </div>
        </div>
      </div>

      <!-- Product Info -->
      <div class="md:w-1/2 flex flex-col justify-between gap-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight">{{ product.name }}</h1>

          <div class="flex items-baseline gap-4 mt-2">
            <p class="text-2xl font-semibold">₹{{ product.selling_price }}</p>
            <p v-if="product.discount_price > 0" class="text-base line-through text-gray-500">
              ₹{{ (parseFloat(product.selling_price) + parseFloat(product.discount_price)).toFixed(2) }}
            </p>
          </div>

          <!-- Available Sizes Label -->
          <div class="mt-4">
            <h3 class="font-semibold mb-2 text-sm">Available Sizes:</h3>

            <!-- Show size buttons if sizes exist -->
            <div v-if="product.product_all_sizes?.length" class="flex flex-wrap gap-2">
              <button
                v-for="(size, idx) in product.product_all_sizes"
                :key="idx"
                @click="selectedSize = size"
                :class="['px-3 py-1 border rounded-full text-sm transition hover:scale-105', selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300']"
              >{{ size }}</button>
            </div>

            <!-- Show note if no sizes -->
            <p v-else class="text-gray-500 text-sm">No size selection required</p>
          </div>

          <p v-if="product.description_short" class="text-gray-600 leading-relaxed mt-3">{{ product.description_short }}</p>

          <div class="flex flex-col sm:flex-row gap-4 mt-6 sticky top-24 z-10">
            <button 
              @click="buyNow"
              class="flex-1 bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transform hover:scale-105 transition">
              Buy Now
            </button>
            <button 
              @click="addToCart"
              class="flex-1 border-2 border-black text-black py-3 px-6 rounded-full font-semibold hover:bg-black hover:text-white transform hover:scale-105 transition">
              Add to Cart
            </button>
          </div>
        </div>

        <!-- Delivery & Returns -->
        <div class="space-y-4 mt-6">
          <div class="pt-4 border-t border-gray-200">
            <h3 class="font-semibold">Delivery Information</h3>
            <p class="text-gray-600 text-sm leading-relaxed mt-1">{{ product.delivery_information }}</p>
          </div>
          <div class="pt-4 border-t border-gray-200">
            <h3 class="font-semibold">Return Information</h3>
            <p class="text-gray-600 text-sm leading-relaxed mt-1" v-html="product.return_information"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ofetch } from "ofetch";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "vue-toastification";

const selectedIndex = ref(0);
const selectedImage = ref("");
const selectedSize = ref("");
const product = ref({});
const loading = ref(true);
const error = ref(null);

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const toast = useToast();

const API_URL = "https://api.streetstylestore.com";
const API_KEY = "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx";

async function fetchProduct() {
  loading.value = true;
  error.value = null;

  if (history.state?.product) {
    product.value = history.state.product;
    selectedImage.value = product.value.images[0]?.bigImg || "";
    selectedSize.value = "";
    loading.value = false;
    return;
  }

  try {
    const productId = route.params.id;
    const res = await ofetch(`${API_URL}/collections/products/documents/${productId}`, {
      headers: { "x-typesense-api-key": API_KEY },
    });
    const doc = res.document ?? res;
    const parsed = doc.product_data ? JSON.parse(doc.product_data) : {};
    const firstData = parsed["0"] || {};

    product.value = {
      ...doc,
      name: doc.name || firstData.name || "",
      selling_price: doc.real_selling_price ?? doc.selling_price ?? parseFloat(firstData.selling_price) ?? 0,
      discount_price: doc.discount_price ?? parseFloat(firstData.discount_price) ?? 0,
      description_short: firstData.description_short || doc.description_short || "",
      images: parsed.images || [],
      product_all_sizes: doc.product_all_sizes || [],
      delivery_information: parsed.delivery_information || doc.delivery_information || "",
      return_information: parsed.return_information || doc.return_information || "",
    };

    selectedImage.value = product.value.images[0]?.bigImg || "";
    selectedSize.value = "";
  } catch (err) {
    console.error(err);
    error.value = "Failed to fetch product data.";
    toast?.error(error.value, { timeout: 2500, icon: "❌" });
  } finally {
    loading.value = false;
  }
}

function selectImage(index) {
  selectedIndex.value = index;
  selectedImage.value = product.value.images[index].bigImg;
}

function addToCart() {
  // If product has sizes, require selection
  if (product.value.product_all_sizes?.length && !selectedSize.value) {
    toast?.warning("Please select a size before adding to cart", { timeout: 2000, icon: "⚠️" });
    return;
  }

  if (product.value.id) {
    cartStore.addToCart({
      id: product.value.id,
      name: product.value.name,
      price: parseFloat(product.value.selling_price),
      size: selectedSize.value || null,
      image: selectedImage.value,
      quantity: 1
    });

    toast?.success(`${product.value.name} has been added to your cart`, {
      timeout: 2000,
      icon: "🛒",
    });
  } else {
    toast?.error("Cannot add product to cart", { timeout: 2000, icon: "❌" });
  }
}

function buyNow() {
  addToCart();
  router.push("/cart");
}

onMounted(fetchProduct);
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; max-height: 0; }
</style>
