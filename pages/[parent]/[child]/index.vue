<template>
  <div class="bg-white text-black min-h-screen p-4 md:p-8">
    <!-- 🔹 Top bar: Filters + Sorting -->
    <div class="flex flex-wrap gap-2 mb-4 items-center w-full">
      <div class="hidden md:flex items-center w-full gap-2">
        <button @click="toggleDrawer" class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
          Filters
        </button>
        <SortingTags v-model="selectedSort" :options="sortOptions" />
        <div class="ml-auto text-gray-700 text-sm">
          Total Results: {{ sortedProducts.length }}
        </div>
      </div>

      <!-- 🔸 Mobile -->
      <div class="flex md:hidden items-center w-full gap-2">
        <button @click="toggleDrawer" class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
          Filters
        </button>
        <div class="ml-auto">
          <SortDropdown v-model="selectedSort" :options="sortOptions" />
        </div>
      </div>
    </div>

    <!-- 🔹 Selected Filters Display on Parent -->
    <div v-if="selectedCategories.length || selectedTags.length || selectedSizes.length" class="flex flex-wrap gap-2 mb-4">
      <div v-for="cat in selectedCategories" :key="'cat-' + cat" class="selected-chip" @click="removeParentFilter('category', cat)">
        {{ capitalize(cat) }} ×
      </div>
      <div v-for="tag in selectedTags" :key="'tag-' + tag" class="selected-chip" @click="removeParentFilter('tag', tag)">
        {{ capitalize(tag) }} ×
      </div>
      <div v-for="size in selectedSizes" :key="'size-' + size" class="selected-chip" @click="removeParentFilter('size', size)">
        {{ size }} ×
      </div>
    </div>

    <!-- 🔹 Drawer Overlay -->
    <transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black/40 z-40" @click="closeDrawer"></div>
    </transition>

    <!-- 🔹 Filter Drawer -->
    <transition name="slide-left">
      <div v-if="isOpen" class="fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 overflow-y-auto">
        <Filters
          :category-number="Number(categoryIdFromRoute)"
          v-model:selectedCategories="selectedCategories"
          v-model:selectedTags="selectedTags"
          v-model:selectedSizes="selectedSizes"
        />
      </div>
    </transition>

    <!-- Voucher -->
    <AvailableVoucher :category-id="categoryIdFromRoute" class="mb-4 mt-4 " />

    <!-- Mobile result count -->
    <div class="md:hidden text-gray-700 text-sm text-right mb-6">
      Total Results: {{ sortedProducts.length }}
    </div>

    <!-- Products Grid -->
    <transition-group
      name="fade-slide"
      tag="div"
      class="grid gap-6 mt-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5"
    >
      <ProductCard
        v-for="(product, index) in sortedProducts"
        :id="product.id"
        :key="product.id || `product-${index}`"
        :title="product.displayName || 'Product'"
        :image="product.imageUrl"
        :hoverImage="product.hoverImageUrl"
        :price="product.displayPrice"
        :mrp="(product.displayDiscount || 0) + (product.displayPrice || 0)"
        :avgRating="product.avgRating"
        :showCartBtn="true"
        :productUrl="`/${route.params.parent || 'products'}/${product.displayCategories?.[0] || 'category'}/${product.slug}/${product.id}`"
      />
    </transition-group>

    <div v-if="!sortedProducts.length" class="text-center py-10 text-gray-500">
      No products found.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "#app";
import { useProductStore } from "@/stores/productStore.js";
import ProductCard from "@/components/common/ProductCard.vue";
import AvailableVoucher from "@/components/collection/AvailableVoucher.vue";
import Filters from "@/components/collection/Filters.vue";
import SortingTags from "@/components/collection/SortingTags.vue";
import SortDropdown from "@/components/collection/SortDropdown.vue";

const store = useProductStore();
const route = useRoute();

// 🧭 Drawer
const isOpen = ref(false);
const toggleDrawer = () => (isOpen.value = !isOpen.value);
const closeDrawer = () => (isOpen.value = false);

// 🔽 Sorting
const selectedSort = ref("default");
const sortOptions = [
  { label: "Price: Low to High", value: "lowtohigh" },
  { label: "Price: High to Low", value: "hightolow" },
  { label: "Newest", value: "latest" },
  { label: "Trending", value: "trending" },
  { label: "Rating", value: "rating" },
];

// 🏷️ Category from route
const categoryIdFromRoute = computed(() => {
  const subCategoryParam = route.params.child || "";
  const match = subCategoryParam?.match(/(\d+)$/);
  const id = match ? Number(match[1]) : Number(route.params.parent);
  console.log("📂 Category ID from route:", id);
  return id;
});

// 🧩 Filters
const selectedCategories = ref([]);
const selectedTags = ref([]);
const selectedSizes = ref([]);

// 🔍 Detect if a string is a valid size (e.g. L, XL, 2XL, 38)
const isSize = (val) => {
  if (!val) return false;
  const v = val.toString().trim().toUpperCase();
  return (
    /^[0-9]+$/.test(v) || // numeric
    /^([0-9]*)(XS|S|M|L|XL|XXL|2XL|3XL|4XL|5XL)$/.test(v)
  );
};

// 🔠 Normalize size format consistently
const normalizeSize = (size) => {
  if (!size) return "";
  let s = size.toString().trim().toUpperCase();
  s = s.replace(/\s+/g, ""); // remove spaces like "2 XL" → "2XL"
  if (!isNaN(s)) return s;
  if (/^([0-9]*)([A-Z]+)$/.test(s)) return s;
  return s;
};

// 🧍 Capitalize for display (not for API)
const capitalize = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

// ❌ Remove selected filter
function removeParentFilter(type, value) {
  if (type === "category")
    selectedCategories.value = selectedCategories.value.filter((v) => v !== value);
  else if (type === "tag")
    selectedTags.value = selectedTags.value.filter((v) => v !== value);
  else if (type === "size")
    selectedSizes.value = selectedSizes.value.filter((v) => v !== value);

  console.log(`🗑️ Removed ${type} filter:`, value);
  persistFilters(); // save after removing
}

// 🛍️ All products
const allProducts = ref([]);

// 📦 Fetch products from store
const fetchStoreProducts = async () => {
  const catId = categoryIdFromRoute.value;
  if (!catId) return;
  console.log("📦 Fetching products for category:", catId);
  try {
    await store.fetchProducts({ categoryId: catId, page: 1, perPage: 250 });
    allProducts.value = store.productLists[catId]?.products || [];
    console.log("✅ Products fetched:", allProducts.value.length);
  } catch (err) {
    console.error("❌ Error fetching store products:", err);
  }
};

// 💾 --- FILTER PERSISTENCE HELPERS --- 💾

// Unique key per category, so filters don’t overlap across pages
const getStorageKey = () => `collectionFilters_${categoryIdFromRoute.value}`;

// Save current filters to localStorage
const persistFilters = () => {
  const filters = {
    categories: selectedCategories.value,
    tags: selectedTags.value,
    sizes: selectedSizes.value,
    sort: selectedSort.value,
  };
  localStorage.setItem(getStorageKey(), JSON.stringify(filters));
  console.log("💾 Filters persisted:", filters);
};

// Restore filters from localStorage
const restoreFilters = () => {
  const saved = localStorage.getItem(getStorageKey());
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      selectedCategories.value = parsed.categories || [];
      selectedTags.value = parsed.tags || [];
      selectedSizes.value = parsed.sizes || [];
      selectedSort.value = parsed.sort || "default";
      console.log("♻️ Restored filters from localStorage:", parsed);
    } catch (e) {
      console.warn("⚠️ Error parsing saved filters:", e);
    }
  } else {
    console.log("ℹ️ No saved filters found.");
  }
};

// 🧮 Compute filtered products
const filteredProducts = ref([]);

const computeFilteredProducts = async () => {
  const catId = categoryIdFromRoute.value;
  if (!catId) return;

  console.log("⚙️ Computing filtered products...");
  console.log("🎯 Selected filters:", {
    selectedCategories: selectedCategories.value,
    selectedTags: selectedTags.value,
    selectedSizes: selectedSizes.value,
  });

  const allProds = allProducts.value.map((p) => ({
    ...p,
    imageUrl: p.images?.[0]?.img || "",
    hoverImageUrl: p.images?.[1]?.img || p.images?.[0]?.img || "",
    displayPrice: Number(p.displayPrice ?? p.price ?? 0),
    displayDiscount: Number(p.displayDiscount ?? 0),
    avgRating: Number(
      p.avgRating ?? p.rawData?.avg_rating ?? p.rawData?.rating?.avg ?? 0
    ),
    tags: p.tags || [],
    sizes: (p.sizes || []).map(normalizeSize),
  }));

  if (
    !selectedCategories.value.length &&
    !selectedTags.value.length &&
    !selectedSizes.value.length
  ) {
    filteredProducts.value = allProds;
    console.log("ℹ️ No filters selected — showing all products.");
    return;
  }

  let apiIds = [];
  try {
    const filters = [`categories:=${catId}`, `active:=1`];

    // Separate tags vs sizes cleanly
    const rawValues = [
      ...selectedCategories.value,
      ...selectedTags.value,
      ...selectedSizes.value,
    ];

    const tagValues = rawValues.filter((v) => !isSize(v));
    const sizeValues = rawValues.filter(isSize).map(normalizeSize);

    // 🏷️ Tags filter
    if (tagValues.length) {
      const tagStr = tagValues.map((t) => `"${t}"`).join(",");
      filters.push(`tags:=[${tagStr}]`);
    }

    // 📏 Sizes filter
    if (sizeValues.length) {
      const sizeStr = sizeValues.map((s) => `"${s}"`).join(",");
      filters.push(`product_size_array:=[${sizeStr}]`);
    }

    // 🌐 Build API URL
    const filterQuery = filters.map((f) => `&filter_by=${f}`).join("");
    const url = `https://api.streetstylestore.com/collections/products/documents/search?q=*&sort_by=date_updated_unix:desc&per_page=250&page=1${filterQuery}&x-typesense-api-key=VvSmt6K1hvlGJhtTPsxjVrq8RNm9tSXh`;

    console.log("🧠 Final Filter API:", url);

    const res = await fetch(url);
    const data = await res.json();

    apiIds = data.hits?.map((h) => h.document.id) || [];
    console.log("📥 Filter API returned:", apiIds.length, "results");
  } catch (e) {
    console.error("❌ Filter API error:", e);
    apiIds = [];
  }

  filteredProducts.value = apiIds.length
    ? allProds.filter((p) => apiIds.includes(p.id))
    : allProds;

  console.log("🎯 Filtered products count:", filteredProducts.value.length);
  persistFilters(); // auto-save filters after each computation
};

// 🔃 Sorting logic
const sortedProducts = computed(() => {
  const arr = [...filteredProducts.value];
  switch (selectedSort.value) {
    case "lowtohigh":
      return arr.sort((a, b) => a.displayPrice - b.displayPrice);
    case "hightolow":
      return arr.sort((a, b) => b.displayPrice - a.displayPrice);
    case "latest":
      return arr.sort((a, b) => (b.date_added_unix || 0) - (a.date_added_unix || 0));
    case "rating":
      return arr.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    case "trending":
      return arr.sort((a, b) => (b.trending_score || 0) - (a.trending_score || 0));
    default:
      return arr;
  }
});

// 👀 Watchers
watch(
  [selectedCategories, selectedTags, selectedSizes, selectedSort],
  () => {
    console.log("🧭 Filters changed:", {
      selectedCategories: selectedCategories.value,
      selectedTags: selectedTags.value,
      selectedSizes: selectedSizes.value,
      selectedSort: selectedSort.value,
    });
    computeFilteredProducts();
  },
  { deep: true }
);

watch(
  [() => route.params.parent, () => route.params.child],
  async () => {
    console.log("🔄 Route changed — refetching products...");
    await fetchStoreProducts();
    restoreFilters(); // restore on navigation
    await computeFilteredProducts();
  }
);

// 🚀 Mounted
onMounted(async () => {
  console.log("🚀 Component mounted — fetching initial products...");
  restoreFilters(); // restore saved filters first
  await fetchStoreProducts();
  await computeFilteredProducts();
});
</script>

<style scoped>
.selected-chip {
  background: #000;
  color: #fff;
  padding: 0.35rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: 0.2s ease;
}
.selected-chip:hover { background: #333; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-left-enter-active, .slide-left-leave-active { transition: transform 0.3s ease; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }
</style>
