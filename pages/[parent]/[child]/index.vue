<template>
  <div class="bg-white text-black min-h-screen p-4 md:p-8">
    <!-- Top bar: Filters + Sorting Tags + Results count -->
    <div class="flex flex-wrap gap-2 mb-4 items-center">
      <!-- Filters Drawer -->
      <FilterDrawer />

      <!-- Sorting tags -->
      <div class="flex flex-wrap gap-2 overflow-x-auto flex-1 items-center">
        <button 
          v-for="option in sortOptions" 
          :key="option.value" 
          @click="applySort(option)"
          :class="[ 
            selectedSort === option.value 
              ? 'bg-black text-white scale-105 shadow-md' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200', 
            'px-3 py-1 rounded-full border text-sm whitespace-nowrap'
          ]"
        >
          {{ option.label }}
        </button>

        <!-- Results found -->
        <span class="ml-auto text-gray-700 text-sm">
          Results found: {{ filteredProducts.length }}
        </span>
      </div>
    </div>

    <!-- Voucher Eligibility Header with Electric Border -->
  <transition name="fade-scale">
  <ElectricBorder
    v-if="eligibleVoucher"
    :color="'rgb(255,0,0)'"  
    :thickness="2"
    class="mb-6 w-full flex justify-center"
  >
    <div
      class="relative z-10 flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-transparent w-full max-w-2xl text-center"
    >
      <!-- Text -->
      <span
        class="font-bold text-base md:text-lg tracking-wide text-red-600 uppercase"
      >
        Eligible for {{ eligibleVoucher.category_name }}
      </span>
    </div>
  </ElectricBorder>
</transition>


    <!-- Products Grid -->
    <transition-group 
      name="fade-slide" 
      tag="div"
      :class="[ 
        'grid gap-6 mt-10',
        'grid-cols-2 sm:grid-cols-2',   // mobile always 2
        'md:grid-cols-5 lg:grid-cols-5' // desktop always 5
      ]"
    >
      <ProductCard 
        v-for="(product, index) in filteredProducts" 
        :key="product.id || `product-${index}`"
        :id="product.id || `product-${index}`" 
        :title="product.displayName" 
        :image="product.imageUrl"
        :hoverImage="product.hoverImageUrl" 
        :price="product.displayPrice" 
        :mrp="product.displayDiscount"
        :showCartBtn="true"
        :productUrl="`/${route.params.parent || 'products'}/${product.categorySlug}/${product.productSlug}/${product.id}`" 
      />
    </transition-group>

    <div v-if="!filteredProducts.length" class="text-center py-10 text-gray-500">
      No products found.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "#app";
import { useProductStore } from "@/stores/productStore.js";
import ProductCard from "@/components/common/ProductCard.vue";
import FilterDrawer from "@/components/collection/FilterDrawer.vue";
import ElectricBorder from "@/components/common/electricBorder.vue";
import { ofetch } from "ofetch";

// --- Stores & Route ---
const store = useProductStore();
const route = useRoute();

// --- Sorting ---
const selectedSort = ref("default");
const sortOptions = [
  { label: "Price: Low to High", value: "lowtohigh" },
  { label: "Price: High to Low", value: "hightolow" },
  { label: "Newest", value: "latest" },
  { label: "Trending", value: "trending" },
  { label: "Rating", value: "rating" },
];
const applySort = (option) => (selectedSort.value = option.value);

// --- Helper Slugify ---
const slugify = (text) =>
  text?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

// --- Category Id from Route ---
const categoryIdFromRoute = computed(() => {
  const subCategoryParam = route.params.child || "";
  const match = subCategoryParam.match(/(\d+)$/);
  return match ? match[1] : route.params.parent;
});

// --- Products for Current Category ---
const productsForCategory = computed(() =>
  store.getProductsByCategory(categoryIdFromRoute.value)
);

// --- Filtered Products ---
const filteredProducts = computed(() => {
  return productsForCategory.value
    .map((p, index) => {
      const parsedData = p.rawData?.product_data ? JSON.parse(p.rawData.product_data) : {};
      const firstData = parsedData["0"] || {};

      const images = parsedData.images || [];
      const imageUrl = images[0]?.img || p.images[0]?.img || "";
      const hoverImageUrl = images[1]?.img || images[0]?.img || null;

      const categoriesFromData = firstData.categories
        ? firstData.categories.split("^").map((c) => c.split("*")[0])
        : p.displayCategories || [];

      const allSizes =
        (parsedData.shoeSize || []).map((s) => s.Size).filter(Boolean) ||
        (p.product_all_sizes || []).filter(Boolean) ||
        ["N/A"];

      return {
        ...p,
        id: p.id || p.product_id || firstData.id || `product-${index}`,
        displayName: firstData.name || p.displayName || "",
        displayPrice: Number(firstData.selling_price) || Number(p.displayPrice) || 0,
        displayDiscount: Number(firstData.discount_price) || Number(p.displayDiscount) || 0,
        displayCategories: categoriesFromData,
        imageUrl,
        hoverImageUrl,
        categorySlug: slugify(categoriesFromData[0] || "general"),
        productSlug: slugify(firstData.name || p.displayName || "item"),
        product_all_sizes: allSizes,
      };
    })
    .sort((a, b) => {
      switch (selectedSort.value) {
        case "lowtohigh": return a.displayPrice - b.displayPrice;
        case "hightolow": return b.displayPrice - a.displayPrice;
        case "latest": return (new Date(b.rawData?.date_added)) - (new Date(a.rawData?.date_added));
        case "rating": return (b.rawData?.avg_rating ?? 0) - (a.rawData?.avg_rating ?? 0);
        case "trending": return (b.rawData?.sales ?? 0) - (a.rawData?.sales ?? 0);
        default: return 0;
      }
    });
});

// --- Fetch Products ---
const fetchProductsFromRoute = async () => {
  await store.fetchProducts({
    categoryId: categoryIdFromRoute.value,
    page: 1,
    perPage: 250,
  });
};

// --- Voucher Logic ---
const vouchers = ref([]);
const eligibleVoucher = ref(null);
const remainingToApply = ref(0);

const fetchVouchers = async () => {
  try {
    const res = await ofetch(
      "https://api.streetstylestore.com/collections/sss_config/documents/voucher-listing?a=1&x-typesense-api-key=F5gdSFxpg6bi8ZXfuybIsQy074HtBDkC"
    );
    const data = JSON.parse(res.data || "[]");
    vouchers.value = data;

    const voucher = data.find(v => Number(v.id_category) === Number(categoryIdFromRoute.value));
    if (voucher) {
      eligibleVoucher.value = voucher;
      remainingToApply.value = voucher.quantity;
    }
  } catch (err) {
    console.error("Failed to fetch vouchers", err);
  }
};

onMounted(async () => {
  await fetchProductsFromRoute();
  await fetchVouchers();
});

watch(() => [route.params.parent, route.params.child], async () => {
  await fetchProductsFromRoute();
  await fetchVouchers();
});
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from { opacity: 0; transform: translateY(20px); }
.fade-slide-enter-to { opacity: 1; transform: translateY(0); }
.fade-slide-leave-from { opacity: 1; transform: translateY(0); }
.fade-slide-leave-to { opacity: 0; transform: translateY(20px); }

.fade-scale-enter-active { transition: all 0.4s ease; }
.fade-scale-leave-active { transition: all 0.3s ease; }
.fade-scale-enter-from { opacity: 0; transform: scale(0.95); }
.fade-scale-enter-to { opacity: 1; transform: scale(1); }
.fade-scale-leave-from { opacity: 1; transform: scale(1); }
.fade-scale-leave-to { opacity: 0; transform: scale(0.95); }
</style>
