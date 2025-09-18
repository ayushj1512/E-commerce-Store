<template>
  <div class="bg-white text-black min-h-screen font-sans p-4 md:p-10">
    <!-- Loading Shimmer -->
    <div v-if="loading" class="space-y-6">
      <div class="w-full h-[450px] bg-gray-200 rounded-xl animate-pulse"></div>
      <div class="flex gap-4 overflow-x-auto">
        <div
          v-for="n in 6"
          :key="n"
          class="h-40 w-40 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
        ></div>
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
    <div v-else-if="error" class="text-center py-20 text-red-500">
      {{ error }}
    </div>

    <!-- Product Content -->
    <div v-else class="flex flex-col md:flex-row gap-12">
      <!-- Left Images -->
      <div class="md:w-1/2 flex flex-col gap-4">
        <div
          class="w-full rounded-xl flex items-center justify-center p-4 h-[450px] bg-gray-50 transition"
        >
          <img
            :src="selectedImage"
            alt="Selected Product"
            class="rounded-lg w-full h-full object-contain"
            loading="lazy"
          />
        </div>

        <div
          v-if="product.images.length > 1"
          class="flex gap-4 overflow-x-auto w-full mt-4"
        >
          <div
            v-for="(img, index) in product.images"
            :key="index"
            @click="selectImage(index)"
            :class="[
              'bg-gray-50 rounded-xl flex items-center justify-center p-2 cursor-pointer transition transform flex-shrink-0 border-2',
              selectedIndex === index ? 'border-black' : 'border-gray-200',
            ]"
            style="width: 140px; height: 140px"
          >
            <img
              :src="img.img"
              alt="Thumb"
              class="rounded-lg w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <!-- Product Info Section -->
      <div class="md:w-1/2 flex flex-col justify-between gap-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
            {{ product.name }}
          </h1>

          <!-- Price -->
          <div class="flex items-baseline gap-4 mt-2">
            <p class="text-2xl font-semibold">₹{{ product.selling_price }}</p>
            <p
              v-if="product.discount_price > 0"
              class="text-base line-through text-gray-500"
            >
              ₹{{
                (
                  parseFloat(product.selling_price) +
                  parseFloat(product.discount_price)
                ).toFixed(2)
              }}
            </p>
          </div>

          <!-- ✅ Wishlist Button -->
          <button
            @click="toggleWishlist(product.id)"
            class="mt-4 px-4 py-2 rounded-full border-2 font-medium transition-all flex items-center gap-2"
            :class="isWishlisted
              ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
              : 'bg-white border-gray-300 text-black hover:border-black hover:bg-gray-100'"
          >
            <span v-if="isWishlisted">❤️ In Wishlist</span>
            <span v-else>🤍 Add to Wishlist</span>
          </button>

          <!-- ✅ Sizes -->
          <div v-if="filteredSizes.length" class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-sm">Available Sizes:</h3>

              <!-- Size Chart Button -->
              <button
                v-if="product.customSizeChartArr"
                @click="showSizeChart = true"
                class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 text-sm font-medium hover:border-black hover:text-black hover:bg-gray-100 transition-all"
              >
                <Ruler class="w-4 h-4" /> Size Guide
              </button>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="(size, idx) in filteredSizes"
                :key="'size-' + idx"
                @click="selectedSize = size"
                :class="[
                  'px-3 py-1 border rounded-full text-sm transition hover:scale-105',
                  selectedSize === size
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300',
                ]"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Short Description -->
          <p
            v-if="product.description_short"
            class="text-gray-600 leading-relaxed mt-3"
          >
            {{ product.description_short }}
          </p>

          <!-- Buy + Cart Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-4 mt-6 sticky top-24 z-10"
          >
            <button
              @click="buyNow"
              class="flex-1 bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transform hover:scale-105 transition"
            >
              Buy Now
            </button>
            <button
              @click="addToCart"
              class="flex-1 border-2 border-black text-black py-3 px-6 rounded-full font-semibold hover:bg-black hover:text-white transform hover:scale-105 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews & Rating -->
    <reviews-rating :product-id="product.id" />

    <!-- People Also Picked -->
    <div v-if="product.fbt_items?.length" class="mt-8">
      <h3
        class="text-xl md:text-2xl font-bold mb-4 text-black relative inline-block"
      >
        People Also Picked
        <span
          class="absolute left-0 bottom-0 w-12 h-1 bg-gray-500 rounded-full"
        ></span>
      </h3>

      <div class="flex gap-4 overflow-x-auto py-2">
        <div
          v-for="item in product.fbt_items"
          :key="item.product_id"
          class="flex-shrink-0 w-48 bg-white shadow rounded-xl p-3 transition hover:shadow-lg hover:-translate-y-1 cursor-pointer"
          @click="goToProduct(item.product_id)"
        >
          <div class="relative w-full h-48">
            <img
              :src="item.hover && item.alternate_img ? item.alternate_img : item.img"
              alt="FBT Item"
              class="w-full h-full object-contain rounded-lg transition duration-300"
              @mouseover="item.hover = true"
              @mouseleave="item.hover = false"
            />
          </div>
          <p class="text-sm font-medium mt-2 truncate">{{ item.name }}</p>
          <p class="text-lg font-semibold mt-1">₹{{ item.selling_price }}</p>
        </div>
      </div>
    </div>

    <!-- Hot Selling -->
    <hot-selling />

    <!-- ✅ Size Chart Modal -->
    <transition name="fade">
      <div
        v-if="showSizeChart"
        class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4"
      >
        <div
          class="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
        >
          <button
            class="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            @click="showSizeChart = false"
          >
            ✕
          </button>

          <h2 class="text-xl font-bold mb-4">
            {{ product.customSizeChartArr?.topRow?.[0]?.title }}
          </h2>
          <p class="text-sm text-gray-600 mb-6">
            {{ product.customSizeChartArr?.topRow?.[0]?.description }}
          </p>

          <table class="w-full border border-gray-300 text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th
                  v-for="(head, i) in product.customSizeChartArr?.header"
                  :key="i"
                  class="px-3 py-2 border border-gray-300 text-left"
                >
                  {{ head }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in product.customSizeChartArr?.tableBody"
                :key="i"
              >
                <td
                  v-for="(col, j) in row"
                  :key="j"
                  class="px-3 py-2 border border-gray-300"
                >
                  {{ col }}
                </td>
              </tr>
            </tbody>
          </table>

          <div
            v-if="product.customSizeChartArr?.bottomRow?.length"
            class="mt-6 space-y-4"
          >
            <div
              v-for="(row, i) in product.customSizeChartArr.bottomRow"
              :key="i"
            >
              <h4 class="font-semibold">{{ row.title }}</h4>
              <p class="text-sm text-gray-600">{{ row.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ofetch } from "ofetch";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlist";
import { useToast } from "vue-toastification";
import { Ruler } from "lucide-vue-next";
import HotSelling from "@/components/productDetail/HotSelling.vue";
import ReviewsRating from "@/components/productDetail/reviews&rating.vue";

const selectedIndex = ref(0);
const selectedImage = ref("");
const selectedSize = ref("");
const product = ref({});
const loading = ref(true);
const error = ref(null);
const showSizeChart = ref(false);

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const toast = useToast();

const API_URL = "https://api.streetstylestore.com";
const API_KEY = "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx";

// ✅ Filtered sizes (removes empty strings)
const filteredSizes = computed(() => {
  return (
    product.value.product_size_array?.filter((s) => s && s.trim()) ||
    product.value.product_all_sizes?.filter((s) => s && s.trim()) ||
    []
  );
});

// ✅ Check if product is in wishlist
const isWishlisted = computed(() =>
  wishlistStore.isFavorite(product.value.id)
);

// ✅ Toggle wishlist
function toggleWishlist(productId) {
  wishlistStore.toggleFavorite(productId);
  if (wishlistStore.isFavorite(productId)) {
    toast?.success("Added to Wishlist ❤️", { timeout: 2000 });
  } else {
    toast?.info("Removed from Wishlist 🤍", { timeout: 2000 });
  }
}

async function fetchProduct() {
  loading.value = true;
  error.value = null;

  try {
    if (history.state?.product) {
      product.value = history.state.product;
      selectedImage.value = product.value.images[0]?.bigImg || "";
      selectedSize.value = "";
      loading.value = false;
      return;
    }

    const productId = route.params.id;
    const res = await ofetch(
      `${API_URL}/collections/products/documents/${productId}`,
      { headers: { "x-typesense-api-key": API_KEY } }
    );

    const doc = res.document ?? res;
    const parsed = doc.product_data ? JSON.parse(doc.product_data) : {};
    const firstData = parsed["0"] || {};

    product.value = {
      ...doc,
      id: doc.id,
      name: doc.name || firstData.name || "",
      selling_price:
        doc.real_selling_price ??
        doc.selling_price ??
        parseFloat(firstData.selling_price) ??
        0,
      discount_price:
        doc.discount_price ?? parseFloat(firstData.discount_price) ?? 0,
      description_short:
        firstData.description_short || doc.description_short || "",
      images: parsed.images || [],
      product_size_array:
        doc.product_size_array || firstData.product_size_array || [],
      product_all_sizes: doc.product_all_sizes || [],
      customSizeChartArr: parsed.customSizeChartArr || null,
      delivery_information:
        parsed.delivery_information || doc.delivery_information || "",
      return_information:
        parsed.return_information || doc.return_information || "",
      fbt_items: (parsed.fbt || []).map((i) => ({ ...i, hover: false })),
    };

    selectedImage.value = product.value.images[0]?.bigImg || "";
    selectedSize.value = "";
  } catch (err) {
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

function validateSizeSelection() {
  if (filteredSizes.value.length && !selectedSize.value) {
    toast?.warning("Please select a size before proceeding", {
      timeout: 2000,
      icon: "⚠️",
    });
    return false;
  }
  return true;
}

function addToCart() {
  if (!validateSizeSelection()) return;
  if (product.value.id) {
    cartStore.addToCart({
      id: product.value.id,
      name: product.value.name,
      price: parseFloat(product.value.selling_price),
      size: selectedSize.value || null,
      image: selectedImage.value,
      quantity: 1,
    });
    toast?.success(`${product.value.name} added to cart`, {
      timeout: 2000,
      icon: "🛒",
    });
  } else {
    toast?.error("Cannot add product to cart", { timeout: 2000, icon: "❌" });
  }
}

function buyNow() {
  if (!validateSizeSelection()) return;
  addToCart();
  router.push("/cart");
}

function goToProduct(productId) {
  router.push(`/category/subcategory/product/${productId}`);
}

onMounted(() => {
  wishlistStore.loadWishlist();
  fetchProduct();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
