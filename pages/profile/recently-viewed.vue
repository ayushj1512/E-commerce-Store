<template>
  <div class="min-h-screen bg-gray-50 p-6 md:p-12">
    <!-- Header with Sort -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
    >
      <div
        class="flex flex-col md:block w-full md:w-auto mb-4 md:mb-0"
      >
        <h1
          class="text-2xl md:text-3xl font-bold text-gray-900 text-center md:text-left"
        >
          Your Recently Viewed Picks
        </h1>
        <p class="text-gray-600 md:text-lg text-center md:text-left">
          Here's a collection of products you explored recently.
        </p>
      </div>

      <!-- Custom Sort Dropdown -->
      <div
        class="relative w-56 self-end md:self-auto md:ml-auto"
      >
        <button
          @click="toggleDropdown"
          class="w-full bg-white text-gray-800 border border-gray-300 rounded-xl px-4 py-2 font-medium shadow-sm hover:shadow-md transition flex items-center justify-between focus:outline-none"
        >
          <span>{{ getSortLabel(sortBy) }}</span>
          <ChevronDown
            :class="[
              'w-4 h-4 ml-2 transition-transform',
              dropdownOpen ? 'rotate-180' : 'rotate-0',
            ]"
          />
        </button>

        <!-- Dropdown Menu -->
        <transition name="fade">
          <ul
            v-if="dropdownOpen"
            class="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden"
          >
            <li
              v-for="option in sortOptions"
              :key="option.value"
              @click="setSort(option.value)"
              class="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
              :class="{ 'bg-gray-100 font-semibold': sortBy === option.value }"
            >
              <div class="flex items-center gap-2">
                <component :is="option.icon" class="w-4 h-4 text-gray-500" />
                <span>{{ option.label }}</span>
              </div>
              <Check
                v-if="sortBy === option.value"
                class="w-4 h-4 text-gray-700"
              />
            </li>
          </ul>
        </transition>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10 text-gray-500">
      Loading your recently viewed products...
    </div>

    <!-- Empty state -->
    <div
      v-else-if="recentProducts.length === 0"
      class="text-center py-10 text-gray-500"
    >
      You haven't viewed any products yet.
    </div>

    <!-- Products Grid -->
    <div
      v-else
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
    >
      <div
        v-for="product in sortedProducts"
        :key="product.id"
        @click="goToProduct(product.productUrl)"
        class="bg-white shadow-sm rounded-xl p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition"
      >
        <div
          class="w-full h-44 md:h-56 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden"
        >
          <img
            :src="
              product.images?.[0]?.bigImg ||
              product.images?.[0]?.img ||
              product.img ||
              ''
            "
            alt="Product"
            class="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
        <p
          class="text-sm md:text-base font-medium mt-3 truncate text-gray-800"
        >
          {{ product.name }}
        </p>
        <p
          class="text-sm md:text-base font-semibold mt-1 text-gray-900"
        >
          ₹{{ product.selling_price }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCookie } from "#app";
import { ofetch } from "ofetch";
import { ChevronDown, ArrowDown, ArrowUp, Check } from "lucide-vue-next";

// ✅ use the same cookie key as your first component
const recentIds = useCookie("recentProducts", { default: () => [] });
const recentProducts = ref([]);
const loading = ref(true);
const sortBy = ref("latest");
const dropdownOpen = ref(false);

// Sort options (name sort removed)
const sortOptions = [
  { value: "latest", label: "Recently Viewed", icon: ArrowDown },
  { value: "priceLowHigh", label: "Price: Low to High", icon: ArrowDown },
  { value: "priceHighLow", label: "Price: High to Low", icon: ArrowUp },
];

const getSortLabel = (value) => {
  const opt = sortOptions.find((o) => o.value === value);
  return opt ? opt.label : "Sort By";
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const setSort = (value) => {
  sortBy.value = value;
  dropdownOpen.value = false;
};

const API_KEY = "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx";
const API_URL = "https://api.streetstylestore.com";

// Safe JSON parser
const safeParseJSON = (str, fallback = {}) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

// Fetch recently viewed products
const fetchRecentProducts = async () => {
  if (!recentIds.value || recentIds.value.length === 0) {
    recentProducts.value = [];
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const fetched = await Promise.all(
      recentIds.value.map(async (id) => {
        try {
          const res = await ofetch(
            `${API_URL}/collections/products/documents/${id}`,
            {
              headers: { "x-typesense-api-key": API_KEY },
            }
          );
          const doc = res.document ?? res;
          const parsed = doc.product_data
            ? safeParseJSON(doc.product_data, {})
            : {};
          const firstData = parsed["0"] || {};

          return {
            ...doc,
            id: doc.id,
            name: doc.name || firstData.name || "Untitled",
            selling_price:
              doc.real_selling_price ??
              doc.selling_price ??
              firstData.selling_price ??
              0,
            discount_price: doc.discount_price ?? firstData.discount_price ?? 0,
            images: parsed.images || [{ bigImg: doc.img }],
            productUrl: `/category/subcategory/product/${doc.id}`,
          };
        } catch (err) {
          console.error(`❌ Failed fetching product ${id}:`, err);
          return null;
        }
      })
    );

    recentProducts.value = fetched.filter((p) => p !== null);
  } catch (err) {
    console.error("❌ Error fetching recently viewed products:", err);
  } finally {
    loading.value = false;
  }
};

const goToProduct = (url) => {
  window.location.href = url;
};

// Computed: sorted products
const sortedProducts = computed(() => {
  const products = [...recentProducts.value];
  switch (sortBy.value) {
    case "priceLowHigh":
      return products.sort((a, b) => a.selling_price - b.selling_price);
    case "priceHighLow":
      return products.sort((a, b) => b.selling_price - a.selling_price);
    default:
      return products; // latest (no extra sorting)
  }
});

onMounted(fetchRecentProducts);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
